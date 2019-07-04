const merge = require('webpack-merge')
const common = require('./webpack.common.js')

module.exports = merge(common, {
    devServer: {
        contentBase: './dist',
        port: '8880',
        // inline: true,
        historyApiFallback: true,
        hot: true
    },
})