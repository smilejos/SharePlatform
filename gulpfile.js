let gulp = require('gulp');
let sass = require('gulp-sass');
let util = require('gulp-util');
let watch = require('gulp-watch');
let connect = require('gulp-connect');
let webpack = require('webpack');
let nodemon = require('nodemon');
let config = require('./webpack.config.js');

gulp.task('style', function() {
    gulp.src('./public/style/scss/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./build/'));
});

gulp.task("script", function (callback) {
    webpack(config, function (err, stats) {
        if (err)
            throw new util.PluginError("webpack", err);
        util.log("[webpack]", stats.toString({
            // output options
        }));
        callback();
    });
});

gulp.task('watch', function () {
    gulp.watch('./public/style/scss/*.scss', ['style']);
    gulp.watch('./public/components/**/*.jsx', ['script']);

    gulp.src(['build/*.css', 'build/*.js'])
        .pipe(watch(['build/*.css', 'build/*.js']))
        .pipe(connect.reload());
});

gulp.task('connect', function() {
    connect.server({
        livereload: true
    });
});

gulp.task('server', function() {
    nodemon({
        execMap: {
            js: 'babel-node'
        },
        script: 'server/app.js',
        ext: 'js',
        watch: 'server/**/*.js'
    });
});

gulp.task('default', ['server', 'connect', 'script', 'style', 'watch']);