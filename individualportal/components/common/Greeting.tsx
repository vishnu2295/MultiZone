import Image from "next/image";

import { homeContent } from "@/content/site";

export default function Greeting() {
  return (
    <section className="relative overflow-x-clip pt-[72px]">
      {/* Decorative wave — mirrors Figma node 2831:1730 */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-[63.05%] top-[69px] z-0 -translate-x-1/2 -translate-y-1/2"
      >
        <div className="w-[100.06vw] max-w-none rotate-[10.78deg]">
          <div
            className="relative aspect-[2250/647] w-full
                       [mask-image:linear-gradient(to_right,transparent_0%,black_6%)]
                       [-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_6%)]"
          >
            <Image
              src="/background-wave.png"
              alt=""
              fill
              quality={100}
              sizes="100vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-4 pb-16 pt-14 sm:px-6 lg:px-14">
        <p className="text-[15.8px] leading-[19px] text-[#13537B]">
          {homeContent.greeting}
        </p>

        <h1 className="mt-2 max-w-[500px] text-[clamp(2.2rem,4.5vw,3rem)] font-normal leading-[1.2] text-[#13537B]">
          {homeContent.memberName}
        </h1>

        <p className="mt-6 max-w-[380px] text-[13.15px] leading-[19px] text-[#6B7F8C]">
          {homeContent.welcomeMessage}
        </p>
      </div>
    </section>
  );
}