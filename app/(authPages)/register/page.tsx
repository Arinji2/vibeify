import Form from "./form";

export default function Page() {
  return (
    <div className="flex h-fit w-full flex-col items-center justify-center gap-5 bg-palette-background pb-5 md:min-h-excludeNav xl:flex-row  xl:pb-0">
      <div className="flex h-fit  w-full flex-col items-center justify-center xl:h-full xl:w-[40%] xl:items-end">
        <h1 className="pt-5 text-[50px] font-bold text-black md:pt-0 md:text-[70px]">
          REGISTER
        </h1>
      </div>
      <div className="flex h-full w-full flex-col items-start justify-center gap-5 xl:w-[50%]">
        <Form />
      </div>
    </div>
  );
}
