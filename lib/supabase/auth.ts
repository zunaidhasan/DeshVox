import type { AuthError } from "@supabase/supabase-js";

export function getFriendlyAuthErrorMessage(error?: AuthError | null) {
  if (!error) return "Something went wrong. Please try again.";

  const message = error.message.toLowerCase();

  if (message.includes("invalid login credentials") || message.includes("invalid email or password")) {
    return "Invalid credentials. Check your email and password, then try again.";
  }

  if (message.includes("email not confirmed") || message.includes("signup requires email confirmation")) {
    return "Please verify your email before signing in.";
  }

  if (message.includes("password should be at least") || message.includes("weak password")) {
    return "Your password is too weak. Use at least 8 characters with a mix of letters and numbers.";
  }

  if (message.includes("user already registered")) {
    return "An account already exists with this email. Please sign in instead.";
  }

  if (message.includes("oauth")) {
    return "Google sign-in could not be completed. Please try again.";
  }

  return error.message;
}

export function getPendingApprovalMessage(role?: string | null) {
  if (!role) {
    return "Your account is pending approval. Contact admin.";
  }

  return "Your account is pending approval. Contact admin.";
}
