// // // src/pages/Home.jsx
// // import React from "react";
// // import { motion } from "framer-motion";
// // import {
// //   Cpu,
// //   Upload,
// //   FileText,
// //   Shield,
// //   Zap,
// //   GitBranch,
// //   CheckCircle,
// //   Database,
// //   Info,
// // } from "lucide-react";

// // const Home = () => {
// //   const stats = [
// //     { number: "100%", label: "Automation", icon: <Zap size={20} /> },
// //     { number: "3+", label: "AI Agents", icon: <Cpu size={20} /> },
// //     { number: "50+", label: "Processors Mapped", icon: <GitBranch size={20} /> },
// //     { number: "0", label: "Manual Errors", icon: <CheckCircle size={20} /> },
// //   ];

// //   const features = [
// //     {
// //       icon: <Upload className="text-blue-500" size={28} />,
// //       title: "Upload NiFi XML",
// //       description:
// //         "Easily upload your NiFi 1.x flow for automated analysis and 2.x mapping.",
// //     },
// //     {
// //       icon: <Cpu className="text-green-500" size={28} />,
// //       title: "AI-Powered Insights",
// //       description:
// //         "Leverage intelligent CrewAI agents for migration optimization and recommendations.",
// //     },
// //     {
// //       icon: <FileText className="text-yellow-500" size={28} />,
// //       title: "Detailed Reports",
// //       description:
// //         "Receive clean, structured, and human-readable migration reports for your audits.",
// //     },
// //     {
// //       icon: <Shield className="text-red-500" size={28} />,
// //       title: "Error Detection",
// //       description:
// //         "Detect deprecated processors and configuration mismatches before migration.",
// //     },
// //   ];

// //   return (
// //     <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-gray-800 font-inter">
// //       {/* --- Hero Section --- */}
// //       <section className="relative pt-28 pb-20 overflow-hidden">
// //         <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.15),transparent_60%)]"></div>

// //         <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
// //           <motion.div
// //             initial={{ opacity: 0, y: 20 }}
// //             animate={{ opacity: 1, y: 0 }}
// //             transition={{ duration: 0.6 }}
// //             className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-5 py-2 rounded-full text-sm font-medium mb-8"
// //           >
// //             <Cpu size={16} />
// //             NiFi 1.x → 2.x Migration with AI
// //           </motion.div>

// //           <motion.h1
// //             initial={{ opacity: 0, y: 20 }}
// //             animate={{ opacity: 1, y: 0 }}
// //             transition={{ duration: 0.7 }}
// //             className="text-4xl md:text-6xl font-extrabold leading-tight mb-6"
// //           >
// //             Seamless <span className="text-blue-600">NiFi Migration</span> powered by{" "}
// //             <span className="text-gray-900">AI Agents</span>
// //           </motion.h1>

// //           <motion.p
// //             initial={{ opacity: 0 }}
// //             animate={{ opacity: 1 }}
// //             transition={{ delay: 0.2, duration: 0.7 }}
// //             className="text-lg md:text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed"
// //           >
// //             Upload your NiFi 1.x flow template and let our AI agents handle the
// //             complexity — analyzing, mapping, and preparing everything for a
// //             smooth 2.x transition.
// //           </motion.p>

// //           <motion.div
// //             initial={{ opacity: 0 }}
// //             animate={{ opacity: 1 }}
// //             transition={{ delay: 0.4 }}
// //             className="flex flex-col sm:flex-row gap-4 justify-center items-center"
// //           >
// //             <a
// //               href="/upload"
// //               className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg transition-all duration-300 flex items-center gap-2 hover:scale-105"
// //             >
// //               <Upload size={20} />
// //               Upload XML
// //             </a>
// //             <a
// //               href="/reports"
// //               className="border border-gray-300 hover:border-blue-400 hover:text-blue-600 py-4 px-8 rounded-xl font-medium flex items-center gap-2 transition-all duration-300"
// //             >
// //               <FileText size={20} />
// //               View Reports
// //             </a>
// //           </motion.div>
// //         </div>
// //       </section>

