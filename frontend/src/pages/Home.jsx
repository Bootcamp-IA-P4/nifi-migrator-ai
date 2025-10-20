import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  Upload,
  FileText,
  Database,
  Sun,
  Moon,
  Zap,
  Cpu,
  GitBranch,
  CheckCircle,
  Settings,
  Brain,
  ShieldCheck,
  BarChart3,
} from "lucide-react";

const Home = () => {
  const { t } = useTranslation();
  const [darkMode, setDarkMode] = useState(false);
  const [currentWord, setCurrentWord] = useState(0);
  const carouselRef = useRef(null);
  const rotatingWords = t("home.hero.rotating", { returnObjects: true }) || [];

  // 🌙 Persistent dark mode
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
    if (!darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  // 🔁 Hero rotating text
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % rotatingWords.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [rotatingWords.length]);

  const plans = [
    {
      name: t("home.plans.starter.name"),
      description: t("home.plans.starter.desc"),
      price: t("home.plans.starter.price"),
      features: t("home.plans.starter.features", { returnObjects: true }),
      highlight: false,
    },
    {
      name: t("home.plans.pro.name"),
      description: t("home.plans.pro.desc"),
      price: t("home.plans.pro.price"),
      features: t("home.plans.pro.features", { returnObjects: true }),
      highlight: true,
    },
    {
      name: t("home.plans.enterprise.name"),
      description: t("home.plans.enterprise.desc"),
      price: t("home.plans.enterprise.price"),
      features: t("home.plans.enterprise.features", { returnObjects: true }),
      highlight: false,
    },
  ];

  // 📱 Scroll arrows for plans
  const scrollLeft = () => {
    if (carouselRef.current) carouselRef.current.scrollBy({ left: -400, behavior: "smooth" });
  };
  const scrollRight = () => {
    if (carouselRef.current) carouselRef.current.scrollBy({ left: 400, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0f172a] text-slate-800 dark:text-slate-100 font-inter transition-colors duration-500 overflow-hidden">
      {/* 🌙 Dark Mode Toggle */}
      {/* <button
        onClick={toggleDarkMode}
        className="fixed top-6 right-6 z-50 p-3 rounded-full bg-white dark:bg-[#1e293b] shadow-md hover:scale-105 transition-all"
      >
        {darkMode ? <Sun className="text-yellow-400" /> : <Moon className="text-[#006fff]" />}
      </button> */}

      {/* --- HERO --- */}
      <section className="relative h-[90vh] flex flex-col justify-center items-center text-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center brightness-[0.55]"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=2000&q=80')",
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#001a3f]/90 via-[#003b7a]/80 to-[#006fff]/80 dark:from-[#000814]/95 dark:via-[#001d3d]/90 dark:to-[#003566]/85"></div>

        <div className="relative z-10 px-6 max-w-5xl">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-extrabold mb-6 text-white leading-tight drop-shadow-[0_3px_20px_rgba(0,111,255,0.7)]"
          >
            {t("home.hero.title1")}{" "}
            <span className="text-blue-300">{t("home.hero.title2")}</span>
            <br />
            {t("home.hero.title3")}{" "}
            <motion.span
              key={currentWord}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="text-white"
            >
              {rotatingWords[currentWord]}
            </motion.span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-lg md:text-xl text-blue-100 mb-12 max-w-2xl mx-auto"
          >
            {t("home.hero.subtitle")}
          </motion.p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/upload"
              className="bg-white text-[#006fff] font-semibold py-4 px-8 rounded-xl shadow-lg hover:scale-[1.03] transition-transform"
            >
              <Upload size={18} />
              {t("home.hero.uploadBtn")}
            </a>
            <a
              href="/reports"
              className="border border-white/40 text-white hover:bg-white/10 py-4 px-8 rounded-xl font-medium transition-all duration-300"
            >
              <FileText size={18} />
              {t("home.hero.reportsBtn")}
            </a>
          </div>
        </div>
      </section>
      {/* --- CASE STUDIES SECTION (REAL TECH IMPACT AUTO CAROUSEL) --- */}
      <section className="relative py-28 bg-gradient-to-b from-[#001d3d] via-[#002b5b] to-[#004aad] text-white overflow-hidden">
        {(() => {
          const carouselRef = useRef(null);

          useEffect(() => {
            const carousel = carouselRef.current;
            if (!carousel) return;

            let scrollPosition = 0;
            const scrollSpeed = 0.5; // ⚙️ velocidad más fluida (ajusta entre 0.3 y 1)
            const animate = () => {
              if (carousel.scrollLeft >= carousel.scrollWidth - carousel.clientWidth) {
                carousel.scrollLeft = 0; // vuelve al inicio
              } else {
                carousel.scrollLeft += scrollSpeed;
              }
              requestAnimationFrame(animate);
            };
            requestAnimationFrame(animate);

            return () => cancelAnimationFrame(animate);
          }, []);

          return (
            <div className="max-w-7xl mx-auto px-6">
              {/* Header */}
              <div className="text-center mb-16">
                <span className="inline-flex items-center gap-2 px-4 py-1 text-sm bg-blue-500/10 text-blue-400 rounded-full border border-blue-500/20">
                  {t("home.caseStudies.badge")}
                </span>
                <h2 className="text-4xl md:text-5xl font-bold mt-6 leading-tight">
                  {t("home.caseStudies.title")}{" "}
                  <span className="text-blue-400">NiFi Migrator AI</span>
                </h2>
                <p className="mt-4 text-blue-100 max-w-3xl mx-auto">
                  {t("home.caseStudies.subtitle")}
                </p>
              </div>

              {/* Auto sliding cards */}
              <div
                ref={carouselRef}
                className="flex gap-10 overflow-hidden scroll-smooth transition-transform duration-700"
              >
                {t("home.caseStudies.cases", { returnObjects: true }).map((caseItem, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: i * 0.2 }}
                    className="relative bg-white/10 rounded-2xl overflow-hidden border border-blue-500/20 hover:shadow-blue-400/20 hover:-translate-y-2 transition-all duration-500 min-w-[360px] lg:min-w-[420px]"
                  >
                    <div className="overflow-hidden h-60">
                      <img
                        src={
                          caseItem.img ||
                          [
                            "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=900&q=80",
                            "https://images.unsplash.com/photo-1629904853893-c2c8981a1dc5?auto=format&fit=crop&w=1000&q=80",
                            "https://images.unsplash.com/photo-1581090700227-1e37b190418e?auto=format&fit=crop&w=1000&q=80",
                            "https://plus.unsplash.com/premium_photo-1680700308578-b40c7418e997?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2574",
                            "https://images.unsplash.com/photo-1605902711622-cfb43c4437b5?auto=format&fit=crop&w=900&q=80",
                          ][i % 5]
                        }
                        alt={caseItem.title}
                        className="object-cover w-full h-full hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                    <div className="p-8">
                      <div className="text-3xl font-bold text-blue-400">{caseItem.stat}</div>
                      <div className="text-sm uppercase tracking-wide text-blue-200 mb-4">
                        {caseItem.label}
                      </div>
                      <h3 className="text-xl font-semibold mb-3">{caseItem.title}</h3>
                      <p className="text-blue-100">{caseItem.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })()}

        {/* Glow effect */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(0,111,255,0.25),transparent_70%)] pointer-events-none"></div>
      </section>

      {/* --- HOW IT WORKS --- */}
      <section className="py-24 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-[#0f172a] dark:via-[#1e293b] dark:to-[#0f172a] text-center">
        <h2 className="text-4xl font-bold mb-12 text-[#006fff]">
          {t("home.features.title")}
        </h2>
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10 px-6">
          {t("home.features.steps", { returnObjects: true }).map((step, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 p-8 transition-all duration-300 hover:shadow-blue-200 dark:hover:shadow-blue-900"
            >
              <h3 className="text-xl font-semibold mb-3 text-[#006fff]">
                {step.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>



      {/* --- WHY USE NIFI MIGRATOR AI --- */}
      <section className="relative py-24 bg-gradient-to-b from-[#0f172a] to-[#001d3d] text-white overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          {/* Texto */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold mb-6">{t("home.about.title")}</h2>
            <p className="text-blue-100 leading-relaxed mb-6 text-lg">
              {t("home.about.paragraph1")}
            </p>
            <p className="text-blue-200 leading-relaxed">{t("home.about.paragraph2")}</p>
          </motion.div>

          {/* Imagen */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative flex justify-center items-center"
          >
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#006fff]/40 blur-3xl rounded-full"></div>
            <img
              src="https://plus.unsplash.com/premium_photo-1760507717748-ce78eea094ef?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2942"
              alt="NiFi AI Migration Visualization"
              className="rounded-2xl shadow-2xl border border-blue-500/20 max-h-[420px] object-cover object-center"
            />
            <div className="absolute -bottom-8 -left-8 w-28 h-28 bg-blue-400/20 blur-2xl rounded-full"></div>
          </motion.div>
        </div>
      </section>

      {/* --- USE CASES --- */}
      <section className="py-24 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-[#0f172a] dark:via-[#1e293b] dark:to-[#0f172a] text-center">
        <h2 className="text-4xl font-bold mb-12 text-[#006fff]">
          {t("home.useCases.title")}
        </h2>
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10 px-6">
          {t("home.useCases.items", { returnObjects: true }).map((user, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 p-8 transition-all duration-300 hover:shadow-blue-200 dark:hover:shadow-blue-900"
            >
              <h3 className="text-xl font-semibold mb-3">{user.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                {user.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>
      {/* --- TECH ADVANTAGES --- */}
      <section className="relative py-28 bg-gradient-to-b from-[#001d3d] via-[#002b5b] to-[#004aad] text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,111,255,0.15),transparent_70%)] blur-3xl"></div>

        <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl font-bold mb-14">{t("home.tech.title")}</h2>

          {/* Carrusel contenedor */}
          <div className="relative overflow-hidden">
            <motion.div
              className="flex gap-8"
              animate={{
                x: ["0%", "-50%"], // movimiento suave
              }}
              transition={{
                repeat: Infinity,
                duration: 20, // velocidad
                ease: "linear",
              }}
            >
              {/* Doble mapeo para loop infinito */}
              {[...Array(2)].map((_, loopIdx) =>
                t("home.tech.items", { returnObjects: true }).map((item, i) => (
                  <div
                    key={`${loopIdx}-${i}`}
                    className="min-w-[260px] sm:min-w-[300px] md:min-w-[320px] bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-blue-500/20 shadow-lg hover:shadow-blue-400/20 transition-all flex-shrink-0"
                  >
                    <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                    <p className="text-blue-100 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                ))
              )}
            </motion.div>
          </div>
        </div>
      </section>


      {/* --- PLANS --- */}
      <section className="py-28 bg-gradient-to-b from-white via-slate-50 to-white dark:from-[#0f172a] dark:via-[#1e293b] dark:to-[#0f172a] text-center">
        <h2 className="text-4xl font-bold mb-6">{t("home.plans.title")}</h2>
        <p className="text-slate-600 dark:text-slate-300 mb-12 max-w-2xl mx-auto">
          {t("home.plans.subtitle")}
        </p>

        <div className="grid md:grid-cols-3 gap-10 px-6 max-w-6xl mx-auto">
          {plans.map((plan, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.03 }}
              className={`flex flex-col justify-between bg-white dark:bg-[#1e293b] rounded-2xl shadow-lg border transition-all duration-300 p-8 ${
                plan.highlight
                  ? "border-[#006fff] shadow-blue-100 dark:border-[#006fff]"
                  : "border-slate-200 dark:border-slate-700 hover:shadow-xl"
              }`}
            >
              <div>
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm">
                  {plan.description}
                </p>
                <div className="text-3xl font-extrabold text-[#006fff] mb-6">
                  {plan.price}
                </div>
                <ul className="text-left space-y-3 mb-8">
                  {plan.features.map((feature, fIdx) => (
                    <li
                      key={fIdx}
                      className="text-slate-700 dark:text-slate-300 text-sm"
                    >
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <a
                href="/signup"
                className={`inline-block w-full font-semibold py-3 rounded-xl transition-all duration-300 text-center ${
                  plan.highlight
                    ? "bg-[#006fff] hover:bg-blue-700 text-white"
                    : "border border-slate-300 dark:border-slate-600 hover:border-[#006fff] hover:text-[#006fff]"
                }`}
              >
                {t("home.plans.cta")}
              </a>
            </motion.div>
          ))}
        </div>
      </section>
    
      {/* --- CTA FINAL --- */}
      <section className="py-28 bg-[#006fff] text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1533745848184-3db07256e163?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#006fff]/95 to-blue-700/90"></div>

        <div className="relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            {t("home.cta.title")}
          </motion.h2>
          <p className="text-blue-100 mb-10 max-w-2xl mx-auto text-lg">
            {t("home.cta.subtitle")}
          </p>
          <a
            href="/upload"
            className="inline-flex items-center gap-2 bg-white text-[#006fff] font-semibold py-4 px-8 rounded-xl shadow-lg hover:scale-[1.03] transition-transform"
          >
            <Database size={18} />
            {t("home.cta.button")}
          </a>
        </div>
      </section>
    </div>
  );
};

export default Home;

