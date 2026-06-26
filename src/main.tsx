import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.tsx";
import WholesalePage from "./WholesalePage.tsx";
import Login from "./Login.tsx";
import CreateAccount from "./CreateAccount.tsx";
import Profile from "./Profile.tsx";
import Admin from "./Admin.tsx";
import UpdatePassword from "./UpdatePassword.tsx";
import "./index.css";

// Handle the GitHub Pages 404 redirect
const redirect = sessionStorage.getItem("redirect");
if (redirect) {
  sessionStorage.removeItem("redirect");
  history.replaceState(null, "", redirect);
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/wholesale" element={<WholesalePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/update-password" element={<UpdatePassword />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
