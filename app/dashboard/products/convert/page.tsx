import { SelectGenreComponent } from "./selectGenre";

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  let setupGenres = true;

  if (searchParams["setup"] === "2") setupGenres = false;

  return (
    <div className="w-full md:min-h-excludeNav min-h-excludeMobNav h-full flex flex-col items-center justify-start">
      <div className="h-full w-full flex flex-col  items-center justify-start ">
        <SelectGenreComponent />
      </div>
    </div>
  );
}
