export type Category = {
  id: string;
  name: string;
  imgurl: string;
};

// DB 原始資料
export type CategoryDB = Omit<Category, "id">;
