// 讀取 .env 檔，並將變數注入到 Node.js 的 process.env
require("dotenv").config();

function createEnv(prefix = "REACT_APP_") {
  const raw = process.env;

  const filtered = Object.keys(raw)
    // 只保留指定前綴
    .filter((key) => key.startsWith(prefix))
    .reduce(
      (env, key) => ({
        ...env,
        // 轉成 DefinePlugin 需要的格式
        // key: "process.env.REACT_APP_xxx"
        // 在 build 時直接替換成對應的字串值
        [`process.env.${key}`]: JSON.stringify(raw[key]),
      }),
      {},
    );

  return filtered;
}

module.exports = createEnv;
