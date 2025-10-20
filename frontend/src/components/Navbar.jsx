// import React, { useState, useEffect } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { useTranslation } from "react-i18next";
// import {
//   Settings,
//   Eye,
//   EyeOff,
//   Sun,
//   Moon,
// } from "lucide-react";
// import { AnimatePresence, motion } from "framer-motion";
// import nifimigratorlogo from "../assets/nifimigratorlogo-bg.png";

// const Navbar = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isVisible, setIsVisible] = useState(true);
//   const [lastScrollY, setLastScrollY] = useState(0);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [showSettings, setShowSettings] = useState(false);
//   const [darkMode, setDarkMode] = useState(false);
//   const [apiKeys, setApiKeys] = useState({
//     openai: localStorage.getItem("openaiKey") || "",
//     groq: localStorage.getItem("groqKey") || "",
//     supabase: localStorage.getItem("supabaseKey") || "",
//   });
//   const [showKeys, setShowKeys] = useState({
//     openai: false,
//     groq: false,
//     supabase: false,
//   });

//   const location = useLocation();
//   const navigate = useNavigate();
//   const { i18n, t } = useTranslation();

//   // 🔐 Detecta sesión
//   useEffect(() => {
//     const user = localStorage.getItem("user");
//     setIsLoggedIn(!!user);
//   }, [location]);

//   // 🎢 Control scroll navbar
//   useEffect(() => {
//     const controlNavbar = () => {
//       if (window.scrollY > lastScrollY && window.scrollY > 100) {
//         setIsVisible(false);
//       } else {
//         setIsVisible(true);
//       }
//       setLastScrollY(window.scrollY);
//     };
//     window.addEventListener("scroll", controlNavbar);
//     return () => window.removeEventListener("scroll", controlNavbar);
//   }, [lastScrollY]);

//   // 🌗 Dark mode global persistente
//   useEffect(() => {
//     const storedTheme = localStorage.getItem("theme");
//     const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
//     if (storedTheme === "dark" || (!storedTheme && prefersDark)) {
//       document.documentElement.classList.add("dark");
//       document.body.classList.add("dark");
//       setDarkMode(true);
//     } else {
//       document.documentElement.classList.remove("dark");
//       document.body.classList.remove("dark");
//       setDarkMode(false);
//     }
//   }, []);

//   const toggleDarkMode = () => {
//     const newDarkMode = !darkMode;
//     setDarkMode(newDarkMode);

//     if (newDarkMode) {
//       document.documentElement.classList.add("dark");
//       document.body.classList.add("dark");
//       localStorage.setItem("theme", "dark");
//     } else {
//       document.documentElement.classList.remove("dark");
//       document.body.classList.remove("dark");
//       localStorage.setItem("theme", "light");
//     }
//   };

//   // 🌐 Idioma EN/ES
//   const toggleLanguage = () => {
//     const newLang = i18n.language === "en" ? "es" : "en";
//     i18n.changeLanguage(newLang);
//   };

//   // 💾 Guardar API keys
//   const saveApiKeys = () => {
//     Object.entries(apiKeys).forEach(([key, value]) => {
//       localStorage.setItem(`${key}Key`, value);
//     });
//     alert("✅ API Keys guardadas correctamente.");
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("user");
//     setIsLoggedIn(false);
//     navigate("/login");
//   };

//   const navItems = [
//     { name: t("upload"), path: "/upload" },
//     { name: "dashboard", path: "/dashboard" },
//     { name: t("reports"), path: "/reports" },
//     { name: t("about"), path: "/about" },
//   ];

//   return (
//     <>
//       {/* --- NAVBAR --- */}
//       <motion.nav
//         initial={{ y: -100 }}
//         animate={{ y: isVisible ? 0 : -100 }}
//         transition={{ duration: 0.4 }}
//         className="fixed top-0 left-0 right-0 z-50 bg-slate-50/80 dark:bg-[#0f172a]/80 backdrop-blur-md shadow-sm border-b border-slate-200/50 dark:border-slate-700/50 transition-all duration-500"
//       >
//         <div className="flex items-center justify-between h-20 px-4 max-w-7xl mx-auto relative">
//           {/* Logo */}
//           <Link to="/" className="flex items-center">
//             <img
//               src={nifimigratorlogo}
//               alt="NiFi Migrator AI"
//               className="h-20 object-contain"
//             />
//           </Link>

