const HTTP = require('http');
const Request = require('./request.js');

// Gera uma chave que identifica uma rota no mapa de rotas
const getHandlerKey = (type, path) => {
	return `${ type.toUpperCase() }:${ path }`;
};

// Classe que manipula um servidor HTTP
class Server {
	constructor(config) {

		// Caminho onde serão buscados os arquivos
		this.root = '.';

		// Porta padrão
		this.port = 80;

		// Inicializa porta e/ou raiz com objeto de configurações
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

		// Mapa de rotas
		this.routMap = {};
		return this;
	}

	// Adiciona uma rota GET
	get(path, handler) {
		const {routMap} = this;
		const key = getHandlerKey('GET', path);
		routMap[key] = handler;
		return this;
	}

	// Adiciona uma rota POST
	post(path, handler) {
		const {routMap} = this;
		const key = getHandlerKey('POST', path);
		routMap[key] = handler;
		return this;
	}

	// Inicia o servidor
	start(callback) {
		const {root, port, routMap} = this;
		const app = HTTP.createServer((req, res) => {
			const request = new Request(req, res);
			const {type, path} = request;

			// Busca um handler no mapa de rotas
			const handler = routMap[getHandlerKey(type, path)];
			if (handler !== undefined) {
				request.ready(() => {
					try {
						handler(request);
					} catch (error) {
						// Se houver erro de execução define código de erro 500
						request.sendError(500, error);
					}
				});
			} else {
				// Caso não exista rota para este caminho e método de request, trata a rota como uma
				// requisição por leitura de arquivo na raiz do servidor
				request.sendFileAt(root + path);
			}
			// Finaliza a conexão
			request.ready(() => request.end());
		});
		app.listen(port, callback);
		return this;
	}
}

module.exports = Server;