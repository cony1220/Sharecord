import { convertToRaw } from "draft-js";
import { Timestamp } from "firebase/firestore";

// 產生純文字（限制長度）
export const extractPureText = (editorContent, maxLength = 100) => {
  let pureText = "";

  for (let i = 0; i < editorContent.blocks.length; i += 1) {
    const remaining = maxLength - pureText.length;
    if (remaining <= 0) break;

    pureText += editorContent.blocks[i].text.slice(0, remaining);
  }

  return pureText;
};

// 取得第一張圖片
export const extractFirstImage = (editorContent) => {
  const entityMap = editorContent.entityMap || {};

  const firstImage = Object.values(entityMap).find((e) => e?.type === "image");
  const firstPicture = firstImage?.data?.src || "";

  return firstPicture;
};

// 產生 keywords
export const generateKeywords = (text) => {
  if (!text) return [];

  const normalized = text.toLowerCase().trim().replace(/\s+/g, " ");

  const result = new Set();

  // prefix
  for (let i = 1; i <= normalized.length && i <= 15; i += 1) {
    result.add(normalized.slice(0, i));
  }

  // 英文 / 數字 token
  const tokens = normalized.match(/[a-z0-9]+/g) || [];

  tokens.forEach((token) => {
    for (let i = 1; i <= token.length && i <= 10; i += 1) {
      result.add(token.slice(0, i));
    }
  });

  return Array.from(result).slice(0, 50);
};

// 整合：從 editorState 產生所有資料
export const buildPostPayload = ({
  editorState,
  title,
  category,
  authUser,
  profile,
  isEdit = false,
}) => {
  const content = editorState.getCurrentContent();
  const raw = convertToRaw(content);

  const pureText = extractPureText(raw);
  const firstPicture = extractFirstImage(raw);
  const keywords = generateKeywords(title);

  const baseData = {
    categoryId: category?.id,
    categoryName: category?.name,
    title,
    keywords,
    stateContent: JSON.stringify(raw),
    pureText,
    firstPicture,
  };

  // create 才需要的欄位
  if (!isEdit) {
    return {
      ...baseData,
      likeby: [],
      collectby: [],
      createTime: Timestamp.now(),
      author: {
        uid: authUser?.uid,
        name: profile?.name,
        photoURL: profile?.photoURL,
      },
    };
  }

  return baseData;
};
