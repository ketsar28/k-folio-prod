/* eslint-disable no-unused-vars */
import React from "react";
import { Element } from "react-scroll";
import { getImageUrl } from "../../../utils/getAsset";
import { projectData } from "../../../data/side-right/project";
import { Link } from "react-router-dom";

const ProjectFragment = () => {
  return (
    <Element
      name="project"
      className="text-justify font-medium text-lg py-10 space-y-10 font-inter"
      id="project"
    >
      {projectData.length > 0 &&
        projectData.map(
          (
            { image, position, location, description, technologies, pathUrl },
            index
          ) => (
            <a
              href={pathUrl}
              target="_blank"
              key={index}
              className="flex md:flex-row flex-col justify-start items-start text-white gap-5 hover:bg-slate-600/20 py-6 lg:px-8 hover:px-8 rounded-2xl transition-all duration-200 ease-linear group"
            >
              <div className="w-[40%] rounded-2xl overflow-hidden">
                <img
                  src={getImageUrl(image)}
                  className="w-full h-full object-fill object-center"
                  alt=""
                />
              </div>
              <div className="space-y-3 w-full">
                <h3 className="font-semibold text-[16px] text-[#D5DCE9] group-hover:text-green-500 transition-all duration-200 ease-linear relative">
                  {position} &#8226; <span>{location}</span>{" "}
                  <span className="ml-1 group-hover:translate-x-2 absolute transition-all duration-200 ease-linear">
                    &#129125;
                  </span>
                </h3>
                <p className="text-[14px] group-hover:text-[#D5DCE9] text-[#8c99ab] leading-normal">
                  {description}
                </p>
                <div className="flex flex-wrap justify-start items-center gap-5 pt-5">
                  {technologies.length > 0 &&
                    technologies.map((item, index) => (
                      <li
                        key={index}
                        className="px-3 rounded-full text-green-500 font-semibold text-[12px] list-none bg-green-500/10 cursor-pointer hover:bg-green-700/40 transition-all duration-200 ease-linear hover:text-white"
                      >
                        {item}
                      </li>
                    ))}
                </div>
              </div>
            </a>
          )
        )}
      <div>
        <a
          target="_blank"
          href="https://github.com/ketsar28?tab=repositories"
          className="text-[16px] font-bold text-[#D5DCE9] hover:text-green-500 transition-all duration-200 ease-linear text-justify py-6 lg:px-8 group"
        >
          View Full Project Archive{" "}
          <span className="ml-3 group-hover:translate-x-2 absolute transition-all duration-200 ease-linear">
            &#129125;
          </span>
        </a>
      </div>
    </Element>
  );
};

export default ProjectFragment;
