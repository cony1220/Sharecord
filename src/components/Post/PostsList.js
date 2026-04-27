import React, { useState } from "react";
import { useNavigate, createSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import CategoryList from "./CategoryList";
import PostItem from "./PostItem";
import Noposts from "./Noposts";
import { uiActions } from "../../store/ui-slice";
import menuIcon from "../../assets/icons/hamburger.png";
import searchIcon from "../../assets/icons/search.png";

function PostsList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();
  const isCategoryMenuOpen = useSelector(
    (state) => state.ui.isCategoryMenuOpen,
  );
  const posts = useSelector((state) => state.posts.items);

  const toggleCategoryMenu = () => {
    dispatch(uiActions.toggleCategoryMenu());
  };

  const keywordSearchHandler = () => {
    const keyword = search.trim();
    if (!keyword) return;

    navigate({
      pathname: "/home/search",
      search: createSearchParams({
        query: keyword,
      }).toString(),
    });

    setSearch("");
  };

  return (
    <div className="Home-post-container">
      <div className="Home-post-search-container">
        {/* 手機 menu */}
        <div onClick={toggleCategoryMenu} className="Home-menu-icon-container">
          <img className="Home-menu-icon" src={menuIcon} alt="菜單" />
        </div>
        { isCategoryMenuOpen && (
          <div className="Home-categorymenu-container">
            <CategoryList />
          </div>
        )}

        {/* search */}
        <div className="Home-post-search-box">
          <input
            type="text"
            className="Home-post-search-input"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div onClick={keywordSearchHandler} className="Home-post-search-image-container">
            <img className="Home-post-search-image" src={searchIcon} alt="搜尋" />
          </div>
        </div>
      </div>

      {/* posts */}
      { posts.length > 0 ? posts.map((item) => (
        <PostItem key={item.id} item={item} />
      )) : <Noposts />}
    </div>
  );
}
export default PostsList;
