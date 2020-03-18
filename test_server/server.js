const { ExcelServer } = require('../index');

const files = ['./simulator_requirements.xlsx', './openapi_validations.xlsx'];
const port = 3001;
const validations = {
    apiSpec: 'test_server/v1/openapi.yaml',
    validateRequests: true,
    validateResponses: true
};
const sim = new ExcelServer({ files, port }, validations);

sim.run();