// //       {/* --- Stats Section --- */}
// //       <section className="py-12 px-6">
// //         <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
// //           {stats.map((stat, idx) => (
// //             <motion.div
// //               key={idx}
// //               initial={{ opacity: 0, y: 15 }}
// //               animate={{ opacity: 1, y: 0 }}
// //               transition={{ delay: idx * 0.1 }}
// //               className="bg-white/70 backdrop-blur-md rounded-2xl p-6 text-center shadow-sm border border-gray-200 hover:shadow-md hover:-translate-y-1 transition-all"
// //             >
// //               <div className="flex justify-center mb-2 text-blue-600">
// //                 {stat.icon}
// //               </div>
// //               <div className="text-3xl font-bold mb-1">{stat.number}</div>
// //               <div className="text-sm text-gray-600">{stat.label}</div>
// //             </motion.div>
// //           ))}
// //         </div>
// //       </section>

// //       {/* --- Features Section --- */}
// //       <section className="py-20 bg-gradient-to-br from-slate-50 to-slate-100">
// //         <div className="max-w-6xl mx-auto px-6 text-center">
// //           <h2 className="text-3xl md:text-4xl font-bold mb-4">
// //             Why choose <span className="text-blue-600">NiFi Migrator AI</span>?
// //           </h2>
// //           <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
// //             A smarter, faster, and error-free way to migrate your NiFi environments.
// //           </p>

// //           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
// //             {features.map((feature, idx) => (
// //               <motion.div
// //                 key={idx}
// //                 whileHover={{ scale: 1.04 }}
// //                 className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 transition-all"
// //               >
// //                 <div className="p-3 bg-blue-50 rounded-xl w-fit mx-auto mb-4">
// //                   {feature.icon}
// //                 </div>
// //                 <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
// //                 <p className="text-sm text-gray-600 leading-relaxed">
// //                   {feature.description}
// //                 </p>
// //               </motion.div>
// //             ))}
// //           </div>
// //         </div>
// //       </section>

// //       {/* --- Tips Section --- */}
// //       <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white text-center">
// //         <div className="max-w-4xl mx-auto px-6">
// //           <h2 className="text-3xl md:text-4xl font-bold mb-4">Pro Tips</h2>
// //           <p className="text-blue-100 mb-10">
// //             Make your migration smoother with these expert recommendations.
// //           </p>
// //           <div className="grid md:grid-cols-2 gap-6 text-left">
// //             {[
// //               "Export your NiFi 1.x flow as an XML template.",
// //               "Verify custom processors compatibility before migration.",
// //               "Review AI-generated mappings thoroughly.",
// //               "Save migration reports for auditing and compliance.",
// //             ].map((tip, idx) => (
// //               <motion.div
// //                 key={idx}
// //                 whileHover={{ scale: 1.02 }}
// //                 className="flex items-start gap-3 bg-white/10 p-4 rounded-xl border border-white/20"
// //               >
// //                 <Info size={20} className="text-blue-200 mt-1" />
// //                 <p className="text-blue-100 text-sm">{tip}</p>
// //               </motion.div>
// //             ))}
// //           </div>
// //         </div>
// //       </section>

// //       {/* --- CTA Section --- */}
// //       <section className="py-20 bg-gradient-to-r from-blue-700 to-indigo-800 text-center text-white">
// //         <motion.h2
// //           initial={{ opacity: 0, y: 15 }}
// //           animate={{ opacity: 1, y: 0 }}
// //           className="text-3xl md:text-4xl font-bold mb-4"
// //         >
// //           Ready to migrate your flows?
// //         </motion.h2>
// //         <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
// //           Start your automated migration analysis and receive your report within minutes.
// //         </p>
// //         <a
// //           href="/upload"
// //           className="inline-flex items-center gap-2 bg-white text-blue-700 font-semibold py-4 px-8 rounded-xl shadow-lg hover:scale-105 transition-transform"
// //         >
// //           <Database size={20} />
// //           Start Migration
// //         </a>
// //       </section>
// //     </div>
// //   );
// // };

