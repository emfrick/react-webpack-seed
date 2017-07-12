/**
 * Imports
 */
const webpack = require('webpack');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const PATHS = {
    ROOT: __dirname,
    BUILD: path.join(__dirname, 'build'),
    DIST: path.join(__dirname, 'dist'),
    SRC: path.join(__dirname, 'src')
};
const PRODUCTION_ENVIRONMENT = 'PRODUCTION';
const DEVELOPMENT_ENVIRONMENT = 'DEVELOPMENT';
const CLEAN_PATHS = [PATHS.BUILD, PATHS.DIST];

/**
 * Webpack Configuration
 */
const config = (isProduction) => {    

    return {
        context: PATHS.SRC,
        entry: './index.js',
        devtool: isProduction ? 'source-map' : 'eval',
        output: {
            path: isProduction ? PATHS.DIST : PATHS.BUILD,
            filename: 'bundle.js',
            publicPath: '/' // Allows static content to be hosted from this location
                            // HTML can now refer to /assets/img for all images
        },
        module: {
            rules: [
                {
                    test: /\.sass$/,
                    exclude: /node_modules/,
                    use: [
                        'style-loader',
                        'css-loader',
                        'sass-loader'
                    ]
                },
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: 'babel-loader',
                            options: {
                                presets: ['es2015', 'react', 'stage-0']
                            }                        
                        }                    
                    ]
                },
                {
                    test: /\.(jpg|png|svg)$/,
                    use: [
                        {
                            loader: 'url-loader',
                            options: {
                                limit: 25000    // Inline files below 25kB
                            }
                        }
                    ]                
                }
            ]
        },
        plugins: [
            new CleanWebpackPlugin(CLEAN_PATHS, {
                root: PATHS.ROOT,
                verbose: !isProduction
            })
        ],
        devServer: {
            contentBase: './',   // Allows static content to be hosted from this location
                                // HTML can now refer to /assets/img for all images
            stats: 'minimal',
            publicPath: '/'
        }
    }
}

/**
 * Module Export
 */
module.exports = (env) => {

    let isProduction = (env && env === PRODUCTION_ENVIRONMENT);

    console.log("ENVIRONEMNT:", isProduction ? PRODUCTION_ENVIRONMENT : DEVELOPMENT_ENVIRONMENT);

    return config(isProduction);
}