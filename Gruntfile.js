module.exports = function(grunt) {
    'use strict';

    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jscs');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jasmine');

    grunt.initConfig({
        browserify: {
            app: {
                src: ['src/main.js'],
                dest: 'dist/bundle.js'
            },
            tests: {
                src: ['tests/Specs/**/*.js'],
                dest: 'tests/specs.js'
            }
        },
        jasmine: {
            tests: {
                src: [],
                options: {
                    specs: 'tests/specs.js'
                }
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
        uglify: {
            js: {
                files: {
                    'dist/bundle.min.js': ['dist/bundle.js']
                }
            }
        },
        watch: {
            js: {
                files: ['Gruntfile.js', 'src/**/*.js'],
                tasks: ['jshint', 'jscs', 'browserify:app']
            },
            tests: {
                files: ['tests/**/*.js'],
                tasks: ['test']
            }
        }
    });

    grunt.registerTask('test', ['jshint', 'jscs', 'browserify:tests', 'jasmine']);
    grunt.registerTask('build',
        ['copy', 'jshint', 'jscs', 'browserify', 'cssmin', 'uglify']);
};
