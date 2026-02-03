import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AuthProvider, type AuthProviderProps } from "oidc-react";

const oidcConfig: AuthProviderProps = {
  authority: "https://<project_ref_id>.supabase.co/auth/v1",
  clientId: "xxx-xxx-xx",
  redirectUri: "http://localhost:3000/oauth-callback",
  scope: "openid profile email",
  onSignIn: () => {
    // clean up the URL after redirect
    window.history.replaceState({}, document.title, "/");
    window.location.reload();
  },
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider {...oidcConfig}>
      <App />
    </AuthProvider>
  </StrictMode>,
);
