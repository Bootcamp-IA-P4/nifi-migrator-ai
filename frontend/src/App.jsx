// // src/App.jsx
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Home from "./pages/Home";
// import Upload from "./pages/Upload";
// import About from "./pages/About";
// import Report from "./pages/Report";
// import Login from "./pages/Login";
// import Signup from "./pages/Signup";
// import Navbar from "./components/Navbar";
// import Footer from "./components/Footer";
// import Chatbot from "./components/chatbot/Chatbot";
//  // 

// function App() {
//   return (
//     <BrowserRouter>
//       <Navbar />

//       <main className="pt-20 min-h-screen flex flex-col">
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/reports" element={<Report />} />
//           <Route path="/upload" element={<Upload />} />
//           <Route path="/about" element={<About />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/signup" element={<Signup />} />
//         </Routes>
//       </main>
//       <Footer />
//       <Chatbot />
//     </BrowserRouter>
//   );
// }

// export default App;
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Home from "./pages/Home";
import Upload from "./pages/Upload";
import About from "./pages/About";
import Report from "./pages/Report";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Chatbot from "./components/chatbot/Chatbot";
import "./i18n"; // importar la configuración de idiomas

function App() {
  const { i18n } = useTranslation();

  // Función para alternar idioma
  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "es" : "en";
    i18n.changeLanguage(newLang);
  };

  return (
    <BrowserRouter>
      <Navbar />
      <main className="pt-20 min-h-screen flex flex-col">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/reports" element={<Report />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </main>

      <Footer />
      <Chatbot />
    </BrowserRouter>
  );
}

export default App;
