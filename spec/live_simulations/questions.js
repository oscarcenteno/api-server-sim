const api = require('./api');

class Questions {
    async getSimulationsNumber() {
        const response = await api.getSimulations();
        return response.data.length;
    }
}

module.exports = new Questions();