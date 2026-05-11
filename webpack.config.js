const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const createEnv = require("./webpack/env");

const isProd = process.env.NODE_ENV === "production";

module.exports = {
  // webpack 模式（會影響預設優化）
  mode: isProd ? "production" : "development",
  entry: "./src/index.tsx",
  output: {
    publicPath: "/", // 所有資源的 base path
    filename: "[name].[contenthash].bundle.js",
    chunkFilename: "[name].[contenthash].bundle.js", // lazy load chunk
    path: path.resolve(__dirname, "dist"),
    clean: true, // build 前清空 dist（取代舊的 CleanWebpackPlugin）
  },
  // source map 設定
  // hidden-source-map：產生 map 但不暴露給瀏覽器（給錯誤追蹤用）
  // eval-source-map：開發快，但體積大
  devtool: isProd ? "hidden-source-map" : "eval-source-map",
  devServer: {
    port: 3000,
    open: true,
    hot: true,
    compress: true,
    historyApiFallback: true,
  },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js"],
  },
  module: {
    rules: [
      // CSS Modules（*.module.css）
      {
        test: /\.css$/i,
        use: [
          // production：抽成檔案
          // development：用 style tag 注入
          isProd ? MiniCssExtractPlugin.loader : "style-loader",
          {
            loader: "css-loader",
            options: {
              importLoaders: 1, // @import 的 css 也會跑 postcss
              modules: {
                // className 命名規則
                localIdentName: isProd ? "[hash:base64]" : "[path][name]__[local]",
              },
            },
          },
          // 使用 PostCSS plugin
          // 設定來源：postcss.config.js 與 browserslist
          "postcss-loader",
        ],
        include: /\.module\.css$/i,
      },

      // 一般 CSS（非 module）
      {
        test: /\.css$/i,
        use: [
          isProd ? MiniCssExtractPlugin.loader : "style-loader",
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
            },
          },
          "postcss-loader",
        ],
        exclude: /\.module\.css$/i,
      },
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
    ],
  },
  plugins: [
    // 根據 template 生成 HTML 並注入 webpack 輸出的資源（JS chunk、CSS）
    // 其他資源如 prefetch/preload 需搭配額外設定或 plugin
    new HtmlWebpackPlugin({ template: "./public/index.html" }),

    // 注入環境變數（例如 process.env.API_URL）
    new webpack.DefinePlugin(createEnv()),

    // 型別檢查
    new ForkTsCheckerWebpackPlugin(),

    // production 才抽 CSS
    ...(isProd
      ? [
        new MiniCssExtractPlugin({
          filename: "[name].[contenthash].css",
          chunkFilename: "[name].[contenthash].css",
        }),
      ]
      : []),

    // 開啟 ANALYZE 才分析 bundle 大小
    ...(process.env.ANALYZE
      ? [new BundleAnalyzerPlugin()]
      : []),
  ],
  optimization: {
    // 讓 module id 穩定（避免 hash 因 id 改變），
    // production："deterministic"
    // development："named"
    // moduleIds: "deterministic",

    // 把 runtime 抽出來（避免 entry hash 被污染）
    runtimeChunk: "single",
    splitChunks: {
      chunks: "all",
      cacheGroups: {
        // React 相關套件獨立拆開
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom|react-router-dom)[\\/]/,
          name: "react",
          chunks: "all",
          priority: 20,
        },

        // 編輯器（draft-js）單獨拆
        editor: {
          test: /[\\/]node_modules[\\/]draft-js[\\/]/,
          name: "editor",
          chunks: "all",
          priority: 10,
        },

        // 其他第三方套件
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
          priority: -10,
        },
      },
    },
  },
};
