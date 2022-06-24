import React from "react";
import { Link } from "react-router-dom";
import useGetColData from "../../hooks/useCollection";

function CategoryList() {
  const { data: categoryList } = useGetColData("category");
  return (
    <>
      {categoryList.map((item) => (
        <Link to={`/home/${item.name}`} className="Home-category-container item" key={`${item.id}`}>
          <div className="Home-category-image-container">
            <img className="Home-category" src={item.imgurl} alt={item.name} />
          </div>
          <div>{item.name}</div>
        </Link>
      ))}
    </>
  );
}
export default CategoryList;
