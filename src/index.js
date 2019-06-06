'use strict';

const child_process = require('child_process');
const path = require('path');

function fork(forkPath, argv, env) {
  const cp = child_process.fork(forkPath, argv, {
    slient: false,
    execArgv: [],
    env
  });
  cp.on('exit', function(signal) {
    console.log(
      `[${new Date().toLocaleString()}] [Node-Contend Fork ${process.pid}] child process exit [signal = ${signal}]`
    );
    cp.kill();
  });
  return cp;
}

function Contend({port, success, close, delay}) {
  delay = delay || 10 * 1000;
  port = port || 4000;
  const forkPath = path.resolve(__dirname, 'fork.js');
  const cp = fork(forkPath, [JSON.stringify({port})], port);
  let complete = false;
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
      let timer = setTimeout(function() {
        clearTimeout(timer);
        cp.kill();
      }, delay);
    }
  });
  return cp;
}

exports = module.exports = Contend;
