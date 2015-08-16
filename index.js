'use strict';

// https://github.com/atom/electron/blob/master/docs/api/browser-window.md#webcontentssendchannel-args
// https://github.com/atom/electron/tree/master/docs/tutorial

// In renderer process (web page).
var ipc = require('ipc');
console.log(ipc.sendSync('synchronous-message', 'ping')); // prints "pong"

ipc.on('asynchronous-reply', function(arg) {
  console.log(arg); // prints "pong"
});
ipc.send('asynchronous-message', 'ping');

console.log('msg',$('#message'));
$('#message').on('keyup', function() {
  let message = $(this).val();
  console.log(this, message);
  ipc.send('asynchronous-message', message);
});
