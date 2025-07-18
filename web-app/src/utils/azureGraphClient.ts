import { Client } from "@microsoft/microsoft-graph-client";

interface CreateUserRequest {
  displayName: string;
  mailNickname: string;
  userPrincipalName: string;
  password: string;
}

class AzureGraphClient {
  private accessToken?: string;

  setAccessToken(token: string) {
    this.accessToken = token;
  }

  private async getAccessToken(): Promise<string> {
    if (this.accessToken) {
      return this.accessToken;
    }
    // Get the current user's token with Graph API scopes
    const response = await fetch("/auth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        scopes: ["https://graph.microsoft.com/User.ReadWrite.All"],
      }),
    });

    const data = await response.json();
    return data.access_token;
  }

  private getGraphClient() {
    if (!this.accessToken) throw new Error("Access token not set");
    return Client.init({
      authProvider: (done) => {
        done(null, this.accessToken!);
      },
    });
  }

  async createUser(userData: CreateUserRequest): Promise<any> {
    if (this.accessToken) {
      // Use Graph SDK directly if token is set
      const client = this.getGraphClient();
      return await client.api("/users").post({
        accountEnabled: true,
        displayName: userData.displayName,
        mailNickname: userData.mailNickname,
        userPrincipalName: userData.userPrincipalName,
        passwordProfile: {
          forceChangePasswordNextSignIn: true,
          password: userData.password,
        },
      });
    }
    const token = await this.getAccessToken();

    const response = await fetch("https://graph.microsoft.com/v1.0/users", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        accountEnabled: true,
        displayName: userData.displayName,
        mailNickname: userData.mailNickname,
        userPrincipalName: userData.userPrincipalName,
        passwordProfile: {
          forceChangePasswordNextSignIn: true,
          password: userData.password,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "Failed to create user");
    }

    return await response.json();
  }

  async assignAppRole(userId: string, appRoleId: string): Promise<void> {
    if (this.accessToken) {
      const client = this.getGraphClient();
      const resourceId = process.env.OBJECT_ID;
      if (!resourceId) {
        throw new Error(
          "App Service Principal Object ID (OBJECT_ID) is not set in environment variables."
        );
      }
      await client.api(`/users/${userId}/appRoleAssignments`).post({
        principalId: userId,
        resourceId: resourceId,
        appRoleId: appRoleId,
      });
      return;
    }
    const token = await this.getAccessToken();

    // Assign the user to your specific app (not Azure portal access)
    const resourceId = process.env.OBJECT_ID;
    if (!resourceId) {
      throw new Error(
        "App Service Principal Object ID (OBJECT_ID) is not set in environment variables."
      );
    }

    const response = await fetch(
      `https://graph.microsoft.com/v1.0/users/${userId}/appRoleAssignments`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          principalId: userId,
          resourceId: resourceId, // App's service principal ID from env
          appRoleId: appRoleId, // Specific role ID for App
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to assign app role");
    }
  }
}

export const graphClient = new AzureGraphClient();
