var gulp = require('gulp');
var runSequence = require('run-sequence');
var gulpCopy = require('gulp-copy');

gulp.task('copyProject', function() {
    var sources = [
        'package.json'
    ];

    return gulp.src(sources)
        .pipe(gulpCopy('dist', { prefix: 0 }));
});

gulp.task('default', function(callBack) {
    return runSequence('copyProject', callBack);
});