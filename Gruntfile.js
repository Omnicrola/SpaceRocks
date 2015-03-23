/**
 * Created by Eric on 3/18/2015.
 */
module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            dist: {
                src: ['src/**/*.js'],
                dest: 'bin/spacerocks.js'
            }
        },
        jshint: {
            files: {
                src: ['src/**/*.js']
            },
            options: {
                curly: true,
                eqeqeq: true,
                eqnull: true,
                browser: true

            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.registerTask('default', ['build']);
    grunt.registerTask('build', ['jshint', 'concat']);
};