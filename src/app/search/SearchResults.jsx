// app/search/page.jsx
"use client"; // 클라이언트 컴포넌트로 지정

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation"; // 쿼리 파라미터 가져오기

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link"; // 상품 상세 페이지로 이동하기 위해
import { searchProducts } from "@/lib/api";
import LoadingAnimation from "@/components/LoadingAnimation";

export default function SearchResultsPage() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("query") || ""; // URL에서 'query' 파라미터 값을 가져옵니다.
  const keywordsParam = searchParams.get("keywords") || "";

  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [relatedKeywords, setRelatedKeywords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // searchQuery를 이용해 백엔드 API를 호출하여
    // 연관 키워드와 추천 상품 목록을 가져옵니다.
    const fetchSearchResults = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // keywords 파라미터를 다시 배열로 변환
        const keywordsArray = keywordsParam ? keywordsParam.split(",") : [];

        const result = await searchProducts({
          query: searchQuery,
          keywords: keywordsArray,
        });

        if (result && result.data && Array.isArray(result.data.products)) {
          setRecommendedProducts(result.data.products);
          // 연관 키워드 백에서 주면 추가
        } else {
          throw new Error(result.message || "상품 검색에 실패했습니다.");
        }
      } catch (error) {
        setError("상품을 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };
    if (searchQuery) {
      fetchSearchResults();
    } else {
      // 검색어가 없으면 로딩을 멈추고 상품 목록을 비웁니다.
      setIsLoading(false);
      setRecommendedProducts([]);
    }
  }, [searchQuery, keywordsParam]); // searchQuery나 keywordParam 바뀔때마다 재검색

  // 좋아요 버튼 토글 핸들러
  const handleLikeToggle = (productId) => {
    setRecommendedProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId
          ? { ...product, isLiked: !product.isLiked }
          : product
      )
    );
  };

  // 로딩 및 에러 상태에 따른 UI 처리
  if (isLoading) {
    return (
      // 2. 로딩 컴포넌트가 중앙에 오도록 스타일링
      <div className="flex justify-center items-center h-[calc(100vh-64px)]">
        <LoadingAnimation />
      </div>
    );
  }

  if (error) {
    return <div className="text-center p-20 text-red-500">{error}</div>;
  }

  return (
    <div className="flex flex-col items-center px-4 pt-6 md:pt-16 lg:pt-20 pb-16 bg-gray-50 min-h-[calc(100vh-64px)]">
      {" "}
      {/* 헤더 높이만큼 빼서 스크롤 영역 확보 */}
      <div className="w-full max-w-6xl bg-white p-8 rounded-lg shadow-md">
        {/* 검색 문장 표시 */}
        <h1 className="text-xl md:text-xl font-bold text-gray-800 mb-6">
          <span className="text-black">'{searchQuery}'</span>에 대한 검색 결과
        </h1>

        {/* 연관 키워드 */}
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-gray-700 mb-2">
            AI 추출 키워드
          </h2>
          <div className="flex flex-wrap gap-2">
            {relatedKeywords.map((keyword, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="bg-blue-100 text-blue-800 text-sm px-3 py-1"
              >
                {keyword}
              </Badge>
            ))}
          </div>
        </div>

        {/* AI 추천 상품 리스트 */}
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          AI 추천 상품 (
          <span className="text-blue-600">{recommendedProducts.length}</span>개)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {recommendedProducts.map((product) => (
            <Card
              key={product.id}
              className="relative flex flex-col group hover:shadow-lg transition-shadow duration-200"
            >
              {/* 좋아요 버튼 */}
              <Button
                variant="outline"
                size="icon"
                className={`absolute top-2 right-2 rounded-full w-8 h-8 z-10 ${
                  product.isLiked
                    ? "bg-red-100 text-red-500 border-red-300"
                    : "bg-white text-gray-400 border-gray-300"
                }`}
                onClick={() => handleLikeToggle(product.id)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 fill-current"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </Button>

              {/* 상품 상세 페이지로 Link */}
              <Link
                href={`/product/${product.id}`}
                className="flex flex-col flex-grow"
              >
                <CardHeader className="p-0 pb-3 flex items-center justify-center bg-gray-100 rounded-t-lg overflow-hidden h-40">
                  <img
                    src={product.main_image_url}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </CardHeader>
                <CardContent className="p-4 flex-grow">
                  <Badge
                    variant="secondary"
                    className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 mb-2"
                  >
                    {product.tag}
                  </Badge>
                  <h3 className="text-base font-semibold text-gray-800 mb-1 line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {product.description}
                  </p>
                </CardContent>
                <CardFooter className="px-4 py-3 flex justify-between items-center border-t text-sm">
                  <span className="text-lg font-bold text-[#33A1E0]">
                    {product.price.toLocaleString()}원
                  </span>
                </CardFooter>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
