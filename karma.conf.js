/**
 * Created by omnic on 11/29/2015.
 */
module.exports = function (config) {
    config.set({
        preprocessors: {
            'test/**/*.js': ['browserify'],
            'src/**/*.js': ['browserify']
        },
        browsers: ['Chrome'],
        reporters: ['mocha'],
        frameworks: ['mocha', 'chai', 'sinon', 'browserify'],
        plugins: [
            'karma-browserify',
            'karma-chrome-launcher',
            'karma-mocha-reporter',
            'karma-mocha',
            'karma-chai',
            'karma-sinon'
        ],
        browserify: {
            debug: true
        },
        files: [
            'src/**/*.js',
            'test/**/*.js'
        ]
    });
}