// // src/components/Navbar.jsx
// import React, { useState, useEffect } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import nifimigratorlogo from "../assets/nifimigratorlogo-bg.png";

// const Navbar = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isVisible, setIsVisible] = useState(true);
//   const [lastScrollY, setLastScrollY] = useState(0);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const location = useLocation();
//   const navigate = useNavigate();

//   // Detecta si el usuario está logueado
//   useEffect(() => {
//     const user = localStorage.getItem("user");
//     setIsLoggedIn(!!user);
//   }, [location]);

//   // Controla el comportamiento al hacer scroll
//   useEffect(() => {
//     const controlNavbar = () => {
//       if (typeof window !== "undefined") {
//         if (window.scrollY > lastScrollY && window.scrollY > 100) {
//           setIsVisible(false);
//         } else {
//           setIsVisible(true);
//         }
//         setLastScrollY(window.scrollY);
//       }
//     };

//     if (typeof window !== "undefined") {
//       window.addEventListener("scroll", controlNavbar);
//       return () => {
//         window.removeEventListener("scroll", controlNavbar);
//       };
//     }
//   }, [lastScrollY]);

//   const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
//   const closeMenu = () => setIsMenuOpen(false);

//   const handleLogout = () => {
//     localStorage.removeItem("user");
//     setIsLoggedIn(false);
//     navigate("/login");
//   };

//   const navItems = [
//     { name: "Home", path: "/" },
//     { name: "Upload XML", path: "/upload" },
//     { name: "Reports", path: "/reports" },
//     { name: "About", path: "/about" },
//   ];

//   return (
//     <nav
//       className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 font-sans ${
//         isVisible ? "translate-y-0" : "-translate-y-full"
//       }`}
//       style={{ fontFamily: "Inter, system-ui, -apple-system, sans-serif" }}
//     >
//       <div className="bg-slate-50/80 backdrop-blur-md w-full relative overflow-hidden shadow-sm border-b border-slate-200/50">
//         <div className="flex items-center justify-between h-20 px-4 max-w-7xl mx-auto relative z-10">
//           {/* Brand logo */}
//           <div className="flex items-center">
//             <Link to="/" className="flex items-center">
//               <img
//                 src={nifimigratorlogo}
//                 alt="NiFi Migrator AI"
//                 className="h-20 object-contain"
//               />
//             </Link>
//           </div>

//           {/* Navigation links - Desktop */}
//           <div className="hidden md:flex items-center h-full ml-auto">
//             {navItems.map((item) => (
//               <Link
//                 key={item.name}
//                 to={item.path}
//                 className={`h-full flex items-center justify-center px-4 text-lg font-semibold transition-all duration-300 rounded-lg ${
//                   location.pathname === item.path
//                     ? "text-indigo-600 bg-indigo-50"
//                     : "text-slate-600 hover:text-indigo-500 hover:bg-indigo-50"
//                 }`}
//               >
//                 {item.name}
//               </Link>
//             ))}

//             {/* Auth buttons (Login / Logout) */}
//             <div className="h-full flex items-center px-4">
//               {!isLoggedIn ? (
//                 <Link
//                   to="/login"
//                   className="border-2 border-indigo-500 text-indigo-600 px-6 py-2 rounded-full font-semibold text-lg bg-indigo-50 hover:bg-indigo-100 transition-all duration-200"
//                 >
//                   Login
//                 </Link>
//               ) : (
//                 <button
//                   onClick={handleLogout}
//                   className="border-2 border-red-500 text-red-600 px-6 py-2 rounded-full font-semibold text-lg bg-red-50 hover:bg-red-100 transition-all duration-200"
//                 >
//                   Logout
//                 </button>
//               )}
//             </div>

//             {/* CTA Desktop */}
//             {isLoggedIn && (
//               <div className="h-full flex items-center px-4">
//                 <Link
//                   to="/upload"
//                   className="border-2 border-indigo-500 text-indigo-600 px-6 py-2 rounded-full font-semibold text-lg bg-indigo-50 hover:bg-indigo-100 transition-all duration-200"
//                 >
//                   Start Migration
//                 </Link>
//               </div>
//             )}
//           </div>

