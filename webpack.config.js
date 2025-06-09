const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  target: "electron-main", // Para o processo principal
  resolve: {
    fallback: {
      fs: false, // Evita erro de resolução
    },
  },
  mode: "development",
  entry: "./src/renderer.jsx",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "renderer.js",
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: "babel-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: "asset/resource", // <- ESSENCIAL!
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
  ],
  devtool: "source-map",
};
