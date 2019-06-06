'use strict';

var child_process = require('child_process');
var path = require('path');

function fork(forkPath, argv, env) {
  var cp = child_process.fork(forkPath, argv, {
    slient: false,
    execArgv: [],
    env: env
  });
  cp.on('exit', function(signal) {
    console.log(
      '[' +
        new Date().toLocaleString() +
        '] [Node-Contend Fork ' +
        process.pid +
        '] child process exit [signal = ' +
        signal +
        ']'
    );
    cp.kill();
  });
  return cp;
}

function Contend(_ref) {
  var port = _ref.port,
    success = _ref.success,
    close = _ref.close,
    delay = _ref.delay;

  delay = delay || 10 * 1000;
  port = port || 4000;
  var forkPath = path.resolve(__dirname, 'fork.js');
  var cp = fork(forkPath, [JSON.stringify({port: port})], port);
  var complete = false;
  cp.on('exit', function() {
    if (typeof close === 'function' && !complete) {
      close();
    }
  });
  cp.on('message', function(message) {
    if (message === 'success') {
      if (typeof success === 'function') {
        success();
        complete = true;
      }
      var timer = setTimeout(function() {
        clearTimeout(timer);
        cp.kill();
      }, delay);
    }
  });
  return cp;
}

exports = module.exports = Contend;
