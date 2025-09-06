// app/product/[productId]/page.jsx
"use client"; // 클라이언트 컴포넌트로 지정

import { useState, useEffect } from "react";
// Next.js 라우터 훅
import { useParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { getProductById } from "@/lib/api";
import LoadingAnimation from "@/components/LoadingAnimation";
// 캐러셀 컴포넌트 (선택사항, 이미지 슬라이드를 구현하려면 설치 필요)
// import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

export default function ProductDetailPage() {
  const params = useParams(); // URL 파라미터 가져오기 (예: { productId: '123' })
  const productId = params.productId; // 현재 상품 ID

  // 더미 상품 데이터 (실제로는 API 호출로 가져옵니다)
  const [product, setProduct] = useState(null);
  const [selectedOption, setSelectedOption] = useState(""); // 선택된 상품 옵션 (예: 2kg)
  const [quantity, setQuantity] = useState(1); // 선택된 수량
  const [totalPrice, setTotalPrice] = useState(0); // 총 결제 금액
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  //사진
  const [mainImage, setMainImage] = useState(null);

  // 데이터 로딩을 위한 useEffect
  useEffect(() => {
    if (!productId) return; // productId가 없으면 실행하지 않음

    const fetchProductDetail = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const result = await getProductById(productId);

        if (result && result.data) {
          setProduct(result.data);

          if (result.data.images && result.data.images.length > 0) {
            // is_main이 true인 이미지를 찾습니다.
            const mainImgObject = result.data.images.find(
              (img) => img.is_main === true
            );
            // 만약 mainImgObject가 있으면 그 URL을, 없으면 0번 이미지 URL을 대표로 설정합니다.
            setMainImage(
              mainImgObject ? mainImgObject.url : result.data.images[0].url
            );
          }

          // 옵션이 없는 상품의 기본 가격 설정
          if (!result.data.options || result.data.options.length === 0) {
            setTotalPrice(result.data.price || 0);
          }
          // 옵션이 있다면 첫 번째 옵션을 기본으로 선택
          if (result.data.options && result.data.options.length > 0) {
            setSelectedOption(result.data.options[0].id);
          }
        } else {
          throw new Error(
            result.error?.message || "상품 상세 정보를 가져오지 못했습니다."
          );
        }
      } catch (err) {
        setError("상품 정보를 가져오는데 실패했습니다.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProductDetail();
  }, [productId]);

  // 옵션 변경 시 총 가격 계산
  useEffect(() => {
    if (product && product.options && selectedOption) {
      const option = product.options.find((opt) => opt.id === selectedOption);
      if (option) {
        setTotalPrice(option.price * quantity);
      }
    }
  }, [selectedOption, quantity, product]);

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

  // 상품 데이터가 없을 경우 (예: 잘못된 ID)
  if (!product) {
    return <div className="text-center p-20">존재하지 않는 상품입니다.</div>;
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-xl text-gray-700">
          상품 정보를 불러오는 중입니다...
        </p>
      </div>
    );
  }

  // 선택된 옵션의 가격을 찾습니다.
  const currentOption = product?.options?.find(
    (opt) => opt.id === selectedOption
  );
  const currentPricePerUnit = currentOption ? currentOption.price : 0;

  const handleQuantityChange = (type) => {
    setQuantity((prev) => {
      if (type === "increment") {
        return prev + 1;
      } else if (type === "decrement" && prev > 1) {
        return prev - 1;
      }
      return prev;
    });
  };

  const handleBuyClick = () => {
    alert(
      `${product.name} (옵션: ${
        currentOption?.name
      }, 수량: ${quantity}개) 총 ${totalPrice.toLocaleString()}원 구매`
    );
    // 실제 결제 또는 장바구니 추가 로직
  };

  return (
    <div className="flex justify-center p-8 bg-gray-50">
      <div className="w-full max-w-6xl bg-white p-8 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row gap-8 pb-8 border-b border-gray-200">
          {" "}
          <div className="flex-1 min-w-0">
            {" "}
            {/* flex-1 추가, min-w-0으로 오버플로우 방지 */}
            {/* 메인 이미지 */}
            <div className="bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center h-90 mb-10">
              <img
                src={mainImage || "https://placehold.co/600x400?text=No+Image"}
                alt={product.name}
                className="w-full h-full object-contain"
              />
            </div>
            {/* 썸네일 이미지 */}
            {/* <div className="flex gap-2 justify-center">
              {(product.images || []).map((imgObj, index) => (
                <div
                  key={index}
                  className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden border border-gray-200"
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div> */}
          </div>
          {/* 오른쪽: 상품 정보 및 구매 옵션 */}
          <div className="flex-1 min-w-0 space-y-4">
            {" "}
            {/* flex-1 추가, min-w-0으로 오버플로우 방지 */}
            <Badge
              variant="secondary"
              className="bg-blue-100 text-blue-800 text-sm px-3 py-1 w-fit"
            >
              {" "}
              {/* w-fit 추가 */}
              {product.category}
            </Badge>
            <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
            <p className="text-sm text-gray-800">{product.shortDescription}</p>
            {/* 키워드 태그 */}
            <div className="flex flex-wrap gap-2">
              {(product.keywords || []).map((keyword, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="bg-blue-100 text-blue-800"
                >
                  {keyword}
                </Badge>
              ))}
            </div>
            {/* 옵션 선택 */}
            <div>
              <Label
                htmlFor="productOption"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                옵션을 선택해주세요
              </Label>
              <Select value={selectedOption} onValueChange={setSelectedOption}>
                <SelectTrigger id="productOption" className="w-full">
                  <SelectValue placeholder="옵션을 선택해주세요" />
                </SelectTrigger>
                <SelectContent>
                  {(product.options || []).map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* 수량 및 가격 */}
            <div className="flex items-center justify-between border-t border-b py-4">
              <div className="text-md font-semibold">
                {currentOption?.name || "옵션 선택"}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange("decrement")}
                  disabled={quantity <= 1}
                >
                  -
                </Button>
                <Input
                  type="text"
                  value={quantity}
                  readOnly
                  className="w-16 text-center"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange("increment")}
                >
                  +
                </Button>
              </div>
              <div className="text-md font-bold text-gray-800">
                {currentPricePerUnit.toLocaleString()}원
              </div>
            </div>
            {/* 총 결제 금액 */}
            <div className="flex justify-between items-center text-sm mt-4 ">
              <span>총 금액</span>
              <span className="text-blue-600 font-bold text-xl">
                {totalPrice.toLocaleString()}원
              </span>
            </div>
            <Button
              onClick={handleBuyClick}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3"
            >
              구매하기
            </Button>
          </div>
        </div>

        {/* 상품 상세 설명 */}
        <div className="mt-8">
          {" "}
          {/* mt-8 추가 */}
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            상품 상세 정보
          </h2>
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: product.detailed_description }}
          >
            {/* 상세 설명은 HTML 태그를 포함할 수 있으므로 dangerouslySetInnerHTML을 사용 (보안 주의) */}
          </div>
        </div>

        {/* 판매자 정보 & 배송 정보 아코디언 */}
        <div className="mt-8">
          {" "}
          {/* mt-8 추가 */}
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-lg font-semibold text-gray-700">
                판매자 정보
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                {product.sellerInfo}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-lg font-semibold text-gray-700">
                배송 정보
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                {product.deliveryInfo}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
}
