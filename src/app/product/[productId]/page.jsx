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
import { Label } from "@radix-ui/react-label";
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

  // 실제 데이터 대신 더미 데이터를 로드하는 효과
  useEffect(() => {
    // 실제라면 여기서 productId를 이용해 API를 호출하여 데이터를 가져옵니다.
    // fetch(`/api/products/${productId}`).then(res => res.json()).then(data => setProduct(data));

    // 더미 데이터
    const dummyProductData = {
      id: productId,
      name: "제주 한라봉",
      tag: "농산물",
      shortDescription: "제주도에서 직접 재배한 달콤한 한라봉입니다",
      keywords: ["#제주도", "#과일선물", "#명절선물", "#비타민C", "#고당도"],
      options: [
        { id: "opt1", name: "제주 한라봉: 2kg", price: 25000 },
        { id: "opt2", name: "제주 한라봉: 3kg", price: 35000 },
        { id: "opt3", name: "제주 한라봉: 5kg", price: 50000 },
      ],
      detailDescription:
        "제주도의 청정 자연에서 자란 프리미엄 한라봉을 만나보세요. 겨울철 제주도의 따뜻한 햇살과 깨끗한 공기를 머금고 자란 한라봉은 달콤함과 상큼함이 완벽하게 조화를 이룹니다. 비타민 C가 풍부하여 겨울철 감기 관리에도 탁월하며, 껍질이 얇고 과육이 부드러워 남녀노소 누구나 즐길 수 있습니다. 농약을 최소화하고 친환경적으로 재배하여 안심하고 드실 수 있는 건강한 과일입니다.",
      sellerInfo: "로컬리 농장 (제주특별자치도 제주시)",
      deliveryInfo: "평일 14시 이전 주문 시 당일 발송 (CJ 대한통운)",
      images: [
        "https://via.placeholder.com/600x400?text=Product+Image+1",
        "https://via.placeholder.com/100x100?text=Thumb+1",
        "https://via.placeholder.com/100x100?text=Thumb+2",
        "https://via.placeholder.com/100x100?text=Thumb+3",
      ],
    };
    setProduct(dummyProductData);
    // 초기 옵션 설정 및 총 가격 계산
    if (dummyProductData.options.length > 0) {
      setSelectedOption(dummyProductData.options[0].id);
      setTotalPrice(dummyProductData.options[0].price * quantity);
    }
  }, [productId, quantity]); // productId나 quantity가 변하면 다시 계산

  // 옵션 변경 시 총 가격 계산
  useEffect(() => {
    if (product && selectedOption) {
      const option = product.options.find((opt) => opt.id === selectedOption);
      if (option) {
        setTotalPrice(option.price * quantity);
      }
    }
  }, [selectedOption, quantity, product]);

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
  const currentOption = product.options.find(
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
            <div className="bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center aspect-video mb-10">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-contain"
              />
            </div>
            {/* 썸네일 이미지 */}
            <div className="flex gap-2 justify-center">
              {product.images.slice(1, 4).map((img, index) => (
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
            </div>
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
              {product.tag}
            </Badge>
            <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
            <p className="text-sm text-gray-800">{product.shortDescription}</p>
            {/* 키워드 태그 */}
            <div className="flex flex-wrap gap-2">
              {product.keywords.map((keyword, index) => (
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
                  {product.options.map((option) => (
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
            dangerouslySetInnerHTML={{ __html: product.detailDescription }}
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
