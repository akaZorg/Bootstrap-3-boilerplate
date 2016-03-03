var gulp        = require('gulp'),
	sass        = require('gulp-sass'),
	del         = require('del'),
	autoprefix  = require('gulp-autoprefixer'),
	extender    = require('gulp-html-extend'),
	uglify      = require('gulp-uglifyjs'),
	notify      = require('gulp-notify'),
	gutil       = require('gulp-util'),
	browserSync = require('browser-sync').create();

var config = {
	bowerDir:  './bower_components',
	srcDir:    './src',
	distDir:   './public'
};

// Clean up
gulp.task('clean', function() {
  return del('public').pipe(notify({ message: 'Public folder deleted' }));
});

// Copy fonts
gulp.task('fonts', function () {
	return gulp.src([
			config.bowerDir + '/bootstrap-sass/assets/fonts/**/*',
		])
		.pipe(gulp.dest(config.distDir + '/fonts'));
});

// CSS
gulp.task('css', function () {
	return gulp.src('src/css/build.scss')
		.pipe(sass({ includePaths: [config.bowerDir + '/bootstrap-sass/assets/stylesheets'] }).on('error', gutil.log))
		// .pipe(autoprefix('last 2 version'))
		.pipe(gulp.dest(config.distDir + '/css'))
		.pipe(browserSync.stream());
});

// Javascript
gulp.task('js', function () {
	return gulp.src([
			config.bowerDir + '/jquery/dist/jquery.min.js',
			config.bowerDir + '/bootstrap-sass/assets/javascripts/bootstrap.js',
			config.srcDir + '/js/*.js'
		])
		.pipe(uglify('build.js', {
			compress: false,
			outSourceMap: true,
		}).on('error', gutil.log))
		.pipe(gulp.dest(config.distDir + '/js'));
});

// HTML Extender
gulp.task('html', function () {
    gulp.src(config.srcDir + '/**/*.html')
        .pipe(extender({
        	annotations: false,
        	verbose: false
        }).on('error', gutil.log))
	    .pipe(gulp.dest(config.distDir));
});

// Task that ensures the [js] task is complete before reloading browsers
gulp.task('js-watch', ['js'], browserSync.reload);

/**
 * Browsersync: Static Server + watching scss/html/js files
 * http://www.browsersync.io/docs/gulp/
 */
gulp.task('serve', ['css', 'html'], function () {
	browserSync.init({
		server: config.distDir
	});
	gulp.watch(config.bowerDir + '/**/*.scss', ['css']);
	gulp.watch(config.srcDir + '/**/*.scss', ['css']);
	gulp.watch(config.srcDir + '/**/*.html', ['html']).on('change', browserSync.reload);
//	gulp.watch(config.srcDir + '/*.html', ['html']).on('change', browserSync.reload);
	gulp.watch(config.srcDir + '/**/*.js', ['js-watch']);
});

gulp.task('default', ['fonts', 'css', 'js', 'html', 'serve']);