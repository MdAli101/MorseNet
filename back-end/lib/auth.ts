// Simple client-side auth utilities for demo purposes
// In production, this would be server-side with proper JWT tokens

export const isAuthenticated = (): boolean => {
  if (typeof window === "undefined") return false
  return localStorage.getItem("isAdminAuthenticated") === "true"
}

export const logout = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("isAdminAuthenticated")
  }
}

export const requireAuth = (callback: () => void) => {
  if (!isAuthenticated()) {
    window.location.href = "/admin/login"
    return
  }
  callback()
}