// // export default Home;
// import React from "react";
// import { motion } from "framer-motion";
// import {
//   Cpu,
//   Upload,
//   FileText,
//   Shield,
//   Zap,
//   GitBranch,
//   CheckCircle,
//   Database,
//   Info,
// } from "lucide-react";

// const Home = () => {
//   const stats = [
//     { number: "100%", label: "Automation", icon: <Zap size={20} /> },
//     { number: "3+", label: "AI Agents", icon: <Cpu size={20} /> },
//     { number: "50+", label: "Processors Mapped", icon: <GitBranch size={20} /> },
//     { number: "0", label: "Manual Errors", icon: <CheckCircle size={20} /> },
//   ];

//   const features = [
//     {
//       icon: <Upload className="text-blue-600" size={28} />,
//       title: "Upload NiFi XML",
//       description:
//         "Easily upload your NiFi 1.x flow for automated analysis and 2.x mapping.",
//     },
//     {
//       icon: <Cpu className="text-green-600" size={28} />,
//       title: "AI-Powered Insights",
//       description:
//         "Leverage intelligent CrewAI agents for migration optimization and recommendations.",
//     },
//     {
//       icon: <FileText className="text-yellow-600" size={28} />,
//       title: "Detailed Reports",
//       description:
//         "Receive structured, human-readable migration reports ready for compliance and audits.",
//     },
//     {
//       icon: <Shield className="text-red-600" size={28} />,
//       title: "Error Detection",
//       description:
//         "Detect deprecated processors and configuration mismatches before migration.",
//     },
//   ];

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-white text-gray-800 font-inter">
//       {/* --- HERO SECTION --- */}
//       <section className="relative pt-32 pb-24 overflow-hidden">
//         {/* Background gradient accent */}
//         <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-slate-100"></div>

//         <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6 }}
//             className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-5 py-2 rounded-full text-sm font-medium mb-8"
//           >
//             <Cpu size={16} />
//             NiFi 1.x → 2.x Migration with AI
//           </motion.div>

//           <motion.h1
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.7 }}
//             className="text-5xl md:text-6xl font-extrabold leading-tight mb-6 tracking-tight text-slate-900"
//           >
//             The Future of <span className="text-blue-600">NiFi Migration</span> <br />
//             is <span className="text-gray-900">Automated</span> by AI
//           </motion.h1>

//           <motion.p
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.2, duration: 0.7 }}
//             className="text-lg md:text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed"
//           >
//             Upload your NiFi 1.x template and let our intelligent agents handle the mapping,
//             analysis, and transformation — giving you a seamless transition to 2.x in minutes.
//           </motion.p>

//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.4 }}
//             className="flex flex-col sm:flex-row gap-4 justify-center items-center"
//           >
//             <a
//               href="/upload"
//               className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-xl shadow-md transition-all duration-300 flex items-center gap-2 hover:scale-[1.03]"
//             >
//               <Upload size={20} />
//               Upload XML
//             </a>
//             <a
//               href="/reports"
//               className="border border-gray-300 hover:border-blue-400 hover:text-blue-600 py-4 px-8 rounded-xl font-medium flex items-center gap-2 transition-all duration-300"
//             >
//               <FileText size={20} />
//               View Reports
//             </a>
//           </motion.div>
//         </div>
//       </section>

//       {/* --- STATS SECTION --- */}
//       <section className="py-12 px-6 bg-white/60 backdrop-blur-sm border-t border-gray-100">
//         <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
//           {stats.map((stat, idx) => (
//             <motion.div
//               key={idx}
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: idx * 0.1 }}
//               className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all"
//             >
//               <div className="flex justify-center mb-3 text-blue-600">{stat.icon}</div>
//               <div className="text-3xl font-bold mb-1">{stat.number}</div>
//               <div className="text-sm text-gray-600">{stat.label}</div>
//             </motion.div>
//           ))}
//         </div>
//       </section>

