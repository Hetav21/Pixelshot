import { Dashboard } from "@/pages/Dashboard";
import { useEffect } from "react";
import { HashRouter, Route, Routes, useNavigate } from "react-router-dom";
import { Auth } from "./components/Auth";

function App() {
  return (
    <HashRouter>
      <RoutesWithNavbar />
    </HashRouter>
  );
}

function RoutesWithNavbar() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Redirect />} />
        <Route path="/sign-up" element={<Auth type="sign-up" />} />
        <Route path="/sign-in" element={<Auth type="sign-in" />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  );
}

export function Redirect() {
  const navigate = useNavigate();

  useEffect(() => {
    const username = localStorage.getItem("username");

    if (username) {
      navigate("/sign-in");
    } else {
      navigate("/sign-up");
    }
  }, [navigate]);

  return null;
}

export default App;
