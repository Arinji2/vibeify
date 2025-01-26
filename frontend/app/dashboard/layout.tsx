import { getToken } from "@/utils/getToken";
import Navbar from "../(navbar)/dashNavbar";
import WidthWrapper from "../(wrapper)/widthWrapper";
import Pocketbase from "pocketbase";
import { getModel } from "@/utils/getModel";
import { UserSchema } from "@/utils/validations/account/schema";
import { unstable_cache } from "next/cache";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pb = new Pocketbase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
  const token = await getToken();
  const model = await getModel();
  pb.authStore.save(token);
  const userRecord = await unstable_cache(
    async () => {
      const userRecord = await pb.collection("users").getOne(model.id);
      return userRecord;
    },
    ["cache-key"],
    {
      tags: ["dashboardLayout"],
    }
  )();

  const parsedUserRecord = UserSchema.safeParse(userRecord);
  if (!parsedUserRecord.success) throw new Error("Invalid User Data");

  const dicebear = parsedUserRecord.data.dicebear;
  let seed;
  if (dicebear.length === 0) seed = undefined;
  else seed = dicebear;
  return (
    <div className="bg-palette-accent">
      <Navbar border seed={seed} />
      <WidthWrapper>{children}</WidthWrapper>
    </div>
  );
}
