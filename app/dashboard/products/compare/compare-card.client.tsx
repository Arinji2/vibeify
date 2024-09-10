"use client";

import { DeleteCompareAction } from "@/actions/compare/deleteCompare";
import ShareCompareModal from "@/app/(models)/shareCompareModal";
import { CompareSchema } from "@/utils/validations/products/compare/schema";
import { CompareSchemaType } from "@/utils/validations/products/compare/types";
import { Check, Loader2, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Pocketbase from "pocketbase";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

export function CompareCardClient({
  compareData,
  token,
}: {
  compareData: CompareSchemaType;
  token: string | undefined;
}) {
  const [compareDataState, setCompareDataState] = useState(compareData);
  const [matchString, setMatchString] = useState("-");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) return;

    let compareDataSubscription: Promise<() => void>;

    (async () => {
      const pocketbase = new Pocketbase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
      pocketbase.authStore.save(token);

      await pocketbase.collection("users").authRefresh();

      compareDataSubscription = pocketbase
        .collection("compareList")
        .subscribe(compareData.id, (data) => {
          const parsedCompareData = CompareSchema.safeParse(data.record);

          if (parsedCompareData.success && parsedCompareData.data.results) {
            setCompareDataState(parsedCompareData.data);
            toast.success("Comparison Finished");
          }
        });
    })();

    return () => {
      compareDataSubscription?.then((unsubscribe) => unsubscribe());
    };
  }, [token, compareData]);

  useMemo(() => {
    if (!compareDataState.results) return;
    const totalSongsAvg =
      (compareDataState.results.common.length +
        compareDataState.results.missingIn1.length +
        compareDataState.results.missingIn2.length) /
      3;
    setMatchString(
      Math.round(
        (compareDataState.results.common.length / totalSongsAvg) * 100
      ) + "%"
    );
  }, [compareDataState]);
  const router = useRouter();

  return (
    <>
      {showModal && (
        <ShareCompareModal id={compareData.id} setIsOpen={setShowModal} />
      )}
      <div className="w-full h-[60px] bg-palette-background rounded-lg border-[2px] border-black flex flex-row items-center  justify-center gap-2">
        <div className="w-full h-full flex flex-row items-center justify-center gap-3">
          <p className="font-medium text-[18px] text-black">Public:</p>
          <div className="w-fit h-fit p-1 bg-[#FF7A5C] rounded-lg border-[2px] border-black">
            {compareData.shareLink.length > 0 ? (
              <Check strokeWidth={4} className="size-[13px] text-black" />
            ) : (
              <X strokeWidth={3} className="size-[13px] text-black" />
            )}
          </div>
        </div>
        <div className="w-[2px] h-[90%] bg-black shrink-0"></div>
        <div className="w-full h-full flex flex-row items-center justify-center gap-3">
          <p className="font-medium text-[18px] text-black">Match:</p>
          <p className="font-medium text-[18px] text-palette-accent">
            {matchString}
          </p>
        </div>
      </div>
      {compareDataState.results ? (
        <div className="w-full h-fit flex flex-row items-center justify-between gap-2 mt-auto">
          <Link
            href={`/dashboard/products/compare/view/${compareDataState.id}`}
            className="px-4 md:px-6 rounded-lg py-2  border-[3px] bg-palette-tertiary border-black  flex flex-row gap-2 items-center justify-center"
          >
            <p className="text-[15px] text-black font-medium">View</p>
          </Link>
          <button
            disabled={loading}
            onClick={async () => {
              setLoading(true);
              const res = await DeleteCompareAction({
                id: compareDataState.id,
              });
              if (res.success) {
                router.refresh();
                toast.success("Compare Deleted");
                window.location.reload();
              } else {
                toast.error(res.message);
              }

              setLoading(false);
            }}
            className="px-4 md:px-6 rounded-lg py-2 md:w-[101px] md:h-[46px] h-[43px] w-[85px] border-[3px] bg-palette-error border-black  flex flex-row gap-2 items-center justify-center"
          >
            {loading ? (
              <Loader2 className="animate-spin size-[15px]" />
            ) : (
              <p className="text-[15px] text-white font-medium">Delete</p>
            )}
          </button>
          <button
            onClick={() => {
              if (compareDataState.shareLink.length === 0) {
                setShowModal(!showModal);
                return;
              }
              let link =
                window.location.host + "/compare/" + compareDataState.shareLink;
              window.navigator.clipboard.writeText(link);
              toast.success("Link copied to clipboard");
            }}
            className="px-4 md:px-6 rounded-lg py-2  border-[3px] bg-palette-tertiary border-black  flex flex-row gap-2 items-center justify-center"
          >
            <p className="text-[15px] text-black font-medium">Share</p>
          </button>
        </div>
      ) : (
        <div className="w-full h-[100px] bg-palette-tertiary rounded-lg border-[3px] border-black flex flex-row gap-3 items-center justify-center">
          <p className="font-medium text-[18px] text-black">
            Comparing Playlists
          </p>{" "}
          <Loader2
            strokeWidth={3}
            className="size-[20px] text-black animate-spin"
          />
        </div>
      )}
    </>
  );
}
