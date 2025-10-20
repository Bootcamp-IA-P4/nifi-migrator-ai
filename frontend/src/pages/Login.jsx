import React, { useState, useEffect } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import nifimigratorlogo from "../assets/nifimigratorlogo-bg.png";

const Login = () => {
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) navigate("/upload");
  }, [navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    const registeredUser = localStorage.getItem("registeredUser");
    if (!registeredUser) {
      setError(t("noAccount"));
      return;
    }

    const { email: savedEmail, password: savedPassword } =
      JSON.parse(registeredUser);

    if (email === savedEmail && password === savedPassword) {
      localStorage.setItem("user", JSON.stringify({ email }));
      navigate("/upload");
    } else {
      setError(t("invalidCredentials"));
    }
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "es" : "en";
    i18n.changeLanguage(newLang);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen font-inter">
      {/* Left Side - Login Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center bg-white px-8 py-12 md:px-20 relative">
        {/* 🌐 Language Selector */}
        <button
          onClick={toggleLanguage}
          className="absolute top-6 right-6 flex items-center gap-2 text-gray-600 hover:text-blue-600 border border-gray-300 px-3 py-1 rounded-full text-sm font-medium transition-all duration-200"
        >
          🌐 {i18n.language === "en" ? "EN" : "ES"}
        </button>

        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="mb-8 text-center">
            <img
              src={nifimigratorlogo}
              alt="NiFi Migrator AI"
              className="h-20 mx-auto object-contain"
            />
            <h1 className="text-2xl font-semibold text-gray-800 mt-2">
              {t("welcome")}
            </h1>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("email")}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("password")}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border border-gray-300 rounded-lg pl-10 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center mt-2">{error}</p>
            )}

            {/* Log in */}
            <button
              type="submit"
              className="w-full bg-black text-white font-semibold py-2 rounded-lg hover:bg-gray-900 transition-all duration-200"
            >
              {t("login")}
            </button>

            {/* Sign Up Button */}
            <Link
              to="/signup"
              className="w-full block text-center border border-gray-300 font-semibold py-2 rounded-lg hover:bg-gray-50 transition-all duration-200"
            >
              {t("signup")}
            </Link>
          </form>
        </div>
      </div>

      {/* Right Side - Promo */}
      <div className="hidden md:flex w-1/2 relative bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 text-white overflow-hidden items-center justify-center p-16">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/circuit-board.png')]"></div>
        <div className="relative z-10 max-w-md text-center">
          <h2 className="text-4xl font-bold leading-tight mb-4">
            {t("aiTitle")}
          </h2>
          <p className="text-lg text-white/90 mb-8">{t("aiDescription")}</p>
          <Link
            to="/upload"
            className="bg-white text-blue-700 font-semibold py-2 px-6 rounded-lg hover:bg-gray-100 transition"
          >
            {t("startMigration")}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
