const express = require('express');
const _ = require('underscore');
const EndPoints = require('./Endpoints');

// configure app
const app = express();
const port = 3000;
// 	disable cache and 304 Not Modified Response Codes
app.disable('etag');
// to be able to parse the body of a request
app.use(express.json())

const path = require('path');
const file = path.join(__dirname, 'endpoints.xlsx');
const rows = getRowsFromSheet({ file, sheet: 'Sheet1' });

const endPoints = new EndPoints(rows).endPoints;

const smartGetEndPoints = [];

endPoints.forEach((endpoint) => {
  const found = smartGetEndPoints.find((element) => element.method == endpoint.method && element.url == endpoint.url);

  if (found) {
    found.mappings.push({
      body: endpoint.jsonBody,
      query: endpoint.jsonQuery,
      response: endpoint.jsonResponse
    });
  } else {
    const smartEndPoint = {
      method: endpoint.method,
      url: endpoint.url,
      mappings: [
        {
          body: endpoint.jsonBody,
          query: endpoint.jsonQuery,
          response: endpoint.jsonResponse
        }
      ]
    };
    smartGetEndPoints.push(smartEndPoint);
  }
});

const createEndpoint = (element) => {

  switch (element.method) {
    case "get":
      app.get(element.url, (req, res) => {
        res.setHeader('Content-Type', 'application/json');

        const mappings = element.mappings;
        const found = mappings.find((element) => _.isEqual(element.query, req.query));

        if (found) {
          res.json(found.response);
        } else {
          res.status(404).send({ 'message': 'Query params were not matched.' });
        }
      });
      break;
    case "post":
      app.post(element.url, (req, res) => {
        res.setHeader('Content-Type', 'application/json');

        const mappings = element.mappings;
        const found = mappings.find((element) => _.isEqual(element.body, req.body));

        if (found) {
          res.json(found.response);
        } else {
          res.status(404).send({ 'message': 'Body was not matched.' });
        }


        res.json({});
      });
      break;

    case "put":
      app.put(element.url, (req, res) => {
        res.setHeader('Content-Type', 'application/json');

        const mappings = element.mappings;
        const found = mappings.find((element) => _.isEqual(element.body, req.body));

        if (found) {
          res.json(found.response);
        } else {
          res.status(404).send({ 'message': 'Body was not matched.' });
        }


        res.json({});
      });
      break;
    default:
      break;
  }


};

smartGetEndPoints.forEach(createEndpoint);

/*
app.get('', function (req, res) {
  res.send(req.params)
})
app.get('/entitlements', function (req, res) {
  res.status(200).send(['a', 'b', 'c'])
})
*/

app.listen(port, () => console.log(`Listening on port ${port}!`));



function getRowsFromSheet({ file, sheet }) {
  const excelToJson = require('convert-excel-to-json');
  const result = excelToJson({
    sourceFile: file,
    header: {
      rows: 1
    },
    columnToKey: {
      '*': '{{columnHeader}}'
    }
  });

  return result[sheet];
}