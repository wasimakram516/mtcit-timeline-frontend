import api from "./api";
import axios from "axios";

// Store only access token, refresh token stays in cookies
export const getAccessToken = () => sessionStorage.getItem("accessToken");
export const setAccessToken = (accessToken) =>
  sessionStorage.setItem("accessToken", accessToken);
export const clearTokens = () => sessionStorage.removeItem("accessToken");

// **Login API Call**
export const login = async (email, password) => {
  const { data } = await api.post("/auth/login", { email, password });

  // Set access token (refresh token is stored in secure HTTP-only cookie)
  setAccessToken(data.data.accessToken);

  return data.data.accessToken;
};

// **Refresh Access Token Using Secure Cookie**
export async function refreshToken() {
  try {
    const { data } = await axios.post("/api/auth/refresh", {
      withCredentials: true,
    });
    setAccessToken(data.data.accessToken);
    return data.data.accessToken;
  } catch (error) {
    console.error("Failed to refresh token:", error);
    throw new Error("Failed to refresh token");
  }
}

// **Logout API Call**
export async function logoutUser() {
  try {
    await api.post("/auth/logout"); // Backend will clear the refresh token cookie
  } catch (error) {
    console.error("Failed to logout on the server:", error);
  } finally {
    clearTokens();

    // ✅ Prevent multiple redirects
    if (window.location.pathname !== "/login") {
      window.location.href = "/login";
    }
  }
}
