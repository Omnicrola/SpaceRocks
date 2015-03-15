/**
 * Created by Eric on 3/14/2015.
 */
module.exports = function (config) {
    config.set({
        basePath: '../',
        frameworks: ['mocha', 'expect', 'sinon', 'requirejs'],
        files: ['test/js/**/*.js', 'src/js/**/*.js'],
        autoWatch: true,
        browsers: ['Chrome']
    });
};