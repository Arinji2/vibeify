import Image from "next/image";
import Link from "next/link";

export default async function Products() {
  return (
    <div className="md:min-h-excludeNav h-full  bg-palette-accent flex flex-col items-center justify-start py-4 gap-3">
      <h1 className="text-palette-background font-bold md:text-[60px] text-[45px] xl:text-[70px] text-center">
        SELECT A PRODUCT!
      </h1>
      <div className="w-full h-full flex flex-row items-center justify-center gap-6 gap-y-8 flex-wrap gap-x-14">
        <Link
          href="/dashboard/products/compare/setup"
          className="w-[300px] rounded-[10px] hover:scale-95 scale-100 transition-all ease-in-out duration-300 border-[4px] border-black shadow-button flex flex-col items-center justify-center gap-10 h-[450px] bg-palette-background"
        >
          <Image
            src="/graphics/compare.svg"
            alt="Compare"
            width={200}
            height={100}
            className="w-auto h-auto"
          />
          <h2 className="text-palette-text font-bold text-[30px]">Compare</h2>
          <p className="text-palette-text font-medium text-[15px] text-center">
            Compare 2 playlists to find out how many songs are missing in both.{" "}
          </p>
          <div className="w-full h-fit flex flex-row items-center justify-center gap-2">
            <p className="text-palette-text font-bold text-[20px] text-center">
              PRICE:
            </p>
            <p className="text-palette-accent font-bold text-[20px] text-center">
              FREE FOREVER
            </p>
          </div>
        </Link>
        <Link
          href="/dashboard/products/convert"
          className="w-[300px] rounded-[10px] hover:scale-95 scale-100 transition-all ease-in-out duration-300 border-[4px] border-black shadow-button flex flex-col items-center justify-center gap-10 h-[450px] bg-palette-background"
        >
          <Image
            src="/graphics/convert.svg"
            alt="Compare"
            width={200}
            height={100}
            className="w-auto h-auto"
          />
          <h2 className="text-palette-text font-bold text-[30px]">Convert</h2>
          <p className="text-palette-text font-medium text-[15px] text-center">
            Convert a playlist into multiple playlists based on song genres.
          </p>
          <div className="w-full h-fit flex flex-row items-center justify-center gap-2">
            <p className="text-palette-text font-bold text-[20px] text-center">
              PRICE:
            </p>
            <p className="text-palette-accent font-bold text-[20px] text-center">
              FREE FOREVER
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
