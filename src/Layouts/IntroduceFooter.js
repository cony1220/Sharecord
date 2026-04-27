import React from "react";
import logoIcon from "../assets/icons/logo.png";
import githubIcon from "../assets/icons/github.png";
import twitterIcon from "../assets/icons/twitter.png";
import facebookIcon from "../assets/icons/facebook.png";

function IntroduceFooter() {
  return (
    <div className="Introduce-footer-container">
      <div className="Introduce-footer-slogan">
        <img
          className="Introduce-logo"
          src={logoIcon}
          alt="logo"
        />
        <div className="Introduce-slogan">Sharecord</div>
        <div>share and record</div>
      </div>
      <div className="Introduce-link-container">
        <a href="https://github.com/cony1220/Sharecord">
          <img
            className="Introduce-logo"
            src={githubIcon}
            alt="github"
          />
        </a>
        <a href="/">
          <img
            className="Introduce-logo"
            src={twitterIcon}
            alt="twitter"
          />
        </a>
        <a href="/">
          <img
            className="Introduce-logo"
            src={facebookIcon}
            alt="facebook"
          />
        </a>
      </div>
    </div>
  );
}
export default IntroduceFooter;
