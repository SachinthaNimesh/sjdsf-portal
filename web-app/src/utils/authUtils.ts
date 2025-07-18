// Utility for authentication actions and user info management
import Cookies from "js-cookie";

const isLocal = window.location.hostname === "localhost"; // temp

export function login() {
  if (isLocal) return; // Disable redirect in local dev
  window.location.href = "/auth/login";
}

export function logout() {
  if (isLocal) return; // Disable redirect in local dev //temp
  const sessionHint = Cookies.get("session_hint");
  window.location.href = `/auth/logout?session_hint=${sessionHint}`;
}

export function getUserInfoFromCookie() {
  if (isLocal) {
    // temp from here to
    // Return mock user info for local dev
    return {
      first_name: "Dev",
      last_name: "User",
      email: "devuser@example.com",
    };
  } // temp to here
  const encodedUserInfo = Cookies.get("userinfo");
  if (encodedUserInfo) {
    try {
      const userInfo = JSON.parse(atob(encodedUserInfo));
      Cookies.remove("userinfo", { path: "/" });
      return userInfo;
    } catch (e) {
      Cookies.remove("userinfo", { path: "/" });
      return null;
    }
  }
  return null;
}

export async function getUserInfoFromEndpoint() {
  if (isLocal) {
    // temp from here to
    // Return mock user info for local dev
    return {
      first_name: "Dev",
      last_name: "User",
      email: "devuser@example.com",
    };
  } // temp to here
  try {
    const response = await fetch("/auth/userinfo");
    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch {
    return null;
  }
}

export async function performGet(url) {
  try {
    const response = await fetch(url);
    if (response.status === 401) {
      window.location.href = "/auth/login";
    }
    return response;
  } catch (error) {
    throw error;
  }
}
