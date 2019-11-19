const Parser = require('./EndPointsParser');

/**
 * @param {{ forEach: (arg0: (file: String) => void) => void; }} files
 */
function getSmartEndPoints(files) {
  const smartGetEndPoints = [];
  const path = require('path');
  const appDir = path.dirname(require.main.filename);

  let endPoints = [];
  files.forEach(file => {
    const currentEndpoints = new Parser({ appDir, file }).getList();
    endPoints = endPoints.concat(currentEndpoints);
  });

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


module.exports = getSmartEndPoints;