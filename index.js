console.log('api server simulator 0.0.1');

class Server {
	constructor({ excelFile, port }) {
		console.log('excelFile: ' + excelFile);
		console.log('port: ' + port);
	}

	run() {
		console.log('Starting server');
	}
}

module.exports = Server;
