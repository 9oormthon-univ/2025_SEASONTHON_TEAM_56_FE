// app/search/page.jsx
import { Suspense } from "react";
import SearchResults from "./SearchResults";
import LoadingAnimation from "@/components/LoadingAnimation";

export default function SearchPage() {
  return (
    <Suspense fallback={<LoadingAnimation />}>
      <SearchResults />
    </Suspense>
  );
}
