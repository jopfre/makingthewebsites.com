var gulp = require('gulp');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');

var browserSync = require('browser-sync');

var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var postcss = require('gulp-postcss');
var cssnano = require('cssnano');
var autoprefixer = require('autoprefixer'); 
var pixrem = require('gulp-pixrem');

var concat = require('gulp-concat');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');

var dirName = require('path').basename(__dirname);

gulp.task('browser-sync', function() {
  console.log();
  browserSync({
    proxy: "localhost/"+dirName
  });
});

gulp.task('bs-reload', function () {
  browserSync.reload();
});

var errorHandler = { 
  errorHandler: function(error) {
    console.log(error.message);
    this.emit('end');
  }
};

gulp.task('styles', function(){
  gulp.src('./src/sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([ autoprefixer({ browsers: [">1%"] }) ]))
    .pipe(gulp.dest('./'))
    .pipe(rename({suffix: '.min'}))
    .pipe(postcss([ cssnano() ]))
    .pipe(pixrem({ rootValue: '10px', html: false })) //has to be after minify or the fallbacks get stripped
    .pipe(gulp.dest('./'))
    .pipe(browserSync.reload({stream:true}));
});

gulp.task('scripts', function(){
  gulp.src('src/js/**/*.js')
    .pipe(plumber(errorHandler))
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(concat('main.js'))
    .pipe(gulp.dest('./'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify({
      mangle: {
        except: []
      }
    }))
    .pipe(gulp.dest('./'))
    .pipe(browserSync.reload({stream:true}))
}); 

gulp.task('default', ['browser-sync'], function(){
  gulp.watch("src/sass/**/*.scss", ['styles']);
  gulp.watch("src/js/**/*.js", ['scripts']);
  gulp.watch("**/*.html", ['bs-reload']);  
});