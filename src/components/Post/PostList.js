import React from "react";
import { useOutletContext } from "react-router-dom";
import CategoryList from "./CategoryList";
import PostBlock from "./PostBlock";
import Noposts from "./Noposts";

function Category() {
  const [
    postList, isCategoryMenu, toggleCategoryMenu,
    handleKeywordSearch, search, setSearch] = useOutletContext();
  return (
    <div className="Home-post-container">
      <div className="Home-post-search-container">
        <div onClick={toggleCategoryMenu} className="Home-menu-icon-container">
          <img className="Home-menu-icon" src="https://cdn-icons-png.flaticon.com/512/56/56763.png" alt="菜單" />
        </div>
        { isCategoryMenu ? (
          <div className="Home-categorymenu-container">
            <CategoryList />
          </div>
        )
          : null}
        <div className="Home-post-search-box">
          <input
            type="text"
            className="Home-post-search-input"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div onClick={handleKeywordSearch} className="Home-post-search-image-container">
            <img className="Home-post-search-image" src="https://cdn-icons-png.flaticon.com/128/151/151773.png" alt="搜尋" />
          </div>
        </div>
      </div>
      { postList.length > 0 ? postList.map((item) => (
        <PostBlock key={item.id} item={item} />
      )) : <Noposts />}
    </div>
  );
}
export default Category;
