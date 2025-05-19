"use client";

import dynamic from "next/dynamic";
import successAnimation from "@/assets/animation/success.json";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

const SuccessAnimation = () => {
  return (
    <div className="w-[200px] h-[200px] mx-auto">
      <Lottie
        animationData={successAnimation}
        loop={true}
        style={{ width: 200, height: 200 }}
      />
    </div>
  );
};

export default SuccessAnimation;