//           {/* Links desktop */}
//           <div className="hidden md:flex items-center ml-auto space-x-3">
//             {isLoggedIn &&
//               navItems.map((item) => (
//                 <Link
//                   key={item.name}
//                   to={item.path}
//                   className={`px-4 py-2 text-base font-medium rounded-lg transition-all ${
//                     location.pathname === item.path
//                       ? "text-[#006fff] bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400"
//                       : "text-gray-700 dark:text-gray-300 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
//                   }`}
//                 >
//                   {item.name}
//                 </Link>
//               ))}

//             {/* Idioma */}
//             <button
//               onClick={toggleLanguage}
//               className="border border-gray-300 dark:border-slate-600 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full hover:bg-blue-50 dark:hover:bg-slate-700 transition-all text-sm"
//             >
//               {i18n.language === "en" ? "EN" : "ES"}
//             </button>

//             {/* Settings */}
//             <button
//               onClick={() => setShowSettings(true)}
//               className="p-2 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all"
//               title="Settings"
//             >
//               <Settings className="w-6 h-6 text-gray-700 dark:text-gray-300 hover:text-blue-600" />
//             </button>

//             {/* Dark mode */}
//             <button
//               onClick={toggleDarkMode}
//               className="p-2 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all"
//             >
//               {darkMode ? (
//                 <Sun className="text-yellow-400" />
//               ) : (
//                 <Moon className="text-blue-600" />
//               )}
//             </button>

//             {/* Sesión */}
//             {!isLoggedIn ? (
//               <Link
//                 to="/login"
//                 className="border-2 border-blue-600 text-blue-600 px-6 py-2 rounded-full font-semibold bg-blue-50 hover:bg-blue-100 transition-all"
//               >
//                 {t("login")}
//               </Link>
//             ) : (
//               <button
//                 onClick={handleLogout}
//                 className="border-2 border-red-500 text-red-600 px-6 py-2 rounded-full font-semibold bg-red-50 hover:bg-red-100 transition-all"
//               >
//                 {t("logout")}
//               </button>
//             )}
//           </div>
//         </div>
//       </motion.nav>

//       {/* --- SETTINGS PANEL --- */}
//       <AnimatePresence>
//         {showSettings && (
//           <motion.div
//             className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] flex justify-center items-start pt-24"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//           >
//             <motion.div
//               initial={{ y: -50, opacity: 0 }}
//               animate={{ y: 0, opacity: 1 }}
//               exit={{ y: -50, opacity: 0 }}
//               transition={{ duration: 0.3 }}
//               className="bg-white dark:bg-[#1e293b] rounded-3xl shadow-2xl w-[90%] max-w-xl p-8 relative"
//             >
//               <button
//                 onClick={() => setShowSettings(false)}
//                 className="absolute top-4 right-5 text-gray-500 dark:text-gray-300 hover:text-red-500 text-xl"
//               >
//                 ✕
//               </button>

//               <h2 className="text-2xl font-bold mb-8 text-center text-[#006fff] dark:text-blue-400">
//                 ⚙️ Settings
//               </h2>

//               {/* Appearance */}
//               <div className="mb-8 border-b border-slate-200 dark:border-slate-700 pb-6">
//                 <h3 className="text-lg font-semibold mb-3">🌗 Appearance</h3>
//                 <button
//                   onClick={toggleDarkMode}
//                   className={`w-full py-3 rounded-xl text-white font-semibold transition-all ${
//                     darkMode ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-700 hover:bg-gray-800"
//                   }`}
//                 >
//                   {darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
//                 </button>
//               </div>

//               {/* API Keys */}
//               <div>
//                 <h3 className="text-lg font-semibold mb-4">🔑 API Keys</h3>
//                 {Object.keys(apiKeys).map((key) => (
//                   <div key={key} className="mb-5">
//                     <label className="block mb-2 capitalize text-sm font-medium text-gray-700 dark:text-gray-300">
//                       {key} Key
//                     </label>
//                     <div className="relative">
//                       <input
//                         type={showKeys[key] ? "text" : "password"}
//                         value={apiKeys[key]}
//                         onChange={(e) =>
//                           setApiKeys({ ...apiKeys, [key]: e.target.value })
//                         }
//                         placeholder={`Enter your ${key} API key`}
//                         className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-800 text-gray-700 dark:text-gray-100 pr-12 focus:ring-2 focus:ring-blue-500 outline-none"
//                       />
//                       <button
//                         type="button"
//                         onClick={() =>
//                           setShowKeys({ ...showKeys, [key]: !showKeys[key] })
//                         }
//                         className="absolute right-3 top-3 text-gray-500 dark:text-gray-300 hover:text-blue-600"
//                       >
//                         {showKeys[key] ? <EyeOff size={20} /> : <Eye size={20} />}
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//                 <button
//                   onClick={saveApiKeys}
//                   className="w-full py-3 bg-[#006fff] hover:bg-blue-700 text-white rounded-xl font-semibold transition-all"
//                 >
//                   Save All Keys
//                 </button>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </>
//   );
// };

