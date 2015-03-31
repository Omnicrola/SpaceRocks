/**
 * Created by Eric on 3/18/2015.
 */
module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        watch:{
            script: {
                files: ['src/js/**/*.js'],
                tasks: ['concat'],
                options: {
                    spawn: false
                }
            }
        },
        concat: {
            dist: {
                src: ['src/**/*.js'],
                dest: 'bin/spacerocks.js'
            }
        },
        jshint: {
            files: {
                src: ['src/js/**/*.js'],
                src: ['test/js/**/*.js']
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

    grunt.registerTask('default', ['build', 'watch']);
    grunt.registerTask('build', ['jshint', 'concat']);
};