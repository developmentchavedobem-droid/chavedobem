import {Resend} from 'resend';

const resend = new Resend(process.env.RESEND_KEY);

export class ResendService {
    private fromAddress = 'noreply@chavedobem.com';

    public async sendEmail(to: string, subject: string, body: string) {
        console.log('chegamos no resend')
        return await resend.emails.send({
            from: this.fromAddress,
            to: to,
            subject: subject,
            html: body
        })
    }
}
