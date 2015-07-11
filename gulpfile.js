/**
 * Created by joy on 2015/6/11.
 */
var gulp = require('gulp');
var uglify=require('gulp-uglify');//condese the javascript and css to *.min.js and *.min.css version
var htmlreplace = require('gulp-html-replace');//replace the original css and js with condensed  min version
var browserify = require('browserify');//pack the commonJS modules into a js file and use it in the browser
var reactify = require('reactify');//convert jsx file to js file
var source = require('vinyl-source-stream');
var streamify=require('gulp-streamify');
var watchify = require('watchify');//watch the file update and automatically trigger the build task
var concat=require('gulp-concat');
var rename=require('gulp-rename');
var del=require('del');
var minifycss=require('gulp-minify-css');


var path = {
    HTML: 'views/index.ejs',
    MINIFIED_OUT_APPJS:'app.min.js',
    MINIFIED_OUT_CSS:'all.min.css',
    OUT_APPJS:'app.js',
    ENTRY_POINT: './public/javascripts/src/app.js',
    DEST_SRC:'./public/javascripts/',
    DEST_BUILD_JS:'dist/static/javascripts/',
    DEST_BUILD_CSS:'dist/static/stylesheets/',
    DEST_BUILD_IMAGES:'dist/static/images/',
    DEST_BUILD_VIEW:'dist/views/'
};

gulp.task('watch',function(){

    var watcher=watchify(browserify({
            entries:[path.ENTRY_POINT],
            transform:[reactify],
            debug:true,
            cache:{},packageCache:{},fullPaths:true
        })
    );

    return watcher.on('update',function(){
        watcher.bundle()
            .pipe(source(path.OUT_APPJS))
            .pipe(gulp.dest(path.DEST_SRC));
        console.log("updated from watcher");
    }).bundle()
        .pipe(source('app.js'))
        .pipe(gulp.dest(path.DEST_SRC));
});

/**
 * browserify all the reat js files into app.min.js(variable path.MINIFIED_OUT)
 * and uglify it then copy into dist/build folder(variable path.MINIFIED_OUT)
 */
gulp.task('javascripts', function(){
   /*1. build app.min.js*/
   browserify({
       entries: [path.ENTRY_POINT],
       transform: [reactify]
   }).bundle()
    .pipe(source(path.MINIFIED_OUT_APPJS))
    .pipe(streamify(uglify(path.MINIFIED_OUT_APPJS)))
    .pipe(gulp.dest(path.DEST_BUILD_JS));
});

/**
 * build all.min.css, let it depends on 'javascripts' task
 */
gulp.task('stylesheets',['javascripts'],function(){
    //include all the files under public/stylesheets but exclude reserved.css file with '!' prefixed.
    gulp.src(['./public/stylesheets/*.css', '!./public/stylesheets/reserved.css'])
    .pipe(concat('all.css'))
    .pipe(gulp.dest(path.DEST_BUILD_CSS))
    .pipe(rename({suffix: '.min'}))
   // .pipe(rename(path.MINIFIED_OUT_CSS))
    .pipe(streamify(minifycss(path.MINIFIED_OUT_CSS)))
    .pipe(gulp.dest(path.DEST_BUILD_CSS));
});

/**
 * copy images from public/images to path.DEST_BUILD_IMAGES('dist/static/images/')
 */
gulp.task('copyImages',function(){
    gulp.src('./public/images/*')
    .pipe(gulp.dest(path.DEST_BUILD_IMAGES));
});

gulp.task('copyViews',function(){
    gulp.src('./views/*')
        .pipe(gulp.dest('dist/views/'));
    gulp.src('./public/stylesheets/*')
        .pipe(gulp.dest('dist/static/stylesheets/'));
});


/**
 * replace   <!--build:css--> in index.ejs file
 */
gulp.task('replaceHTML', function(){
    gulp.src(path.HTML)
    .pipe(htmlreplace({
            'css': '/stylesheets/'+path.MINIFIED_OUT_CSS
        }))
    .pipe(gulp.dest(path.DEST_BUILD_VIEW));
});


/**
 * clean task for deleting all files in /dist folder
 */
gulp.task('clean', function(cb){
    del([
        path.DEST_BUILD_JS,
        path.DEST_BUILD_CSS,
        path.DEST_BUILD_VIEW
    ],cb);
});


/**
 * run when development
 */
gulp.task('default', ['watch']);

/**
 * run before deployment
 */
gulp.task('production', ['javascripts','stylesheets','copyViews','copyImages']);