// export default Navbar;
// import React, { useState, useEffect } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { useTranslation } from "react-i18next";
// import {
//   Settings,
//   Eye,
//   EyeOff,
//   Sun,
//   Moon,
//   Menu,
//   X,
// } from "lucide-react";
// import { AnimatePresence, motion } from "framer-motion";
// import nifimigratorlogo from "../assets/nifimigratorlogo-bg.png";

// const Navbar = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isVisible, setIsVisible] = useState(true);
//   const [lastScrollY, setLastScrollY] = useState(0);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [showSettings, setShowSettings] = useState(false);
//   const [darkMode, setDarkMode] = useState(false);
//   const [apiKeys, setApiKeys] = useState({
//     openai: localStorage.getItem("openaiKey") || "",
//     groq: localStorage.getItem("groqKey") || "",
//     supabase: localStorage.getItem("supabaseKey") || "",
//   });
//   const [showKeys, setShowKeys] = useState({
//     openai: false,
//     groq: false,
//     supabase: false,
//   });

//   const location = useLocation();
//   const navigate = useNavigate();
//   const { i18n, t } = useTranslation();

//   // Detecta sesión
//   useEffect(() => {
//     const user = localStorage.getItem("user");
//     setIsLoggedIn(!!user);
//   }, [location]);

//   // Control scroll navbar
//   useEffect(() => {
//     const controlNavbar = () => {
//       if (window.scrollY > lastScrollY && window.scrollY > 100) {
//         setIsVisible(false);
//       } else {
//         setIsVisible(true);
//       }
//       setLastScrollY(window.scrollY);
//     };
//     window.addEventListener("scroll", controlNavbar);
//     return () => window.removeEventListener("scroll", controlNavbar);
//   }, [lastScrollY]);

//   // Dark mode persistente
//   useEffect(() => {
//     const storedTheme = localStorage.getItem("theme");
//     const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
//     if (storedTheme === "dark" || (!storedTheme && prefersDark)) {
//       document.documentElement.classList.add("dark");
//       document.body.classList.add("dark");
//       setDarkMode(true);
//     } else {
//       document.documentElement.classList.remove("dark");
//       document.body.classList.remove("dark");
//       setDarkMode(false);
//     }
//   }, []);

//   const toggleDarkMode = () => {
//     const newDarkMode = !darkMode;
//     setDarkMode(newDarkMode);
//     document.documentElement.classList.toggle("dark", newDarkMode);
//     document.body.classList.toggle("dark", newDarkMode);
//     localStorage.setItem("theme", newDarkMode ? "dark" : "light");
//   };

//   // Cambiar idioma
//   const toggleLanguage = () => {
//     const newLang = i18n.language === "en" ? "es" : "en";
//     i18n.changeLanguage(newLang);
//   };

//   // Guardar API keys
//   const saveApiKeys = () => {
//     Object.entries(apiKeys).forEach(([key, value]) => {
//       localStorage.setItem(`${key}Key`, value);
//     });
//     alert("✅ API Keys guardadas correctamente.");
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("user");
//     setIsLoggedIn(false);
//     navigate("/login");
//   };

//   const navItems = [
//     { name: t("upload"), path: "/upload" },
//     { name: "Dashboard", path: "/dashboard" },
//     { name: t("reports"), path: "/reports" },
//     { name: t("about"), path: "/about" },
//   ];

