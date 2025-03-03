// Client-side auth utilities
export function getUserRole(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("userRole")
}

export function getUserOffice(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("userOffice")
}

export function setUserAuth(role: string, office: string): void {
  if (typeof window === "undefined") return
  localStorage.setItem("userRole", role)
  localStorage.setItem("userOffice", office)
}

export function clearUserAuth(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem("userRole")
  localStorage.removeItem("userOffice")
}

