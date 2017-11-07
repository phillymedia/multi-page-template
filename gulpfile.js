var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var stringify = require('stringify');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var runSequence = require('run-sequence');

plugins.sass = require('gulp-sass');
plugins.useref = require('gulp-useref');
plugins.uglify = require('gulp-uglify');
plugins.gulpIf = require('gulp-if');
plugins.cssnano = require('gulp-cssnano');
plugins.browserSync = require('browser-sync').create();
plugins.del = require('del');
plugins.sass = require('gulp-sass');
plugins.nunjucksRender = require('gulp-nunjucks-render');
plugins.gutil = require('gulp-util');
plugins.removeCode = require('gulp-remove-code');
plugins.inline = require('gulp-inline');

gulp.task('browserify', function() {
    return browserify({
            'entries': ['app/js/main.js']
        })
        .transform(stringify, {
            appliesTo: {
                includeExtensions: ['.html']
            }
        })
        .bundle()
        .pipe(source('main.js'))
        .pipe(buffer())
        .pipe(gulp.dest('.tmp/js'))
        .pipe(plugins.browserSync.reload({
          stream: true
        }))
});
gulp.task('copyjs', function() {
    return gulp.src(['app/js/pages/*.js']) // Gets all files ending with .scss
      .pipe(gulp.dest('.tmp/js/pages'))
      .pipe(plugins.browserSync.reload({
        stream: true
      }))
});

gulp.task('browserifyBuild', function() {
    return browserify({
            'entries': ['app/js/main.js']
        })
        .transform(stringify, {
            appliesTo: {
                includeExtensions: ['.html']
            }
        })
        .bundle()
        .pipe(source('main.js'))
        .pipe(buffer())
        .pipe(uglify({
            mangle: false,
            compress: false
        }).on('error', plugins.gutil.log))
        .pipe(gulp.dest('.tmp/js'))
});


function getTask(task) {
    return require('./gulp-tasks/' + task)(gulp, plugins);
}

gulp.task('sass', getTask('sass'));
gulp.task('browserSync', getTask('browserSync'));
gulp.task('clean:dist', getTask('clean'));
gulp.task('nunjucks', getTask('nunjucks'));
gulp.task('nunjucks-build', getTask('nunjucks-build'));
gulp.task('useref', getTask('useref'));
gulp.task('indexcleanup',['inline'], getTask('indexcleanup'));
gulp.task('sass-build', getTask('sass-build'));
gulp.task('inline', getTask('inline'));



gulp.task('watch', ['browserSync', 'sass', 'nunjucks'], function (){
  gulp.watch('app/scss/**/*.scss', ['sass']);
  gulp.watch('app/**/*.html', ['nunjucks']);
  gulp.watch('app/js/*.+(js|html)',['browserify']);
});

gulp.task('default', function(callback) {
  runSequence(['sass','browserify','copyjs','nunjucks', 'browserSync', 'watch'],
    callback
  )
})

gulp.task('build', function(callback) {
  runSequence('clean:dist', 'browserifyBuild',
    ['sass','nunjucks-build','copyjs'],'useref','inline','indexcleanup',
    callback
  )
})
