var gulp = require('gulp');
var sass = require('gulp-sass');
var minifyCSS = require('gulp-csso');
var prefix = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();

// Compile autoprifexed and minified CSS from SCSS
gulp.task('css', function(){
	return gulp.src('sass/*.scss')
		.pipe(sass())
		.pipe(prefix('last 2 versions'))
		.pipe(minifyCSS())
		.pipe(gulp.dest('css'))
});

// Watch for changes
gulp.watch('sass/*.scss', ['css']);

// Go Gulp, Go!
gulp.task('default', [ 'css' ]);