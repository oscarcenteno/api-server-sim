console.log('api server simulator 0.0.1');

class ExcelServer {
	constructor({ file, port }) {
    console.log('file: ' + file);
		console.log('port: ' + port);
	}

	run() {
		console.log('Starting server');
	}
}

module.exports = { ExcelServer };
