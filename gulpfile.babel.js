"use strict";

const gulp = require("gulp"),
 sass = require("gulp-sass")(require('sass')),
 postcss = require("gulp-postcss"),
 autoprefixer = require("autoprefixer"),
 cssnano = require("cssnano"),
 sourcemaps = require("gulp-sourcemaps"),
 babel = require("gulp-babel"),
 browserSync = require("browser-sync"),
 concat = require("gulp-concat"),
 del = require("del"),
 rename = require("gulp-rename"),
 imagemin = require("gulp-imagemin"),
 imageminMozjpeg = require("imagemin-mozjpeg"),
 server = browserSync.create(),
 svgSprite = require("gulp-svg-sprite"),
 babelify = require("babelify"),
 uglify = require("gulp-uglify"),
 watchify = require("watchify"),
 browserify = require("browserify"),
 source = require("vinyl-source-stream"),
 buffer = require("vinyl-buffer"),
 log = require("gulplog"),
 assign = require("lodash.assign"),
 cond = require("gulp-cond"),
 { argv } = require("yargs");

if (argv.prod) {
 process.env.NODE_ENV = "production";
}
let PROD = process.env.NODE_ENV === "production";

const srcPath = "_src/",
 buildPath = PROD ? "dist/" : "build/";
const paths = {
 styles: {
  src: srcPath + "scss/",
  dest: buildPath + "css/"
 },
 javascripts: {
  src: srcPath + "js/",
  dest: buildPath + "js/"
 },
 images: {
  src: srcPath + "images/",
  dest: buildPath + "images/"
 },
 sprite: {
  src: srcPath + "images/icons",
  dest: buildPath + "images/"
 },
 fonts: {
  src: srcPath + "fonts/",
  dest: buildPath + "fonts/"
 },
 ajax: {
  src: srcPath + "ajax/",
  dest: buildPath + "ajax/"
 },
 lib: {
  src: srcPath + "js/lib",
  dest: buildPath + "js/"
 },
 html: {
  src: srcPath,
  dest: buildPath
 }
};

// BrowserSync
function serve(done) {
 server.init({
  server: {
   baseDir: paths.html.dest
  }
 });
 done();
}

// BrowserSync Reload
function reload(done) {
 server.reload();
 done();
}

// Clean assets
function clean() {
 return del([buildPath]);
}

// CSS task
function css() {
 return gulp
  .src(paths.styles.src + "*.scss")
  .pipe(cond(!PROD, sourcemaps.init()))
  .pipe(
   sass({
    includePaths: [paths.styles.src + "**/*.scss", "./node_modules/"]
   })
  )
  .on("error", sass.logError)
  .pipe(cond(PROD, postcss([autoprefixer(), cssnano({ discardComments: { removeAll: true } })])))
  .pipe(cond(!PROD, postcss([autoprefixer()])))
  .pipe(cond(!PROD, sourcemaps.write("./")))
  .pipe(gulp.dest(paths.styles.dest))
  .pipe(server.stream());
}

// js task
const customOpts = {
  entries: [paths.javascripts.src + "main.js"],
  debug: true
 },
opts = assign({}, watchify.args, customOpts),
b = watchify(browserify(opts));
b.transform(babelify.configure({presets: ["@babel/preset-env"]}));
b.on("update", bundle); // on any dep update, runs the bundler
b.on("log", log.info); // output build logs to terminal

function bundle() {
 return b
  .bundle()
  .on("error", log.error.bind(log, "Browserify Error"))
  .pipe(source("main.js"))
  .pipe(buffer())
  .pipe(cond(PROD, sourcemaps.init({ loadMaps: true })))
  .pipe(cond(PROD, uglify()))
  .pipe(gulp.dest(paths.javascripts.dest))
  .pipe(server.stream());
}

// Optimize Images
function images() {
 return gulp
  .src(paths.images.src + "**/*", { since: gulp.lastRun(images) })
  .pipe(
   imagemin([imageminMozjpeg({ quality: 85 })], {
    optimizationLevel: 5,
    progressive: true,
    svgoPlugins: [{ removeViewBox: false }]
   })
  )
  .pipe(gulp.dest(paths.images.dest))
  .pipe(server.stream());
}

// Create Sprites
function sprite() {
 return gulp
  .src(paths.sprite.src + "**/*")
  .pipe(
   svgSprite({
    mode: {
     symbol: {
      dest: "",
      sprite: "sprite.svg"
     }
    },
    shape: {
     transform: [
      {
       svgo: {
        plugins: [{ removeAttrs: { attrs: ["fill"] } }]
       }
      }
     ],
     id: [
      {
       generator: function(name) {
        return basename(name, ".svg");
       }
      }
     ]
    }
   })
  )
  .pipe(gulp.dest(paths.sprite.dest))
  .pipe(server.stream());
}

// Create Sprites without touching attr

function spriteIllustrations() {
 return gulp
  .src(paths.sprite.src + "**/*", !paths.sprite.src + "/**/icon-*.svg")
  .pipe(
   svgSprite({
    mode: {
     symbol: {
      dest: "",
      sprite: "sprite-illustrations.svg"
     }
    },
    shape: {
     id: [
      {
       generator: function(name) {
        return basename(name, ".svg");
       }
      }
     ]
    }
   })
  )
  .pipe(gulp.dest(paths.sprite.dest))
  .pipe(server.stream());
}

// copy html
function html() {
 return gulp
  .src(paths.html.src + "*.*", { since: gulp.lastRun(html) })
  .pipe(gulp.dest(paths.html.dest))
  .pipe(server.stream());
}

// copy fonts
function fonts() {
 return gulp
  .src(paths.fonts.src + "*.*", { since: gulp.lastRun(fonts) })
  .pipe(gulp.dest(paths.fonts.dest))
  .pipe(server.stream());
}

// copy ajax
function ajax() {
  return gulp
    .src(paths.ajax.src + "*.*", {since: gulp.lastRun(ajax)})
    .pipe(gulp.dest(paths.ajax.dest))
    .pipe(server.stream());
}
// copy js lib
function lib() {
  return gulp
    .src(paths.lib.src + "**/*", {since: gulp.lastRun(lib)})
    .pipe(gulp.dest(paths.lib.dest))
    .pipe(server.stream());
}

// copy videos
function videos() {
 return gulp
  .src(paths.images.src + "**/*.{mp4, ogg}", { since: gulp.lastRun(videos) })
  .pipe(gulp.dest(paths.images.dest))
  .pipe(server.stream());
}

/**/

// Watch files
function watchFiles() {
 gulp.watch(paths.styles.src + "**/*", css);
 gulp.watch(paths.html.src + "*.*", html);
 gulp.watch(paths.images.src + "**/*", images);
 gulp.watch(paths.sprite.src + "**/*", sprite);
 gulp.watch(paths.sprite.src + "**/*", spriteIllustrations);
 gulp.watch(paths.fonts.src + "**/*", fonts);
 gulp.watch(paths.ajax.src + "**/*", ajax);
 gulp.watch(paths.lib.src + "**/*", lib);
}

// Tasks

gulp.task("css", css);
gulp.task("js", bundle);
gulp.task("images", images);
gulp.task("videos", videos);
gulp.task("sprite", sprite);
gulp.task("spriteIllustrations", spriteIllustrations);
gulp.task("clean", clean);
gulp.task("html", html);
gulp.task("ajax", ajax);
gulp.task("lib", lib);

gulp.task("default", gulp.parallel(css, bundle, fonts, images, ajax, lib, videos, sprite, spriteIllustrations, html, serve, watchFiles));