//           {/* Mobile navigation controls */}
//           <div className="flex items-center md:hidden">
//             <button
//               onClick={toggleMenu}
//               className="inline-flex items-center justify-center p-2 text-slate-500 hover:text-indigo-500 hover:bg-indigo-50 rounded-lg focus:outline-none transition-colors duration-200"
//             >
//               <div className="relative flex items-center justify-center w-6 h-6">
//                 <span
//                   className={`absolute h-0.5 w-6 bg-current transition-all duration-300 ${
//                     isMenuOpen ? "rotate-45" : "-translate-y-1.5"
//                   }`}
//                 ></span>
//                 <span
//                   className={`absolute h-0.5 w-6 bg-current transition-all duration-300 ${
//                     isMenuOpen ? "opacity-0" : "opacity-100"
//                   }`}
//                 ></span>
//                 <span
//                   className={`absolute h-0.5 w-6 bg-current transition-all duration-300 ${
//                     isMenuOpen ? "-rotate-45" : "translate-y-1.5"
//                   }`}
//                 ></span>
//               </div>
//             </button>
//           </div>
//         </div>

//         {/* Mobile dropdown menu */}
//         <div
//           className={`transition-all duration-300 ease-in-out overflow-hidden md:hidden ${
//             isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
//           }`}
//         >
//           <div className="bg-slate-50/90 backdrop-blur-md flex flex-col border-t border-slate-200/50">
//             {navItems.map((item) => (
//               <Link
//                 key={item.name}
//                 to={item.path}
//                 onClick={closeMenu}
//                 className={`flex items-center justify-center h-16 text-lg font-semibold transition-all duration-200 mx-4 my-1 rounded-lg ${
//                   location.pathname === item.path
//                     ? "text-indigo-600 bg-indigo-50"
//                     : "text-slate-600 hover:bg-indigo-50 hover:text-indigo-500"
//                 }`}
//               >
//                 {item.name}
//               </Link>
//             ))}

//             {/* Auth button mobile */}
//             <div className="flex items-center justify-center h-20 px-4">
//               {!isLoggedIn ? (
//                 <Link
//                   to="/login"
//                   onClick={closeMenu}
//                   className="border-2 w-full border-indigo-500 text-indigo-600 px-6 py-3 rounded-full font-semibold text-lg bg-indigo-50 hover:bg-indigo-100 transition-all duration-200 text-center"
//                 >
//                   Login
//                 </Link>
//               ) : (
//                 <button
//                   onClick={() => {
//                     handleLogout();
//                     closeMenu();
//                   }}
//                   className="border-2 w-full border-red-500 text-red-600 px-6 py-3 rounded-full font-semibold text-lg bg-red-50 hover:bg-red-100 transition-all duration-200 text-center"
//                 >
//                   Logout
//                 </button>
//               )}
//             </div>

//             {/* CTA Mobile */}
//             {isLoggedIn && (
//               <div className="flex items-center justify-center h-20 px-4">
//                 <Link
//                   to="/upload"
//                   onClick={closeMenu}
//                   className="border-2 w-full border-indigo-500 text-indigo-600 px-6 py-3 rounded-full font-semibold text-lg bg-indigo-50 hover:bg-indigo-100 transition-all duration-200 text-center"
//                 >
//                   Start Migration
//                 </Link>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

// import React, { useState, useEffect } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import nifimigratorlogo from "../assets/nifimigratorlogo-bg.png";


// const Navbar = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isVisible, setIsVisible] = useState(true);
//   const [lastScrollY, setLastScrollY] = useState(0);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const location = useLocation();
//   const navigate = useNavigate();

//   // Detecta si el usuario está logueado
//   useEffect(() => {
//     const user = localStorage.getItem("user");
//     setIsLoggedIn(!!user);
//   }, [location]);

