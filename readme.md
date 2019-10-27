# API Server Simulator

Easily simulate requests and responses for a REST Api server as specified in an Excel file.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Installing

```sh
npm install
```

## Running the server

```js
const ExcelServer = require("api-server-sim");
const sim = new ExcelServer({file: 'file.xslx', port: 7001});

sim.run();
```

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags).

## Authors

* **Oscar Centeno** - *Initial work* - [oscarcenteno](https://github.com/oscarcenteno)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
