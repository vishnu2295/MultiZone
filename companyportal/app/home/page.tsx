import HomeNavbar from "@/components/home/HomeNavbar";
import HomeGreeting from "@/components/home/HomeGreeting";
import QuickActions from "@/components/home/QuickActions";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--page-dark-background)]">
      <HomeNavbar />
      <HomeGreeting />
      <QuickActions />
    </main>
  );
}
