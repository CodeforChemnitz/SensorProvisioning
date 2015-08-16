'use strict';
const app = require('app');
const BrowserWindow = require('browser-window');
const request = require('request');


// report crashes to the Electron project
require('crash-reporter').start();

// adds debug features like hotkeys for triggering dev tools and reload
require('electron-debug')();

function createMainWindow () {
	const win = new BrowserWindow({
		width: 600,
		height: 400,
		resizable: true
	});

	win.loadUrl(`file://${__dirname}/index.html`);
	win.on('closed', onClosed);

	// var url = 'http://heise.de';
	// request(url, function(err, response, body) {
	// 	if (err) {
	// 		console.log("error", err); return;
	// 	}
	// 	console.log("response", response);
	// 	//console.log("body", body);
	//
	// });

	return win;
}

function onClosed() {
	// deref the window
	// for multiple windows store them in an array
	mainWindow = null;
}

// prevent window being GC'd
let mainWindow;

app.on('window-all-closed', function () {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate-with-no-open-windows', function () {
	if (!mainWindow) {
		mainWindow = createMainWindow();
	}
});

app.on('ready', function () {
	mainWindow = createMainWindow();
});


// In main process.
var ipc = require('ipc');
ipc.on('asynchronous-message', function(event, arg) {
  console.log(arg);  // prints "ping"
  event.sender.send('asynchronous-reply', 'pong');
});

ipc.on('synchronous-message', function(event, arg) {
  console.log(arg);  // prints "ping"
  event.returnValue = 'pong';
});
