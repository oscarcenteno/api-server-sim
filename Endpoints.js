
class Endpoints {
  constructor(rows) {
    this.endPoints = rows.map((element) => {
      let query;
      if (element.query) {
        try {
          query = JSON.parse(element.query);
        } catch (error) {
          query = require(element.query);
        }
      }

      let body;
      if (element.body) {
        try {
          body = JSON.parse(element.body);
        } catch (error) {
          body = require(element.body);
        }
      }

      let response;
      if (element.response) {
        try {
          response = JSON.parse(element.response);
        } catch (error) {
          response = require(element.response);
        }
      }

      const allowedMethods = ["get", "post", "put"];
      const currentMethod = element.method.toLowerCase();
      if (allowedMethods.includes(currentMethod)) {
        return {
          method: currentMethod,
          url: element.url,
          jsonBody: body,
          jsonQuery: query,
          jsonResponse: response
        };
      }
      else {
        console.log(`Method ${currentMethod} is not allowed for ${element.url}`);
      }

    });
  }
}

module.exports = Endpoints;

