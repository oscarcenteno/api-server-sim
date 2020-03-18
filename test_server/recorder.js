const { RecordingProxy } = require('../index');
const port = 3002;
const destinationFile = ['./recorded_scenarios.xlsx'];
const callBackUrl = ['http://localhost:3001'];
const simRelativeUrl = ['/wallets-sim'];

const recorder = new RecordingProxy({ port, destinationFile, callBackUrl, simRelativeUrl });

recorder.run();
