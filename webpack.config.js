var _ = require( 'lodash' );
var path = require( 'path' );
var webpack = require( 'webpack' );
var HtmlWebpackPlugin = require('html-webpack-plugin');

var pathAppTo;
var pathAssets;

function pathTo() {
    return path.join( __dirname, 'src', path.join.apply( path, arguments ) );
}

pathApp = _.partial( pathTo, 'app' );
pathAssets = _.partial( pathTo, 'assets' );

module.exports = function ( options ) {
    var config = _.merge( {}, {
        entry: {
            vendor: [
                'font-awesome/css/font-awesome.min.css',

                'jquery',
                'bootstrap/dist/js/bootstrap.min.js',
                'bluebird',
                'lodash',

                'angular',
                'angular-animate',
                'angular-aria',
                'angular-ui-router'
            ]
        },

        output: {
            path: path.join( __dirname, 'build' ),
            filename: 'bundle/[name]-[hash].js',
            publicPath: '/'
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NoErrorsPlugin(),
            new webpack.ProvidePlugin( {
                jQuery: 'jquery',
                $: 'jquery',
                'window.jQuery': 'jquery'
            } ),
            new HtmlWebpackPlugin({
                template: './src/assets/index.html',
                inject: 'body'
            }),
            new webpack.optimize.CommonsChunkPlugin( 'vendor', 'bundle/vendor-[hash].js' )
        ],
        resolve: {
            extensions: [ '', '.js' ],
            alias: {
                //application aliases
                controllers: pathApp( 'controllers' ),
                directives: pathApp( 'directives' ),

                templates: pathAssets( 'templates' ),

                assets: pathTo( 'assets' ),

                //vendor aliases
                jquery: 'jquery/dist/jquery.min.js'
            }
        },
        module: {
            loaders: [
                {
                    test: /\.html$/,
                    loader: 'file?name=templates/[name]-[hash:6].html'
                },
                {
                    test: /\.css$/,
                    loader: 'style-loader!css-loader'
                },
                {
                    test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                    loader: 'url-loader?limit=10000&mimetype=application/font-woff'
                },
                {
                    test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                    loader: 'file-loader'
                },
                {
                    test: /\.jpg|\.png|\.mp3/,
                    loader: 'file-loader'
                }
            ]
        },
        resolveLoader: {
            root: path.join( __dirname, 'node_modules' )
        }
    }, options.overrides );

    config.module.loaders = _.union( config.module.loaders, options.loaders );
    config.plugins = _.union( config.plugins, options.plugins );

    return config;
};