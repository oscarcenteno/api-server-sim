const helloApi = require('../hello/get/api');
const actions = require('./actions');
const questions = require('./questions');

describe('One-time Simulations / Simulate responses on demand', () => {

	it('can get the list of one-time simulations', async () => {
		// given there were no on-time simulations
		await actions.deleteSimulations();

		// when an endpoint is configured to answer 500 to GET /hello
		await actions.simulateGetHelloReturns500();

		// then there will be one simulation
		const number = await questions.getSimulationsNumber();
		expect(number).toEqual(1);
	});

	it('can add a one-time simulation at runtime to match method and path', async () => {
		// given an endpoint was configured to answer 500 to GET /hello
		await actions.deleteSimulations();
		await actions.simulateGetHelloReturns500();

		try {
			// when GET /hello is invoked
			await helloApi.getHello();
			fail('Server should be down.');
		} catch (error) {
			// then status will be 500
			expect(error.response.status).toEqual(500);
		}
		finally {
			await actions.deleteSimulations();
		}
	});

	it('both method and path should match', async () => {
		// given an endpoint was configured to answer 500 to POST /hello
		await actions.deleteSimulations();
		await actions.simulatePostHelloReturns500();

		try {
			// when GET /hello is invoked
			await helloApi.getHello();
			// then no 500 error is thrown
		}
		finally {
			await actions.deleteSimulations();
		}
	});
	it('can add a one-time-simulation at runtime to get an status code', async () => {
		// given an endpoint was configured to answer 500 to GET /hello
		await actions.deleteSimulations();
		await actions.simulateGetHelloReturns500();

		try {
			// when GET /hello is invoked
			await helloApi.getHello();
			fail('Server should be down.');
		} catch (error) {
			// then status will be the expected one
			expect(error.response.status).toEqual(500);
		}
		finally {
			await actions.deleteSimulations();
		}
	});

	it('can add a one-time-simulation at runtime to get a response', async () => {
		// given an endpoint was configured to answer 500 to GET /hello
		await actions.deleteSimulations();
		await actions.simulateGetHelloReturns500();

		try {
			// when GET /hello is invoked
			await helloApi.getHello();
			fail('Server should be down.');
		} catch (error) {
			// then response body will be the expected one
			const expected = { message: 'server is down!' };
			expect(error.response.data).toEqual(expected);
		}
		finally {
			await actions.deleteSimulations();
		}
	});

	it('a one-time-simulation works only one time', async () => {
		// given an endpoint was configured to answer 500 to GET /hello
		await actions.deleteSimulations();
		await actions.simulateGetHelloReturns500();

		// when the simulation is performed
		try {
			await helloApi.getHello();
			fail('Server should be down.');
		}
		catch (error) { error.response.data; }
		finally {
			await actions.deleteSimulations();
		}

		// then subsequent calls will be successful
		const hello = await helloApi.getHello();
		expect(hello.message).toEqual('Hello World!');
	});
});
