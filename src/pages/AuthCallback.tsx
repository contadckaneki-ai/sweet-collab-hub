import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { saveToken, fetchDiscordUser, saveUser } from "@/lib/discord";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const token = params.get("access_token");

    if (token) {
      saveToken(token);
      fetchDiscordUser(token)
        .then((user) => {
          saveUser(user);
          navigate("/dashboard", { replace: true });
        })
        .catch(() => {
          navigate("/", { replace: true });
        });
    } else {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="text-sm text-muted-foreground">Autenticando...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
