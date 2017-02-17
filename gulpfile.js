var gulp        = require('gulp'),
    sass        = require('gulp-sass'),
    del         = require('del'),
    cssmin      = require('gulp-cssmin'),
    autoprefix  = require('gulp-autoprefixer'),
    extender    = require('gulp-html-extend'),
    imagemin    = require('gulp-imagemin'),
    pngquant    = require('imagemin-pngquant'),     // $ npm i -D imagemin-pngquant
    uglify      = require('gulp-uglifyjs'),
    notify      = require('gulp-notify'),
    gutil       = require('gulp-util'),
    browserSync = require('browser-sync').create(),
    reload       = browserSync.reload;

var paths = {
    bs:   './node_modules/bootstrap-sass/assets',
    lib:  './node_modules',
    src:  './src',
    dist: './public'
};


// Clean up
gulp.task('clean', function() {
    return del('public/**/*');
    //.pipe(notify({ message: 'Public folder deleted' }));
});


// Fonts
gulp.task('fonts', function () {
    return gulp
            .src([paths.bs + '/fonts/**/*'])
            .pipe(gulp.dest(paths.dist + '/assets/fonts'));
});


// CSS
gulp.task('scss', function () {
    return gulp
            .src(paths.src + '/scss/build.scss')
            .pipe(sass({
                includePaths: [paths.bs + '/stylesheets']
            }).on('error', gutil.log))
            // .pipe(autoprefix('last 2 version'))
            .pipe(cssmin())
            .pipe(gulp.dest(paths.dist + '/assets/css'))
            .pipe(browserSync.stream());
});


// Images
gulp.task('img', function(){
    return gulp
            .src(paths.src + '/img/*.*')
            .pipe(imagemin({
                progressive: true,
                use: [pngquant()]
            }).on('error', gutil.log))
            .pipe(gulp.dest(paths.dist + '/assets/img'));
});


// Javascript
gulp.task('js', function () {
    return gulp.src([
            paths.lib + '/jquery/dist/jquery.min.js',
            paths.bs + '/assets/javascripts/bootstrap.js',
            paths.src + '/js/*.js'
        ])
        .pipe(uglify('build.js', {
            compress: false,
            outSourceMap: true,
        }).on('error', gutil.log))
        .pipe(gulp.dest(paths.dist + '/assets/js'));
});


// HTML Extender
gulp.task('html', function () {
    gulp.src(paths.src + '/*.html')
        .pipe(extender({
            annotations: false,
            verbose: false
        }).on('error', gutil.log))
        .pipe(gulp.dest(paths.dist));
});

gulp.task('js-watch', ['js'], reload);


/**
 * Browsersync: Static Server + watching scss/html/js files
 * http://www.browsersync.io/docs/gulp/
 */
gulp.task('serve', ['scss', 'html'], function () {
    browserSync.init({
        server: paths.dist,
        notify: {
            styles: {
                top:                    'auto',
                bottom:                 '0',
                padding:                '10px',
                borderBottomLeftRadius: "0"
            }
        }
    });
    gulp.watch(paths.src + '/img/**/*.*', ['img']);
    gulp.watch(paths.src + '/scss/**/*.scss', ['scss']);
    gulp.watch(paths.src + '/**/*.html', ['html']).on('change', reload);
    gulp.watch(paths.src + '/js/**/*.js', ['js-watch']);
});

gulp.task('default', ['fonts', 'img', 'js', 'serve']);
