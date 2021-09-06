const path = require('path')
const webpack = require('webpack')
const CopyPlugin = require('copy-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const ModuleFederationPlugin = require('webpack').container.ModuleFederationPlugin
const deps = require('./package.json').dependencies

module.exports = function (env, argv) {
    let webpackConfig = {
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
        mode: env.WEBPACK_SERVE ? 'development' : 'production',
        devServer: {
            watchFiles: path.join(__dirname, 'dist'),
            port: 3001,
            historyApiFallback: true,
            hot: true,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
                'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
            },
        },
        resolve: {
            extensions: ['.js', '.jsx', '.ts', '.tsx', '.scss', '.json', '.jpg', '.png', '.gif'],
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
                patterns: [{ cache: true, from: '../node_modules/single-spa/lib/umd/single-spa.min.js', to: 'single-spa.min.js' }],
            }),
            new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn/),
            new ModuleFederationPlugin({
                name: 'packages2',
                library: { type: 'var', name: 'packages2' },
                filename: 'remoteEntry.js',
                exposes: {
                    widget: './src/widget',
                    widget1: './src/widget1',
                },
                shared: {
                    moment: deps.moment,
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
                chunks: ['index'],
                inject: true,
            }),
        ],
    }

    if (env.WEBPACK_SERVE) {
        webpackConfig.devtool = 'source-map'
    }

    if (!env.WEBPACK_SERVE) {
        webpackConfig.optimization = {
            minimize: true,
            minimizer: [
                new TerserPlugin({
                    // test: /\.js(\?.*)?$/i,
                    exclude: /node_modules/i,
                    parallel: require('os').cpus().length - 1,
                    extractComments: {
                        condition: /@keep/i,
                        filename: (fileData) => {
                            // The "fileData" argument contains object with "filename", "basename", "query" and "hash"
                            return `${fileData.filename}.txt`
                        },
                    },
                    // TerserPlugin.terserMinify 15469ms 160kb
                    // TerserPlugin.uglifyJsMinify 21492ms 158kb
                    // TerserPlugin.esbuildMinify 6436ms 169kb
                    minify: TerserPlugin.terserMinify,
                    terserOptions: {
                        //...
                    },
                }),
            ],
        }
    }

    return webpackConfig
}
