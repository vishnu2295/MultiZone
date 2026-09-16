import { notFound } from "next/navigation";
import Navbar from "@/components/landing/Navbar";
import RegisterFlow from "@/components/register/RegisterFlow";
import { getPersona } from "@/lib/personas";

type RegisterPageProps = {
  params: Promise<{ persona: string }>;
};

export default async function RegisterPage({ params }: RegisterPageProps) {
  const { persona: personaSlug } = await params;
  const persona = getPersona(personaSlug);

  if (!persona) {
    notFound();
  }

  return (
    <main className="relative min-h-dvh bg-[#F6F9FB]">
      <Navbar />
      <div className="mx-auto flex w-full max-w-[1440px] justify-center px-4 pb-16 pt-[calc(54px+3.5rem)] sm:px-6 lg:px-[56px]">
        <RegisterFlow persona={persona} />
      </div>
    </main>
  );
}
