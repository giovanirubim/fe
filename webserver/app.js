const HTTP = require('http');
const FS = require('fs');
const Server = require('./lib/server.js');
const port = 80;

const server = new Server({ port, root: __dirname + '/web' });

server.start(() => {
	console.log(`Server started at port ${port} - ${new Date()}`);
});