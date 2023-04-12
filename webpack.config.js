const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  context: __dirname,
  target: [
    "web",
    "es6"
  ],
  entry: {
    bundle: path.resolve(__dirname, "src/index.ts")
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "babel-loader",
        include: [
          path.resolve(__dirname, "src")
        ],
        exclude: [
          /node_modules/
        ]
      }
    ]
  },
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "[name].js",
    clean: true,
    assetModuleFilename: "[name][ext]",
    library: {
      name: "ViewCounter",
      type: "umd",
      export: "default",
      umdNamedDefine: true
    }
  },
  resolve: {
    extensions: [
      ".ts",
      ".js"
    ]
  },
  devtool: "source-map",
  devServer: {
    static: {
      directory: path.resolve(__dirname, "build")
    },
    port: 3000,
    open: true,
    hot: true,
    compress: true,
    historyApiFallback: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "Firebase View Counter",
      filename: "index.html",
      template: "src/template.html",
      scriptLoading: "blocking"
    })
  ]
}
