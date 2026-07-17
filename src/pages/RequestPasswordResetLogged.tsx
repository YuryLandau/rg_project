// src/pages/RequestPasswordResetLogged.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Head } from "../components/layout/Head";
import { Section } from "../components/ui/Section";
import { Container } from "../components/ui/Container";
import { Button } from "../components/ui/Button";
import { requestPasswordResetLogged } from "../services/api";

export const RequestPasswordResetLogged = () => {
  const navigate = useNavigate();
  const { user, accessToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  if (!user) {
    navigate("/login");
    return null;
  }

  const [error, setError] = useState("");

const handleClick = async () => {
  setError("");
  setLoading(true);

  try {
    if (!accessToken) {
      throw new Error("Sessão expirada. Faça login novamente.");
    }

    await requestPasswordResetLogged(accessToken);
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
      <Head title="Trocar senha via e-mail - RG" description="Solicite reset de senha estando logado" />
      <Section>
        <Container size="small">
          <div className="py-16 min-h-[60vh] flex items-center justify-center">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
              <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">Trocar senha via e-mail</h1>

              {!sent ? (
                <>
                  <p className="text-center text-gray-600 mb-6">
                    Clique no botão abaixo para receber o link de redefinição.
                  </p>
                  
                  {error && (
                  <div
                    className="p-3 bg-red-50 border border-red-300 rounded-lg text-red-700 text-sm text-center mb-4"
                    role="alert">
                    {error}
                  </div>
                  )}
                  <Button variant="primary" size="large" fullWidth disabled={loading} onClick={handleClick}>
                    {loading ? "Solicitando..." : "Enviar e-mail de redefinição"}
                  </Button>
                  <div className="mt-4 text-center">
                    <Link to="/change-password" className="text-primary font-semibold">Voltar</Link>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-center text-gray-600 mb-6">
                    Confira seu e-mail. Se este e-mail existir e estiver apto, enviaremos o link.
                  </p>
                  <div className="flex flex-col gap-3">
                    <Button variant="primary" size="large" fullWidth onClick={() => navigate("/profile")}>
                      Voltar ao perfil
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