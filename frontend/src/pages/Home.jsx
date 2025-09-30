// src/pages/Home.jsx
import React from "react";
import { 
  Cpu, 
  Upload, 
  FileText, 
  Shield, 
  Zap, 
  GitBranch, 
  CheckCircle, 
  Database, 
  Info
} from "lucide-react";

const Home = () => {
  const stats = [
    { number: "100%", label: "Automation", icon: <Zap size={20} /> },
    { number: "3+", label: "AI Agents", icon: <Cpu size={20} /> },
    { number: "50+", label: "Processors Mapped", icon: <GitBranch size={20} /> },
    { number: "0", label: "Manual Errors", icon: <CheckCircle size={20} /> },
  ];

  const features = [
    {
      icon: <Upload className="text-blue-500" size={28} />,
      title: "Upload NiFi XML",
      description: "Easily upload your NiFi 1.x flow template for automated migration analysis.",
    },
    {
      icon: <Cpu className="text-green-500" size={28} />,
      title: "AI-Powered Insights",
      description: "Get migration recommendations powered by intelligent CrewAI agents.",
    },
    {
      icon: <FileText className="text-yellow-500" size={28} />,
      title: "Detailed Reports",
      description: "Receive structured and human-readable migration reports with mapping details.",
    },
    {
      icon: <Shield className="text-red-500" size={28} />,
      title: "Error Detection",
      description: "Identify deprecated processors and potential issues before migration.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="pt-20 pb-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Cpu size={16} />
            AI-Powered NiFi 1.x → 2.x Migration
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6 leading-tight">
            Seamless <span className="text-blue-600">NiFi Migration</span> <br />
            from 1.x to <span className="text-gray-900">2.x</span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Upload your NiFi 1.x XML template and let our AI agents generate a
            complete migration report with mappings, recommendations, and risk detection.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <a
              href="/upload"
              className="group bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
            >
              <Upload size={20} />
              Upload XML
            </a>

            <a
              href="/reports"
              className="text-gray-700 hover:text-blue-600 font-medium py-4 px-6 rounded-xl border border-gray-200 hover:border-blue-200 transition-all duration-300 flex items-center gap-2"
            >
              <FileText size={20} />
              View Reports
            </a>
          </div>
        </div>

        {/* Stats Section */}
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 text-center border border-gray-200 hover:bg-white/90 transition-all duration-300"
            >
              <div className="flex justify-center mb-2 text-blue-600">{stat.icon}</div>
              <div className="text-3xl font-bold text-gray-800 mb-1">{stat.number}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 px-4 bg-white/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Why use <span className="text-blue-600">NiFi Migrator AI</span>?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-12">
            Simplify your migration journey with automation, AI, and professional-grade insights.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200"
              >
                <div className="mb-4 p-3 bg-gray-50 rounded-xl w-fit mx-auto group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="py-16 px-4 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Pro Tips</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Get the most out of your migration with these quick tips.
          </p>

          <div className="grid md:grid-cols-2 gap-6 text-left">
            {[
              "Export your NiFi 1.x flow as an XML template.",
              "Check for custom processors before migration.",
              "Review AI recommendations carefully.",
              "Save migration reports for compliance and audits.",
            ].map((tip, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 bg-white/10 p-4 rounded-xl border border-white/20"
              >
                <Info size={20} className="text-blue-200 mt-1" />
                <p className="text-blue-100 text-sm">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 px-4 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to migrate your flows?
          </h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Get started today and generate detailed migration reports with just one upload.
          </p>

          <a
            href="/upload"
            className="group bg-white text-blue-600 hover:bg-gray-50 font-semibold py-4 px-8 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2 mx-auto w-fit"
          >
            <Database size={20} />
            Start Migration
          </a>
        </div>
      </div>
    </div>
  );
};

export default Home;

