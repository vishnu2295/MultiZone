"use-client";

import { redirect } from "next/navigation";
import Dashboard from "@/components/landing/Dashboard";
import Navbar from "@/components/landing/Navbar";
import { auth0, getRoleHomePath } from "@/lib/auth0";

export default async function Home() {
  const session = await auth0.getSession();
  const roleHomePath = getRoleHomePath(session?.tokenSet.accessToken);

  if (roleHomePath) {
    redirect(roleHomePath);
  }

  return (
    <main className="relative h-dvh overflow-hidden bg-(--page-dark-background)">
      <Navbar />
      <Dashboard />
    </main>
  );
}
