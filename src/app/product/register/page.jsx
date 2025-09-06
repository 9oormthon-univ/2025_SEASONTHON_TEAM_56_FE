// app/product/register/page.jsx
"use client"; // 클라이언트 컴포넌트로 지정

import { useState, useRef } from "react"; // useRef 추가
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label"; // Label 컴포넌트가 필요할 수 있습니다. (설치되어 있지 않다면 npx shadcn-ui@latest add label)
import { makeAiProductionDes, registerProduct } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function ProductRegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [keywords, setKeywords] = useState([]); // 추가된 키워드 목록
  const [currentKeyword, setCurrentKeyword] = useState(""); // 현재 입력 중인 키워드
  const [detailDescription, setDetailDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [images, setImages] = useState([]); // 이미지 파일 목록
  const [analyzeId, setAnalyzeId] = useState(null);
  const [mainImageUrl, setMainImageUrl] = useState(null);

  // 이미지 드래그 앤 드롭
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null); // 파일 인풋 참조

  // 로딩 상태
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 키워드 추가 함수
  const handleAddKeyword = () => {
    if (currentKeyword && !keywords.includes(currentKeyword)) {
      setKeywords([...keywords, currentKeyword]);
      setCurrentKeyword("");
    }
  };

  // 키워드 삭제 함수
  const handleRemoveKeyword = (keywordToRemove) => {
    setKeywords(keywords.filter((keyword) => keyword !== keywordToRemove));
  };

  // 엔터키로 키워드 추가 함수
  const handleKeywordKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // 기본 폼 전송 동작 방지
      handleAddKeyword();
    }
  };

  // 파일 입력 변경 핸들러 (기존 로직 재활용)
  const handleFileChange = (event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  };

  // 이미지 선택 버튼 클릭 핸들러
  const handleImageSelectClick = () => {
    fileInputRef.current.click(); // 숨겨진 파일 인풋 클릭
  };

  // 파일 입력 변경 핸들러
  const handleFiles = (files) => {
    const selectedFiles = Array.from(files);

    const imageFiles = selectedFiles.filter((file) =>
      file.type.startsWith("image/")
    );

    if (imageFiles.length === 0) return;

    // 최대 5개 이미지 제한
    if (images.length + imageFiles.length > 5) {
      alert("이미지는 최대 5개까지 업로드할 수 있습니다.");
      return;
    }

    const newImagePreviews = selectedFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file), // 미리보기를 위한 URL 생성
    }));
    setImages((prevImages) => [...prevImages, ...newImagePreviews]);
  };

  // 이미지 미리보기 삭제 핸들러
  const handleRemoveImage = (indexToRemove) => {
    setImages((prevImages) => {
      const newImages = prevImages.filter(
        (_, index) => index !== indexToRemove
      );
      // 미리보기 URL 해제 (메모리 누수 방지)
      URL.revokeObjectURL(prevImages[indexToRemove].preview);
      return newImages;
    });
  };

  // 드래그 앤 드롭 핸들러
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  };

  // AI 추천 상세 설명 생성 함수 (더미)
  const handleGenerateAISummary = async () => {
    console.log("ai 설명 생성");
    // alert("AI 추천 상세 설명 생성 (실제 구현 필요)");
    // 실제 백엔드 API 호출 로직이 여기에 들어갑니다.
    // 필수 정보 입력되었는지 확인
    if (!name && !shortDescription && image.length === 0) {
      alert(
        "AI가 설명을 생성하려면 상품명, 간단한 설명 중 하나를 입력해주세요."
      );
      return;
    }

    setIsAiLoading(true);

    try {
      // API에 보낼 데이터를 현재 state에서 수집
      const productDataForAI = {
        name,
        simple_description: shortDescription,
        keywords,
        category,
        price: Number(price) || undefined,
      };

      // API에 보낼 이미지 파일들만 추출
      const imageFiles = images.map((img) => img.file);

      // api 함수 호출
      const result = await makeAiProductionDes(productDataForAI, imageFiles);

      // 👇 이 부분을 추가하여 result.data의 내용을 직접 확인합니다.
      console.log("AI 분석 API 응답 데이터:", result.data);

      // API 응답 결과에서 상세 설명을 가져와 state 업데이트
      if (result && result.data && result.data.detailed_description) {
        setDetailDescription(result.data.detailed_description);
        setAnalyzeId(result.data.analyze_id);

        // 👇 result.data.main_image_url이 실제로 어떤 값인지 확인
        console.log("main_image_url from API:", result.data.main_image_url);
        setMainImageUrl(result.data.main_image_url || null);

        // const analyzeId = result.data.analyze_id;
        // console.log("AI 설명 ID: ", analyzeId);
      } else {
        // API 응답은 성공했지만, success가 false 이거나 데이터 형식이 다른 경우
        throw new Error(result.message || "AI가 설명을 생성하지 못했습니다.");
      }
    } catch (error) {
      alert(`상세 설명 생성에 실패했습니다: ${error.message}`);
    } finally {
      setIsAiLoading(false);
    }
  };

  // 상품 등록 함수
  const handleSubmitProduct = async () => {
    if (!name || !category || !price) {
      alert("상품명, 카테고리, 가격은 필수 입력 항목입니다.");
      return;
    }

    // if (images.length > 0 && !mainImageUrl) {
    //   alert(
    //     "이미지를 첨부했다면, 먼저 'AI 설명 생성'을 실행하여 이미지 URL을 생성해야 합니다."
    //   );
    //   return;
    // }

    setIsSubmitting(true);

    try {
      // API에 보낼 상품 데이터 객체 생성
      const productData = {
        name,
        simple_description: shortDescription,
        keywords,
        detailed_description: detailDescription,
        category,
        price: Number(price),
        analyze_id: analyzeId,
        // image_urls: mainImageUrl ? [mainImageUrl] : [],
        // main_index: 0,
      };
      console.log("등록할 상품 데이터:", productData);

      // api 함수 호출
      const result = await registerProduct(productData);

      if (result && result.data && result.data.product_id) {
        alert("상품이 성공적으로 등록되었습니다.");
        const newProductId = result.data.product_id;
        // 등록 성공 후, 생성된 상품의 상세 페이지로 이동
        router.push(`/product/${newProductId}`);
      } else {
        throw new Error(result.message || "상품 등록에 실패했습니다.");
      }
    } catch (error) {
      alert(`상품 등록 중 오류가 발생했습니다: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center p-8 bg-gray-50">
      <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">상품 등록</h2>
        <p className="text-gray-600 mb-8">
          제품을 쉽게 등록하고 AI가 자동으로 상세설명을 작성해드립니다
        </p>

        <div className="space-y-6">
          {/* 상품 정보 입력 섹션 */}
          <div className="bg-gray-50 p-6 rounded-md border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              상품 정보 입력
            </h3>

            {/* 상품명 */}
            <div>
              <Label
                htmlFor="productName"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2"
              >
                상품명 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="productName"
                placeholder="예: 제주 한라봉"
                className="mt-1 mb-5"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* 간단 설명(한 문장) */}
            <div>
              <Label
                htmlFor="shortDescription"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2"
              >
                간단한 설명(한 문장) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="shortDescription"
                placeholder="예: 제주도에서 직접 재배한 한라봉입니다"
                className="mt-1 mb-5"
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
              />
            </div>

            {/* 키워드 태그 */}
            <div>
              <Label
                htmlFor="keywordInput"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2"
              >
                키워드 태그
              </Label>
              <div className="flex items-center space-x-2 mt-1">
                <Input
                  id="keywordInput"
                  placeholder="키워드 입력 후 엔터"
                  className="flex-grow mb-4"
                  value={currentKeyword}
                  onChange={(e) => setCurrentKeyword(e.target.value)}
                  onKeyDown={handleKeywordKeyDown}
                />
                <Button
                  onClick={handleAddKeyword}
                  className="h-full mb-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                >
                  +
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mb-5">
                {keywords.map((keyword, index) => (
                  <Badge key={index} variant="secondary">
                    {keyword}
                    <button
                      className="ml-2 text-gray-500 hover:text-gray-800"
                      onClick={() => handleRemoveKeyword(keyword)}
                    >
                      &times;
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            {/* 상세 설명 */}
            <div>
              <div className="flex justify-between items-center">
                <Label
                  htmlFor="detailDescription"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  상세 설명
                </Label>
                <Button
                  variant="outline"
                  className="h-8 text-blue-600 border-blue-600 hover:bg-blue-50 hover:text-blue-600"
                  onClick={handleGenerateAISummary}
                  disabled={isAiLoading}
                >
                  {isAiLoading ? "생성 중..." : "AI 설명 생성"}
                </Button>
              </div>
              <div className="relative mt-1">
                <Textarea
                  id="detailDescription"
                  placeholder="AI가 생성한 설명이 여기에 표시하거나 직접 입력하세요"
                  rows={6}
                  className="w-full pr-28 mb-5" // AI 버튼 공간 확보
                  value={detailDescription}
                  onChange={(e) => setDetailDescription(e.target.value)}
                />
              </div>
            </div>

            {/* 카테고리 & 가격 */}
            <div className="flex space-x-4">
              <div className="flex-1">
                <Label
                  htmlFor="category"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  카테고리 <span className="text-red-500">*</span>
                </Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue placeholder="카테고리 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="과일">과일</SelectItem>
                    <SelectItem value="채소">채소</SelectItem>
                    <SelectItem value="수산물">수산물</SelectItem>
                    <SelectItem value="축산물">축산물</SelectItem>
                    <SelectItem value="가공식품">가공식품</SelectItem>
                    <SelectItem value="패션/쥬얼리">패션/쥬얼리</SelectItem>
                    <SelectItem value="케이스/문구">케이스/문구</SelectItem>
                    <SelectItem value="뷰티">뷰티</SelectItem>
                    <SelectItem value="반려동물">반려동물</SelectItem>
                    <SelectItem value="공예">공예</SelectItem>
                    {/* ... 다른 카테고리 ... */}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <Label
                  htmlFor="price"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  가격 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="price"
                  type="number"
                  placeholder=""
                  className="mt-1"
                  value={price}
                  onChange={(e) => {
                    const numValue = Number(e.target.value);

                    if (isNaN(numValue) || numValue < 0) {
                      return;
                    }

                    setPrice(e.target.value);
                  }} // 숫자로 변환
                  onBlur={(e) => {
                    if (e.target.value === "") {
                      setPrice(0);
                    }
                  }}
                />
              </div>
            </div>
          </div>

          {/* 상품 이미지 섹션 */}
          <div className="bg-gray-50 p-6 rounded-md border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              상품 이미지
            </h3>
            <div
              className={`border-2 border-dashed border-gray-300 rounded-md p-6 text-center transition-colors duration-200 
               flex flex-col justify-center items-center min-h-[250px]  // 👈 이 부분을 추가했습니다.
               ${isDragging ? "border-blue-500 bg-blue-50" : ""}`}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <input
                type="file"
                multiple
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden" // 숨겨진 파일 인풋
              />

              {isDragging ? (
                <div>
                  <p className="text-lg font-semibold text-blue-600">
                    여기에 이미지를 놓으세요!
                  </p>
                </div>
              ) : (
                <div>
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 0115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    ></path>
                  </svg>
                  <p className="mt-2 text-sm text-gray-600">
                    이미지를 드래그하거나 클릭하여 업로드하세요(최대 5개)
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={handleImageSelectClick}
                  >
                    이미지 선택
                  </Button>
                </div>
              )}

              {/* 이미지 미리보기 */}
              <div className="mt-4 flex flex-wrap gap-2 justify-center">
                {images.map((image, index) => (
                  <div
                    key={index}
                    className="relative w-24 h-24 border rounded-md overflow-hidden"
                  >
                    <img
                      src={image.preview}
                      alt={`Product Image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-80 hover:opacity-100"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 상품 등록하기 버튼 */}
        <Button
          onClick={handleSubmitProduct}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 mt-8"
          disabled={isSubmitting}
        >
          {isSubmitting ? "등록 중" : "상품 등록하기"}
        </Button>
      </div>
    </div>
  );
}
