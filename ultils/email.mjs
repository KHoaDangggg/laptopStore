import nodemailer from 'nodemailer';
import pug from 'pug';
import { convert } from 'html-to-text';
import * as url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

class Email {
    constructor(user, url) {
        this.to = user.email;
        this.firstName = user.name.split(' ')[0];
        this.url = url;
        this.from = `dangphuckhoa2003@gmail.com`;
    }

    newTransport() {
        return nodemailer.createTransport({
            service: 'SendGrid',
            auth: {
                user: 'apikey',
                pass: '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',
            },
        });
    }

    async send(template, subject) {
        const html = pug.renderFile(
            `${__dirname}/../views/email/${template}.pug`,
            {
                firstName: this.firstName,
                url: this.url,
                subject,
            }
        );
        const emailOption = {
            from: this.from,
            to: this.to,
            subject,
            html,
            text: convert(html),
        };
        await this.newTransport().sendMail(emailOption, (error, info) => {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    }

    async sendWelcome() {
        await this.send('welcome', 'Welcome to Natours');
    }

    async sendPasswordReset() {
        await this.send(
            'passwordReset',
            'Your password reset token (Only valid for 10 minutes)'
        );
    }
}

export default Email;
