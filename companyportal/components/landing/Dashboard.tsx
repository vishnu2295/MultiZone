import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";
import DecorativeWave from "@/components/landing/DecorativeWave";
import { siteContent } from "@/content/site";

export default function Dashboard() {
  return (
    <section className="relative min-h-[calc(100vh-72px)] bg-[linear-gradient(180deg,var(--hero-gradient-start)_0%,var(--hero-gradient-end)_100%)] pt-[72px]">
      <div className="relative mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-10 xl:px-14 2xl:max-w-[1680px] 2xl:px-[72px]">
        <div className="relative">
          <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(500px,0.92fr)] lg:gap-12 lg:items-center 2xl:grid-cols-[minmax(0,1.08fr)_minmax(0.92fr,720px)] 2xl:items-center">
            <div className="relative z-10 pt-[8vw] lg:pl-[56px] lg:pt-[0vw] 2xl:pt-[6vw] 2xl:pl-[56px]">
              <div className="max-w-[470px] 2xl:max-w-[650px]">
                <h1 className="text-[clamp(2.4rem,3.4vw,3.8rem)] font-normal leading-[0.95] tracking-[-0.02em] text-white">
                  {siteContent.heroTitle}
                </h1>
                <p
                  className="mt-2 text-[clamp(2.9rem,4.0vw,4.7rem)] font-normal leading-[0.9] text-[#FDC11A]"
                  style={{ fontFamily: '"Absolutely Silent DEMO", cursive' }}
                >
                  {siteContent.heroTitleAccent}
                </p>

                <p className="mt-4 max-w-[330px] text-[clamp(0.9rem,1vw,1rem)] leading-[1.3] text-white/95">
                  {siteContent.heroDescription}
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-5">
                  <Button className="h-10 min-w-[110px] px-6 text-[14px]">
                    {siteContent.primaryCta}
                  </Button>
                  <p className="text-[14px] font-semibold text-white">
                    {siteContent.secondaryCtaPrefix}{" "}
                    <Link
                      href="/home"
                      style={{ color: "#FFB300" }}
                      className="inline-block border-b border-[#FFB300] pb-[1px] leading-none transition hover:opacity-80"
                    >
                      {siteContent.secondaryCta}
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            <div className="relative flex items-end justify-center lg:justify-start 2xl:justify-end">
              <div className="relative w-full max-w-[812px] mt-[clamp(16px,4vw,50px)] translate-y-[-2px] sm:translate-y-[-12px] lg:translate-y-[40px] lg:-ml-0 lg:mt-[50px] top-[20px] ml-10 2xl:absolute 2xl:right-0 2xl:top-0 2xl:mr-0 2xl:max-w-[900px] 2xl:translate-x-[45px] 2xl:-translate-y-[160px]">
                <Image
                  src="/company/images/people.png"
                  alt="Two members reviewing information on a tablet"
                  width={811}
                  height={541}
                  priority
                  className="h-auto w-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="pointer-events-none relative z-20 left-1/2 w-screen -translate-x-1/2 mt-[clamp(-240px,-22vw,-10px)] sm:mt-[clamp(-250px,-18vw,-70px)] lg:mt-[-149px] 2xl:mt-[-80px]">
        <DecorativeWave />
      </div>
    </section>
  );
}
