// src/pages/VerifyEmail.tsx
import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Head } from "../components/layout/Head";
import { Section } from "../components/ui/Section";
import { Container } from "../components/ui/Container";
import { Button } from "../components/ui/Button";
import { validateUserCode } from "../services/api";
import { ApiError, resendUserCode } from "../services/api";

export const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const emailFromState = (location.state as any)?.email as string | undefined;
  const emailFromQuery = searchParams.get("email") || "";
  const initialEmail = emailFromState || emailFromQuery;

  const [email] = useState(initialEmail);
  const [codigo, setCodigo] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  const canResend = useMemo(() => !!email && cooldown <= 0 && !resending && !blocked, [email, cooldown, resending, blocked]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setInfo("");
    setBlocked(false);

    if (!email) {
      setError("Email não informado. Volte ao login/cadastro.");
      return;
    }

    setLoading(true);
    try {
      await validateUserCode(email, codigo);
      setInfo("E-mail verificado com sucesso! Redirecionando para o login...");
      setTimeout(() => navigate("/login", { state: { message: "E-mail verificado. Faça login." } }), 900);
    } catch (err: any) {
      if (err instanceof ApiError && err.status === 403) {
        setBlocked(true);
        setError("Acesso restrito no ambiente de testes.");
        return;
      }
      const msg = err instanceof Error ? err.message : "Código inválido/expirado ou tentativas excedidas.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setInfo("");

    if (!email) {
      setError("Informe o email primeiro.");
      return;
    }

    setResending(true);
    try {
      await resendUserCode(email);
      setInfo("Se este e-mail existir e estiver pendente, enviaremos um novo código.");
      setCooldown(60);
    } catch {
      // Mesmo se der erro, não exponha existência do e-mail.
      setInfo("Se este e-mail existir e estiver pendente, enviaremos um novo código.");
      setCooldown(60);
    } finally {
      setResending(false);
    }
  };

  return (
    <>
      <Head title="Verificar E-mail - RG" description="Verifique seu e-mail para concluir o cadastro" />
      <Section>
        <Container size="small">
          <div className="py-16 min-h-[60vh] flex items-center justify-center">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
              <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">Verificar e-mail</h1>
              <p className="text-center text-gray-600 mb-6">Digite o código enviado para seu e-mail.</p>

              {error && (
                <div className="p-3 bg-red-50 border border-red-300 rounded-lg text-red-700 text-sm text-center mb-4" role="alert">
                  {error}
                </div>
              )}
              {info && (
                <div className="p-3 bg-green-50 border border-green-300 rounded-lg text-green-700 text-sm text-center mb-4" role="alert">
                  {info}
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input id="email" type="email" value={email} disabled placeholder="seu@email.com" />
                </div>

                <div className="form-group">
                  <label htmlFor="codigo">Código</label>
                  <input
                    id="codigo"
                    type="text"
                    value={codigo}
                    onChange={(e) => setCodigo(e.target.value)}
                    placeholder="Ex: 123456"
                    required
                    disabled={loading || blocked}
                  />
                </div>

                <Button type="submit" variant="primary" size="large" disabled={loading || blocked} fullWidth>
                  {loading ? "Validando..." : "Validar código"}
                </Button>

                <Button type="button" variant="outline" size="small" disabled={!canResend} onClick={handleResend}>
                  {cooldown > 0 ? `Reenviar código (${cooldown}s)` : resending ? "Reenviando..." : "Reenviar código"}
                </Button>

                <p className="text-center text-sm text-gray-600">
                  Voltar para <Link to="/login" className="text-primary font-semibold">Login</Link>
                </p>
              </form>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
};