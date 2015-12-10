/**
 * Created by omnic on 11/29/2015.
 */
var gulp = require('gulp');
var Server = require('karma').Server;

gulp.task('default', ['tdd']);

gulp.task('test', function (done) {
    new Server({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true,
    }, done).start();
});

gulp.task('tdd', function (done) {
    new Server({
        configFile: __dirname + '/karma.conf.js',
        singleRun: false
    }, done).start();
});

var browserify = require('gulp-browserify');
var sourceStream = require('vinyl-source-stream');
var clean = require('gulp-clean');

gulp.task('build', ['clean', 'make-js', 'copy-index']);

gulp.task('clean', function () {
    return gulp.src('./bin', {read: false})
        .pipe(clean());
})

gulp.task('make-js', function () {
    gulp.src('src/exports.js')
        .pipe(browserify({
            insertGlobals : true,
            debug : true
        }))
        .pipe(gulp.dest('bin'));
});

gulp.task('copy-index', function(){
    return gulp.src('./src/index.html')
        .pipe(gulp.dest('./bin'));
})