const path = require('path')
const webpack = require('webpack')
const CopyPlugin = require('copy-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const ModuleFederationPlugin = require('webpack').container.ModuleFederationPlugin
const deps = require('./package.json').dependencies
module.exports = {
    entry: { index: './src/index' },
    output: {
        // charset:true,
        publicPath: 'auto',
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[contenthash:5].js',
        chunkFilename: '[name].[contenthash:5].js',
        assetModuleFilename: '[name].[contenthash:5].js',
    },
    target: 'web', //['web', 'es5'],
    mode: 'development',
    devtool: 'source-map',
    devServer: {
        watchFiles: path.join(__dirname, 'dist'),
        port: 3002,
        historyApiFallback: true,
        hot: true,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
            'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
        },
    },
    resolve: {
        extensions: ['.vue', '.ts', '.js', '.tsx'],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                options: {
                    appendTsSuffixTo: [/\.vue$/],
                },
                exclude: /node_modules/,
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
            },
        ],
    },
    externals: {
        singleSpa: 'single-spa',
    },
    plugins: [
        new CleanWebpackPlugin(),
        new webpack.DefinePlugin({ __VUE_OPTIONS_API__: true, __VUE_PROD_DEVTOOLS__: false }),
        new CopyPlugin({
            patterns: [{ from: '../node_modules/single-spa/lib/umd/single-spa.min.js', to: 'single-spa.min.js' }],
        }),
        new ModuleFederationPlugin({
            name: 'packages3',
            library: { type: 'var', name: 'packages3' },
            filename: 'remoteEntry.js',
            exposes: {
                widget: './src/widget',
            },
            shared: {
                moment: deps.moment,
            },
        }),
        new HtmlWebpackPlugin({
            template: './public/index.html',
            chunks: ['index'],
            inject: true,
        }),
        new VueLoaderPlugin(),
    ],
}
