"use-client";

import Dashboard from "@/components/landing/Dashboard";
import Navbar from "@/components/landing/Navbar";
import { auth0 } from "@/lib/auth0";

export default async function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-(--page-dark-background)">
      <Navbar />
      <Dashboard />
    </main>
  );
}
