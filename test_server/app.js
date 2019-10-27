const { ExcelServer } = require('../index');

const sim = new ExcelServer({ file: './endpoints.xlsx', port: 3000 });

sim.run();
