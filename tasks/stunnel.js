/*
 * grunt-stunnel
 * https://github.com/josephbottigliero/grunt-stunnel
 *
 * Copyright (c) 2015 Joe Bottigliero
 * Licensed under the MIT license.
 */

'use strict';

var path    = require('path');
var child   = require('child_process');
var semver  = require('semver');

module.exports = function(grunt) {

  grunt.registerMultiTask('stunnel', 'Start a SSL encryption wrapper for a service.', function() {
  
    var cb = this.async();

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      silent: false,
      port: 8443,
      /**
       * REQUIRED OPTION : Path to the .pem file for the stunnel process.
       * ////////////////////////////////////////////////////////////////
       * pem : './stunnel.pem',
       */
      remote: {
        host: '127.0.0.1',
        port: 8000
      },
      bin: 'stunnel3'
    });

    /**
     * If a PID file target was not supplied, a file will be created.
     */
    if (!options.pid) {
      options.pid = './.stunnel-' + options.port + '.pid';
    }


    /**
     * stunnel binary version check using "-version" option.
     */
    child.exec(options.bin + ' -version', function(err, stdout, stderr) {

        if (err) {
          if (err.code === 'ENOENT') {
            err.message = 'Couldn\'t find the `' + options.bin + '` binary. Make sure it\'s installed and in your $PATH';
            return cb(err);
          }
          /**
           * Most errors we suppress at this point, as stunnel could be invaildly configured, but
           * still work as expected with parameters (SSL Certificate)
           */
        }

        /**
         * RegExp to grab the stunnel version number.
         * @type {RegExp}
         */
        var regex = /stunnel[\s]([0-9]*?.[0-9]*?.[0-9]*)[\s]on/g;

        var result = regex.exec(
          stdout.trim() || stderr.trim()
        );

        /**
         * Currently, stunnel -version does not return proper semver.
         * This is a simple way to covert it (adds a PATCH number of .0)
         * @type {String}
         */
        var version = result[1];
        if (version.split('.').length === 2) {
          version += '.0';
        }

        var req = '~5.19';

        if (!semver.satisfies(version, req)) {
          err = new Error(options.bin + ' ' + version + ' does not satisfy the version requirement of: ' + req);
          err.name = 'InvalidBinVersion';
          cb(err);
          return;
        }

        if (!options.pem) {
          grunt.warn('A "pem" option must be set in order to use grunt-stunnel.' +
                        ' The "pem" value should be set to the locaiton of the ".pem" for the stunnel wrapper.');
          return;
        }

        var host = options.remote.host + ':' + options.remote.port;
        // [host:]port http://man.he.net/man8/stunnel3
        var args = ['-r', host];

        // [host:]port http://man.he.net/man8/stunnel3
        args.push('-d', options.port);

        args.push('-p', path.resolve(options.pem));

        /**
         * Set a PID file output. Since stunnel spawns a seperate pid, just killing
         * the child process will not kill the stunnel wrapper.
         * @type {String}
         */
        var pid = path.resolve(options.pid);
        args.push('-P', pid);

        var cp = child.spawn(options.bin, args, {
          stdio: options.silent ? 'ignore' : 'inherit'
        });

        var kill = function() {
          cp.kill();
          /**
           * Kill the stunnel wrapper PID's and remove the pid files.
           */
          child.exec('kill $(cat ' + pid + ') && rm ' + pid);
        };

        /**
         * A bit verbose – process.on('exit', ...) isn't reliable.
         */
        process
          .on('exit', kill)
          .on('SIGINT', kill)
          .on('SIGHUP', kill)
          .on('SIGBREAK', kill);
    
        cb();
    });

  });

};