//   return (
//     <>
//       {/* --- NAVBAR --- */}
//       <motion.nav
//         initial={{ y: -100 }}
//         animate={{ y: isVisible ? 0 : -100 }}
//         transition={{ duration: 0.4 }}
//         className="fixed top-0 left-0 right-0 z-50 bg-slate-50/80 dark:bg-[#0f172a]/80 backdrop-blur-md shadow-sm border-b border-slate-200/50 dark:border-slate-700/50 transition-all duration-500"
//       >
//         <div className="flex items-center justify-between h-20 px-4 max-w-7xl mx-auto relative">
//           {/* Logo */}
//           <Link to="/" className="flex items-center">
//             <img
//               src={nifimigratorlogo}
//               alt="NiFi Migrator AI"
//               className="h-20 object-contain"
//             />
//           </Link>

//           {/* Links desktop */}
//           <div className="hidden md:flex items-center ml-auto space-x-3">
//             {isLoggedIn &&
//               navItems.map((item) => (
//                 <Link
//                   key={item.name}
//                   to={item.path}
//                   className={`px-4 py-2 text-base font-medium rounded-lg transition-all ${
//                     location.pathname === item.path
//                       ? "text-[#006fff] bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400"
//                       : "text-gray-700 dark:text-gray-300 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
//                   }`}
//                 >
//                   {item.name}
//                 </Link>
//               ))}

//             {/* Idioma */}
//             <button
//               onClick={toggleLanguage}
//               className="border border-gray-300 dark:border-slate-600 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full hover:bg-blue-50 dark:hover:bg-slate-700 transition-all text-sm"
//             >
//               {i18n.language === "en" ? "EN" : "ES"}
//             </button>

//             {/* Settings */}
//             <button
//               onClick={() => setShowSettings(true)}
//               className="p-2 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all"
//               title="Settings"
//             >
//               <Settings className="w-6 h-6 text-gray-700 dark:text-gray-300 hover:text-blue-600" />
//             </button>

//             {/* Dark mode */}
//             <button
//               onClick={toggleDarkMode}
//               className="p-2 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all"
//             >
//               {darkMode ? (
//                 <Sun className="text-yellow-400" />
//               ) : (
//                 <Moon className="text-blue-600" />
//               )}
//             </button>

//             {/* Sesión */}
//             {!isLoggedIn ? (
//               <Link
//                 to="/login"
//                 className="border-2 border-blue-600 text-blue-600 px-6 py-2 rounded-full font-semibold bg-blue-50 hover:bg-blue-100 transition-all"
//               >
//                 {t("login")}
//               </Link>
//             ) : (
//               <button
//                 onClick={handleLogout}
//                 className="border-2 border-red-500 text-red-600 px-6 py-2 rounded-full font-semibold bg-red-50 hover:bg-red-100 transition-all"
//               >
//                 {t("logout")}
//               </button>
//             )}
//           </div>

//           {/* Botón menú móvil */}
//           <div className="md:hidden flex items-center">
//             <button
//               onClick={() => setIsMenuOpen(!isMenuOpen)}
//               className="p-2 rounded-md hover:bg-blue-100 dark:hover:bg-slate-700 transition-all"
//             >
//               {isMenuOpen ? (
//                 <X className="w-7 h-7 text-blue-600" />
//               ) : (
//                 <Menu className="w-7 h-7 text-blue-600" />
//               )}
//             </button>
//           </div>
//         </div>

//         {/* --- MENÚ MÓVIL --- */}
//         <AnimatePresence>
//           {isMenuOpen && (
//             <motion.div
//               initial={{ opacity: 0, y: -10 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -10 }}
//               className="md:hidden absolute top-20 left-0 w-full bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-700 shadow-lg"
//             >
//               <div className="flex flex-col items-center py-6 space-y-4">
//                 {isLoggedIn &&
//                   navItems.map((item) => (
//                     <Link
//                       key={item.name}
//                       to={item.path}
//                       onClick={() => setIsMenuOpen(false)}
//                       className={`text-lg font-medium ${
//                         location.pathname === item.path
//                           ? "text-[#006fff]"
//                           : "text-gray-700 dark:text-gray-200 hover:text-[#006fff]"
//                       }`}
//                     >
//                       {item.name}
//                     </Link>
//                   ))}

//                 <div className="flex items-center gap-3 mt-4">
//                   <button
//                     onClick={toggleLanguage}
//                     className="border border-gray-300 dark:border-slate-600 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full text-sm hover:bg-blue-50 dark:hover:bg-slate-700"
//                   >
//                     {i18n.language === "en" ? "EN" : "ES"}
//                   </button>

