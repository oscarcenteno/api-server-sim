const api = require('./api');

describe('Emails', () => {
	it('can receive and record smtp emails', async () => {
		// given there are no sent emails
		await api.deleteEmails();
		await api.sendEmail();
		const emails = await api.getEmails();
		expect(emails.length).toEqual(1);
	});
});
