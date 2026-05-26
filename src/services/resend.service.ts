import { Resend } from "resend";

export class ResendService {
  private fromAddress = "noreply@chavedobem.com";
  private resend?: Resend;

  private getClient() {
    if (this.resend) return this.resend;

    const apiKey = process.env.RESEND_KEY || process.env.RESEND_API_KEY;

    if (!apiKey) {
      throw new Error("RESEND_KEY ou RESEND_API_KEY nao configurada.");
    }

    this.resend = new Resend(apiKey);
    return this.resend;
  }

  public async sendEmail(to: string, subject: string, body: string) {
    return this.getClient().emails.send({
      from: this.fromAddress,
      to,
      subject,
      html: body,
    });
  }
}
