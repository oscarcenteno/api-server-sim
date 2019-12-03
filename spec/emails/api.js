const { default: axios } = require('axios');

class Api {
	async sendEmail() {
		const nodemailer = require('nodemailer');
		let transporter = nodemailer.createTransport({
			host: '127.0.0.1',
			port: 1025,
			secure: false, // true for 465, false for other ports

			tls: {
				rejectUnauthorized: false
			}
		});

		// send mail with defined transport object
		const info = await transporter.sendMail({
			from: '"Fred Foo 👻" <foo@example.com>', // sender address
			to: 'bar@example.com, baz@example.com', // list of receivers
			subject: 'Hello ✔', // Subject line
			text: 'Hello world! 👻', // plain text body
			html: '<b>Hello world! 👻</b>' // html body
		});

		// eslint-disable-next-line no-console
		console.log('Message sent: %s', info.messageId);
		// Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

		// Preview only available when sending through an Ethereal account
		// eslint-disable-next-line no-console
		console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
		// Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

		return info;
	}

	async getEmails() {
		const apiUrl = 'http://localhost:3001/emails';
		const response = await axios.get(apiUrl);
		return response.data;
	}

	async deleteEmails() {
		const apiUrl = 'http://localhost:3001/emails';
		const response = await axios.delete(apiUrl);
		return response.data;
	}
}

module.exports = new Api();
