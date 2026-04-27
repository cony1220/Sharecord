import React, { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";

import useHttp from "../../hooks/use-http";
import { getAllCategories } from "../../lib/api";
import categoryIcon from "../../assets/icons/category.png";
import allIcon from "../../assets/icons/all.png";

function CategoryList() {
  const {
    sendRequest: fetchCategories,
    data: categoryList,
    error,
  } = useHttp(getAllCategories, true, []);

  useEffect(() => {
    fetchCategories("category");
  }, [fetchCategories]);

  const categories = useMemo(() => {
    const safeList = Array.isArray(categoryList) ? categoryList : [];

    return [
      {
        id: "all",
        name: "全部",
        imgurl: allIcon,
      },
      ...safeList,
    ];
  }, [categoryList]);

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="Home-label-box">
      <div className="Home-label-container">
        <div className="Home-label-image-container">
          <img className="Home-label-image" src={categoryIcon} alt="Label" />
        </div>
        <div>分類</div>
      </div>
      {categories.map((item) => (
        <Link to={`/home/${item.id}`} className="Home-category-container item" key={item.id}>
          <div className="Home-category-image-container">
            <img className="Home-category" src={item.imgurl} alt={item.name} />
          </div>
          <div>{item.name}</div>
        </Link>
      ))}
    </div>
  );
}
export default CategoryList;
