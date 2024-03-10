/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { navigationData } from "../../../data/side-left/navigation";
import { Link } from "react-scroll";
const NavigationFragment = () => {
  const [activeLink, setActiveLink] = useState(null);
  const [clicked, setClicked] = useState(false); // State untuk menandai apakah navigasi sudah diklik atau belum

  const handleSetActive = (to) => {
    setActiveLink(to);
  };

  const handleClick = () => {
    setClicked(true); // Mengatur state clicked menjadi true saat navigasi diklik
  };

  return (
    <div className="lg:space-y-4 lg:block flex flex-wrap justify-start items-center gap-2 w-full font-inter">
      {navigationData.length > 0 &&
        navigationData.map((item, index) => (
          <Link
            activeClass="active"
            key={index}
            to={item.href}
            smooth={false}
            duration={0}
            offset={-70}
            spy={true}
            onSetActive={handleSetActive}
            className="group flex justify-start items-center gap-5 cursor-pointer p-2"
            onClick={handleClick} // Menambahkan event onClick untuk setiap navigasi
          >
            <div
              className={`lg:block hidden border-4 rounded-full ${
                clicked && activeLink === item.href
                  ? "w-[25%] border-green-600"
                  : "w-[15%] border-green-300 group-hover:w-[20%]"
              } transition-all duration-200 ease-linear`}
            ></div>
            <p className="font-semibold sm:text-[14px] text-[12px] uppercase lg:py-0 lg:px-0 lg:bg-transparent text-green-300 lg:text-white hover:text-white py-2 px-5 bg-green-500/10 border-2 border-green-500 lg:border-none rounded-full text-sm hover:bg-green-600/50 lg:hover:bg-transparent transition-all duration-200 ease-linear">
              {item.label}
            </p>
          </Link>
        ))}
    </div>
  );
};

export default NavigationFragment;
