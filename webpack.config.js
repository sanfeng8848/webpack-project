let path = require('path')
module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    library: 'mylibrary',   // 配置自己开发的库使用在html中的script标签中
    libraryTarget: "umd"    // 统一模块, 可以使用ESM, CMD, UMD等
  }
}