//   // Controla el comportamiento al hacer scroll
//   useEffect(() => {
//     const controlNavbar = () => {
//       if (typeof window !== "undefined") {
//         if (window.scrollY > lastScrollY && window.scrollY > 100) {
//           setIsVisible(false);
//         } else {
//           setIsVisible(true);
//         }
//         setLastScrollY(window.scrollY);
//       }
//     };

//     if (typeof window !== "undefined") {
//       window.addEventListener("scroll", controlNavbar);
//       return () => {
//         window.removeEventListener("scroll", controlNavbar);
//       };
//     }
//   }, [lastScrollY]);

//   const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
//   const closeMenu = () => setIsMenuOpen(false);

//   const handleLogout = () => {
//     localStorage.removeItem("user");
//     setIsLoggedIn(false);
//     navigate("/login");
//   };

//   const navItems = [
//     { name: "Upload XML", path: "/upload" },
//     { name: "Reports", path: "/reports" },
//     { name: "About", path: "/about" },
//   ];

//   return (
//     <nav
//       className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 font-sans ${
//         isVisible ? "translate-y-0" : "-translate-y-full"
//       }`}
//       style={{ fontFamily: "Inter, system-ui, -apple-system, sans-serif" }}
//     >
//       <div className="bg-slate-50/80 backdrop-blur-md w-full relative overflow-hidden shadow-sm border-b border-slate-200/50">
//         <div className="flex items-center justify-between h-20 px-4 max-w-7xl mx-auto relative z-10">
//           {/* Brand logo */}
//           <div className="flex items-center">
//             <Link to="/" className="flex items-center">
//               <img
//                 src={nifimigratorlogo}
//                 alt="NiFi Migrator AI"
//                 className="h-20 object-contain"
//               />
//             </Link>
//           </div>

//           {/* Navigation links - Desktop */}
//           <div className="hidden md:flex items-center h-full ml-auto">
//             {isLoggedIn &&
//               navItems.map((item) => (
//                 <Link
//                   key={item.name}
//                   to={item.path}
//                   className={`h-full flex items-center justify-center px-4 text-lg font-semibold transition-all duration-300 rounded-lg ${
//                     location.pathname === item.path
//                       ? "text-blue-600 bg-blue-50"
//                       : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
//                   }`}
//                 >
//                   {item.name}
//                 </Link>
//               ))}

//             {/* Auth buttons (Login / Logout) */}
//             <div className="h-full flex items-center px-4">
//               {!isLoggedIn ? (
//                 <Link
//                   to="/login"
//                   className="border-2 border-blue-600 text-blue-600 px-6 py-2 rounded-full font-semibold text-lg bg-blue-50 hover:bg-blue-100 transition-all duration-200"
//                 >
//                   Login
//                 </Link>
//               ) : (
//                 <button
//                   onClick={handleLogout}
//                   className="border-2 border-red-500 text-red-600 px-6 py-2 rounded-full font-semibold text-lg bg-red-50 hover:bg-red-100 transition-all duration-200"
//                 >
//                   Logout
//                 </button>
//               )}
//             </div>

//             {/* CTA Desktop */}
//             {isLoggedIn && (
//               <div className="h-full flex items-center px-4">
//                 <Link
//                   to="/upload"
//                   className="text-white bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-full font-semibold text-lg shadow-md transition-all duration-200"
//                 >
//                   Start Migration
//                 </Link>
//               </div>
//             )}
//           </div>

//           {/* Mobile navigation controls */}
//           <div className="flex items-center md:hidden">
//             <button
//               onClick={toggleMenu}
//               className="inline-flex items-center justify-center p-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg focus:outline-none transition-colors duration-200"
//             >
//               <div className="relative flex items-center justify-center w-6 h-6">
//                 <span
//                   className={`absolute h-0.5 w-6 bg-current transition-all duration-300 ${
//                     isMenuOpen ? "rotate-45" : "-translate-y-1.5"
//                   }`}
//                 ></span>
//                 <span
//                   className={`absolute h-0.5 w-6 bg-current transition-all duration-300 ${
//                     isMenuOpen ? "opacity-0" : "opacity-100"
//                   }`}
//                 ></span>
//                 <span
//                   className={`absolute h-0.5 w-6 bg-current transition-all duration-300 ${
//                     isMenuOpen ? "-rotate-45" : "translate-y-1.5"
//                   }`}
//                 ></span>
//               </div>
//             </button>
//           </div>
//         </div>

