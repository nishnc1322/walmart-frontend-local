export function isAdminUser(email: string | undefined): boolean {
  if (!email) return false

  const adminEmails = ["nishant.chintalapati@walmart.com"]

  return adminEmails.includes(email.toLowerCase())
}

export function canEditAgents(email: string | undefined): boolean {
  return isAdminUser(email)
}
