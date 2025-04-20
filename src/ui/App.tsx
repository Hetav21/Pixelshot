import { Dashboard } from "@/pages/App";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import { Auth } from "./components/Auth";
import { useEffect } from "react";

function App() {
  // Defining routes of the application
  return (
    <BrowserRouter>
      <RoutesWithNavbar />
    </BrowserRouter>
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
    navigate("/sign-up");
  });

  return null;
}

export default App;
