# API Server Simulator

This Simulator allows for a Test Automation System to control and observe the universe of a Backend system that depends upon external API services. The two main features are:

1. Simulate requests and responses for a REST Api server as specified in an Excel file.
2. Spy on API calls and emails being sent by your backend.

## How to use

First, install the library:

Install the required libraries.

```sh
npm install api-server-sim
```

Then, create a JS file containing the next code, named sim.js for example. Here we will configure and start an API server as specified in a list of Excel files located in your NodeJS project.

```js
const ExcelServer = require("api-server-sim");

// Parameters
const files = ['./endpoints.xlsx'];
const port = 3000;
const validations = {
    apiSpec: undefined,
    validateRequests: false,
    validateResponses: false
};
// start the server without validating open api spec
const sim = new ExcelServer({ files, port }, validations);
sim.run();
```

The endpoints.xlsx file contains the REST API endpoints to run. For example, the Excel can contain a table such as the next one as a "GET Hello World" endpoint:

| scenario| method | url | headers| body | query | status | response |
| ------- | ------ | ----| ------ | ---- | ----- | ------ | -------- |
|Hello World | get | /hello | | | | 200 | { "message": "Hello World" }- |

The headers, body, query and response columns must be valid json objects or paths to a valid json file.

Finally, execute the sim.js file, by running node:

```sh
node sim.js
```

... or creating a script in your package.json and running with NPM:

```sh
npm run sim
```

## For Developers: Running the acceptance tests

### 1. Download this code repository and install the required libraries.

```sh
npm install
```

### 2. Run the server

```sh
npm run start
```

### 3. Run the acceptance tests

After running the sample server provided in this library, run the sample Jasmine tests. Every test should pass.

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
  * Validate simulation scenarios (requests and responses) against a swagger file
* Make your test automation aware of external dependencies:
  * Spy on calls made
  * Spy on emails sent
* Videos with advice on designing a testable backend system and how the Simulator can