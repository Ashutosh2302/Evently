import Spinner from "@/components/shared/Spinner";
import React from "react";

const loading = () => {
  return (
    <div className="h-screen flex justify-center items-center spinner">
      <Spinner showText />
    </div>
  );
};

export default loading;