//                   <button
//                     onClick={toggleDarkMode}
//                     className="p-2 rounded-full hover:bg-blue-100 dark:hover:bg-slate-700 transition-all"
//                   >
//                     {darkMode ? (
//                       <Sun className="text-yellow-400" />
//                     ) : (
//                       <Moon className="text-blue-600" />
//                     )}
//                   </button>
//                 </div>

//                 {!isLoggedIn ? (
//                   <Link
//                     to="/login"
//                     onClick={() => setIsMenuOpen(false)}
//                     className="mt-6 border-2 border-blue-600 text-blue-600 px-6 py-2 rounded-full font-semibold bg-blue-50 hover:bg-blue-100 transition-all"
//                   >
//                     {t("login")}
//                   </Link>
//                 ) : (
//                   <button
//                     onClick={() => {
//                       handleLogout();
//                       setIsMenuOpen(false);
//                     }}
//                     className="mt-6 border-2 border-red-500 text-red-600 px-6 py-2 rounded-full font-semibold bg-red-50 hover:bg-red-100 transition-all"
//                   >
//                     {t("logout")}
//                   </button>
//                 )}
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </motion.nav>

//       {/* --- SETTINGS PANEL --- */}
//       <AnimatePresence>
//         {showSettings && (
//           <motion.div
//             className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] flex justify-center items-start pt-24"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//           >
//             <motion.div
//               initial={{ y: -50, opacity: 0 }}
//               animate={{ y: 0, opacity: 1 }}
//               exit={{ y: -50, opacity: 0 }}
//               transition={{ duration: 0.3 }}
//               className="bg-white dark:bg-[#1e293b] rounded-3xl shadow-2xl w-[90%] max-w-xl p-8 relative"
//             >
//               <button
//                 onClick={() => setShowSettings(false)}
//                 className="absolute top-4 right-5 text-gray-500 dark:text-gray-300 hover:text-red-500 text-xl"
//               >
//                 ✕
//               </button>

//               <h2 className="text-2xl font-bold mb-8 text-center text-[#006fff] dark:text-blue-400">
//                 ⚙️ Settings
//               </h2>

//               {/* Appearance */}
//               <div className="mb-8 border-b border-slate-200 dark:border-slate-700 pb-6">
//                 <h3 className="text-lg font-semibold mb-3">🌗 Appearance</h3>
//                 <button
//                   onClick={toggleDarkMode}
//                   className={`w-full py-3 rounded-xl text-white font-semibold transition-all ${
//                     darkMode ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-700 hover:bg-gray-800"
//                   }`}
//                 >
//                   {darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
//                 </button>
//               </div>

//               {/* API Keys */}
//               <div>
//                 <h3 className="text-lg font-semibold mb-4">🔑 API Keys</h3>
//                 {Object.keys(apiKeys).map((key) => (
//                   <div key={key} className="mb-5">
//                     <label className="block mb-2 capitalize text-sm font-medium text-gray-700 dark:text-gray-300">
//                       {key} Key
//                     </label>
//                     <div className="relative">
//                       <input
//                         type={showKeys[key] ? "text" : "password"}
//                         value={apiKeys[key]}
//                         onChange={(e) =>
//                           setApiKeys({ ...apiKeys, [key]: e.target.value })
//                         }
//                         placeholder={`Enter your ${key} API key`}
//                         className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-800 text-gray-700 dark:text-gray-100 pr-12 focus:ring-2 focus:ring-blue-500 outline-none"
//                       />
//                       <button
//                         type="button"
//                         onClick={() =>
//                           setShowKeys({ ...showKeys, [key]: !showKeys[key] })
//                         }
//                         className="absolute right-3 top-3 text-gray-500 dark:text-gray-300 hover:text-blue-600"
//                       >
//                         {showKeys[key] ? <EyeOff size={20} /> : <Eye size={20} />}
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//                 <button
//                   onClick={saveApiKeys}
//                   className="w-full py-3 bg-[#006fff] hover:bg-blue-700 text-white rounded-xl font-semibold transition-all"
//                 >
//                   Save All Keys
//                 </button>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </>
//   );
// };

// export default Navbar;


