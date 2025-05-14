"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const useGetURL = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [fullUrl, setFullUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const url = `${window.location.origin}${pathname}${
        searchParams.toString() ? `?${searchParams.toString()}` : ""
      }`;
      setFullUrl(url);
    }
  }, [pathname, searchParams]);

  return fullUrl;
};

export default useGetURL;
