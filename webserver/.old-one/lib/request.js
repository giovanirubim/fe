const FS = require('fs');
const URL = require('url');
const MIME = require('mime-types');

const TEXT_MIME = MIME.lookup('.txt');
const JSON_MIME = MIME.lookup('.json');

// Classe utilizada para implementar funções que manipulam uma requisição HTTP
class Request {
	constructor(req, res) {

		// Separa e query e o caminho da URL
		const {
			query,
			pathname
		} = URL.parse(req.url, true);

		this.req = req;
		this.res = res;

		// Código padrão é OK
		this.code = 200;

		this.content = null;

		// Extensão padrão é formato texto
		this.contentType = TEXT_MIME;

		this.path = pathname;
		this.query = query;
		this.type = req.method;

		// Flag que indica que o objeto Request está pronto
		this.isReady = false;
		
		// Fila de funções aguardando o objeto estar pronto
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

	// Executa todos os handlers 'ready'
	callReadyHandlers() {
		const {readyHandlers} = this;
		for (let i=0; i<readyHandlers.length; ++i) {
			const handler = readyHandlers[i];
			handler(this);
		}
		readyHandlers.length = 0;
		return this;
	}

	// Executa a função handler quando o objeto estiver pronto
	ready(handler) {
		const {isReady, readyHandlers} = this;
		if (isReady === false || readyHandlers.length) {
			readyHandlers.push(handler);
		} else {
			handler();
		}
		return this;
	}

	// Define um código e mensagem de erro para a resposta
	sendError(code, error) {
		this.code = code;
		this.content = null;
		if (error) {
			console.error(error);
		}
		return this;
	}

	// Carrega um arquivo para a resposta do servidor
	// Caso o caminho aponte a um diretório será considerado o caminho para um arquivo index.html
	// dentro deste diretório.
	// Caso não exista um arquivo neste caminho será definido o código de erro 404.
	// Caso haja erro ao abrir o arquivo será definido o código de erro 500.
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
			this.contentType = MIME.lookup(path);
			this.content = file;
		} catch (error) {
			this.sendError(500, error);
		}
		return this;
	}

	// Converte um conteúdo num JSON e define como resposta da requisição.
	// Caso haja erro na conversão será definido o código de erro 500.
	sendJSON(content) {
		try {
			const json = JSON.stringify(content);
			this.contentType = JSON_MIME;
			this.content = json;
		} catch(error) {
			this.sendError(500, error);
		}
		return this;
	}

	// Finaliza a conexão, enviando o conteúdo e código de erro que foram definidos previamente
	end() {
		const {res, code, contentType, content} = this;
		res.writeHead(code, { 'Content-Type': contentType });
		res.end(content);
		return this;
	}
}

module.exports = Request;