//         {/* Mobile dropdown menu */}
//         <div
//           className={`transition-all duration-300 ease-in-out overflow-hidden md:hidden ${
//             isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
//           }`}
//         >
//           <div className="bg-slate-50/90 backdrop-blur-md flex flex-col border-t border-slate-200/50">
//             {isLoggedIn &&
//               navItems.map((item) => (
//                 <Link
//                   key={item.name}
//                   to={item.path}
//                   onClick={closeMenu}
//                   className={`flex items-center justify-center h-16 text-lg font-semibold transition-all duration-200 mx-4 my-1 rounded-lg ${
//                     location.pathname === item.path
//                       ? "text-blue-600 bg-blue-50"
//                       : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
//                   }`}
//                 >
//                   {item.name}
//                 </Link>
//               ))}

//             {/* Auth button mobile */}
//             <div className="flex items-center justify-center h-20 px-4">
//               {!isLoggedIn ? (
//                 <Link
//                   to="/login"
//                   onClick={closeMenu}
//                   className="border-2 w-full border-blue-600 text-blue-600 px-6 py-3 rounded-full font-semibold text-lg bg-blue-50 hover:bg-blue-100 transition-all duration-200 text-center"
//                 >
//                   Login
//                 </Link>
//               ) : (
//                 <button
//                   onClick={() => {
//                     handleLogout();
//                     closeMenu();
//                   }}
//                   className="border-2 w-full border-red-500 text-red-600 px-6 py-3 rounded-full font-semibold text-lg bg-red-50 hover:bg-red-100 transition-all duration-200 text-center"
//                 >
//                   Logout
//                 </button>
//               )}
//             </div>

