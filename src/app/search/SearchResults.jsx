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

export default function SearchResultsPage() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("query") || ""; // URL에서 'query' 파라미터 값을 가져옵니다.

  // 더미 데이터 (실제로는 API 호출로 가져옵니다)
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [relatedKeywords, setRelatedKeywords] = useState([]);

  useEffect(() => {
    // 실제라면 여기서 searchQuery를 이용해 백엔드 API를 호출하여
    // 연관 키워드와 추천 상품 목록을 가져옵니다.
    // fetch(`/api/search?query=${searchQuery}`).then(res => res.json()).then(data => {
    //   setRelatedKeywords(data.keywords);
    //   setRecommendedProducts(data.products);
    // });

    // 더미 데이터 설정
    setRelatedKeywords(["설날선물", "제주과일", "달콤한", "명절선물"]);
    setRecommendedProducts([
      {
        id: "1",
        name: "제주 한라봉",
        description:
          "제주도의 청정 자연에서 자란 프리미엄 한라봉을 만나보세요. 비타민 C가 풍부하여 겨울철 감기 관리에도...",
        price: 25000,
        tag: "제철과일",
        imageUrl: "https://via.placeholder.com/200x200?text=Jeju+Hallabong",
        isLiked: false, // 좋아요 상태 추가
      },
      {
        id: "2",
        name: "고당도 샤인머스켓",
        description:
          "알알이 꽉 찬 프리미엄 샤인머스켓! 망고향이 나는 달콤함이 일품입니다.",
        price: 38000,
        tag: "고급과일",
        imageUrl: "https://via.placeholder.com/200x200?text=Shine+Muscat",
        isLiked: false,
      },
      {
        id: "3",
        name: "상큼한 딸기 (1kg)",
        description:
          "새콤달콤한 맛이 일품인 싱싱한 딸기, 온 가족이 함께 즐기세요!",
        price: 18000,
        tag: "제철과일",
        imageUrl: "https://via.placeholder.com/200x200?text=Strawberry",
        isLiked: false,
      },
      // 더미 상품 추가
      {
        id: "4",
        name: "프리미엄 사과 세트",
        description:
          "아삭한 식감과 풍부한 과즙의 프리미엄 사과, 선물용으로 좋습니다.",
        price: 32000,
        tag: "과일선물",
        imageUrl: "https://via.placeholder.com/200x200?text=Apple+Set",
        isLiked: false,
      },
      {
        id: "5",
        name: "싱싱한 감귤 (3kg)",
        description: "새콤달콤한 맛과 비타민C가 가득한 싱싱한 감귤입니다.",
        price: 15000,
        tag: "제철과일",
        imageUrl: "https://via.placeholder.com/200x200?text=Mandarin",
        isLiked: false,
      },
    ]);
  }, [searchQuery]); // searchQuery가 변경될 때마다 데이터를 다시 로드

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

  return (
    <div className="flex flex-col items-center px-4 pt-6 md:pt-16 lg:pt-20 pb-16 bg-gray-50 min-h-[calc(100vh-64px)]">
      {" "}
      {/* 헤더 높이만큼 빼서 스크롤 영역 확보 */}
      <div className="w-full max-w-6xl bg-white p-8 rounded-lg shadow-md">
        {/* 검색 문장 표시 */}
        <h1 className="text-xl md:text-xl font-bold text-gray-800 mb-6">
          <span className="text-blue-600">'{searchQuery}'</span>에 대한 검색
          결과
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
                    src={product.imageUrl}
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
                  <span className="text-lg font-bold text-blue-600">
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
