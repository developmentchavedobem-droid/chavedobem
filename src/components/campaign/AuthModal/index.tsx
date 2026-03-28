'use client'

import { useState } from "react";
import { IoClose, IoArrowBack } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { registerAction, customerLoginAction } from "@/src/actions/auth";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaignSlug: string;
}

type ModalStep = 'selection' | 'login' | 'register' | 'forgot';

export default function AuthModal({ isOpen, onClose, campaignSlug }: AuthModalProps) {
  const router = useRouter();
  const [step, setStep] = useState<ModalStep>('selection');
  const [isLoading, setIsLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  if (!isOpen) return null;

  const backToSelection = () => {
    setMsg({ type: '', text: '' });
    setStep('selection');
  };

  // Lógica de Login (Somente Customer)
  async function handleLogin(formData: FormData) {
    setIsLoading(true);
    setMsg({ type: '', text: '' });

    const result = await customerLoginAction(formData);

    if (result?.error) {
      setMsg({ type: 'error', text: result.error });
      setIsLoading(false);
    } else {
      setMsg({ type: 'success', text: "Acesso autorizado! Redirecionando..." });
      router.refresh();
      setTimeout(() => {
        onClose();
        // Aqui ele já estaria logado, o botão na página mudará para "Resgatar"
      }, 1500);
    }
  }

  // Lógica de Cadastro (Força Role Customer)
  async function handleRegister(formData: FormData) {
    setIsLoading(true);
    setMsg({ type: '', text: '' });

    const result = await registerAction(formData);

    if (result?.error) {
      setMsg({ type: 'error', text: result.error });
      setIsLoading(false);
    } else {
      setMsg({ type: 'success', text: "Conta criada! Verifique seu e-mail." });
      setTimeout(() => {
        setStep('login');
        setIsLoading(false);
        setMsg({ type: 'success', text: "Agora faça seu primeiro acesso." });
      }, 2000);
    }
  }

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-[#053B80]/60 backdrop-blur-md" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 flex items-center justify-between border-b border-zinc-50 shrink-0">
          {step !== 'selection' ? (
            <button 
              onClick={backToSelection} 
              className="text-[#053B80] flex items-center gap-1 font-black text-xs uppercase tracking-widest hover:opacity-70 transition-opacity"
            >
              <IoArrowBack size={18} /> Voltar
            </button>
          ) : <div />}
          
          <button onClick={onClose} className="text-zinc-300 hover:text-red-500 transition-colors">
            <IoClose size={32} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 pt-4 overflow-y-auto custom-scrollbar">
          
          {/* Messages Alert */}
          {msg.text && (
            <div className={`mb-6 p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center ${
              msg.type === 'error' ? 'bg-red-50 text-red-500 border border-red-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
            }`}>
              {msg.text}
            </div>
          )}

          {/* STEP 1: SELECTION */}
          {step === 'selection' && (
            <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-4">
              <p className="text-2xl font-black text-[#053B80] mb-8 uppercase italic tracking-tighter text-center leading-tight">
                Você está a um passo<br/>do seu prêmio!
              </p>
              <div className="w-full space-y-4">
                <button 
                  onClick={() => setStep('login')} 
                  className="w-full bg-[#1F8C6D] hover:bg-[#16664f] text-white font-black py-5 rounded-2xl shadow-lg transition-all active:scale-95 uppercase text-lg"
                >
                  ACESSAR MINHA CONTA
                </button>
                <button 
                  onClick={() => setStep('register')} 
                  className="w-full bg-[#053B80] hover:bg-sky-900 text-white font-black py-5 rounded-2xl shadow-lg transition-all active:scale-95 uppercase text-lg"
                >
                  CRIAR NOVA CONTA
                </button>
                <button 
                  onClick={() => setStep('forgot')} 
                  className="w-full bg-transparent border-2 border-zinc-100 text-zinc-400 font-black py-4 rounded-2xl uppercase text-[10px] tracking-widest mt-4 hover:border-zinc-200"
                >
                  ESQUECI MINHA SENHA
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: LOGIN */}
          {step === 'login' && (
            <form action={handleLogin} className="space-y-4 animate-in fade-in slide-in-from-right-4">
              <div className="text-center mb-6">
                <h3 className="text-xl font-black text-[#053B80] uppercase tracking-tighter italic">Entrar</h3>
                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Exclusivo para doadores</p>
              </div>
              <Input label="Seu E-mail" name="email" type="email" placeholder="email@exemplo.com" required />
              <Input label="Sua Senha" name="password" type="password" placeholder="********" required />
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-[#1F8C6D] disabled:bg-zinc-300 text-white font-black py-5 rounded-2xl shadow-lg uppercase mt-4 active:scale-95 transition-all"
              >
                {isLoading ? "Autenticando..." : "ACESSAR AGORA"}
              </button>
            </form>
          )}

          {/* STEP 3: REGISTER */}
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
                  Confirmo ter +18 anos e aceito os <b>termos</b> e <b>políticas</b>.
                </p>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-[#053B80] disabled:bg-zinc-300 text-white font-black py-5 rounded-2xl shadow-lg uppercase mt-2 active:scale-95 transition-all"
              >
                {isLoading ? "Processando..." : "CRIAR MINHA CONTA"}
              </button>
            </form>
          )}

          {/* STEP 4: FORGOT */}
          {step === 'forgot' && (
            <form className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <div className="text-center">
                <h3 className="text-xl font-black text-[#053B80] uppercase italic tracking-tighter">Recuperar</h3>
                <p className="text-xs text-gray-500 mt-2">Enviaremos um link de acesso para o seu e-mail cadastrado.</p>
              </div>
              <Input label="E-mail de Cadastro" type="email" name="email" required />
              <button type="submit" className="w-full bg-[#053B80] text-white font-black py-5 rounded-2xl shadow-lg uppercase">
                ENVIAR LINK DE RECUPERAÇÃO
              </button>
            </form>
          )}
        </div>
        
        {/* Footer Accent */}
        <div className="p-4 bg-zinc-50 flex justify-center shrink-0 border-t border-zinc-100">
           <div className="h-1.5 w-12 bg-zinc-200 rounded-full" />
        </div>
      </div>
    </div>
  );
}

// Internal Input Component
function Input({ label, ...props }: any) {
  return (
    <div className="space-y-1.5 w-full">
      <label className="text-[10px] font-black text-gray-400 uppercase ml-3 tracking-widest">
        {label}
      </label>
      <input 
        {...props} 
        className="w-full bg-zinc-100 border-2 border-transparent focus:border-[#053B80]/20 focus:bg-white rounded-2xl px-6 py-4 text-sm outline-none transition-all placeholder:text-zinc-300 font-bold text-[#053B80]"
      />
    </div>
  );
}