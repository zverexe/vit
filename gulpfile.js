var gulp = require('gulp');
var sass = require('gulp-sass');
var prefixer = require('gulp-autoprefixer');

gulp.task('sass', function(){
  return gulp.src('assets/scss/*.scss')
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
    .pipe(prefixer('last 15 versions'))
    .pipe(gulp.dest('assets/'))
});

gulp.task('watch',['sass'], function(){
    gulp.watch('assets/scss/*.scss', ['sass']);
});
gulp.task('default', ['sass', 'watch']);
