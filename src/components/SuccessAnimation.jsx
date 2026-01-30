// src/components/SuccessAnimation.jsx
"use client";

import Lottie from "lottie-react";

const animationData = "/Success.json";

export default function SuccessAnimation({ message, onComplete }) {
  return (
    // 화면 전체를 덮는 반투명 오버레이
    <div className="fixed inset-0 bg-gray bg-opacity-50 flex justify-center items-center z-50">
      {/* 애니메이션과 텍스트를 담는 흰색 박스 */}
      <div className="bg-white rounded-lg p-8 flex flex-col items-center shadow-xl">
        <div className="w-40 h-40">
          {" "}
          {/* 애니메이션 크기 조절 */}
          <Lottie
            path={animationData}
            loop={false} // 한 번만 재생
            autoplay={true}
            onComplete={onComplete}
          />
        </div>
        <p className="text-lg font-semibold text-gray-700 mt-4">
          {message || "성공적으로 완료되었습니다!"}
        </p>
      </div>
    </div>
  );
}
