const { ExcelServer } = require('../index');

const sim = new ExcelServer({ file: './test_server.xlsx', port: 3001 }, 'test_server/v1/openapi.yaml');

sim.run();
