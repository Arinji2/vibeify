import Link from "next/link";
export default function Footer({ full }: { full?: boolean }) {
  return (
    <div
      className={`${
        full ? "md:w-full w-full " : "md:w-[70%] w-[95%] "
      }  h-fit p-2 py-4 bg-palette-background flex flex-col items-center gap-5 justify-center rounded-md shadow-button border-[4px] border-black`}
    >
      <h2 className="text-5xl font-bold text-palette-accent ">VIBEIFY</h2>
      <section className="flex h-fit w-full flex-row flex-wrap items-center justify-center gap-[33px] md:flex-nowrap">
        <div className="flex h-fit w-fit flex-row items-center justify-center gap-[11px]">
          <div className="h-[17px] w-[17px] rounded-full bg-palette-primary"></div>
          <h3 className="text-[20px] font-medium text-palette-text md:text-[30px]">
            Showcase
          </h3>
        </div>
        <div className="flex h-fit w-fit flex-row items-center justify-center gap-[11px]">
          <div className="h-[17px] w-[17px] rounded-full bg-palette-primary"></div>
          <h3 className="text-[20px] font-medium text-palette-text md:text-[30px]">
            Compare
          </h3>
        </div>
        <div className="flex h-fit w-fit flex-row items-center justify-center gap-[11px]">
          <div className="h-[17px] w-[17px] rounded-full bg-palette-primary"></div>
          <h3 className="text-[20px] font-medium text-palette-text md:text-[30px]">
            Convert
          </h3>
        </div>
      </section>

      <Link
        href="/"
        className="w-full flex flex-row items-center justify-center gap-2 text-center"
      >
        <p className="text-2xl font-medium text-black">Intrested?</p>
        <p className="text-xl md:text-3xl font-bold text-palette-secondary border-b-2 border-black">
          Check Us Out!
        </p>
      </Link>
    </div>
  );
}
