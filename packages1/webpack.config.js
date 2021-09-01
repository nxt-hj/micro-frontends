const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const ExternalMemotesPlugin = require('external-remotes-plugin')
const ModuleFederationPlugin = require('webpack').container.ModuleFederationPlugin
module.exports = {
    entry: './src/index',
    output: {
        // charset:true,
        publicPath: '/',
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
        port: 3000,
        historyApiFallback: true,
        hot: true,
        // client: {
        //     progress: true,
        // },
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
            'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
        },
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', 'jsx'],
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                options: {
                    presets: ['@babel/preset-react'],
                },
            },
            {
                test: /\.tsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                options: {
                    presets: ['@babel/preset-react', '@babel/preset-typescript'],
                },
            },
        ],
    },
    externals: {
        singleSpa: 'single-spa',
    },
    plugins: [
        new CleanWebpackPlugin(),
        new CopyPlugin({
            patterns: [{ from: '../node_modules/single-spa/lib/umd/single-spa.min.js', to: 'single-spa.min.js' }],
        }),
        new ModuleFederationPlugin({
            name: 'packages1',
            // remotes: {
            //     packages2: 'packages2@[packages2RemoteUrl]/remoteEntry.js',
            //     packages3: 'packages3@[packages3RemoteUrl]/remoteEntry.js',
            // },
            shared: {
                react: {
                    import: 'react', // the "react" package will be used a provided and fallback module
                    shareKey: 'react', // under this name the shared module will be placed in the share scope
                    shareScope: 'default', // share scope with this name will be used
                    singleton: true, // only a single version of the shared module is allowed
                },
                'react-dom': {
                    singleton: true, // only a single version of the shared module is allowed
                },
            },
        }),
        new HtmlWebpackPlugin({
            template: './public/index.html',
        }),
        new ExternalMemotesPlugin(),
    ],
}
