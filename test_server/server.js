const { ExcelServer } = require('../index');
const files = ['./simulator_requirements.xlsx', './openapi_validations.xlsx'];
const port = 3001;
const apiSpec = 'test_server/v1/openapi.yaml';
const sim = new ExcelServer({ files, port }, apiSpec);

sim.run();
