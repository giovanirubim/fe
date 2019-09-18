const HTTP = require('http');
const FS = require('fs');

const Server = require('./server.js');

const port = 80;

const server = new Server();
server.post('/aluno/get', req => {
	const obj = req.req;
	for (let attr in obj) {
		console.log(attr);
	}
});

server.start(port, () => {
	console.log(`Server started at port ${port} - ${new Date()}`);
});