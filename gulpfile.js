"use strict";
let gulp = require('gulp'),
	gulpWebpack = require('gulp-webpack'),
    compass = require('gulp-compass'),
    minifyCSS = require('gulp-minify-css'),
    webpack = require('webpack'),
	nodemon = require('nodemon'),
	del = require('del');
 
let paths = {
    sass: './public/style/scss/',
    imgs: './public/style/imgs/',
    main: './public/components/*.*',
    build: './build/',
    app: './server/app.js'
};

let watchConfig = {
    scss : './public/style/scss/*.scss',
    components : './public/components/**/*.jsx',
    program : './public/**/*.js',
    server : './server/*.js'
};

let webpackConfig = {
    entry: './public/components/main/entry.jsx',
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    output: {
        filename: 'bundle.js'
    },
    module: {
        loaders: [{  
                test: /\.jsx$/,  
                loader: 'babel',
                exclude: /node_modules/,
                query: { 
                    presets:['react', 'es2015'] 
                }
            },{
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015']
                }
            }
        ]
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

var nodemonConfig = {
    execMap: {
        js: 'node'
    },
    script: 'server/app.js',
    ext: 'js',
    watch: 'server/**/*.js'
};

gulp.task('compass', function() {
    console.log('--------------compass--------------');
    del(paths.build + 'style.css', function(){
        
    });
    gulp.src(paths.main)
        .pipe(compass({
                css: paths.build,
                sass: paths.sass,
                image: paths.imgs
            })
        );
    
        // .pipe(minifyCSS({
        //     noAdvanced: false,
        //     keepBreaks: true,
        //     cache: true // this add-on is gulp only
        // }))
        // .pipe(gulp.dest(paths.build));
});

gulp.task('copy', function() {
    //gulp.src(source_paths.app).pipe(gulp.dest(dest_paths.main));
    //gulp.src(source_paths.components).pipe(gulp.dest(dest_paths.components));
});

gulp.task('build', function() {
    console.log('--------------build--------------');
    gulp.src(paths.main)
        .pipe(gulpWebpack(webpackConfig))
        .pipe(gulp.dest(paths.build));    
});

gulp.task('nodemon', function() {
    console.log('--------------nodemon--------------');
    nodemon(nodemonConfig);
});

gulp.task('default', ['build', 'compass', 'nodemon']);  //, 'nodemon'
gulp.watch(watchConfig.components, ['build']); //restart my server 
gulp.watch(watchConfig.program, ['build']); //restart my server 
gulp.watch(watchConfig.scss, ['compass']); //restart my server 
