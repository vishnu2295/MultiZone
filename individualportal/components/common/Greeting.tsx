import Image from "next/image";

import { homeContent } from "@/content/site";
import { BuildingIcon } from "@/components/common/icons";

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

      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-4 pb-16 pt-[74px] sm:px-6 lg:px-[100px]">
        <p className="text-[15.8px] font-normal leading-[19px] text-[#13537B]">
          {homeContent.greeting}
        </p>

        <h1 className="mt-5 max-w-[465px] text-[clamp(2.2rem,4.5vw,3rem)] font-normal leading-[58px] text-[#13537B]">
          {homeContent.memberName}
        </h1>

        {/* Employer line — Figma frame 2147217702 (24px icon, 10px gap). */}
        <div className="flex items-center gap-[10px]">
          <BuildingIcon className="h-6 w-6 shrink-0 text-[#13537B]" />
          <span className="[font-family:'Helvetica_Neue',Inter,sans-serif] text-[13.15px] font-normal leading-[19px] text-[#6B7F8C]">
            {homeContent.organisation}
          </span>
        </div>

        <p className="mt-[70px] max-w-[378px] [font-family:'Helvetica_Neue',Inter,sans-serif] text-[13.15px] font-normal leading-[19px] text-[#6B7F8C]">
          {homeContent.welcomeMessage}
        </p>
      </div>

    </section>
  );
}