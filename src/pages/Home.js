import React from "react";
import { Outlet } from "react-router-dom";
import "../Styles/Home.css";
import CategoryList from "../components/Post/CategoryList";

function Home() {
  return (
    <div className="Home-box">
      <div className="Home-background">
        <div className="Home-background-slogan">
          <div className="Home-slogan-line1">Share what you see,</div>
          <div className="Home-slogan-line2">record what you live.</div>
        </div>
      </div>
      <div className="Home-content-box">
        <div className="Home-personal-label-container">
          <div className="Home-label-box">
            <div className="Home-label-container">
              <div className="Home-label-image-container">
                <img className="Home-label-image" src="https://cdn-icons-png.flaticon.com/128/617/617418.png" alt="Label" />
              </div>
              <div>分類</div>
            </div>
            <CategoryList />
          </div>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
export default Home;
