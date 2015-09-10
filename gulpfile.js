var gulp   = require("gulp"),
    rename = require("rename"),
    del    = require("del"),
    NodeWebkitBuilder = require("nw-builder"),
    runSequence       = require("run-sequence");

gulp.task("clean", function(callback) {
  del("build", callback);
});

gulp.task("copy-vendor-js", function() {
  return gulp.src(["bower_components/angular/angular.min.js", "bower_components/jquery/dist/jquery.min.js", "bower_components/bootstrap/dist/js/bootstrap.min.js"])
          .pipe(gulp.dest("app/scripts/vendor"));
});

gulp.task("copy-vendor-css", function() {
  return gulp.src("bower_components/bootstrap/dist/css/bootstrap.min.css")
          .pipe(gulp.dest("app/styles/vendor"));
});

gulp.task("copy-vendor-fonts", function() {
  return gulp.src("bower_components/bootstrap/dist/fonts/*.*")
          .pipe(gulp.dest("app/styles/fonts"));
});

gulp.task("default", function(callback) {
  runSequence("clean", ["copy-vendor-js", "copy-vendor-css", "copy-vendor-fonts"], "build", callback);
});

gulp.task("build", function(callback) {
  var nw = new NodeWebkitBuilder({
    files: "app/**/*",
    version: "0.12.2",
    platforms: ["osx64", "win32", "linux64"],
    cacheDir: process.env.HOME + "/.nwjs-cache",
    buildDir: "./build"
  });

  nw.build()
    .then(function() {
      callback();
    }).catch(function(error) {
      callback(error);
    });
});
