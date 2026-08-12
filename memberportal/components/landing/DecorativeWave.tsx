import Image from "next/image";



export default function DecorativeWave() {

  return (

<div className="pointer-events-none relative h-[clamp(190px,26vw,320px)] 2xl:h-[552px] 2xl:max-w-[1920px] 2xl:mx-auto w-full">

  <Image

    src="/company/icons/landing-wave(1).svg"

    alt=""

    fill

    className="object-cover object-top 2xl:object-contain 2xl:object-bottom"

  />

</div>

  );

}