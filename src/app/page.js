// app/page.tsx
"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

export default function HomePage() {
  // 추가된 키워드
  const [keywords, setKeywords] = useState([]);
  // 현재 입력중인 키워드
  const [currentKeyword, setCurrentKeyword] = useState("");

  // 키워드 추가 함수
  const handleAddKeyword = () => {
    // 입력값이 비어있지 않고, 현재 키워드가 추가한 키워드에 없으면 추가
    if (currentKeyword && !keywords.includes(currentKeyword)) {
      setKeywords([...keywords, currentKeyword]);
      setCurrentKeyword("");
    }
  };

  // 키워드 삭제 함수
  const handleRemoveKeyword = (keyWordToRemove) => {
    setKeywords(keywords.filter((keyword) => keyword !== keyWordToRemove));
  };

  // 엔터키로 키워드 추가 함수
  const handlekeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleAddKeyword();
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-grow flex flex-col items-center justify-center p-8 mb-40">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">AI 상품 검색</h1>
        <p className="text-md text-[#393E46] text-center max-w-2xl mb-12">
          원하는 상품을 자연스럽게 설명하면 AI가 키워드를 추출해서 맞춤 상품을
          추천해드립니다
        </p>

        <div className="w-full max-w-3xl flex flex-col items-center space-y-4">
          {/* Main Search Input */}
          <div className="flex w-full space-x-2">
            <div className="relative flex-grow w-full">
              <Input
                type="text"
                placeholder="원하는 상품을 자연스럽게 설명해보세요(예: 설날에 부모님께 드릴 달콤한 과일을 찾아줘)"
                className="pl-10 pr-4 py-2 text-base h-12 focus-visible:ring-2 
             focus-visible:ring-[#5F9DFA] 
             focus-visible:border-[#5F9DFA]"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 h-12">
              검색
            </Button>
          </div>

          {/* 키워드 추가 */}
          <div className="flex w-full space-x-2">
            <div className="relative flex-grow w-full">
              <Input
                type="text"
                placeholder="추가 키워드 입력"
                value={currentKeyword}
                onChange={(e) => setCurrentKeyword(e.target.value)}
                onKeyDown={handlekeyDown}
                className=" py-2 text-base h-12 focus-visible:ring-2 
             focus-visible:ring-[#5F9DFA] 
             focus-visible:border-[#5F9DFA]"
              />
            </div>
            <Button
              variant="outline"
              className="text-blue-600 border-blue-600 hover:bg-blue-50 px- h-12"
              onClick={handleAddKeyword}
            >
              + 추가
            </Button>
          </div>

          {keywords.length > 0 && (
            <div className="w-full text-left pt-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                추가한 키워드
              </h3>
              <div className="flex flex-wrap gap-2">
                {/* 5. keywords 배열을 순회하며 Badge 동적 렌더링 */}
                {keywords.map((keyword, index) => (
                  <Badge
                    key={index} // React가 각 요소를 구분하기 위한 고유 key
                    variant="secondary"
                    className="bg-blue-100 text-blue-800 px-3 py-1 text-sm"
                  >
                    {keyword}
                    <button
                      className="ml-2 text-blue-500 hover:text-blue-800"
                      onClick={() => handleRemoveKeyword(keyword)} // 삭제 이벤트 연결
                    >
                      &times; {/* 'x' 모양 문자 */}
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer (생략) */}
    </div>
  );
}
