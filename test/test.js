/* globals describe, it */
'use strict';

var assert  = require('assert');
var https   = require('https');

var defaults = {
    port: 8443,
    rejectUnauthorized: false
};

it('should start a stunnel wrapper', function(cb) {
    this.timeout(10000);

    var opts = Object.assign({}, defaults);

    var req = https
        .request(opts, function(res) {
            assert.equal(res.statusCode, 200);
            cb();
        });

    req.end();
});


it('should start a stunnel with a custom port', function(cb) {
    this.timeout(10000);

    var opts = Object.assign({
        port: 8081
    }, defaults);

    var req = https
        .request(opts, function(res) {
            assert.equal(res.statusCode, 200);
            cb();
        });

    req.end();

});