//             {/* CTA Mobile */}
//             {isLoggedIn && (
//               <div className="flex items-center justify-center h-20 px-4">
//                 <Link
//                   to="/upload"
//                   onClick={closeMenu}
//                   className="w-full text-center text-white bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-full font-semibold text-lg shadow-md transition-all duration-200"
//                 >
//                   Start Migration
//                 </Link>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import nifimigratorlogo from "../assets/nifimigratorlogo-bg.png";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { i18n, t } = useTranslation(); // Traducción activa

  // Detecta si el usuario está logueado
  useEffect(() => {
    const user = localStorage.getItem("user");
    setIsLoggedIn(!!user);
  }, [location]);

  // Oculta / muestra navbar al hacer scroll
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

  // Alternar idioma EN ↔ ES
  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "es" : "en";
    i18n.changeLanguage(newLang);
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate("/login");
  };

  // Enlaces traducidos
  const navItems = [
    { name: t("upload"), path: "/upload" },
    { name: "Dashboard", path: "/dashboard" },
    { name: t("reports"), path: "/reports" },
    { name: t("about"), path: "/about" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 font-sans ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
      style={{ fontFamily: "Inter, system-ui, -apple-system, sans-serif" }}
    >
      <div className="bg-slate-50/80 backdrop-blur-md w-full shadow-sm border-b border-slate-200/50">
        <div className="flex items-center justify-between h-20 px-4 max-w-7xl mx-auto relative z-10">
          {/* Brand logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img
                src={nifimigratorlogo}
                alt="NiFi Migrator AI"
                className="h-20 object-contain"
              />
            </Link>
          </div>

          {/* Navigation links - Desktop */}
          <div className="hidden md:flex items-center h-full ml-auto">
            {isLoggedIn &&
              navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`h-full flex items-center justify-center px-4 text-lg font-semibold transition-all duration-300 rounded-lg ${
                    location.pathname === item.path
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  {item.name}
                </Link>
              ))}

            {/* 🌐 Language Toggle Button */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 ml-2 text-gray-600 hover:text-blue-600 transition-all duration-200 text-sm font-medium border border-gray-300 px-3 py-1 rounded-full hover:bg-blue-50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M12 3v1m0 16v1m8-9h1M3 12H2m15.364-7.364l.707.707M5.636 18.364l-.707.707M18.364 18.364l.707-.707M5.636 5.636l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z"
                />
              </svg>
              {i18n.language === "en" ? "EN" : "ES"}
            </button>

            {/* Auth buttons */}
            <div className="h-full flex items-center px-4">
              {!isLoggedIn ? (
                <Link
                  to="/login"
                  className="border-2 border-blue-600 text-blue-600 px-6 py-2 rounded-full font-semibold text-lg bg-blue-50 hover:bg-blue-100 transition-all duration-200"
                >
                  {t("login")}
                </Link>
              ) : (
                <button
                  onClick={handleLogout}
                  className="border-2 border-red-500 text-red-600 px-6 py-2 rounded-full font-semibold text-lg bg-red-50 hover:bg-red-100 transition-all duration-200"
                >
                  {t("logout")}
                </button>
              )}
            </div>

            {/* CTA Desktop */}
            {isLoggedIn && (
              <div className="h-full flex items-center px-4">
                <Link
                  to="/upload"
                  className="text-white bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-full font-semibold text-lg shadow-md transition-all duration-200"
                >
                  {t("startMigration")}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile navigation controls */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg focus:outline-none transition-colors duration-200"
            >
              <div className="relative flex items-center justify-center w-6 h-6">
                <span
                  className={`absolute h-0.5 w-6 bg-current transition-all duration-300 ${
                    isMenuOpen ? "rotate-45" : "-translate-y-1.5"
                  }`}
                ></span>
                <span
                  className={`absolute h-0.5 w-6 bg-current transition-all duration-300 ${
                    isMenuOpen ? "opacity-0" : "opacity-100"
                  }`}
                ></span>
                <span
                  className={`absolute h-0.5 w-6 bg-current transition-all duration-300 ${
                    isMenuOpen ? "-rotate-45" : "translate-y-1.5"
                  }`}
                ></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden md:hidden ${
            isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="bg-slate-50/90 backdrop-blur-md flex flex-col border-t border-slate-200/50">
            {/* Idioma móvil */}
            <button
              onClick={() => {
                toggleLanguage();
                closeMenu();
              }}
              className="flex items-center justify-center gap-2 text-gray-700 hover:text-blue-600 text-base font-medium py-3 border-b border-gray-200"
            >
              🌐 {i18n.language === "en" ? "English" : "Español"}
            </button>

            {isLoggedIn &&
              navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={closeMenu}
                  className={`flex items-center justify-center h-16 text-lg font-semibold transition-all duration-200 mx-4 my-1 rounded-lg ${
                    location.pathname === item.path
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  }`}
                >
                  {item.name}
                </Link>
              ))}

            {/* Auth button mobile */}
            <div className="flex items-center justify-center h-20 px-4">
              {!isLoggedIn ? (
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="border-2 w-full border-blue-600 text-blue-600 px-6 py-3 rounded-full font-semibold text-lg bg-blue-50 hover:bg-blue-100 transition-all duration-200 text-center"
                >
                  {t("login")}
                </Link>
              ) : (
                <button
                  onClick={() => {
                    handleLogout();
                    closeMenu();
                  }}
                  className="border-2 w-full border-red-500 text-red-600 px-6 py-3 rounded-full font-semibold text-lg bg-red-50 hover:bg-red-100 transition-all duration-200 text-center"
                >
                  {t("logout")}
                </button>
              )}
            </div>

            {/* CTA Mobile */}
            {isLoggedIn && (
              <div className="flex items-center justify-center h-20 px-4">
                <Link
                  to="/upload"
                  onClick={closeMenu}
                  className="w-full text-center text-white bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-full font-semibold text-lg shadow-md transition-all duration-200"
                >
                  {t("startMigration")}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

