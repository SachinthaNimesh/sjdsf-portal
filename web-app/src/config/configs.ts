export const API_URL = "/choreo-apis/employee-mgmt-system/backend/v1";
// export const API_URL =
// "https://87e89eab-95e5-4c0f-8192-7ee0196e1581-dev.e1-us-east-azure.choreoapis.dev/employee-mgmt-system/server-docker/v1.0";

declare global {
  interface Window {
    config: {
      VITE_API_KEY: string;
      VITE_AZURE_CLIENT_ID: string;
      VITE_AZURE_TENANT_ID: string;
      apiUrl: string;
      VITE_GOOGLE_SHEET_API_KEY: string;
    };
  }
}

export const appConfig = window.config;
