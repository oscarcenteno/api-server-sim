const api = require('./api');

describe('Emails', () => {
	it('can receive and record smtp emails', async () => {
		// given there are no sent emails
		await api.deleteEmails();

		// when we attempt to send an email
		await api.sendEmail();

		// then the server will have one email request
		freeze(1);
		const emails = await api.getEmails();
		expect(emails.length).toEqual(1);
	});
});

function freeze(seconds) {
	const miliseconds = seconds * 1000;
	const stop = new Date().getTime() + miliseconds;
	while (new Date().getTime() < stop);
}