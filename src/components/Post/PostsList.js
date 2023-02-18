import React, { useState } from "react";
import { useNavigate, createSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import CategoryList from "./CategoryList";
import PostItem from "./PostItem";
import Noposts from "./Noposts";
import { uiActions } from "../../store/ui-slice";

function PostsList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();
  const category = useSelector((state) => state.ui);
  const posts = useSelector((state) => state.posts);

  const toggleCategoryMenu = () => {
    dispatch(uiActions.toggle());
  };

  const keywordSearchHandler = () => {
    if (search) {
      navigate({
        pathname: "/home/search",
        search: createSearchParams({
          query: search,
        }).toString(),
      });
      setSearch("");
    }
  };

  return (
    <div className="Home-post-container">
      <div className="Home-post-search-container">
        <div onClick={toggleCategoryMenu} className="Home-menu-icon-container">
          <img className="Home-menu-icon" src="https://cdn-icons-png.flaticon.com/512/56/56763.png" alt="菜單" />
        </div>
        { category.categoryIsVisible ? (
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
          <div onClick={keywordSearchHandler} className="Home-post-search-image-container">
            <img className="Home-post-search-image" src="https://cdn-icons-png.flaticon.com/128/151/151773.png" alt="搜尋" />
          </div>
        </div>
      </div>
      { posts.items.length > 0 ? posts.items.map((item) => (
        <PostItem key={item.id} item={item} />
      )) : <Noposts />}
    </div>
  );
}
export default PostsList;
