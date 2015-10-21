/*
 * grunt-stunnel
 * https://github.com/josephbottigliero/grunt-stunnel
 *
 * Copyright (c) 2015 Joe Bottigliero
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= mochaTest.test.src %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    php: {
      test: {
          options: {
            base: './test/fixtures/webroot'
          }
      },
      custom_options: {
        options: {
          port: 8080,
          base: './test/fixtures/webroot'
        }
      }
    },

    // Configuration to be run (and then tested).
    stunnel: {
      default_options: {
        options: {
          pem: './test/fixtures/cert/stunnel.pem'
        }
      },
      custom_options: {

        options: {
          port: 8081,
          pem: './test/fixtures/cert/stunnel.pem',
          remote: {
            port: 8080
          },
        }
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/test.js']
      }
      
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-php');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['php', 'stunnel', 'mochaTest']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
