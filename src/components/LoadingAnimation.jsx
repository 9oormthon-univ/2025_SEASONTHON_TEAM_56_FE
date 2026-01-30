// src/components/LoadingAnimation.jsx
"use client";

import Lottie from "lottie-react";

const animationData = "/loading.json";

export default function LoadingAnimation() {
  return (
    <div className="flex flex-col justify-center items-center h-full">
      <div className="w-48 h-48">
        {" "}
        <Lottie
          animationData={null}
          path={animationData}
          loop={true}
          autoplay={true}
        />
      </div>
    </div>
  );
}