//       {/* --- FEATURES SECTION --- */}
//       <section className="py-24 bg-gradient-to-br from-slate-50 via-white to-slate-100">
//         <div className="max-w-6xl mx-auto px-6 text-center">
//           <h2 className="text-4xl font-bold mb-4 tracking-tight text-slate-900">
//             Why <span className="text-blue-600">NiFi Migrator AI</span>?
//           </h2>
//           <p className="text-gray-600 mb-16 max-w-2xl mx-auto">
//             Save months of engineering work and eliminate human error with our automated AI migration engine.
//           </p>

//           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
//             {features.map((feature, idx) => (
//               <motion.div
//                 key={idx}
//                 whileHover={{ scale: 1.03 }}
//                 className="bg-white rounded-2xl p-8 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300"
//               >
//                 <div className="p-3 bg-blue-50 rounded-xl w-fit mx-auto mb-5">{feature.icon}</div>
//                 <h3 className="font-semibold text-lg mb-2 text-slate-800">{feature.title}</h3>
//                 <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* --- PRO TIPS SECTION --- */}
//       <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-center relative overflow-hidden">
//         <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/circuit-board.png')]"></div>
//         <div className="relative z-10 max-w-4xl mx-auto px-6">
//           <h2 className="text-3xl md:text-4xl font-bold mb-4">Pro Tips</h2>
//           <p className="text-blue-100 mb-12">
//             Get the most from your migration experience with these key insights.
//           </p>
//           <div className="grid md:grid-cols-2 gap-6 text-left">
//             {[
//               "Export your NiFi 1.x flow as an XML template.",
//               "Check for custom processors before migration.",
//               "Validate AI mappings and review compatibility.",
//               "Store reports for compliance and documentation.",
//             ].map((tip, idx) => (
//               <motion.div
//                 key={idx}
//                 whileHover={{ scale: 1.02 }}
//                 className="flex items-start gap-3 bg-white/10 p-4 rounded-xl border border-white/20"
//               >
//                 <Info size={20} className="text-blue-200 mt-1" />
//                 <p className="text-blue-100 text-sm">{tip}</p>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* --- CTA SECTION --- */}
//       <section className="py-24 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-center text-white">
//         <motion.h2
//           initial={{ opacity: 0, y: 15 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="text-3xl md:text-4xl font-bold mb-4"
//         >
//           Ready to start your migration?
//         </motion.h2>
//         <p className="text-blue-100 mb-10 max-w-2xl mx-auto">
//           Launch your AI-powered NiFi migration and receive your full report within minutes.
//         </p>
//         <a
//           href="/upload"
//           className="inline-flex items-center gap-2 bg-white text-blue-700 font-semibold py-4 px-8 rounded-xl shadow-lg hover:scale-[1.03] transition-transform"
//         >
//           <Database size={20} />
//           Start Migration
//         </a>
//       </section>
//     </div>
//   );
// };

// export default Home;

import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  Cpu,
  Upload,
  FileText,
  Shield,
  Zap,
  GitBranch,
  CheckCircle,
  Database,
  Info,
} from "lucide-react";

