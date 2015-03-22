var webpack = require("webpack");

module.exports = {
  devtool: "source-map",
  entry: {
    app: [
      "./src/scripts/main.js"
    ]
  },
  output: {
    path: "./build",
    filename: "bundle.js"
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  resolve: {
    modulesDirectories: ["node_modules"],
  },
  module: {
    loaders: [
      {
        test: /src\/scripts/,
        loader: "react-hot!babel"
      },

      {
        test: /node_modules\/react-googlemaps/,
        loader: "react-hot!babel"
      },

      {
        test: /\.scss$/,
        loader: "style!css!sass?outputStyle=expanded"
      },

      {
        test: /\.(html|png)$/,
        loader: "file?name=[path][name].[ext]&context=./src"
      }
    ]
  },
  node: {
    net: "empty",
    tls: "empty",
    websocket : "empty"
  }
};
