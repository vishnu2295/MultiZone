import Dashboard from "@/components/landing/Dashboard";
import Navbar from "@/components/landing/Navbar";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-(--page-dark-background)">
      <Navbar />
      <Dashboard />
    </main>
  );
}
