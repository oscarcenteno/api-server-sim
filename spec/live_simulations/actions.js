const api = require('./api');

class Actions {
    async simulateGetHelloReturns500() {
        const data = {
            method: 'get',
            path: '/hello',
            status: 500,
            response: { message: 'server is down!' }
        };
        await api.createSimulation(data);
    }

    async simulatePostHelloReturns500() {
        const data = {
            method: 'post',
            path: '/hello',
            status: 500,
            response: {}
        };
        await api.createSimulation(data);
    }

    async deleteSimulations() {
        await api.deleteSimulations();
    }
}

module.exports = new Actions();