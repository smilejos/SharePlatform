let path = require('path');
let config = {
    entry: path.resolve(__dirname, './public/components/main/entry.jsx'),
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    output: {
        path: path.resolve(__dirname, './assets/'),
        filename: 'bundle.js'
    },
    module: {
        loaders: [{  
            test: /\.jsx$/,  
            loader: 'babel',
            exclude: /node_modules/,
            query: { 
                presets: ['react', 'es2015'],
                plugins: [
                    "syntax-class-properties",
                    "transform-class-properties",
                    "transform-object-rest-spread"
                ]
            }
        },{
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: /node_modules/,
            query: {
                presets: ['es2015']
            }
        }]
    },
    plugins: process.env.PROD_ENV == "production" ? [
        new webpack.optimize.UglifyJsPlugin({
            include: /\.js$/,
            minimize: true,
            compress: {
                warnings: false
            }
        }) 
    ]: []
};

module.exports = config;