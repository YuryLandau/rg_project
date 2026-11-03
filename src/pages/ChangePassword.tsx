// src/pages/ChangePassword.tsx
import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/useAuth";
import { Head } from "../components/layout/Head";
import { Section } from "../components/ui/Section";
import { Container } from "../components/ui/Container";
import { Button } from "../components/ui/Button";
import { ApiError, updatePasswordLogged } from "../services/api";

export const ChangePassword = () => {
  const navigate = useNavigate();
  const { user, logout, accessToken } = useAuth();

  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [blocked, setBlocked] = useState(false);
  const errorMessages = [...new Set(error.split('\n').map(message => message.trim()).filter(Boolean))];

  if (!user) {
    navigate("/login");
    return null;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setBlocked(false);

    if (novaSenha !== confirmar) {
      setError("As senhas não conferem.");
      return;
    }

    setLoading(true);
    try {
      const resp = await updatePasswordLogged(accessToken ?? "", senhaAtual, novaSenha, confirmar);

      if (resp?.requiresReauth) {
        // (PDF) deslogar e redirecionar
        logout?.();
        navigate("/login", { state: { message: "Faça login novamente." } });
        return;
      }

      navigate("/profile", { state: { message: "Senha atualizada." } });
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        if (err.status === 400 && err.errors) {
          const messages = Object.values(err.errors).filter(message => message.trim());
          setError(messages.length ? messages.join('\n') : err.message);
        } else {
          setError(err.message);
        }

        // (PDF) tentativas excedidas -> bloquear temporariamente
        if (/tentativas excedidas/i.test(err.message)) {
          setBlocked(true);
        }
      } else {
        setError(err instanceof Error ? err.message : "Erro ao atualizar senha.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head title="Alterar senha - RG" description="Altere sua senha" />
      <Section>
        <Container size="small">
          <div className="py-16 min-h-[60vh] flex items-center justify-center">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
              <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">Alterar senha</h1>
              <p className="text-center text-gray-600 mb-6">Informe sua senha atual e defina uma nova.</p>

              {errorMessages.length > 0 && (
                <div className="p-3 bg-red-50 border border-red-300 rounded-lg text-red-700 text-sm text-center mb-4" role="alert">
                  {errorMessages.length === 1 ? errorMessages[0] : (
                    <>
                      <p className="font-semibold mb-2">Confira os dados informados:</p>
                      <ul className="list-disc pl-5 space-y-1 text-left">
                        {errorMessages.map(message => <li key={message}>{message}</li>)}
                      </ul>
                    </>
                  )}
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="form-group">
                  <label htmlFor="senhaAtual">Senha atual</label>
                  <input id="senhaAtual" type="password" value={senhaAtual} onChange={(e) => setSenhaAtual(e.target.value)} required disabled={loading || blocked} />
                </div>

                <div className="form-group">
                  <label htmlFor="novaSenha">Nova senha</label>
                  <input id="novaSenha" type="password" value={novaSenha} onChange={(e) => setNovaSenha(e.target.value)} required disabled={loading || blocked} />
                </div>

                <div className="form-group">
                  <label htmlFor="confirmar">Confirmar nova senha</label>
                  <input id="confirmar" type="password" value={confirmar} onChange={(e) => setConfirmar(e.target.value)} required disabled={loading || blocked} />
                </div>

                <Button type="submit" variant="primary" size="large" disabled={loading || blocked} fullWidth>
                  {loading ? "Salvando..." : "Alterar senha"}
                </Button>

                <Button type="button" variant="outline" size="small" disabled={loading || blocked} onClick={() => navigate("/request-password-reset-logged")}>
                  Trocar senha via e-mail
                </Button>
              </form>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
};
