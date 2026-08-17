import Navbar from "@/components/common/Navbar";
import Greeting from "@/components/common/Greeting";
import QuickActions from "@/components/common/QuickActions";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#F3F7FA]">
      <Navbar />
      <Greeting />
      <QuickActions />
    </main>
  );
}
