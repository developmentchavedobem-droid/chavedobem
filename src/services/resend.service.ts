import {Resend} from 'resend';

const resend = new Resend(process.env.RESEND_KEY);

export class ResendService {
    private fromAddress = 'contato.chavedobem@noreply.com';

    public sendEmail(to: string, subject: string, body: string) {
        resend.emails.send({
            from: this.fromAddress,
            to: to,
            subject: subject,
            html: body
        })
    }
}
