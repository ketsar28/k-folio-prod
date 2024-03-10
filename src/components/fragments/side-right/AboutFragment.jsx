/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { aboutData } from "../../../data/side-right/detail";
import { Element } from "react-scroll";
import useMousePosition from "../../../data/effect/useMousePosition";

const AboutFragment = () => {
  return (
    <Element
      className="text-justify font-normal text-lg font-inter "
      id="about"
      name="about"
    >
      <div className="space-y-5">
        {aboutData.paragraph.length > 0 &&
          aboutData.paragraph.map((item, index) => (
            <p className="text-[#e1e3e6] opacity-70 text-[16px]" key={index}>
              {item}
            </p>
          ))}
      </div>
    </Element>
  );
};

export default AboutFragment;
