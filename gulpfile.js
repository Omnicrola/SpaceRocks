/**
 * Created by omnic on 11/29/2015.
 */
var gulp = require('gulp');
var Server = require('karma').Server;
var browserify = require('gulp-browserify');
var clean = require('gulp-clean');
var uglify = require('gulp-uglify');

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

gulp.task('build', ['make-js', 'copy-index', 'copy-resources']);
gulp.task('build-dist', ['make-js-dist', 'copy-index', 'copy-resources']);

gulp.task('clean', function () {
    return gulp.src('./bin', {read: false})
        .pipe(clean());
})

gulp.task('make-js', function () {
    return gulp.src('src/exports.js')
        .pipe(browserify({
            insertGlobals: true,
            debug: true
        }))
        .pipe(gulp.dest('bin'));
});

gulp.task('make-js-dist', function(){
    return gulp.src('src/exports.js')
        .pipe(browserify({
            insertGlobals: true,
            debug: true
        }))
        .pipe(uglify())
        .pipe(gulp.dest('bin'));
});

gulp.task('copy-index', function () {
    return gulp.src('./src/index.html')
        .pipe(gulp.dest('./bin'));
});

gulp.task('copy-resources', function () {
    return gulp.src('./resources/**/*')
        .pipe(gulp.dest('./bin'));
});