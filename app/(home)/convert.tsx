import Image from "next/image";
import WidthWrapper from "../(wrapper)/widthWrapper";

export default function Convert() {
  return (
    <section className="flex h-fit w-full flex-col  items-center justify-center bg-palette-primary py-10">
      <WidthWrapper>
        <div className="flex h-full w-full flex-col items-center justify-center gap-10 xl:items-start">
          <div className="flex h-fit w-fit flex-col items-center justify-start gap-5 md:flex-row ">
            <div className="flex h-[100px] w-[100px] flex-col items-center justify-center rounded-full bg-palette-offWhite">
              <p className="shrink  text-[60px] font-bold text-palette-primary">
                3
              </p>
            </div>
            <h2 className="text-[50px] font-bold text-palette-background">
              Convert
            </h2>
          </div>
          <div className="flex h-full w-full flex-col items-start justify-center  xl:pl-16">
            <div className="flex h-fit w-full shrink-0 flex-col items-center justify-start gap-5  border-[3px] border-black bg-palette-background p-5 shadow-button transition-all  duration-300 ease-in-out will-change-transform  hover:scale-90 hover:shadow-buttonHover md:shrink xl:m-0 xl:h-[300px] xl:max-w-[1060px]">
              <div className="flex h-fit w-full flex-col items-center justify-center gap-5 md:h-fit md:gap-3 xl:flex-row">
                <p className="text-center text-[40px] font-medium text-black md:text-[50px]">
                  Main Playlist
                </p>
                <div className="relative flex h-[200px] w-fit shrink-0 flex-row items-center justify-center gap-y-5 xl:h-full xl:flex-col">
                  <Image
                    src="/graphics/arrow.png"
                    width={185}
                    height={3}
                    alt="Arrow"
                    className="ml-7 rotate-[100deg] object-contain md:absolute md:right-20  md:ml-0 md:rotate-[123deg] xl:static  xl:mr-3 xl:-rotate-[19deg] "
                  />

                  <Image
                    src="/graphics/arrow.png"
                    width={185}
                    height={3}
                    alt="Arrow"
                    className="mt-5 hidden rotate-[90deg] object-contain md:block xl:mt-0 xl:rotate-0"
                  />
                  <Image
                    src="/graphics/arrow.png"
                    width={185}
                    height={3}
                    alt="Arrow"
                    className=" mr-7 rotate-[77deg] object-contain md:absolute md:left-20 md:mr-0 md:rotate-[57deg] xl:static xl:mr-3 xl:rotate-[19deg] "
                  />
                </div>
                <div className="flex h-full w-full flex-row items-start justify-between gap-8 md:w-fit md:items-center  md:justify-center xl:flex-col">
                  <p className="text-[20px] text-black md:text-[30px]">
                    Playlist 1
                  </p>
                  <p className=" text-[20px] text-black md:text-[30px]">
                    Playlist 2
                  </p>
                  <p className="hidden text-[20px] text-black md:block md:text-[30px]">
                    Playlist 3
                  </p>
                </div>
              </div>
              <p className="text-center text-[15px] text-palette-accent">
                Split your Playlist based on Genre with AI And Spotify!
              </p>
            </div>
          </div>
        </div>
      </WidthWrapper>
    </section>
  );
}

function Card({ title, description }: { title: string; description: string }) {
  return (
    <div
      tabIndex={0}
      className="m-auto flex  h-[200px] w-full flex-col items-start justify-start border-[3px] border-black bg-palette-background p-5 shadow-button transition-all  duration-300 ease-in-out will-change-transform hover:scale-90 hover:shadow-buttonHover md:w-[516px]"
    >
      <h3 className="text-[50px] font-bold text-palette-text">{title}</h3>
      <p className=" text-[20px] font-medium text-palette-text">
        {description}
      </p>
    </div>
  );
}
