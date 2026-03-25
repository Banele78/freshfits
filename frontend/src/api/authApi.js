import api from "../api";

// Register
export const register = (data) => api.post("auth/register", data);

// Verify email
export const verifyEmail = (token) =>
  api.get(`auth/verify-email?token=${token}`);

// Resend verification
export const resendVerification = (email) =>
  api.post("auth/resend-verification", { email });

// Login
export const login = (data) => api.post("auth/login", data);

//logout
export const logout = () => api.post("auth/logout");

//me
export const me = () => api.get("/me");

// Forgot password
export const forgotPassword = (email) =>
  api.post("auth/forgot-password", { email });

// Reset password
export const resetPassword = (data) => api.post("auth/reset-password", data);
