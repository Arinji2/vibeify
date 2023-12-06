"use client";
import { ChangeUsernameAction } from "@/actions/account/username";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
export default function ChangeUsernameModal({
  setIsOpen,
  serverData,
}: {
  setIsOpen: Function;
  serverData: string;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [username, setUsername] = useState<string>(serverData ?? "");
  return (
    <div
      className={
        "w-full h-[100svh] p-4 z-[10000] fixed top-0 left-0 bg-black bg-opacity-80 backdrop-blur-sm flex flex-col items-center justify-center"
      }
    >
      <div className="w-[90%] min-h-[500px] flex flex-col items-center  justify-center p-4 md:h-[50%] gap-6  xl:w-[70%] aspect-video bg-palette-background border-[3px] border-black shadow-button">
        <div className="w-full h-fit flex md:flex-row items-center  justify-center gap-4 flex-col">
          <h1 className="text-[35px] md:text-[60px] text-palette-text font-medium text-center ">
            Update Username
          </h1>
        </div>
        <div className=" px-2 py-3 text-sm md:text-base w-full h-[60px] md:max-w-[250px] xl:max-w-[400px] flex flex-row items-center justify-start border-[3px] focus:outline-none border-black">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            name="username"
            className="w-full z-30 bg-palette-background text-palette-text focus:outline-none"
          />
        </div>
        <div className="w-full h-fit flex flex-row items-center justify-center flex-wrap gap-5">
          <button
            disabled={username.length === 0 || loading}
            onClick={async () => {
              setLoading(true);
              const res = await ChangeUsernameAction({
                username: username,
              });

              if (res.status === 200) {
                toast.success("Username changed successfully");

                router.refresh();
              } else if (res.status === 404) {
                toast.error("User not found");
              } else if (res.status === 403) {
                toast.error("Unauthorized");
              } else {
                toast.error("Server Error");
              }

              setLoading(false);
              setIsOpen(false);
            }}
            className="w-[180px] h-[70px] disabled:bg-slate-500 bg-palette-success  border-[4px] border-black shadow-button hover:shadow-buttonHover transition-all ease-in-out duration-300 will-change-transform hover:scale-95 flex flex-col items-center justify-center "
          >
            <p className="text-white text-[30px] font-medium">
              {loading ? (
                <Loader2 className="animate-spin w-[40px] h-[40px]" />
              ) : (
                "Update"
              )}
            </p>
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsOpen(false);
            }}
            className="w-[180px] h-[70px] bg-palette-error  border-[4px] border-black shadow-button hover:shadow-buttonHover transition-all ease-in-out duration-300 will-change-transform hover:scale-95 flex flex-col items-center justify-center "
          >
            <p className="text-white text-[30px] font-medium">Go Back</p>
          </button>
        </div>
      </div>
    </div>
  );
}
