# grunt-stunnel

> Grunt plugin for using stunnel (intended for use with grunt-php).

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-stunnel --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-stunnel');
```

## The "stunnel" task

### Overview
In your project's Gruntfile, add a section named `stunnel` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  stunnel: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
});
```

### Options

Options that are mapped directly to `stunnel` can be found in `man stunnel(3)` or [here](http://man.he.net/man8/stunnel3).

#### options.bin
Type: `String`
Default value: `stunnel3`

Path to the stunnel binary, by default uses `stunnel3`

#### options.pem *REQUIRED*
Type: `String`
Default value: `undefined`

Path to a pemfile, this _can_ be self-signed. For instructions on how to generate a .pem, see [here](https://www.stunnel.org/howto.html#authentication). This parameter maps to `stunnel -p`.

#### options.port
Type: `Integer`
Default value: `8443`

The port which the stunnel wrapper will be available on. Maps to `stunnel -d`.

#### options.remote.host
Type: `String`
Default value: `'127.0.0.1'`

The host of the remote service to wrap. This combines with the `options.remote.port` to create the `stunnel -r` argument.

#### options.remote.port
Type: `Integer`
Default value: `8000`

The port of the remote service to wrap. This combines with the `options.remote.host` to create the `stunnel -r` argument.

#### options.pid
Type: `String`
Default value: `./stunnel-${options.port}.pid`

The path which to store the `stunnel` pid.

### Usage Examples

*NOTE* A `options.pem` value is required in all instances.

#### Default Options

Assuming a vaild certificate is available at `.cert/stunnel.pem` and the `grunt-php` server running at it's defaults `localhost:8000` the service will be made available using SSL at `https://localhost:8443`

```js
grunt.initConfig({
  stunnel: {
    options: {
      pem: '.cert/stunnel.pem'
    }
  },
});
```

#### Custom Options

Assuming a vaild certificate is available at `.cert/stunnel.pem` and the `grunt-php` server running at `localhost:8080` the service will be made available using SSL at `https://localhost:8081`

```js
grunt.initConfig({
  stunnel: {
    options: {
      pem: '.cert/stunnel.pem',
      port: 8081,
      remote: {
        port: 8080
      }
    }
  },
});
```

## Release History
_(Nothing yet)_
