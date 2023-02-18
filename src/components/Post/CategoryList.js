import React, { useEffect } from "react";
import { Link } from "react-router-dom";

import useHttp from "../../hooks/use-http";
import { getAllCategories } from "../../lib/api";

function CategoryList() {
  const {
    sendRequest,
    data: categoryList,
    error,
  } = useHttp(getAllCategories, true);

  useEffect(() => {
    sendRequest("category");
  }, [sendRequest]);

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="Home-label-box">
      <div className="Home-label-container">
        <div className="Home-label-image-container">
          <img className="Home-label-image" src="https://cdn-icons-png.flaticon.com/128/617/617418.png" alt="Label" />
        </div>
        <div>分類</div>
      </div>
      {categoryList && categoryList.map((item) => (
        <Link to={`/home/${item.name}`} className="Home-category-container item" key={`${item.id}`}>
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
