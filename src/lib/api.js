// 백엔드 서버 기본 주소
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://43.201.10.255:8080/api";

/**
 * AI 상세 설명을 요청하는 API 함수
 * @param {Object} productData - 상품 정보 객체
 * @param {string} [productData.name] - 상품명
 * @param {string} [productData.simple_description] - 간단 설명
 * @param {string[]} [productData.keywords] - 키워드 배열
 * @param {string} [productData.category] - 카테고리
 * @param {number} [productData.price] - 가격
 * @returns {Promise<Object>} - AI가 생성한 상세 설명 데이터
 */
export const makeAiProductionDes = async (productData, imageFiles) => {
  const formData = new FormData();

  formData.append(
    "payload",
    new Blob([JSON.stringify(productData)], { type: "application/json" })
  );

  imageFiles.forEach((file) => {
    formData.append("images", file);
  });

  try {
    const response = await fetch(`${API_BASE_URL}/products/analyze`, {
      method: "POST",

      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "네트워크 응답에 문제가 있습니다.");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("AI 상세설명 요청 API 호출 중 오류 발생: ", error);
    throw error;
  }
};

/**
 * 새로운 상품을 등록하는 API 함수
 * @param {Object} productData - 등록할 상품 데이터
 * @returns {Promise<Object>} - 등록 성공 시 { success: true, data: { product_id: ... } }
 */
export const registerProduct = async (productData, imageFiles) => {
  // 1. 텍스트와 파일을 모두 담을 FormData 객체를 생성합니다.
  const formData = new FormData();

  // 2. 텍스트 데이터(productData)를 'productRequest' 같은 키에 JSON 문자열로 추가합니다.
  //    (이 key 이름은 백엔드와 약속해야 합니다.)
  formData.append(
    "payload", // 또는 'payload', 'dto' 등 백엔드가 요구하는 이름
    new Blob([JSON.stringify(productData)], { type: "application/json" })
  );

  // 3. 이미지 파일들을 'images' 키에 여러 개 추가합니다.
  //    (이 key 이름도 백엔드와 약속해야 합니다.)
  if (imageFiles && imageFiles.length > 0) {
    imageFiles.forEach((file) => {
      formData.append("images", file);
    });
  }

  try {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: "POST",
      // ❗ FormData를 보낼 때는 headers를 설정하지 않습니다.
      //    브라우저가 알아서 'multipart/form-data'와 경계(boundary)를 설정해줍니다.
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "상품 등록에 실패했습니다.");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("상품 등록 API 호출 중 오류 발생: ", error);
    throw error;
  }
};

/**
 * 문장형 쿼리와 키워드로 상품을 검색하는 API 함수
 * @param {Object} params - 검색 파라미터
 * @param {string} params.query - 사용자가 입력한 검색 문장
 * @param {string[]} [params.keywords] - 사용자가 추가한 키워드 배열 (옵션)
 * @returns {Promise<Object>} - 검색 결과 데이터
 */

export const searchProducts = async ({ query, keywords }) => {
  try {
    const params = new URLSearchParams();

    params.append("query", query);

    // 키워드가 존재하면 콤마로 구분된 문자열 만들어서 추가
    if (keywords && keywords.length > 0) {
      params.append("keywords", keywords.join(""));
    }

    // 쿼리 스트링으로 fetch 요청 보냄
    const response = await fetch(
      `${API_BASE_URL}/products/search?${params.toString()}`
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "네트워크 응답에 문제가 있습니다.");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("상품 검색 API 호출 중 오류 발생", error);
    throw Error;
  }
};

/**
 * 상품 ID로 상세 정보를 조회하는 API 함수
 * @param {string} productId - 조회할 상품의 ID
 * @returns {Promise<Object>} - 상품 상세 정보 데이터
 */

export const getProductById = async (productId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${productId}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error?.message || "상품 정보를 불러오는데 실패했습니다."
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(
      `상품 상세 정보(ID: ${productId}) API 호출 중 오류 발생: `,
      error
    );
    throw error;
  }
};
