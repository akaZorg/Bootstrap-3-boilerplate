var gulp        = require('gulp'),
	sass        = require('gulp-sass'),
	del         = require('del'),
	cssmin      = require('gulp-cssmin'),
	autoprefix  = require('gulp-autoprefixer'),
	extender    = require('gulp-html-extend'),
	imagemin    = require('gulp-imagemin'),
	pngquant    = require('imagemin-pngquant'),		// $ npm i -D imagemin-pngquant
	uglify      = require('gulp-uglifyjs'),
	notify      = require('gulp-notify'),
	gutil       = require('gulp-util'),
	browserSync = require('browser-sync').create();

var paths = {
	bs:    './bower_components/bootstrap-sass/assets',
	bower: './bower_components',
	src:   './src',
	dist:  './public'
};


// Clean up
gulp.task('clean', function() {
	return del('public/**/*');
	//.pipe(notify({ message: 'Public folder deleted' }));
});


// Fonts
gulp.task('fonts', function () {
	return gulp.src([paths.bs + '/fonts/**/*']).pipe(gulp.dest(paths.dist + '/fonts'));
});


// CSS
gulp.task('css', function () {
	return gulp.src(paths.src + '/css/build.scss')
		.pipe(sass({
			includePaths: [paths.bs + '/stylesheets']
		}).on('error', gutil.log))
		// .pipe(autoprefix('last 2 version'))
		// .pipe(cssmin())
		.pipe(gulp.dest(paths.dist + '/css'))
		.pipe(browserSync.stream());
});


// Images
gulp.task('img', function(){
	return gulp.src(paths.src + '/img/*.*')
		.pipe(imagemin({
			progressive: true,
			use: [pngquant()]
		}).on('error', gutil.log))
		.pipe(gulp.dest(paths.dist + '/img'));
});


// Javascript
gulp.task('js', function () {
	return gulp.src([
			paths.bower + '/jquery/dist/jquery.min.js',
			paths.bs + '/javascripts/bootstrap.js',
			paths.src + '/js/*.js'
		])
		.pipe(uglify('build.js', {
			compress: false,
			outSourceMap: true,
		}).on('error', gutil.log))
		.pipe(gulp.dest(paths.dist + '/js'));
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

// Task that ensures the [js] task is complete before reloading browsers
gulp.task('js-watch', ['js'], browserSync.reload);


/**
 * Browsersync: Static Server + watching scss/html/js files
 * http://www.browsersync.io/docs/gulp/
 */
gulp.task('serve', ['css', 'html'], function () {
	browserSync.init({
		server: paths.dist
	});
	gulp.watch(paths.src + '/img/**/*.*', ['img']);
	gulp.watch(paths.src + '/css/**/*.scss', ['css']);
	gulp.watch(paths.src + '/**/*.html', ['html']).on('change', browserSync.reload);
	gulp.watch(paths.src + '/js/**/*.js', ['js-watch']);
});

gulp.task('default', ['fonts', 'img', 'js', 'serve']);