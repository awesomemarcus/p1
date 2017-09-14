var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var inject = require('gulp-inject');
var wiredep = require('wiredep').stream;

gulp.task('sass', function() {
  var injectAppFiles = gulp.src('public/sass/styles/*.scss', {read: false});
  var injectGlobalFiles = gulp.src('public/sass/global/*scss', {read: false});

  function transformFilepath(filepath) {
    return '@import "' + filepath + '";';
  }

  var injectAppOptions = {
    transform: transformFilepath,
    starttag: '// inject:app',
    endtag: '// endinject',
    addRootSlash: false
  };

  var injectGlobalOptions = {
    transform: transformFilepath,
    starttag: '// inject:global',
    endtag: '// endinject',
    addRootSlash: false
  };

  return gulp.src('public/sass/main.scss')
      .pipe(wiredep())
      .pipe(inject(injectGlobalFiles, injectGlobalOptions))
      .pipe(inject(injectAppFiles, injectAppOptions))
      .pipe(sourcemaps.init())
      .pipe(sass().on('error', sass.logError))
      .pipe(sourcemaps.write('./maps'))
      .pipe(gulp.dest('public/css'));
});


gulp.task('sass-watch', function() {
  gulp.watch(['./public/sass/**/**/*.scss', 'bower_components/bootstrap-sass/**/*.scss'], ['sass']);

  var injectFiles = gulp.src(['public/css/main.css']);

  gulp.src('index.html')
      .pipe(inject(injectFiles))
      .pipe(gulp.dest('./'));
});
