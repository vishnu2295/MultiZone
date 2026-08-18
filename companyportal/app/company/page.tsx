import HomeNavbar from "@/components/home/HomeNavbar";
import HomeGreeting from "@/components/home/HomeGreeting";
import QuickActions from "@/components/home/QuickActions";
import { auth0 } from "@/lib/auth0";

export default async function Home() {
  const session = await auth0.getSession();
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#F3F7FA]">
      <HomeNavbar />
      <HomeGreeting />
      <QuickActions />
    </main>
  );
}
