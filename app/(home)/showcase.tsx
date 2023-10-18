import WidthWrapper from "../(wrapper)/widthWrapper";

export default function Showcase() {
  return (
    <section className="flex h-fit w-full flex-col  items-center justify-center bg-palette-primary py-10 ">
      <WidthWrapper>
        <div className="flex h-full w-full flex-col items-center justify-center gap-10 md:items-start">
          <div className="flex h-fit w-fit flex-col items-center justify-start gap-5 md:flex-row ">
            <div className="flex h-[100px] w-[100px] flex-col items-center justify-center rounded-full bg-palette-offWhite">
              <p className="shrink text-[60px] font-bold text-palette-primary">
                1
              </p>
            </div>
            <h2 className="text-[50px] font-bold text-palette-background">
              Showcase
            </h2>
          </div>
          <div className="grid h-full w-full grid-cols-1 gap-5 xl:w-fit xl:grid-cols-2 xl:pl-16">
            <Card
              title="Themes"
              description="Showcase your playlists in multiple themes."
            />
            <Card
              title="Link"
              description="Make a custom link to access your spotify playlist."
            />
            <Card
              title="Lyrics"
              description="View lyrics in any language for your songs."
            />
            <Card
              title="Stats"
              description="Showcase stats like Likes and Views for your playlist."
            />
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
      className="m-auto flex h-[150px] w-full  flex-col items-start justify-start border-[3px] border-black bg-palette-background p-5 shadow-button transition-all duration-300 ease-in-out  will-change-transform hover:scale-90 hover:shadow-buttonHover md:mr-auto md:h-[200px] md:w-[516px]"
    >
      <h3 className="text-[30px] font-bold text-palette-text md:text-[50px]">
        {title}
      </h3>
      <p className="text-[15px] font-medium text-palette-text md:text-[20px]">
        {description}
      </p>
    </div>
  );
}
