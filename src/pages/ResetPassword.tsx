// src/pages/ResetPassword.tsx
import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Head } from "../components/layout/Head";
import { Section } from "../components/ui/Section";
import { Container } from "../components/ui/Container";
import { Button } from "../components/ui/Button";
import { ApiError, confirmPasswordReset } from "../services/api";

export const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = useMemo(() => searchParams.get("token") || "", [searchParams]);

  const [novaSenha, setNovaSenha] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setInfo("");

    if (!token) {
      setError("Token ausente. Solicite um novo reset.");
      return;
    }
    if (novaSenha !== confirmar) {
      setError("As senhas não conferem.");
      return;
    }

    setLoading(true);
    try {
      await confirmPasswordReset(token, novaSenha, confirmar);
      setInfo("Senha redefinida com sucesso! Redirecionando para o login...");
      setTimeout(() => navigate("/login", { state: { message: "Senha redefinida. Faça login." } }), 900);
    } catch (err: any) {
      if (err instanceof ApiError && err.status === 400) {
        setError("Link inválido/expirado ou nova senha igual à atual.");
      } else {
        setError(err instanceof Error ? err.message : "Erro ao redefinir senha.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head title="Redefinir senha - RG" description="Defina sua nova senha" />
      <Section>
        <Container size="small">
          <div className="py-16 min-h-[60vh] flex items-center justify-center">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
              <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">Redefinir senha</h1>
              <p className="text-center text-gray-600 mb-6">Crie uma nova senha para sua conta.</p>

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
                  <label htmlFor="novaSenha">Nova senha</label>
                  <input id="novaSenha" type="password" value={novaSenha} onChange={(e) => setNovaSenha(e.target.value)} required disabled={loading} />
                </div>

                <div className="form-group">
                  <label htmlFor="confirmar">Confirmar nova senha</label>
                  <input id="confirmar" type="password" value={confirmar} onChange={(e) => setConfirmar(e.target.value)} required disabled={loading} />
                </div>

                <Button type="submit" variant="primary" size="large" disabled={loading} fullWidth>
                  {loading ? "Salvando..." : "Redefinir senha"}
                </Button>

                <p className="text-center text-sm text-gray-600">
                  Link expirou? <Link to="/forgot-password" className="text-primary font-semibold">Solicitar novo reset</Link>
                </p>
              </form>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
};