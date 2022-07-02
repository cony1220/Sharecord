import React, { useState, useEffect } from "react";
import {
  Outlet, useParams, useNavigate,
  useSearchParams, createSearchParams,
} from "react-router-dom";
import "../Styles/Home.css";
import CategoryList from "../components/Post/CategoryList";
import useGetQueryColData from "../hooks/useQueryCollection";
import Loading from "../components/Loading";

function Home() {
  const { categoryPage } = useParams();
  const navigator = useNavigate();
  const [search, setSearch] = useState("");
  const [searchKeyword] = useSearchParams();
  const { isLoading: LoadPostList, data: postList, getData } = useGetQueryColData();
  const [isCategoryMenu, setIsCategoryMenu] = useState(false);
  const toggleCategoryMenu = () => {
    setIsCategoryMenu((pre) => !pre);
  };
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
  return (
    <div className="Home-box">
      { LoadPostList ? <Loading /> : (
        <>
          <div className="Home-background">
            <div className="Home-background-slogan">
              <div className="Home-slogan-line1">Share what you see,</div>
              <div className="Home-slogan-line2">record what you live.</div>
            </div>
          </div>
          <div className="Home-content-box">
            <div className="Home-personal-label-container">
              <CategoryList />
            </div>
            <Outlet
              context={[postList,
                isCategoryMenu,
                toggleCategoryMenu,
                handleKeywordSearch,
                search,
                setSearch]}
            />
          </div>
        </>
      )}
    </div>
  );
}
export default Home;
