const HTTP = require('http');
const Request = require('./request.js');

const getHandlerKey = (method, path) => {
	return `${ method.toUpperCase() }:${ path }`;
};

class Server {
	constructor(config) {
		this.root = '.';
		this.port = 80;
		if (arguments.length !== 0) {
			if ('port' in config) {
				this.port = config.port;
			}
			if ('root' in config) {
				let root = config.root.trim();
				const {length} = root;
				const last = root[length - 1];
				if (last === '/' || last === '\\') {
					root = root.substr(0, length - 1);
				}
				this.root = root;
			}
		}
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
	start(callback) {
		const {root, port, handlers} = this;
		const app = HTTP.createServer((req, res) => {
			const request = new Request(req, res);
			const {type, path} = request;
			const handler = handlers[getHandlerKey(type, path)];
			if (handler !== undefined) {
				request.ready(() => {
					try {
						handler(request);
					} catch (error) {
						request.sendError(500, error);
					}
				});
			} else {
				request.sendFileAt(root + path);
			}
			request.ready(() => request.end());
		});
		app.listen(port, callback);
		return this;
	}
}

module.exports = Server;