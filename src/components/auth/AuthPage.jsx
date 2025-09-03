import { useState, useEffect } from "react";
import  Login  from "../login/Login";
import  Register  from "../signup/SignUp";
import { useLocation } from "react-router-dom"; 
import "./AuthPage.css";

export default function AuthPage({ defaultTab = "login" }) {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("login");

  // Đồng bộ tab với URL
  useEffect(() => {
    if (location.pathname === "/signup") {
      setActiveTab("register");
    } else {
      setActiveTab("login");
    }
  }, [location.pathname]);

  return (
    <div className="auth-container">
      <header className="auth-header">
        <nav>
          <button
            className={activeTab === "login" ? "active" : ""}
            onClick={() => setActiveTab("login")}
          >
            Đăng nhập
          </button>
          <button
            className={activeTab === "register" ? "active" : ""}
            onClick={() => setActiveTab("register")}
          >
            Đăng ký
          </button>
        </nav>
      </header>

      <main>
        {activeTab === "login" ? <Login /> : <Register />}
      </main>
    </div>
  );
}
