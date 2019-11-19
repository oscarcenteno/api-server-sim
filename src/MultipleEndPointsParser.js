const EndPointsParser = require('./EndPointsParser');

class MultipleEndPointsParser {
    constructor({ appDir, files }) {
        this.endPoints = [];
        files.forEach(file => {
            const currentEndpoints = new EndPointsParser({ appDir, file }).getList();
            this.endPoints = this.endPoints.concat(currentEndpoints);
        });
    }

    getList() {
        return this.endPoints;
    }
}

module.exports = MultipleEndPointsParser;
