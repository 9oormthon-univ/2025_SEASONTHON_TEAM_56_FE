// app/search/page.jsx
import { Suspense } from "react";
import SearchResults from "./SearchResults";
import LoadingAnimation from "@/components/LoadingAnimation";

// 로딩 중에 보여줄 간단한 컴포넌트
// function Loading() {
//   return (
//     <div className="flex justify-center items-center h-[calc(100vh-64px)]">
//       <p className="text-xl text-gray-700">검색 결과를 불러오는 중입니다...</p>
//     </div>
//   );
// }

export default function SearchPage() {
  return (
    // Suspense로 SearchResults 컴포넌트를 감싸줍니다.
    <Suspense fallback={<LoadingAnimation />}>
      <SearchResults />
    </Suspense>
  );
}
