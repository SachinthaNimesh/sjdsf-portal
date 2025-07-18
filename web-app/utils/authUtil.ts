import Cookies from "js-cookie";

// Redirects to Choreo's managed authentication login endpoint
export function login() {
  // You can add query params if needed: /auth/login?fidp=myfederatedidp
  window.location.href = "/auth/login";
}

// Redirects to Choreo's managed authentication logout endpoint with session_hint
export function logout() {
  const sessionHint = Cookies.get("session_hint");
  // It is recommended to clear any stored user info here if you store it elsewhere
  window.location.href = `/auth/logout?session_hint=${sessionHint}`;
}

// Retrieves user info from the short-lived 'userinfo' cookie and clears it
export function getUserInfoFromCookie() {
  const encodedUserInfo = Cookies.get("userinfo");
  if (encodedUserInfo) {
    try {
      const userInfo = JSON.parse(atob(encodedUserInfo));
      // Store userInfo in preferred browser storage if needed
      // The path should match your post-login path (default '/')
      Cookies.remove("userinfo", { path: "/" });
      return userInfo;
    } catch (e) {
      Cookies.remove("userinfo", { path: "/" });
      return null;
    }
  }
  return null;
}

// Retrieves user info from the Choreo managed authentication endpoint
export async function getUserInfoFromEndpoint() {
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

// Performs a GET request and handles session expiry by redirecting to login on 401
export async function performGet(url) {
  try {
    const response = await fetch(url);
    if (response.status === 401) {
      // Session expired or not authenticated, redirect to login
      window.location.href = "/auth/login";
    }
    return response;
  } catch (error) {
    throw error;
  }
}
