import React from "react";
import "./Footer.css";
import IntroduceFooter from "./IntroduceFooter";

function Footer({ variant }) {
  return (
    <>
      {variant === "introduce" && <IntroduceFooter />}
      <div className="footer">COPYRIGHT © 2022 Sharecord</div>
    </>
  );
}
export default Footer;
