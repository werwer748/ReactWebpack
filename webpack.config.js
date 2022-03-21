const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

const config = ({ isDev }) => ({
    mode: isDev ? 'development' : 'production',
    devtool: 'eval',
    resolve: {
        extensions: ['.js', ',jsx'],
    },
    entry: {
        main: './src/index',
    },
    output: {
        path: path.join(__dirname, 'dist'),
        publicPath: '/',
        filename: '[name].js',
    },
    module: {
        rules: [
            {
                test: /\.(png|jpg|svg|gif)$/,
                loader: 'url-loader',
                options: {
                    name: '[name].[ext]?[hash]',
                    limit: 5000,
                },
            },
            {
                test: /\.(js|jsx)$/,
                exclude: '/node_modules',
                include: path.resolve(__dirname, 'src'),
                loader: 'babel-loader',
                options: {
                    presets: [
                        ['@babel/preset-env', {
                            targets: { browsers: ['> .1%', 'last 2 versions'] },
                        }],
                        '@babel/preset-react',
                    ],
                    plugins: [
                        [isDev && 'react-refresh/babel'].filter(Boolean),
                        [
                            '@babel/plugin-transform-runtime', { corejs: 3, proposals: true },
                        ],
                    ],
                },
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
    plugins: [
        new webpack.DefinePlugin({
            VERSION: JSON.stringify('v0.1.0'),
        }),
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: './public/index.html',
        }),
        new ReactRefreshWebpackPlugin(),
    ],
    devServer: {
        // devMiddleware: {publicPath: '/dist'},
        // static: { directory: path.resolve(__dirname) },
        port: 3000,
        historyApiFallback: true,
        open: true,
        hot: true,
    },
});

module.exports = (env, argv) => config({ isDev: argv.mode === 'development' });