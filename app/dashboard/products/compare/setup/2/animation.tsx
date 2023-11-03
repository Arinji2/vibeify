"use client";
import Lottie from "react-lottie-player";
import animationJSON from "../../../../../../public/animations/compare2.json";

export default function Animation() {
  return (
    <div className=" w-full h-fit p-4 flex flex-col items-center justify-center ">
      <div className="md:w-[300px] aspect-square w-[150px] bg-transparent">
        <Lottie
          loop
          animationData={animationJSON}
          play
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    </div>
  );
}
