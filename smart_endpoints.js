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
  var path = require('path');
  var appDir = path.dirname(require.main.filename);
  const file = path.join(appDir, relativeFile);
  const rows = getRowsFromSheet({ file, sheet: 'Sheet1' });
  return rows;
}

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

module.exports = getSmartEndPoints;