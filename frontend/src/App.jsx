// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Upload from "./pages/Upload";
import About from "./pages/About";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Chatbot from "./components/chatbot/Chatbot";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <main className="pt-20 min-h-screen flex flex-col">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
      <Footer />
      <Chatbot />
    </BrowserRouter>
  );
}

export default App;
