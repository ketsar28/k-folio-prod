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
    <div className="flex flex-wrap justify-center items-center gap-2 font-inter fixed bottom-16 bg-green-600 w-[90%] z-10 rounded-3xl left-1/2 transform -translate-x-1/2 md:transform-none md:bg-transparent md:justify-start md:static md:w-full lg:space-y-4 lg:block">
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
            className="group flex justify-start items-center gap-5 cursor-pointer md:p-2 py-2"
            onClick={handleClick} // Menambahkan event onClick untuk setiap navigasi
          >
            <div
              className={`lg:block hidden border-4 rounded-full ${
                clicked && activeLink === item.href
                  ? "w-[25%] border-green-600"
                  : "w-[15%] border-green-300 group-hover:w-[20%]"
              } transition-all duration-200 ease-linear`}
            ></div>
            <p className="font-semibold rounded-full text-sm hover:bg-green-900 transition-all duration-200 ease-linear text-white sm:text-[14px] text-[12px] uppercase lg:py-0 lg:px-0 lg:bg-transparent md:text-green-300 md:hover:bg-green-600/50 lg:text-white hover:text-white py-2 px-5 md:bg-green-500/10 md:border-2 md:border-green-500 lg:border-none lg:hover:bg-transparent  lg:static relative">
              {item.label}
            </p>
          </Link>
        ))}
    </div>
  );
};

export default NavigationFragment;
