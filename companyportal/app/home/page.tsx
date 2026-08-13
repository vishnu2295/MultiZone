import HomeNavbar from "@/components/home/HomeNavbar";
import HomeGreeting from "@/components/home/HomeGreeting";
import QuickActions from "@/components/home/QuickActions";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#F3F7FA]">
      <HomeNavbar />
      <HomeGreeting />
      <QuickActions />
    </main>
  );
}
