const HTTP = require('http');

const Request = require('./request.js');

const getHandlerKey = (method, path) => {
	return `${ method.toUpperCase() }:${ path }`;
};

class Server {
	constructor() {
		this.handlers = {};
		return this;
	}
	get(path, handler) {
		const {handlers} = this;
		const key = getHandlerKey('GET', path);
		handlers[key] = handler;
		return this;
	}
	post(path, handler) {
		const {handlers} = this;
		const key = getHandlerKey('POST', path);
		handlers[key] = handler;
		return this;
	}
	start(port, callback) {
		const {handlers} = this;
		const app = HTTP.createServer((req, res) => {
			const request = new Request(req, res);
			const {type, path} = request;
			const handler = handlers[getHandlerKey(type, path)];
			if (handler !== undefined) {
				try {
					handler(request);
				} catch (error) {
					request.sendError(500);
				}
			} else {
				request.sendFileAt(path==='/'?'./web/index.html':'./web'+path);
			}
			request.end();
		});
		app.listen(port, callback);
		return this;
	}
}

module.exports = Server;