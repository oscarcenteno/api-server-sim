function getSmartEndPoints(file) {
  const rows = retrieveRowsFromFile(file);
  const EndPoints = require('./Endpoints');
  const endPoints = new EndPoints(rows).endPoints;
  const smartGetEndPoints = [];
  endPoints.forEach((endpoint) => {
    const found = smartGetEndPoints.find(
      (element) => element.method == endpoint.method && element.url == endpoint.url
    );
    if (found) {
      found.mappings.push({
        headers: endpoint.jsonHeaders,
        body: endpoint.jsonBody,
        query: endpoint.jsonQuery,
        status: endpoint.status,
        response: endpoint.jsonResponse
      });
    } else {
      const smartEndPoint = {
        method: endpoint.method,
        url: endpoint.url,
        mappings: [
          {
            headers: endpoint.jsonHeaders,
            body: endpoint.jsonBody,
            query: endpoint.jsonQuery,
            status: endpoint.status,
            response: endpoint.jsonResponse
          }
        ]
      };
      smartGetEndPoints.push(smartEndPoint);
    }
  });
  return smartGetEndPoints;
}

function retrieveRowsFromFile(relativeFile) {
  const path = require('path');
  const appDir = path.dirname(require.main.filename);
  const file = path.join(appDir, relativeFile);
  const rows = getRowsFromSheet(file);
  return rows;
}

function getRowsFromSheet(file) {
  const excelToJson = require('convert-excel-to-json');
  const jsonFile = excelToJson({
    sourceFile: file,
    header: {
      rows: 1
    },
    columnToKey: {
      '*': '{{columnHeader}}'
    }
  });

  // join all tabs in a single list
  let rows = [];
  let key, keys = Object.keys(jsonFile);
  let n = keys.length;
  while (n--) {
    key = keys[n];
    const newElements = jsonFile[key];
    rows = rows.concat(newElements);
  }

  return rows;
}

module.exports = getSmartEndPoints;