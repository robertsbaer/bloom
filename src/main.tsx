import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  Outlet,
} from "react-router-dom";
import App from "./App.tsx";
import WholesalePage from "./WholesalePage.tsx";
import Login from "./Login.tsx";
import CreateAccount from "./CreateAccount.tsx";
import Profile from "./Profile.tsx";
import Admin from "./Admin.tsx";
import UpdatePassword from "./UpdatePassword.tsx";
import { supabase } from "./supabase.ts";
import "./index.css";

// Handle the GitHub Pages 404 redirect
const redirect = sessionStorage.getItem("redirect");
if (redirect) {
  sessionStorage.removeItem("redirect");
  history.replaceState(null, "", redirect);
}

function AppLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        navigate("/update-password");
      }
    });
  }, [navigate]);

  return <Outlet />;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<App />} />
          <Route path="/wholesale" element={<WholesalePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/create-account" element={<CreateAccount />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/update-password" element={<UpdatePassword />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
