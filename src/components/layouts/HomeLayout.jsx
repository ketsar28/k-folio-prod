/* eslint-disable no-unused-vars */
import React from "react";
import HeadFragment from "../fragments/side-left/HeadFragment";
import AboutFragment from "../fragments/side-right/AboutFragment";
import NavigationFragment from "../fragments/side-left/NavigationFragment";
import ExperienceFragment from "../fragments/side-right/ExperienceFragment";
import ProjectFragment from "../fragments/side-right/ProjectFragment";
import FooterFragment from "../fragments/side-right/FooterFragment";

const HomeLayout = () => {
  return (
    <div className="max-w-screen-2xl mx-auto grid grid-cols-1 gap-5 lg:px-32 lg:py-24 lg:grid-cols-2">
      <div className="grid place-items-start lg:space-y-4 lg:sticky top-20 max-h-screen p-10 space-y-10">
        <HeadFragment />
        <NavigationFragment />
      </div>
      <div className="grid place-items-center p-10 gap-20 ">
        <AboutFragment />
        <ExperienceFragment />
        <ProjectFragment />
        <FooterFragment />
      </div>
    </div>
  );
};

export default HomeLayout;
