import React, { useState, useEffect } from "react";
import {
  useParams, useNavigate, useSearchParams, createSearchParams,
} from "react-router-dom";
import CategoryList from "./CategoryList";
import PostBlock from "./PostBlock";
import Noposts from "./Noposts";
import useGetQueryColData from "../../hooks/useQueryCollection";

function Category() {
  const { categoryPage } = useParams();
  const navigator = useNavigate();
  const [search, setSearch] = useState("");
  const [isCategoryMenu, setIsCategoryMenu] = useState(false);
  const [searchKeyword] = useSearchParams();
  const { isLoading: LoadPostList, data: postList, getData } = useGetQueryColData();
  useEffect(() => {
    let queryString;
    if (categoryPage === "all") {
      queryString = "";
    } else if (categoryPage === "search") {
      queryString = { name: "keywords", condition: "array-contains", value: searchKeyword.get("query") };
    } else {
      queryString = { name: "categoryName", condition: "==", value: `${categoryPage}` };
    }
    getData("posts", queryString);
    setIsCategoryMenu(false);
  }, [categoryPage, searchKeyword]);
  const handleKeywordSearch = () => {
    if (search) {
      navigator({
        pathname: "/home/search",
        search: createSearchParams({
          query: search,
        }).toString(),
      });
      setSearch("");
    }
  };
  const toggleCategoryMenu = () => {
    setIsCategoryMenu((pre) => !pre);
  };
  return (
    <div className="Home-post-container">
      <div className="Home-post-search-container">
        <div onClick={toggleCategoryMenu} className="Home-menu-icon-container">
          <img className="Home-menu-icon" src="https://cdn-icons-png.flaticon.com/512/56/56763.png" alt="菜單" />
        </div>
        { isCategoryMenu ? (
          <div className="Home-categorymenu-container">
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
      {postList.length > 0 ? postList.map((item) => (
        <PostBlock key={item.id} item={item} />
      )) : (
        <Noposts />
      )}
    </div>
  );
}
export default Category;
