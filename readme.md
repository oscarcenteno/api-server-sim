# API Server Simulator

Easily simulate requests and responses for a REST Api server as specified in an Excel file.

## How to use the library

Next code will use the library and start an API server as specified in a list of Excel files located in your NodeJS project.

```js
const ExcelServer = require("api-server-sim");
const sim = new ExcelServer({files: ['./endpoints.xslx'], port: 3000});
sim.run();
```

Find a sample Excel in the test_server folder.

## Running and testing a sample server

Install the required libraries.

```sh
npm install
```

### Running the sample server

Use the test_server/endpoints.xlsx as a reference to simulate GET, POST or PUT requests, and specify specific Urls and Query params. Responses can be specified with status and body.

```sh
npm run start
```

### Running tests for sample server

After running the sample server provided in this library, run the sample Jasmine tests.

```sh
npm test
```

## Authors

* **Oscar Centeno** - *Initial work* - [oscarcenteno](https://github.com/oscarcenteno)

## License

This project is licensed under the MIT License - see the [license.txt](license.txt) file for details.

## Contributing

Feel free to report suggestions and issues! Thanks.

## Also

* Contract testing
  * Validate simulation scenarios against a swagger file
* Make your test automation aware of external dependencies:
  * Spy on calls made
  * SMTP Server and emails verification endpoints
