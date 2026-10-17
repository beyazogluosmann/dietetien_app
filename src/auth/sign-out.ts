"use server";

import { redirect } from "next/navigation";
import { clearSession } from "@/auth/session";

export async function signOut() {
  await clearSession();
  redirect("/");
}
