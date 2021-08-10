const CracoLessPlugin = require("craco-less");

module.exports = {
  module: {
    rules: [{
      test: /\.(html)$/,
      use: {
        loader: 'html-loader',
        options: {
          attrs: [':data-src']
        }
      }
    }],
  },
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
  babel: {
    plugins: [["@babel/plugin-proposal-decorators", { legacy: true }]],
  },
};
