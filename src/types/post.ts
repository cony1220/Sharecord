import { Timestamp, type WhereFilterOp } from "firebase/firestore";

export type Author = {
  name: string;
  photoURL: string;
  uid: string;
};

// UI 資料
export type Post = {
  id: string;
  title: string;
  pureText: string;
  stateContent: string;

  categoryId: string;
  categoryName: string;

  author: Author;

  keywords: string[];
  likeby: string[];
  collectby: string[];

  firstPicture: string;

  createTime: number;
};

// DB 原始資料
export type PostDB = Omit<Post, "id" | "createTime"> & {
  createTime: Timestamp;
};

export type PostsQueryParams = {
  col: string;
  name?: string;
  condition?: WhereFilterOp;
  value?: string;
};