const Home = () => {
  const { t } = useTranslation();

  const stats = [
    { number: "100%", label: t("home.stats.automation"), icon: <Zap size={20} /> },
    { number: "3+", label: t("home.stats.agents"), icon: <Cpu size={20} /> },
    { number: "50+", label: t("home.stats.processors"), icon: <GitBranch size={20} /> },
    { number: "0", label: t("home.stats.errors"), icon: <CheckCircle size={20} /> },
  ];

  const features = [
    {
      icon: <Upload className="text-blue-600" size={28} />,
      title: t("home.features.upload.title"),
      description: t("home.features.upload.desc"),
    },
    {
      icon: <Cpu className="text-green-600" size={28} />,
      title: t("home.features.ai.title"),
      description: t("home.features.ai.desc"),
    },
    {
      icon: <FileText className="text-yellow-600" size={28} />,
      title: t("home.features.reports.title"),
      description: t("home.features.reports.desc"),
    },
    {
      icon: <Shield className="text-red-600" size={28} />,
      title: t("home.features.errors.title"),
      description: t("home.features.errors.desc"),
    },
  ];

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-white text-gray-800 font-inter">
      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-slate-100"></div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-5 py-2 rounded-full text-sm font-medium mb-8"
          >
            <Cpu size={16} />
            {t("home.hero.badge")}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-5xl md:text-6xl font-extrabold leading-tight mb-6 tracking-tight text-slate-900"
          >
            {t("home.hero.title1")}{" "}
            <span className="text-blue-600">{t("home.hero.title2")}</span> <br />
            {t("home.hero.title3")}{" "}
            <span className="text-gray-900">{t("home.hero.title4")}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="text-lg md:text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            {t("home.hero.subtitle")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <a
              href="/upload"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-xl shadow-md transition-all duration-300 flex items-center gap-2 hover:scale-[1.03]"
            >
              <Upload size={20} />
              {t("home.hero.uploadBtn")}
            </a>
            <a
              href="/reports"
              className="border border-gray-300 hover:border-blue-400 hover:text-blue-600 py-4 px-8 rounded-xl font-medium flex items-center gap-2 transition-all duration-300"
            >
              <FileText size={20} />
              {t("home.hero.reportsBtn")}
            </a>
          </motion.div>
        </div>
      </section>

      {/* --- STATS SECTION --- */}
      <section className="py-12 px-6 bg-white/60 backdrop-blur-sm border-t border-gray-100">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all"
            >
              <div className="flex justify-center mb-3 text-blue-600">{stat.icon}</div>
              <div className="text-3xl font-bold mb-1">{stat.number}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section className="py-24 bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4 tracking-tight text-slate-900">
            {t("home.features.title")}
          </h2>
          <p className="text-gray-600 mb-16 max-w-2xl mx-auto">
            {t("home.features.subtitle")}
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.03 }}
                className="bg-white rounded-2xl p-8 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300"
              >
                <div className="p-3 bg-blue-50 rounded-xl w-fit mx-auto mb-5">{feature.icon}</div>
                <h3 className="font-semibold text-lg mb-2 text-slate-800">{feature.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- PLANS SECTION --- */}
      <section className="py-24 bg-gradient-to-b from-slate-50 via-white to-slate-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.07),transparent_70%)]"></div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900">
            {t("home.plans.title")}
          </h2>
          <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
            {t("home.plans.subtitle")}
          </p>

          {/* Carousel */}
          <div className="flex overflow-x-auto gap-8 snap-x snap-mandatory scrollbar-hide px-4 md:px-0">
            {plans.map((plan, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.03 }}
                className={`snap-center min-w-[85%] sm:min-w-[45%] md:min-w-[30%] bg-white rounded-2xl shadow-lg border transition-all duration-300 p-8 ${
                  plan.highlight
                    ? "border-blue-600 shadow-blue-100"
                    : "border-gray-200 hover:shadow-xl"
                }`}
              >
                <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-6 text-sm">{plan.description}</p>
                <div className="text-3xl font-extrabold text-blue-600 mb-6">
                  {plan.price}
                </div>
                <ul className="text-left space-y-3 mb-8">
                  {plan.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-center gap-2 text-gray-700 text-sm">
                      <CheckCircle className="text-blue-500" size={18} />
                      {feature}
                    </li>
                  ))}
                </ul>
                <a
                  href="/signup"
                  className={`inline-block w-full font-semibold py-3 rounded-xl transition-all duration-300 ${
                    plan.highlight
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "border border-gray-300 hover:border-blue-500 hover:text-blue-600"
                  }`}
                >
                  {t("home.plans.cta")}
                </a>
              </motion.div>
            ))}
          </div>

          <p className="text-sm text-gray-500 mt-6">← {t("home.plans.scroll")} →</p>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="py-24 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-center text-white">
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-bold mb-4"
        >
          {t("home.cta.title")}
        </motion.h2>
        <p className="text-blue-100 mb-10 max-w-2xl mx-auto">{t("home.cta.subtitle")}</p>
        <a
          href="/upload"
          className="inline-flex items-center gap-2 bg-white text-blue-700 font-semibold py-4 px-8 rounded-xl shadow-lg hover:scale-[1.03] transition-transform"
        >
          <Database size={20} />
          {t("home.cta.button")}
        </a>
      </section>
    </div>
  );
};

export default Home;
