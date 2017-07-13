/**
 * Imports
 */
const webpack = require('webpack');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const PATHS = {
    ROOT: __dirname,
    BUILD: path.join(__dirname, 'build'),
    DIST: path.join(__dirname, 'dist'),
    SRC: path.join(__dirname, 'src')
};
const PRODUCTION_ENVIRONMENT = 'PRODUCTION';
const DEVELOPMENT_ENVIRONMENT = 'DEVELOPMENT';
const ANALYZE_ENVIRONMENT = 'ANALYZE';
const CLEAN_PATHS = [PATHS.BUILD, PATHS.DIST];

/**
 * Webpack Configuration
 */
const config = (isProduction) => {    

    return {
        context: PATHS.SRC,
        entry: {
            main: './index.js',
            lib: ['react', 'react-dom'],
        },
        devtool: isProduction ? 'source-map' : 'eval',
        output: {
            path: isProduction ? PATHS.DIST : PATHS.BUILD,
            filename: '[name].bundle.js',
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
            }),
            new CopyWebpackPlugin([
                {
                    from: path.join(PATHS.SRC, 'assets'),
                    to: isProduction ? path.join(PATHS.DIST, 'assets') : path.join(PATHS.BUILD, 'assets'),
                    ignore: ['**/*.sass']
                },
                {
                    from: path.join(PATHS.SRC, 'index.html'),
                    to: isProduction ? path.join(PATHS.DIST, 'index.html') : path.join(PATHS.BUILD, 'index.html')
                }
            ]),
            new webpack.optimize.CommonsChunkPlugin({
                name: 'lib',
                minChunks: Infinity
            }),
            new HtmlWebpackPlugin({
                template: path.resolve(PATHS.SRC, 'index.html')
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

    console.log("ENVIRONMENT:", isProduction ? PRODUCTION_ENVIRONMENT : DEVELOPMENT_ENVIRONMENT);

    let configuration = config(isProduction);

    if (env === ANALYZE_ENVIRONMENT) {
        configuration.plugins.push(
            new BundleAnalyzerPlugin()
        );
    }

    if (isProduction) {
        configuration.plugins.push(            
            new webpack.DefinePlugin({
                'process.env': {
                    'NODE_ENV': JSON.stringify('production')
                }
            }),
            new webpack.optimize.UglifyJsPlugin(),
            new webpack.optimize.AggressiveMergingPlugin()
        )
    }

    return configuration;
}