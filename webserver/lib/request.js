const FS = require('fs');
const URL = require('url');
const MIME = require('mime-types');

class Request {
	constructor(req, res) {
		const {
			query,
			pathname
		} = URL.parse(req.url, true);
		this.req = req;
		this.res = res;
		this.code = 200;
		this.content = null;
		this.extension = '.txt';
		this.path = pathname;
		this.query = query;
		this.type = req.method;
		this.isReady = false;
		this.readyHandlers = [];
		this.body = {};
		req.on('data', chunk => {
			this.body = URL.parse('/?' + chunk.toString(), true).query;
		});
		req.on('end', () => {
			this.isReady = true;
			this.callReadyHandlers();
		});
	}
	callReadyHandlers() {
		const {readyHandlers} = this;
		for (let i=0; i<readyHandlers.length; ++i) {
			const handler = readyHandlers[i];
			handler(this);
		}
		readyHandlers.length = 0;
		return this;
	}
	ready(handler) {
		const {isReady, readyHandlers} = this;
		if (isReady === false || readyHandlers.length) {
			readyHandlers.push(handler);
		} else {
			handler();
		}
		return this;
	}
	sendError(code, error) {
		this.code = code;
		if (error) {
			console.error(error);
		}
		return this;
	}
	sendFileAt(path) {
		path = path.trim();
		if (!FS.existsSync(path)) {
			return this.sendError(404);
		}
		if (FS.lstatSync(path).isDirectory()) {
			const last = path[path.length - 1];
			if (last !== '/' && path !== '\\') {
				path += '/index.html';
			} else {
				path += 'index.html';
			}
			if (!FS.existsSync(path)) {
				return this.sendError(404);
			}
		}
		try {
			const file = FS.readFileSync(path);
			this.extension = path;
			this.content = file;
		} catch (error) {
			this.sendError(500, error);
		}
		return this;
	}
	sendJSON(content) {
		try {
			const json = JSON.stringify(content);
			this.extension = '.json';
			this.content = json;
		} catch(error) {
			this.sendError(500, error);
		}
		return this;
	}
	end() {
		const {res, code, extension, content} = this;
		res.writeHead(code, { 'Content-Type': MIME.lookup(extension) });
		res.end(content);
		return this;
	}
}

module.exports = Request;