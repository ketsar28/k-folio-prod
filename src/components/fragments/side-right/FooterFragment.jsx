/* eslint-disable no-unused-vars */
import React from "react";
import { Element } from "react-scroll";
import { footerData } from "../../../data/side-right/footer";

const FooterFragment = () => {
  const { description, fontBold } = footerData;

  // Normalizing words to lowercase for consistency
  const normalizedFontBold = fontBold.map((word) => word.toLowerCase());

  const isBold = (phrase) => {
    // Normalizing phrase to lowercase for consistency
    const normalizedPhrase = phrase.toLowerCase();
    return normalizedFontBold.some((word) => normalizedPhrase.includes(word));
  };

  // Split description by space to get individual words
  const descriptionWords = description.split(" ");

  return (
    <Element className="text-justify font-medium font-inter py-2 lg:px-4">
      <footer className="text-[14px] font-light text-[#D5DCE9] text-justify">
        {descriptionWords.map((word, index) => (
          <span key={index} className={isBold(word) ? "font-bold" : ""}>
            {word} {index !== descriptionWords.length - 1 && " "}
          </span>
        ))}
      </footer>
    </Element>
  );
};

export default FooterFragment;
