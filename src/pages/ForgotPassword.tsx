// src/pages/ForgotPassword.tsx
import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom"; // ✅ add useNavigate
import { Head } from "../components/layout/Head";
import { Section } from "../components/ui/Section";
import { Container } from "../components/ui/Container";
import { Button } from "../components/ui/Button";
import { requestPasswordReset } from "../services/api";

export const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    await requestPasswordReset(email);
    setSent(true);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Erro ao solicitar redefinição de senha.";
    setError(msg);
    setSent(false);
  } finally {
    setLoading(false);
  }
};

  return (
    <>
      <Head title="Recuperar senha - RG" description="Solicite recuperação de senha" />
      <Section>
        <Container size="small">
          <div className="py-16 min-h-[60vh] flex items-center justify-center">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
              <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">Esqueci minha senha</h1>

              {!sent ? (
                <>
                  <p className="text-center text-gray-600 mb-6">Informe seu e-mail para receber o link de redefinição.</p>

                  {error && (
                    <div className="p-3 bg-red-50 border border-red-300 rounded-lg text-red-700 text-sm text-center mb-4" role="alert">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div className="form-group">
                      <label htmlFor="email">Email</label>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="seu@email.com"
                        required
                        disabled={loading}
                      />
                    </div>

                    <Button type="submit" variant="primary" size="large" disabled={loading} fullWidth>
                      {loading ? "Enviando..." : "Enviar link"}
                    </Button>

                    <p className="text-center text-sm text-gray-600">
                      Voltar para <Link to="/login" className="text-primary font-semibold">Login</Link>
                    </p>
                  </form>
                </>
              ) : (
                <>
                  <p className="text-center text-gray-600 mb-6">
                    Se este e-mail existir, enviaremos um link de redefinição. Confira sua caixa de entrada.
                  </p>

                  <div className="flex flex-col gap-3">
                    <Button variant="primary" size="large" fullWidth onClick={() => navigate("/login")}>
                   Ir para Login
                  </Button>

                  <Button variant="outline" size="small" onClick={() => navigate("/reset-password-code")}>
                  Tenho um código e quero digitar
                  </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
};