// app/layout.tsx
import { Inter } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen bg-gray-50">
          {/* Header: 모든 페이지에 공통으로 적용됩니다. */}
          <header className="bg-[#D0E3FE] border-b shadow-sm sticky top-0 z-10">
            <div className="mx-w-screen-xl px-10 py-3 flex items-center justify-between">
              <Link href="/" className="text-blue-600 text-2xl font-bold">
                <Image
                  src="/images/locally-logo.png"
                  alt="로고 이미지"
                  width={120}
                  height={20}
                  priority
                />
              </Link>
              <nav className="space-x-6 text-gray-700 text-sm">
                <Link href="/product/register" className="hover:text-blue-600">
                  상품 등록
                </Link>
                <Link href="/" className="hover:text-blue-600">
                  상품 검색
                </Link>
                <Link href="/cart" className="hover:text-blue-600">
                  장바구니
                </Link>
                <Link href="/mypage" className="hover:text-blue-600">
                  마이페이지
                </Link>
              </nav>
            </div>
          </header>

          {/* children: 이 부분에 각 페이지의 실제 내용이 들어옵니다. */}
          <main className="flex-grow overflow-y-auto">{children}</main>

          {/* 여기에 Footer를 추가할 수도 있습니다. */}
        </div>
      </body>
    </html>
  );
}
