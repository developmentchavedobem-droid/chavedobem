"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthLogin() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data?.error || "Não foi possível realizar login.");
        return;
      }

      router.push("/home");
      router.refresh();
    } catch {
      setError("Erro ao realizar login. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="w-screen min-h-screen flex">
      <div className="w-full sm:w-1/2 flex flex-col items-center justify-center p-4 sm:p-8 mx-auto">
        <div className="w-full max-w-md p-6 sm:p-8 flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold text-[#053B80] text-center">
              Login
            </h1>
          </div>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <fieldset className="fieldset w-full">
              <input
                type="email"
                placeholder="E-mail"
                className="input bg-transparent border-2 border-[#053B80] text-[#053B80] rounded-3xl w-full"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </fieldset>

            <fieldset className="fieldset w-full">
              <input
                type="password"
                placeholder="Senha"
                className="input bg-transparent border-2 border-[#053B80] text-[#053B80] rounded-3xl w-full"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </fieldset>

            <Link
              href="/recuperar-senha"
              className="text-[#053B80] hover:text-[#0755bb] text-sm w-fit"
            >
              Esqueci minha senha
            </Link>

            {error ? (
              <p className="text-sm text-red-600">{error}</p>
            ) : null}

            <button
              type="submit"
              className="btn btn-theme-primary mt-1"
              disabled={loading}
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </div>

        <p className="text-sm text-zinc-600 align-baseline text-center px-4">
          Junte-se ao sistema para acompanhar todos os seus dados referentes aos
          seus links
        </p>
      </div>

      <div className="hidden sm:flex w-1/2 p-8">
        <div className="flex items-center justify-center bg-linear-to-r from-[#026D9B] to-[#1D8C6C] w-full h-full rounded-2xl">
          <Image
            className="w-20 sm:w-72 md:w-60 h-auto"
            src="/logo.svg"
            alt="ChaveDoBem logo"
            width={300}
            height={300}
            priority
          />
        </div>
      </div>
    </section>
  );
}