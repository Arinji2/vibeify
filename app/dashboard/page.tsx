import { cookies } from "next/headers";

import { getModel } from "@/utils/getModel";

export default async function Page() {
  const model = await getModel();

  return (
    <main>
      <p>This is the dashboard. Only logged-in users can view this route</p>
      <p>Logged-in user: </p>
      <pre>{JSON.stringify(model, null, 2)}</pre>
    </main>
  );
}
