import Dashboard from "@/components/landing/Dashboard";
import Navbar from "@/components/landing/Navbar";
import RoleRedirect from "@/components/landing/RoleRedirect";

export default function Home() {
  return (
    <main className="relative h-dvh overflow-hidden bg-(--page-dark-background)">
      <RoleRedirect />
      <Navbar />
      <Dashboard />
    </main>
  );
}
