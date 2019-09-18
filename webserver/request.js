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
	}

	sendError(code, error) {
		this.code = code;
		return this;
	}

	sendFileAt(path) {
		console.log('loading ' + path);
		const {res} = this;
		if (!FS.existsSync(path)) {
			return this.sendError(404);
		}
		try {
			const file = FS.readFileSync(path);
			this.extension = path;
			this.content = file;
		} catch (error) {
			res.sendError(500, error);
		}
		return this;
	}

	sendJSON(content) {
		const {res} = this;
		try {
			const json = JSON.stringify(content);
			this.extension = '.json';
			this.content = json;
		} catch(error) {
			sendError(500, error);
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