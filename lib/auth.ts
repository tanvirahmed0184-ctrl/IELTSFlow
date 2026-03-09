// Supabase Auth integration
// TODO: Configure Supabase Auth client and middleware

export async function getSession() {
  // TODO: Implement session retrieval from Supabase Auth
  return null;
}

export async function requireAuth() {
  const session = await getSession();
  if (!session) {
    throw new Error("Authentication required");
  }
  return session;
}

export type UserRole = "guest" | "student" | "instructor" | "admin" | "super_admin";
