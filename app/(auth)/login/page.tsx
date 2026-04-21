"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/src/stores/auth.store";
import { forgotPasswordAction, resetPasswordAction } from "@/src/actions/auth";

type ViewMode = "login" | "forgot" | "reset";

export default function AuthLogin() {
  const router = useRouter();
  const refreshUser = useAuthStore((state) => state.refreshUser);

  // Estados de Controle
  const [view, setView] = useState<ViewMode>("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Dados do Formulário
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");

  // 1. Lógica de Login
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data?.error || "Não foi possível realizar login.");
        return;
      }

      await refreshUser();
      router.push("/home");
      router.refresh();
    } catch {
      setError("Erro ao realizar login. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  // 2. Lógica para Solicitar Código (Forgot Password)
  async function handleRequestOTP(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("email", email);

    const result: any = await forgotPasswordAction(formData);

    if (result.success) {
      setSuccess("Código enviado! Verifique seu e-mail.");
      setTimeout(() => {
        setView("reset");
        setSuccess("");
      }, 2000);
    } else {
      setError(result.error || "Erro ao solicitar código.");
    }
    setLoading(false);
  }

  // 3. Lógica para Definir Nova Senha (Reset Password)
  async function handleResetPassword(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("email", email);
    formData.append("code", otpCode);
    formData.append("password", password);

    const result: any = await resetPasswordAction(formData);

    if (result.success) {
      setSuccess("Senha alterada! Faça login agora.");
      setTimeout(() => {
        setView("login");
        setSuccess("");
        setPassword("");
      }, 2000);
    } else {
      setError(result.error || "Código inválido ou erro ao resetar.");
    }
    setLoading(false);
  }

  return (
    <section className="w-screen min-h-screen flex font-sans">
      <div className="w-full sm:w-1/2 flex flex-col items-center justify-center p-4 sm:p-8 mx-auto">
        <div className="w-full max-w-md p-6 sm:p-8 flex flex-col gap-6 animate-in fade-in duration-500">
          
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-black text-[#053B80] text-center uppercase italic tracking-tighter">
              {view === "login" && "Login"}
              {view === "forgot" && "Recuperar"}
              {view === "reset" && "Nova Senha"}
            </h1>
            <p className="text-center text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
              {view === "login" && "Acesse sua conta de parceiro"}
              {view === "forgot" && "Enviaremos um código de 6 dígitos"}
              {view === "reset" && "Defina sua nova credencial"}
            </p>
          </div>

          {/* MENSAGENS DE FEEDBACK */}
          {error && <p className="bg-red-50 border border-red-100 text-red-500 p-3 rounded-xl text-xs font-bold text-center uppercase tracking-tight">{error}</p>}
          {success && <p className="bg-emerald-50 border border-emerald-100 text-emerald-600 p-3 rounded-xl text-xs font-bold text-center uppercase tracking-tight">{success}</p>}

          {/* VIEW: LOGIN */}
          {view === "login" && (
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="E-mail"
                className="input-custom"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Senha"
                className="input-custom"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setView("forgot")}
                className="text-[#053B80] font-bold text-xs w-fit hover:underline ml-2"
              >
                Esqueci minha senha
              </button>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? "Entrando..." : "Entrar agora"}
              </button>
            </form>
          )}

          {/* VIEW: FORGOT PASSWORD (SOLICITAR) */}
          {view === "forgot" && (
            <form className="flex flex-col gap-4" onSubmit={handleRequestOTP}>
              <input
                type="email"
                placeholder="Confirme seu E-mail"
                className="input-custom"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? "Enviando..." : "Enviar código de 6 dígitos"}
              </button>
              <button type="button" onClick={() => setView("login")} className="text-zinc-400 text-xs font-bold uppercase tracking-widest hover:text-zinc-600 transition-colors">
                Voltar ao login
              </button>
            </form>
          )}

          {/* VIEW: RESET PASSWORD (DEFINIR NOVA) */}
          {view === "reset" && (
            <form className="flex flex-col gap-4" onSubmit={handleResetPassword}>
              <input
                type="text"
                placeholder="Código de 6 dígitos"
                className="input-custom"
                maxLength={6}
                required
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
              />
              <input
                type="password"
                placeholder="Nova Senha"
                className="input-custom"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? "Processando..." : "Redefinir Senha"}
              </button>
            </form>
          )}

          <p className="text-sm text-zinc-500 text-center px-4 leading-relaxed italic">
            Acompanhe o desempenho dos seus links e gerencie suas metas em um só lugar.
          </p>

          <div className="rounded-2xl bg-zinc-50 p-4 text-center text-xs leading-5 text-zinc-500">
            <p>
              Esta area e destinada a parceiros e divulgadores autorizados da Chave do Bem. O acesso permite consultar informacoes operacionais, acompanhar resultados e utilizar ferramentas internas vinculadas as campanhas.
            </p>
            <p className="mt-2">
              Para sua seguranca, use apenas dispositivos confiaveis, mantenha sua senha protegida e consulte nossos{" "}
              <Link href="/termos-uso" className="font-bold text-[#053B80] hover:underline">
                Termos de Uso
              </Link>{" "}
              e nossa{" "}
              <Link href="/politica-privacidade" className="font-bold text-[#053B80] hover:underline">
                Politica de Privacidade
              </Link>{" "}
              antes de utilizar a plataforma.
            </p>
          </div>
        </div>
      </div>

      {/* LADO DIREITO (BANNER) */}
      <div className="hidden sm:flex w-1/2 p-8">
        <div className="flex items-center justify-center bg-gradient-to-br from-[#026D9B] to-[#1D8C6C] w-full h-full rounded-[3rem] shadow-2xl">
          <Image
            className="w-64 h-auto drop-shadow-2xl animate-pulse"
            src="/logo.png"
            alt="ChaveDoBem logo"
            width={300}
            height={300}
            priority
          />
        </div>
      </div>

      <style jsx>{`
        .input-custom {
          width: 100%;
          background: #f8fafc;
          border: 2px solid #e2e8f0;
          padding: 1rem 1.5rem;
          border-radius: 1.5rem;
          font-weight: 700;
          color: #053B80;
          outline: none;
          transition: all 0.2s;
        }
        .input-custom:focus {
          border-color: #053B80;
          background: white;
        }
        .btn-primary {
          width: 100%;
          background: #053B80;
          color: white;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          padding: 1.25rem;
          border-radius: 1.5rem;
          box-shadow: 0 10px 20px -5px rgba(5, 59, 128, 0.3);
          transition: all 0.2s;
        }
        .btn-primary:active {
          transform: scale(0.98);
        }
        .btn-primary:disabled {
          background: #cbd5e1;
        }
      `}</style>
    </section>
  );
}
