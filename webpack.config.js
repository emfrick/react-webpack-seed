/**
 * Imports
 */
const webpack = require('webpack');
const path = require('path');

/**
 * Webpack Configuration
 */
const config = {
    context: path.join(__dirname, 'src'),
    entry: './index.js',
    devtool: 'source-map',
    output: {
        path: __dirname,
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
    devServer: {
        contentBase: './',   // Allows static content to be hosted from this location
                            // HTML can now refer to /assets/img for all images
        stats: 'minimal',
        publicPath: '/'
    }
}

/**
 * Module Export
 */
module.exports = config;