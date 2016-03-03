var gulp        = require('gulp'),
	sass        = require('gulp-sass'),
	autoprefix  = require('gulp-autoprefixer'),
	uglify      = require('gulp-uglifyjs'),
	notify      = require('gulp-notify'),
	browserSync = require('browser-sync').create();

var config = {
	bowerDir: './bower_components',
	srcDir  : './src',
	distDir : './public'
};

gulp.task('fonts', function () {
	return gulp.src([
			config.bowerDir + '/bootstrap-sass/assets/fonts/**/*',
		])
		.pipe(gulp.dest(config.distDir + '/fonts'));
});

gulp.task('css', function () {
	return gulp.src('src/css/build.scss')
		.pipe(sass({
			outputStyle: 'compressed',
			includePaths: [config.bowerDir + '/bootstrap-sass/assets/stylesheets'],
		}))
		.on('error', notify.onError(function (error) {
			return 'Error: ' + error.message;
		}))
		// .pipe(autoprefix('last 2 version'))
		.pipe(gulp.dest(config.distDir + '/css'))
		.pipe(browserSync.stream());
});

gulp.task('js', function () {
	return gulp.src([
			config.bowerDir + '/jquery/dist/jquery.min.js',
			config.bowerDir + '/bootstrap-sass/assets/javascripts/bootstrap.js',
			config.srcDir + '/js/*.js'
		])
		.pipe(uglify('build.js', {
			compress: false,
			outSourceMap: true,
		}))
		.pipe(gulp.dest(config.distDir + '/js'));
});

// Task that ensures the [js] task is complete before reloading browsers
gulp.task('js-watch', ['js'], browserSync.reload);

// Copy HTML files into the production directory
gulp.task('html', function () {
	gulp.src(config.srcDir + '/*.html')
		.pipe(gulp.dest(config.distDir));
});

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
	gulp.watch(config.srcDir + '/*.html', ['html']).on('change', browserSync.reload);
	gulp.watch(config.srcDir + '/**/*.js', ['js-watch']);
});

gulp.task('default', ['fonts', 'css', 'js', 'html', 'serve']);