const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  mode: 'production',

  target: 'node',

  node: {
    __dirname: false
  },

  entry: './src/index.js',

  output: {
    path: path.resolve('dist'),
    filename: 'bundle.js'
  },

  resolve: {
    extensions: ['.js', '.gql'],
    modules: [path.resolve(__dirname), 'node_modules']
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          'babel-inline-import-loader',
          {
            loader: 'babel-loader',
            options: {
              plugins: [
                'transform-object-rest-spread',
                [
                  'babel-plugin-inline-import',
                  {
                    extensions: ['.graphql']
                  }
                ]
              ],
              cacheDirectory: false
            }
          }
        ]
      }
    ]
  },

  externals: [nodeExternals()]
};
