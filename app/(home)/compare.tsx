import WidthWrapper from "../(wrapper)/widthWrapper";

export default function Compare() {
  return (
    <section className="flex h-fit w-full flex-col  items-center justify-center bg-palette-background py-10">
      <WidthWrapper>
        <div className="flex h-full w-full flex-col items-center justify-center gap-10 xl:items-start">
          <div className="flex h-fit w-fit flex-col items-center justify-start gap-5 md:flex-row ">
            <div className="flex h-[100px] w-[100px] flex-col items-center justify-center rounded-full bg-palette-offWhite">
              <p className="shrink  text-[60px] font-bold text-palette-primary">
                2
              </p>
            </div>
            <h2 className="text-[50px] font-bold text-palette-primary">
              Compare
            </h2>
          </div>
          <div className="flex h-full w-full flex-col items-start justify-center  xl:pl-16">
            <div className="flex h-fit w-full flex-col items-center justify-start  gap-5 border-[3px] border-black bg-palette-background p-5 shadow-button  transition-all duration-300 ease-in-out  will-change-transform hover:scale-90 hover:shadow-buttonHover  xl:m-0 xl:max-w-[1060px]">
              <h3 className="text-center text-[40px] font-bold text-palette-text md:text-[50px]">
                Compare between Playlists
              </h3>
              <div className=" block h-[5px] w-[95%] bg-palette-text md:hidden"></div>

              <div className="flex h-full w-full flex-col items-center justify-center gap-3 xl:flex-row">
                <div className="flex h-[50%] w-full flex-col items-center justify-center gap-7 md:gap-5 xl:h-full ">
                  <h4 className="text-[30px] font-medium text-palette-text md:text-[60px]">
                    Playlist 1
                  </h4>
                  <h4 className="text-center text-[20px] font-medium text-palette-text text-opacity-60">
                    2 Songs missing in Playlist 1 from Playlist 2
                  </h4>
                </div>
                <div className="h-[5px] w-[50%] bg-palette-text md:h-[90%] md:w-[10px]"></div>
                <div className="flex h-[50%] w-full flex-col items-center justify-center gap-5 xl:h-full ">
                  <h4 className="text-[30px] font-medium text-palette-text md:text-[60px]">
                    Playlist 2
                  </h4>
                  <h4 className="text-center text-[20px] font-medium text-palette-text text-opacity-60">
                    5 Songs missing in Playlist 2 from Playlist 1
                  </h4>
                </div>
              </div>
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
