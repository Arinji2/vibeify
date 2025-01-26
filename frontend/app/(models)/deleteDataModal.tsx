"use client";
import DeleteDataAction from "@/actions/account/deleteData";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

export default function DeleteAccountModal({
  setIsOpen,
}: {
  setIsOpen: Function;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  return (
    <div
      className={
        "w-full h-[100svh] p-4 z-[10000] fixed top-0 left-0 bg-black bg-opacity-80 backdrop-blur-sm flex flex-col items-center justify-center"
      }
    >
      <div className="w-[90%] min-h-[400px] flex flex-col items-center  justify-center p-4 md:h-[50%] gap-6  xl:w-[70%] aspect-video bg-palette-background border-[3px] border-black shadow-button">
        <div className="w-full h-fit flex md:flex-row items-center  justify-center gap-4 flex-col">
          <h1 className="text-[35px] md:text-[60px] text-palette-text font-medium text-center ">
            Deleting
          </h1>
          <h1 className="md:text-[60px] text-[45px] xl:text-[70px] font-bold text-palette-text truncate w-full md:w-auto  text-center">
            Account Data
          </h1>
        </div>

        <div className="w-full h-fit flex flex-row items-center justify-center flex-wrap gap-5">
          <button
            onClick={async () => {
              setLoading(true);
              const res = await DeleteDataAction();
              if (res.status === 200) {
                toast.success("Account Deleted Successfully");
                router.push("/");
              } else {
                toast.error("Something went wrong");
              }
              setLoading(false);
              setIsOpen(false);
            }}
            className="w-[180px] h-[70px] bg-palette-error  border-[4px] border-black shadow-button hover:shadow-buttonHover transition-all ease-in-out duration-300 will-change-transform hover:scale-95 flex flex-col items-center justify-center "
          >
            <p className="text-white text-[30px] font-medium">
              {loading ? (
                <Loader2 className="animate-spin w-[40px] h-[40px]" />
              ) : (
                "Delete"
              )}
            </p>
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsOpen(false);
            }}
            className="w-[180px] h-[70px] bg-palette-success  border-[4px] border-black shadow-button hover:shadow-buttonHover transition-all ease-in-out duration-300 will-change-transform hover:scale-95 flex flex-col items-center justify-center "
          >
            <p className="text-white text-[30px] font-medium">Go Back</p>
          </button>
        </div>
      </div>
    </div>
  );
}
