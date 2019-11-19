const MultipleEndPointsParser = require('./MultipleEndPointsParser');

/**
 * @param {{ forEach: (arg0: (file: String) => void) => void; }} files
 */
function getSmartEndPoints(files) {
  const smartGetEndPoints = [];
  const path = require('path');
  const appDir = path.dirname(require.main.filename);

  const endPoints = new MultipleEndPointsParser({ appDir, files }).getList();

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