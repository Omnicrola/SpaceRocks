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