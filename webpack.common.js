const path = require('path')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const htmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    entry: {
        index: path.join(__dirname, '/src/index.js'),
        two: path.join(__dirname, "/src/two.js")
    },
    output: {
        path: path.join(__dirname, '/dist'),
        filename: '[name].bundle.js'
    },
    module: {
        rules: [{
                test: /\.css$/,
                use: [{
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: '../'
                        }
                    },
                    'css-loader', 'postcss-loader'
                ]
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 1000,
                        outputPath: 'image'
                    }
                }]
            }
        ]
    },
    plugins: [
        new htmlWebpackPlugin({
            template: path.join(__dirname, '/src/index.template.html')
        }),
        new webpack.HotModuleReplacementPlugin(),
        new MiniCssExtractPlugin({
            filename: "css/[name].css",
            chunkFilename: "css/[id].css"
        })
    ]
};