import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Settings, Eye, EyeOff, Sun, Moon, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import nifimigratorlogo from "../assets/nifimigratorlogo-bg.png";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [apiKeys, setApiKeys] = useState({
    openai: localStorage.getItem("openaiKey") || "",
    groq: localStorage.getItem("groqKey") || "",
    supabase: localStorage.getItem("supabaseKey") || "",
  });
  const [showKeys, setShowKeys] = useState({
    openai: false,
    groq: false,
    supabase: false,
  });

  const location = useLocation();
  const navigate = useNavigate();
  const { i18n, t } = useTranslation();

  // 🔐 Detectar sesión activa
  useEffect(() => {
    const user = localStorage.getItem("user");
    setIsLoggedIn(!!user);
  }, [location]);

  // 🎢 Mostrar / ocultar navbar al hacer scroll
  useEffect(() => {
    const controlNavbar = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(window.scrollY);
    };
    window.addEventListener("scroll", controlNavbar);
    return () => window.removeEventListener("scroll", controlNavbar);
  }, [lastScrollY]);

  // 🌗 Activar modo oscuro global persistente
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (storedTheme === "dark" || (!storedTheme && prefersDark)) {
      document.documentElement.classList.add("dark");
      document.body.classList.add("dark");
      setDarkMode(true);
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("dark");
      setDarkMode(false);
    }
  }, []);

  // Cambiar entre modo claro / oscuro
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    document.documentElement.classList.toggle("dark", newDarkMode);
    document.body.classList.toggle("dark", newDarkMode);
    localStorage.setItem("theme", newDarkMode ? "dark" : "light");
  };

  // 🌐 Cambiar idioma EN ↔ ES
  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "es" : "en";
    i18n.changeLanguage(newLang);
  };

  // 💾 Guardar claves API
  const saveApiKeys = () => {
    Object.entries(apiKeys).forEach(([key, value]) => {
      localStorage.setItem(`${key}Key`, value);
    });
    alert(t("alerts.apiKeysSaved"));
  };

  // 🚪 Cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate("/login");
  };

  // 🔗 Elementos de navegación (traducidos)
  const navItems = [
    { name: t("navbar.upload"), path: "/upload" },
    { name: t("navbar.dashboard"), path: "/dashboard" },
    { name: t("navbar.reports"), path: "/reports" },
    { name: t("navbar.about"), path: "/about" },
  ];

  return (
    <>
      {/* --- BARRA DE NAVEGACIÓN --- */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: isVisible ? 0 : -100 }}
        transition={{ duration: 0.4 }}
        className="fixed top-0 left-0 right-0 z-50 bg-slate-50/80 dark:bg-[#0f172a]/80 backdrop-blur-md shadow-sm border-b border-slate-200/50 dark:border-slate-700/50 transition-all duration-500"
      >
        <div className="flex items-center justify-between h-20 px-4 max-w-7xl mx-auto relative">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src={nifimigratorlogo}
              alt="NiFi Migrator AI"
              className="h-20 object-contain"
            />
          </Link>

          {/* --- LINKS DESKTOP --- */}
          <div className="hidden md:flex items-center ml-auto space-x-3">
            {isLoggedIn &&
              navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 text-base font-medium rounded-lg transition-all ${
                    location.pathname === item.path
                      ? "text-[#006fff] bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400"
                      : "text-gray-700 dark:text-gray-300 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  }`}
                >
                  {item.name}
                </Link>
              ))}

            {/* Idioma */}
            <button
              onClick={toggleLanguage}
              className="border border-gray-300 dark:border-slate-600 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full hover:bg-blue-50 dark:hover:bg-slate-700 transition-all text-sm"
            >
              {i18n.language === "en" ? "EN" : "ES"}
            </button>

            {/* Configuración */}
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all"
              title={t("navbar.settingsTooltip")}
            >
              <Settings className="w-6 h-6 text-gray-700 dark:text-gray-300 hover:text-blue-600" />
            </button>

            {/* Modo oscuro */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all"
            >
              {darkMode ? (
                <Sun className="text-yellow-400" />
              ) : (
                <Moon className="text-blue-600" />
              )}
            </button>

            {/* Inicio / Cierre de sesión */}
            {!isLoggedIn ? (
              <Link
                to="/login"
                className="border-2 border-blue-600 text-blue-600 px-6 py-2 rounded-full font-semibold bg-blue-50 hover:bg-blue-100 transition-all"
              >
                {t("login")}
              </Link>
            ) : (
              <button
                onClick={handleLogout}
                className="border-2 border-red-500 text-red-600 px-6 py-2 rounded-full font-semibold bg-red-50 hover:bg-red-100 transition-all"
              >
                {t("logout")}
              </button>
            )}
          </div>

          {/* --- BOTÓN MENÚ MÓVIL --- */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md hover:bg-blue-100 dark:hover:bg-slate-700 transition-all"
            >
              {isMenuOpen ? (
                <X className="w-7 h-7 text-blue-600" />
              ) : (
                <Menu className="w-7 h-7 text-blue-600" />
              )}
            </button>
          </div>
        </div>

        {/* --- MENÚ MÓVIL --- */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden absolute top-20 left-0 w-full bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-700 shadow-lg"
            >
              <div className="flex flex-col items-center py-6 space-y-4">
                {isLoggedIn &&
                  navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMenuOpen(false)}
                      className={`text-lg font-medium ${
                        location.pathname === item.path
                          ? "text-[#006fff]"
                          : "text-gray-700 dark:text-gray-200 hover:text-[#006fff]"
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}

                <div className="flex items-center gap-3 mt-4">
                  <button
                    onClick={toggleLanguage}
                    className="border border-gray-300 dark:border-slate-600 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full text-sm hover:bg-blue-50 dark:hover:bg-slate-700"
                  >
                    {i18n.language === "en" ? "EN" : "ES"}
                  </button>

                  <button
                    onClick={toggleDarkMode}
                    className="p-2 rounded-full hover:bg-blue-100 dark:hover:bg-slate-700 transition-all"
                  >
                    {darkMode ? (
                      <Sun className="text-yellow-400" />
                    ) : (
                      <Moon className="text-blue-600" />
                    )}
                  </button>
                </div>

                {!isLoggedIn ? (
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="mt-6 border-2 border-blue-600 text-blue-600 px-6 py-2 rounded-full font-semibold bg-blue-50 hover:bg-blue-100 transition-all"
                  >
                    {t("login")}
                  </Link>
                ) : (
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="mt-6 border-2 border-red-500 text-red-600 px-6 py-2 rounded-full font-semibold bg-red-50 hover:bg-red-100 transition-all"
                  >
                    {t("logout")}
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* --- PANEL DE CONFIGURACIÓN --- */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] flex justify-center items-start pt-24"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-[#1e293b] rounded-3xl shadow-2xl w-[90%] max-w-xl p-8 relative"
            >
              <button
                onClick={() => setShowSettings(false)}
                className="absolute top-4 right-5 text-gray-500 dark:text-gray-300 hover:text-red-500 text-xl"
              >
                ✕
              </button>

              <h2 className="text-2xl font-bold mb-8 text-center text-[#006fff] dark:text-blue-400">
                ⚙️ {t("navbar.settingsTooltip")}
              </h2>

              {/* Apariencia */}
              <div className="mb-8 border-b border-slate-200 dark:border-slate-700 pb-6">
                <h3 className="text-lg font-semibold mb-3">{t("navbar.appearance")}</h3>
                <button
                  onClick={toggleDarkMode}
                  className={`w-full py-3 rounded-xl text-white font-semibold transition-all ${
                    darkMode
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-gray-700 hover:bg-gray-800"
                  }`}
                >
                  {darkMode ? t("navbar.switchToLight") : t("navbar.switchToDark")}
                </button>
              </div>

              {/* Claves API */}
              <div>
                <h3 className="text-lg font-semibold mb-4">{t("navbar.apiKeys")}</h3>
                {Object.keys(apiKeys).map((key) => (
                  <div key={key} className="mb-5">
                    <label className="block mb-2 capitalize text-sm font-medium text-gray-700 dark:text-gray-300">
                      {key} Key
                    </label>
                    <div className="relative">
                      <input
                        type={showKeys[key] ? "text" : "password"}
                        value={apiKeys[key]}
                        onChange={(e) =>
                          setApiKeys({ ...apiKeys, [key]: e.target.value })
                        }
                        placeholder={t("navbar.apiPlaceholder", { key })}
                        className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-800 text-gray-700 dark:text-gray-100 pr-12 focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowKeys({ ...showKeys, [key]: !showKeys[key] })
                        }
                        className="absolute right-3 top-3 text-gray-500 dark:text-gray-300 hover:text-blue-600"
                      >
                        {showKeys[key] ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  onClick={saveApiKeys}
                  className="w-full py-3 bg-[#006fff] hover:bg-blue-700 text-white rounded-xl font-semibold transition-all"
                >
                  {t("navbar.saveKeys")}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
