import nodemailer from 'nodemailer'
class MailService {
    transporter;
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            // port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            }
        })
    }
    async sendMail(to: string, text: string) {
        console.log(process.env.SMTP_PORT)
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: "Код активации аккаунта на Neiron",
            text: text.toString()
        })
    }
}

export default MailService