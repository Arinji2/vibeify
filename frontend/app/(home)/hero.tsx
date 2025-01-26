import Image from "next/image";
import { Form } from "./form";

export function Hero() {
  return (
    <div className="flex h-fit w-full flex-col items-start justify-center gap-10 md:min-h-excludeNav">
      <section className="relative flex h-fit w-[90%] flex-col items-start justify-center text-left xl:w-[70%]">
        <h1 className="text-[30px] font-bold text-palette-text md:text-[60px] xl:text-[80px]">
          Giving Love to your Spotify Playlists
        </h1>
        <div className="absolute right-0 top-0 h-[21px] w-[40px] md:right-10 xl:-right-10 xl:h-[31px] xl:w-[50px]">
          <Image
            src="/heart.svg"
            alt="Heart"
            fill
            sizes="(min-width: 1280px) 50px"
          />
        </div>
      </section>
      <section className="flex h-fit w-full flex-row flex-wrap items-center justify-start gap-[33px] md:flex-nowrap">
        <div className="flex h-fit w-fit flex-row items-center justify-center gap-[11px]">
          <div className="h-[17px] w-[17px] rounded-full bg-palette-primary"></div>
          <h2 className="text-[20px] font-medium text-palette-text md:text-[30px]">
            Showcase
          </h2>
        </div>
        <div className="flex h-fit w-fit flex-row items-center justify-center gap-[11px]">
          <div className="h-[17px] w-[17px] rounded-full bg-palette-primary"></div>
          <h2 className="text-[20px] font-medium text-palette-text md:text-[30px]">
            Compare
          </h2>
        </div>
        <div className="flex h-fit w-fit flex-row items-center justify-center gap-[11px]">
          <div className="h-[17px] w-[17px] rounded-full bg-palette-primary"></div>
          <h2 className="text-[20px] font-medium text-palette-text md:text-[30px]">
            Convert
          </h2>
        </div>
      </section>
      <Form />
    </div>
  );
}
