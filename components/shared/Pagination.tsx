"use client";

import { formUrlQuery } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { Button } from "../ui/button";
interface Props {
  urlParamName?: string;
  totalPages: number;
  page: number | string;
}
const Pagination: React.FC<Props> = ({ urlParamName, totalPages, page }) => {
  const router = useRouter();
  const searchParam = useSearchParams();

  const onClick = (btnType: string) => {
    const pageValue = btnType === "next" ? Number(page) + 1 : Number(page) - 1;
    const newUrl = formUrlQuery({
      params: searchParam.toString(),
      key: urlParamName || "page",
      value: pageValue.toString(),
    });
    router.push(newUrl, { scroll: false });
  };

  return (
    <div className="flex gap-2">
      <Button
        className="w-28"
        size="lg"
        variant="outline"
        onClick={() => onClick("previous")}
        disabled={Number(page) <= 1}
      >
        Previous
      </Button>{" "}
      <Button
        className="w-28"
        size="lg"
        variant="outline"
        onClick={() => onClick("next")}
        disabled={Number(page) >= totalPages}
      >
        Next
      </Button>
    </div>
  );
};

export default Pagination;
