module.exports = function (gulp, plugins) {
    return function () {
          return gulp.src('app/pages/*.+(html)')
      .pipe(plugins.nunjucksRender({
           path: ['app/nj-templates']
        }))
        .pipe(plugins.removeCode({
           tmp: true
        }))
      .pipe(gulp.dest('.tmp'))
    };
};
