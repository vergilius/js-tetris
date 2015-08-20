module.exports = function(grunt) {
    'use strict';

    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jscs');

    grunt.initConfig({
        browserify: {
            app: {
                src: ['src/main.js'],
                dest: 'dist/bundle.js'
            }
        },
        cssmin: {
            app: {
                src: ['node_modules/normalize.css/normalize.css'],
                dest: 'dist/bundle.css'
            }
        },
        copy: {
            phaser: {
                src: 'node_modules/phaser/build/phaser.js',
                dest: 'dist/phaser.js'
            }
        },
        jshint: {
            all: ['Gruntfile.js', 'src/**/*.js']
        },
        jscs: {
            src: ['Gruntfile.js', 'src/**/*.js'],
            options: {
                config: '.jscsrc'
            }
        },
        watch: {
            js: {
                files: ['Gruntfile.js', 'src/**/*.js'],
                tasks: ['jshint', 'jscs', 'browserify']
            }
        }
    });

    grunt.registerTask('build',
        ['copy', 'jshint', 'jscs', 'browserify', 'cssmin']);
};
