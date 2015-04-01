/**
 * Created by Eric on 3/14/2015.
 */
module.exports = function (config) {
    config.set({
        basePath: '../',
        frameworks: ['mocha', 'expect', 'sinon'],
        files: [
            'test/js/**/*.js',
            'src/js/**/*.js',
            'src/lib/kibo.js',
            'test/TestUtil.js',
        ],
        autoWatch: false,
        browsers: ['Chrome']
    });
};