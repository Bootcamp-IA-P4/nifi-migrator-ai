// src/pages/About.jsx
import React from "react";

function About() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6 md:px-16 font-sans">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-2xl p-8 md:p-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
          About <span className="text-blue-600">NEXOPS</span>
        </h1>

        <p className="text-gray-700 leading-relaxed mb-4">
          <b className="text-blue-600">NEXOPS</b> is a multidisciplinary team
          focused on innovation in data integration and system migration. Our
          mission is to simplify the migration process from{" "}
          <b className="text-gray-900">Apache NiFi 1.x → NiFi 2.x</b> using
          Artificial Intelligence.
        </p>

        <p className="text-gray-700 leading-relaxed mb-10">
          Our team combines expertise in{" "}
          <b className="text-gray-900">
            AI, Full-Stack Development, Data Engineering, and Cloud Technologies
          </b>{" "}
          to deliver robust and scalable solutions.
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Our Vision
        </h2>
        <p className="text-gray-700 leading-relaxed mb-10">
          To become pioneers in intelligent migration frameworks that reduce
          risks, accelerate adoption, and empower enterprises to modernize their
          data infrastructure.
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Team Values
        </h2>
        <ul className="space-y-3 text-gray-700">
          <li className="flex items-center gap-2">
            🚀 <span>Innovation through AI</span>
          </li>
          <li className="flex items-center gap-2">
            🤝 <span>Collaboration and knowledge sharing</span>
          </li>
          <li className="flex items-center gap-2">
            ⚡ <span>Efficiency and automation</span>
          </li>
          <li className="flex items-center gap-2">
            📈 <span>Scalability and future-proofing</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default About;
