/* eslint-disable no-unused-vars */
import React from "react";
import { headData } from "../../../data/side-left/head";

const HeadFragment = () => {
  return (
    <div className="space-y-3 font-inter">
      {headData.title && (
        <h1 className="text-[#e1e3e6] text-[1.7rem] sm:text-[2.5rem] font-bold">
          {headData.title}
        </h1>
      )}
      {headData.role && (
        <h3 className="font-bold text-[#e1e3e6] text-[1.3rem] sm:text-[26px]">
          {headData.role}
        </h3>
      )}
      {headData.description && (
        <p className="font-normal text-[16px] sm:text-[18px] text-[#e1e3e6] opacity-50 md:w-3/4">
          {headData.description}
        </p>
      )}
    </div>
  );
};

export default HeadFragment;
