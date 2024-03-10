/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import NavbarElement from "../elements/navbar/NavbarElement";
import FooterElement from "../elements/footer/FooterElement";

const AppShell = ({ children }) => {
  return (
    <div>
      <NavbarElement />
      {children}
      <FooterElement />
    </div>
  );
};

export default AppShell;
