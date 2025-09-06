// src/components/LoadingAnimation.jsx
"use client";

import Lottie from "lottie-react";

// 2단계에서 복사한 Lottie Animation URL을 여기에 붙여넣으세요.
const animationData = "/loading.json";

export default function LoadingAnimation() {
  return (
    <div className="flex flex-col justify-center items-center h-full">
      <div className="w-48 h-48">
        {" "}
        {/* 애니메이션의 크기를 조절하세요 */}
        <Lottie
          animationData={null} // 로컬 JSON 파일을 사용할 때 여기에 import
          path={animationData} // URL을 사용할 때 path 속성을 사용
          loop={true}
          autoplay={true}
        />
      </div>
      {/* <p className="text-lg text-gray-600 mt-4">
        AI가 맞춤 상품을 찾고 있어요...
      </p> */}
    </div>
  );
}
