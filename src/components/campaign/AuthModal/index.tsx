'use client'

import { useState } from "react";
import { IoClose, IoArrowBack, IoMailUnread, IoLockOpen } from "react-icons/io5";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  registerAction, 
  customerLoginAction, 
  resendVerificationEmailAction,
  forgotPasswordAction,
  resetPasswordAction
} from "@/src/actions/auth";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaignSlug: string;
}

type ModalStep = 'selection' | 'login' | 'register' | 'forgot' | 'resend' | 'reset_password';

export default function AuthModal({ isOpen, onClose, campaignSlug }: AuthModalProps) {
  const router = useRouter();
  const [step, setStep] = useState<ModalStep>('selection');
  const [isLoading, setIsLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [pendingEmail, setPendingEmail] = useState('');
  const [resetEmail, setResetEmail] = useState('');

  if (!isOpen) return null;

  const backToSelection = () => {
    setMsg({ type: '', text: '' });
    setStep('selection');
  };

  // 1. Lógica de Login
  async function handleLogin(formData: FormData) {
    setIsLoading(true);
    setMsg({ type: '', text: '' });
    const email = formData.get("email") as string;

    const result = await customerLoginAction(formData);

    if (result?.error) {
      setMsg({ type: 'error', text: result.error });
      setIsLoading(false);
      // Se o erro indicar falta de confirmação, move para o step de reenvio
      if (result.error.includes("confirmado")) {
        setPendingEmail(email);
        setTimeout(() => setStep('resend'), 1500);
      }
    } else {
      setMsg({ type: 'success', text: "Acesso autorizado! Redirecionando..." });
      router.refresh();
      setTimeout(() => onClose(), 1500);
    }
  }

  // 2. Lógica de Cadastro
  async function handleRegister(formData: FormData) {
    setIsLoading(true);
    setMsg({ type: '', text: '' });
    const result = await registerAction(formData);

    if (result?.error) {
      setMsg({ type: 'error', text: result.error });
      setIsLoading(false);
    } else {
      setMsg({ type: 'success', text: "Conta criada! Verifique seu e-mail para ativar." });
      setTimeout(() => {
        setStep('login');
        setIsLoading(false);
      }, 3000);
    }
  }

  // 3. Lógica de Reenvio de E-mail de Ativação
  async function handleResendEmail() {
    setIsLoading(true);
    const result = await resendVerificationEmailAction(pendingEmail);
    if (result.success) {
      setMsg({ type: 'success', text: "Novo link enviado! Verifique seu e-mail." });
      setTimeout(() => setStep('login'), 2500);
    } else {
      setMsg({ type: 'error', text: result.error || "Erro ao reenviar." });
    }
    setIsLoading(false);
  }

  // 4. Lógica para Solicitar Recuperação de Senha
  async function handleRequestReset(formData: FormData) {
    setIsLoading(true);
    setMsg({ type: '', text: '' });
    const email = formData.get("email") as string;
    const result: any = await forgotPasswordAction(formData);
    
    if (result.success) {
      setResetEmail(email);
      setMsg({ type: 'success', text: "Código enviado ao seu e-mail!" });
      setTimeout(() => setStep('reset_password'), 1500);
    } else {
      setMsg({ type: 'error', text: result.error || "Erro ao processar." });
    }
    setIsLoading(false);
  }

  // 5. Lógica para Definir Nova Senha com OTP
  async function handleResetSubmit(formData: FormData) {
    setIsLoading(true);
    formData.append("email", resetEmail);
    
    const result: any = await resetPasswordAction(formData);

    if (result.success) {
      setMsg({ type: 'success', text: "Senha alterada com sucesso! Faça login." });
      setTimeout(() => setStep('login'), 2000);
    } else {
      setMsg({ type: 'error', text: result.error || "Código inválido ou expirado." });
    }
    setIsLoading(false);
  }

  return (
    <div className="fixed inset-0 z-300 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#053B80]/60 backdrop-blur-md" onClick={onClose} />

      <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        
        {/* Header Navigation */}
        <div className="p-6 flex items-center justify-between border-b border-zinc-50 shrink-0">
          {step !== 'selection' ? (
            <button onClick={backToSelection} className="text-[#053B80] flex items-center gap-1 font-black text-xs uppercase tracking-widest hover:opacity-70 transition-opacity">
              <IoArrowBack size={18} /> Voltar
            </button>
          ) : <div />}
          <button onClick={onClose} className="text-zinc-300 hover:text-red-500 transition-colors">
            <IoClose size={32} />
          </button>
        </div>

        <div className="p-8 pt-4 overflow-y-auto custom-scrollbar">
          {/* Alertas de Mensagem */}
          {msg.text && (
            <div className={`mb-6 p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center ${
              msg.type === 'error' ? 'bg-red-50 text-red-500 border border-red-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
            }`}>
              {msg.text}
            </div>
          )}

          {/* Passo: Seleção Inicial */}
          {step === 'selection' && (
            <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 text-center">
              <p className="text-2xl font-black text-[#053B80] mb-8 uppercase italic tracking-tighter leading-tight">
                Você está a um passo<br/>do seu prêmio!
              </p>
              <div className="w-full space-y-4">
                <button onClick={() => setStep('login')} className="w-full bg-[#1F8C6D] hover:bg-[#16664f] text-white font-black py-5 rounded-2xl shadow-lg transition-all active:scale-95 uppercase text-lg">
                  ACESSAR MINHA CONTA
                </button>
                <button onClick={() => setStep('register')} className="w-full bg-[#053B80] hover:bg-sky-900 text-white font-black py-5 rounded-2xl shadow-lg transition-all active:scale-95 uppercase text-lg">
                  CRIAR NOVA CONTA
                </button>
                <button onClick={() => setStep('forgot')} className="w-full bg-transparent border-2 border-zinc-100 text-zinc-400 font-black py-4 rounded-2xl uppercase text-[10px] tracking-widest mt-4 hover:border-zinc-200">
                  ESQUECI MINHA SENHA
                </button>
              </div>
            </div>
          )}

          {/* Passo: Login */}
          {step === 'login' && (
            <form action={handleLogin} className="space-y-4 animate-in fade-in slide-in-from-right-4">
              <div className="text-center mb-6">
                <h3 className="text-xl font-black text-[#053B80] uppercase tracking-tighter italic">Entrar</h3>
                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Exclusivo para doadores</p>
              </div>
              <Input label="Seu E-mail" name="email" type="email" placeholder="email@exemplo.com" required />
              <Input label="Sua Senha" name="password" type="password" placeholder="********" required />
              <button type="submit" disabled={isLoading} className="w-full bg-[#1F8C6D] text-white font-black py-5 rounded-2xl shadow-lg uppercase mt-4 active:scale-95 transition-all disabled:opacity-50">
                {isLoading ? "Autenticando..." : "ACESSAR AGORA"}
              </button>
            </form>
          )}

          {/* Passo: Cadastro */}
          {step === 'register' && (
            <form action={handleRegister} className="space-y-4 animate-in fade-in slide-in-from-right-4">
              <div className="text-center mb-6">
                <h3 className="text-xl font-black text-[#053B80] uppercase tracking-tighter italic">Cadastro Grátis</h3>
                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Preencha para resgatar seu cupom</p>
              </div>
              <Input label="Nome Completo" name="name" required />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="CPF ou CNPJ" name="register_number" required />
                <Input label="WhatsApp" name="phone_number" placeholder="(00) 00000-0000" required />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Nascimento" name="birthdate" type="date" required />
                <Input label="Senha de Acesso" name="password" type="password" required />
              </div>
              <Input label="Melhor E-mail" name="email" type="email" required />
              <div className="flex gap-3 bg-zinc-50 p-4 rounded-2xl border border-zinc-100 mt-2">
                <input type="checkbox" className="checkbox checkbox-primary checkbox-sm mt-0.5" required />
                <p className="text-[10px] text-gray-500 leading-tight italic font-medium">
                  Confirmo ter +18 anos. Aceito os{" "}
                  <Link href="/termos-uso" className="font-bold text-[#053B80] underline">
                    Termos de Uso
                  </Link>{" "}
                  e a{" "}
                  <Link href="/politica-privacidade" className="font-bold text-[#053B80] underline">
                    Politica de Privacidade
                  </Link>{" "}
                  do Projeto Chave do Bem e concordo em ser contactado em tempo
                  real durante a transmissao.
                </p>
              </div>
              <button type="submit" disabled={isLoading} className="w-full bg-[#053B80] text-white font-black py-5 rounded-2xl shadow-lg uppercase mt-2 active:scale-95 transition-all disabled:opacity-50">
                {isLoading ? "Processando..." : "CRIAR MINHA CONTA"}
              </button>
            </form>
          )}

          {/* Passo: Reenvio de E-mail de Confirmação */}
          {step === 'resend' && (
            <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 text-center">
              <div className="w-20 h-20 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mb-6">
                <IoMailUnread size={40} />
              </div>
              <h3 className="text-xl font-black text-[#053B80] uppercase italic tracking-tighter">Ative sua conta</h3>
              <p className="text-sm text-gray-500 mt-4 leading-relaxed">Enviaremos um novo link de ativação para <b>{pendingEmail}</b>.</p>
              <div className="w-full space-y-3 mt-8">
                <button onClick={handleResendEmail} disabled={isLoading} className="w-full bg-[#053B80] text-white font-black py-5 rounded-2xl shadow-lg uppercase active:scale-95 transition-all disabled:opacity-50">
                  {isLoading ? "Enviando..." : "SIM, REENVIAR AGORA"}
                </button>
                <button onClick={() => setStep('login')} className="w-full bg-transparent text-zinc-400 font-black py-2 uppercase text-[10px] tracking-widest hover:text-zinc-600">
                  CANCELAR
                </button>
              </div>
            </div>
          )}

          {/* Passo: Esqueci Minha Senha (Solicitar) */}
          {step === 'forgot' && (
            <form action={handleRequestReset} className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-50 text-[#053B80] rounded-full flex items-center justify-center mx-auto mb-4">
                  <IoLockOpen size={30} />
                </div>
                <h3 className="text-xl font-black text-[#053B80] uppercase italic tracking-tighter">Recuperar Senha</h3>
                <p className="text-xs text-gray-500 mt-2">Você receberá um código de 6 dígitos no seu e-mail.</p>
              </div>
              <Input label="E-mail de Cadastro" type="email" name="email" required />
              <button type="submit" disabled={isLoading} className="w-full bg-[#053B80] text-white font-black py-5 rounded-2xl shadow-lg uppercase active:scale-95 transition-all disabled:opacity-50">
                {isLoading ? "Enviando código..." : "ENVIAR CÓDIGO"}
              </button>
            </form>
          )}

          {/* Passo: Resetar Senha (Inserir Código e Nova Senha) */}
          {step === 'reset_password' && (
            <form action={handleResetSubmit} className="space-y-4 animate-in fade-in slide-in-from-right-4">
              <div className="text-center mb-6">
                <h3 className="text-xl font-black text-[#053B80] uppercase italic tracking-tighter">Nova Senha</h3>
                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest italic">Destinatário: {resetEmail}</p>
              </div>
              
              <Input label="Código de 6 dígitos" name="code" placeholder="000000" maxLength={6} required />
              <Input label="Nova Senha de Acesso" name="password" type="password" placeholder="********" required />
              
              <button type="submit" disabled={isLoading} className="w-full bg-[#1F8C6D] text-white font-black py-5 rounded-2xl shadow-lg uppercase mt-4 active:scale-95 transition-all disabled:opacity-50">
                {isLoading ? "Alterando..." : "ATUALIZAR SENHA"}
              </button>
            </form>
          )}
        </div>

        <div className="p-4 bg-zinc-50 flex justify-center shrink-0 border-t border-zinc-100">
           <div className="h-1.5 w-12 bg-zinc-200 rounded-full" />
        </div>
      </div>
    </div>
  );
}

function Input({ label, ...props }: any) {
  return (
    <div className="space-y-1.5 w-full">
      <label className="text-[10px] font-black text-gray-400 uppercase ml-3 tracking-widest">{label}</label>
      <input {...props} className="w-full bg-zinc-100 border-2 border-transparent focus:border-[#053B80]/20 focus:bg-white rounded-2xl px-6 py-4 text-sm outline-none transition-all placeholder:text-zinc-300 font-bold text-[#053B80]" />
    </div>
  );
}
