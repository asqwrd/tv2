
var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var findup = require('findup-sync');
var gzip = require('gulp-gzip');
var path = require('path');
var fs = require('fs');
var _ = require('lodash');
var through2 = require('through2');
var jsBeautify = require('js-beautify').js_beautify;
var shell = require('gulp-shell');
var sassInheritance = require('gulp-sass-inheritance');
var gulpif = require('gulp-if');
var filter = require('gulp-filter');
var cached = require('gulp-cached');
var pump = require('pump');

const vendor_path = findup('/tv2');
const libs = findup('libs');

var runSequence = require('run-sequence');

//compiles typescript files
gulp.task('typescript', function() {
    return gulp.src('app')
        .pipe(shell([
            'npm run ts'
        ]))
});

//compiles typescript files for developement
gulp.task('typescript-dev', function() {
    return gulp.src('app')
        .pipe(shell([
            'npm run ts_dev'
        ]))
});


//bundles angular 2 files
gulp.task('vendors',function(){
    var SystemBuilder = require('./node_modules/builder-systemjs');
    var builder = new SystemBuilder(vendor_path);

    builder.loadConfig('./systemjs.config.js')
        .then(function(){
            var outputFile = 'script/vendors.min.js';
            return builder.buildStatic('app', outputFile, {
                minify: true,
                mangle: false,
                rollup: true,
                sourceMaps: false,
            });
        })
        .then(function(){
            gulp.src([
                    'script/vendors.min.js'
                ])
                .pipe(gzip())
                .pipe(gulp.dest('script'));
            console.log('bundle built successfully!');
        });
});

//bundles angular 2 files for development
gulp.task('vendors_dev',function(){
    var SystemBuilder = require('./node_modules/builder-systemjs');
    var builder = new SystemBuilder(vendor_path);

    builder.loadConfig('./systemjs.config.js')
        .then(function(){
            var outputFile = 'script/vendors.min.js';
            return builder.buildStatic('app', outputFile, {
                minify:false,
                mangle: false,
                rollup: true,
                sourceMaps: true
            });
        })
        .then(function(){
            gulp.src([
                    'script/vendors.min.js'
                ])
                .pipe(gzip())
                .pipe(gulp.dest('script'));
            console.log('bundle built successfully!');
        });
});


//bundles and minifies all 3rd party plugins
gulp.task('scripts', function(cb) {
   pump([
    gulp.src([
        libs + '/moment/moment.min.js',
        libs + '/swiperjs/swiper.min.js',
        libs + '/color-thief.js',
        libs + '/suncalc.js',
        'node_modules/core-js/client/shim.min.js',
        'node_modules/zone.js/dist/zone.js',
        'node_modules/reflect-metadata/Reflect.js',
        'node_modules/systemjs/dist/system.src.js',
        'node_modules/material-design-lite/material.min.js'
    ]),
    concat('all.js'),
    uglify({
            mangle:true,
            compress : { screw_ie8 : true },
            comments: false
        }),
        //.pipe(gzip())
        gulp.dest('script')
    ],cb)
});


//Compiles all sass files
gulp.task('styles', function() {
    return gulp.src(['sass/**/*.scss','app/**/*.scss'])
        .pipe(filter(function (file) {
            return !/\/_/.test(file.path) || !/^_/.test(file.relative);
        }))
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('css'));
});



//Watch task for sass and typescript
gulp.task('default',['styles','build-typescript_dev'],function() {
    gulp.watch('sass/**/*.scss',['styles']);
    gulp.watch('app/**/*.scss',['styles']);
    gulp.watch('app/**/*.ts',['build-typescript_dev']);
});

//builds all files
gulp.task('build',function(){
    runSequence(
        'styles',
        'scripts',
        'typescript'
    );
});

//builds and bundles typescript and angular
gulp.task('build-typescript',function(){
    runSequence(
        'typescript'
    );
});

//builds and bundles typescript and angular for development
gulp.task('build-typescript_dev',function(){
    runSequence(
        'typescript_dev'
    );
});

//Watch task for just typescripts
gulp.task('watch-vendors',['build-typescript_dev'],function() {
    gulp.watch('app/**/*.ts',['build-typescript_dev']);
});
