'use strict';

var Net = require('net');

var server = Net.createServer();

var argv = JSON.parse(process.argv[2]);

var port = argv.port;

server.on('listening', function() {
  console.log('[' + new Date().toLocaleString() + '] [Node-Contend ' + process.pid + '] start listening');
});

server.on('close', function() {
  console.log('[' + new Date().toLocaleString() + '] [Node-Contend ' + process.pid + '] close');
});

server.on('error', function(err) {
  console.log('[' + new Date().toLocaleString() + '] [Node-Contend ' + process.pid + '] err', err);
});

server.listen(port, function() {
  console.log('[' + new Date().toLocaleString() + '] [Node-Contend ' + process.pid + '] listen [port = ' + port + ']');
  process.send('success');
});
