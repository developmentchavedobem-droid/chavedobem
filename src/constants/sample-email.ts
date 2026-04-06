export function forgotPasswordTemplate(code: string) {
  return `
  <div style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 40px;">
    <div style="max-width: 500px; margin: auto; background: #ffffff; border-radius: 12px; padding: 30px; text-align: center;">
      
      <h1 style="color: #111; margin-bottom: 10px;">🔐 Recuperação de senha</h1>
      <p style="color: #555; font-size: 16px;">
        Você solicitou a redefinição de senha no <strong>Chave do Bem</strong>.
      </p>

      <p style="color: #555; margin-top: 20px;">
        Use o código abaixo para continuar:
      </p>

      <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; margin: 25px 0; color: #16a34a;">
        ${code}
      </div>

      <p style="color: #777; font-size: 14px;">
        Esse código expira em alguns minutos.
      </p>

      <p style="color: #999; font-size: 13px; margin-top: 30px;">
        Se você não solicitou isso, pode ignorar este e-mail.
      </p>

    </div>

    <p style="text-align: center; font-size: 12px; color: #aaa; margin-top: 20px;">
      © ${new Date().getFullYear()} Chave do Bem
    </p>
  </div>
  `;
}

export function confirmEmailTemplate(link: string) {
  return `
  <div style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 40px;">
    <div style="max-width: 500px; margin: auto; background: #ffffff; border-radius: 12px; padding: 30px; text-align: center;">
      
      <h1 style="color: #111; margin-bottom: 10px;">🎉 Bem-vindo!</h1>
      <p style="color: #555; font-size: 16px;">
        Obrigado por se cadastrar no <strong>Chave do Bem</strong>.
      </p>

      <p style="color: #555; margin-top: 20px;">
        Para ativar sua conta, confirme seu e-mail clicando no botão abaixo:
      </p>

      <a href="${link}" 
         style="
            display: inline-block;
            margin-top: 25px;
            padding: 12px 24px;
            background-color: #16a34a;
            color: #fff;
            text-decoration: none;
            border-radius: 8px;
            font-weight: bold;
         ">
         Confirmar e-mail
      </a>

      <p style="color: #777; font-size: 14px; margin-top: 20px;">
        Ou copie e cole este link no seu navegador:
      </p>

      <p style="word-break: break-all; color: #16a34a; font-size: 13px;">
        ${link}
      </p>

      <p style="color: #999; font-size: 13px; margin-top: 30px;">
        Se você não criou essa conta, pode ignorar este e-mail.
      </p>

    </div>

    <p style="text-align: center; font-size: 12px; color: #aaa; margin-top: 20px;">
      © ${new Date().getFullYear()} Chave do Bem
    </p>
  </div>
  `;
}