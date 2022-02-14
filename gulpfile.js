const { src, dest, watch, parallel, series } = require('gulp');
//const scss = require('gulp-sass');
const sass = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const uglify = require('gulp-uglify');
const imagemin = import('gulp-imagemin');
const del = require('del');
const browserSync = require('browser-sync').create();
//scss.compiler = require('sass');

function browsersync() {
  browserSync.init({
    server:  {
      baseDir: 'app/'
    }
  })
}

function styles() {
  return src('app/scss/style.scss')
  .pipe(sass({outputStyle: 'compressed'}))//.on('error', scss.logError))
  .pipe(concat('style.min.css'))
  .pipe(autoprefixer({
    overrideBrowserslist: ['last 10 versions'],
    grid: true
  }))
  .pipe(dest('app/css'))
  .pipe(browserSync.stream())
}

function scripts() {
  return src([
    'node_modules/jquery/dist/jquery.js',
    'app/js/main.js'
  ])
  .pipe(concat('main.min.js'))
  .pipe(uglify())
  .pipe(dest('app/js'))
  .pipe(browserSync.stream())
}

function images() {
  return src('app/images/**/*.*')
  .pipe(imagemin())
  .pipe(dest('dist/images'))
}

function build() {
  return src([
    'app/**/*.html',
    'app/css/style.min.css',
    'app/js/main.min.js'
  ], {base: 'app'})
  .pipe(dest('dist'))
}
function cleanDist() {
  return del('dist')
}

function watching() {
  watch(['app/scss/**/*.scss'], styles);
  watch(['app/js/**/*.js', '!app/js/main.min.js'], scripts);
  watch(['app/**/*.html']).on('change', browserSync.reload);
}

exports.styles = styles;
exports.browsersync = browsersync
exports.scripts = scripts;
exports.watching = watching;
exports.images = images;
exports.build = series(cleanDist,/*, images, */ build);
exports.cleanDist = cleanDist;
exports.default = parallel(styles, scripts, browsersync, watching);


// const sass = require('gulp-sass');
// const compiler = require('sass');
// sass.compiler = compiler;
// // const scss = require('gulp-sass');
// const sass = require('gulp-sass')(require('sass'));

// function styles(){
//   return src('app/scss/style.scss')
//     .pipe(sass())
//     .pipe(dest('app/css'))
// }

// exports.styles = styles;

// import gulpSass from "gulp-sass";
// import nodeSass from "node-sass";
    
// const sass = gulpSass(nodeSass);
// // const scss = require('gulp-sass');
// // const sass = require('gulp-sass')(require('sass'));

// function styles(){
//   return src('app/scss/style.scss')
//     .pipe(sass())
//     .pipe(dest('app/css'))
// }

// exports.styles = styles;

// import pkg from 'gulp';
// const { src, dest, series, watch } = pkg;
// import concat from 'gulp-concat'

// import dartSass from 'sass'
// import gulpSass from 'gulp-sass'
// const sass = gulpSass(dartSass)

// function scss() {
//     return src('app/scss/**/*.scss', { sourcemaps: true })
//         .pipe(sass.sync().on('error', sass.logError)) // scss to css
//         .pipe(concat('style.min.css'))
//         .pipe(dest(config.build.style, { sourcemaps: '../sourcemaps/' }))
// }

// async function builds() { scss() }
// export { builds }