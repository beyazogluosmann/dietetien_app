import { redirect } from "next/navigation";
import { getSession } from "@/auth/session";

export async function RedirectIfSignedIn() {
  const session = await getSession();
  if (session) {
    redirect(session.role === "dietitian" ? "/dietitian" : "/client");
  }

  return null;
}
