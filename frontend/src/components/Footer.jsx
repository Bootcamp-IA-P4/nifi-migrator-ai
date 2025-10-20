// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaTwitter, FaLinkedin, FaGithub } from 'react-icons/fa';
import nifimigratorlogo from '../assets/nifimigratorlogo-bg.png';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: 'Upload XML', path: '/upload' },
      { name: 'Reports', path: '/reports' },
      { name: 'Docs', path: '/docs' },
      { name: 'Pricing', path: '/pricing' }
    ],
    company: [
      { name: 'About', path: '/about' },
      { name: 'Contact', path: '/contact' },
      { name: 'Careers', path: '/careers' },
      { name: 'Blog', path: '/blog' }
    ],
    legal: [
      { name: 'Privacy Policy', path: '/privacy' },
      { name: 'Terms of Service', path: '/terms' },
      { name: 'Cookie Policy', path: '/cookies' },
      { name: 'GDPR', path: '/gdpr' }
    ]
  };

  const socialLinks = [
    { name: 'Twitter', icon: FaTwitter, url: '#' },
    { name: 'LinkedIn', icon: FaLinkedin, url: '#' },
    { name: 'GitHub', icon: FaGithub, url: '#' }
  ];

  return (
    <footer className="mt-auto border-t bg-slate-50/80 backdrop-blur-md border-slate-200/50">
      <div className="px-4 py-12 mx-auto max-w-7xl lg:px-8">
        
        {/* Main footer content */}
        <div className="mb-8">
          <div className="mb-8 lg:mb-0 lg:grid lg:grid-cols-5 lg:gap-8">
            
            {/* Brand section */}
            <div className="mb-8 text-center lg:col-span-2 md:text-left lg:mb-0">
              <Link to="/" className="flex items-center justify-center mb-4 md:justify-start">
                <img 
                  src={nifimigratorlogo} 
                  alt="NiFi Migrator AI" 
                  className="object-contain w-40 h-auto"
                />
              </Link>
              <p className="max-w-md mx-auto mb-6 text-base leading-relaxed text-slate-600 md:mx-0">
                NiFi Migrator AI simplifica tu transición de NiFi 1.x → 2.x.  
                Sube tus flujos XML, genera reportes detallados y automatiza la migración con insights basados en IA.
              </p>

              {/* Social links */}
              <div className="flex justify-center space-x-4 md:justify-start">
                {socialLinks.map((social) => {
                  const IconComponent = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.url}
                      className="flex items-center justify-center w-10 h-10 transition-all duration-200 rounded-lg bg-slate-100/60 hover:bg-indigo-50/70 text-slate-600 hover:text-indigo-600"
                      aria-label={social.name}
                    >
                      <IconComponent className="w-5 h-5" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Links sections */}
            <div className="grid grid-cols-3 gap-6 lg:contents lg:gap-8">
              {Object.entries(footerLinks).map(([section, links]) => (
                <div key={section} className="text-center lg:text-left">
                  <h3 className="mb-3 text-base font-semibold text-slate-800 lg:text-lg lg:mb-4 capitalize">
                    {section}
                  </h3>
                  <ul className="space-y-2 lg:space-y-3">
                    {links.map((link) => (
                      <li key={link.name}>
                        <Link
                          to={link.path}
                          className="text-sm transition-colors duration-200 text-slate-600 hover:text-indigo-500 lg:text-base"
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Newsletter section */}
        <div className="pt-8 pb-8 border-t border-slate-200/50">
          <div className="grid items-center grid-cols-1 gap-6 text-center lg:grid-cols-2 lg:text-left">
            <div>
              <h3 className="mb-2 text-lg font-semibold text-slate-800">
                Stay updated with NiFi Migrator AI
              </h3>
              <p className="text-base text-slate-600">
                Get the latest migration strategies, feature releases, and AI-powered insights.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 transition-all duration-200 border rounded-lg bg-white/60 border-slate-300 text-slate-700 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400"
              />
              <button 
                className="px-6 py-3 font-semibold text-white transition-all duration-200 rounded-full bg-indigo-600 hover:bg-indigo-700 whitespace-nowrap"
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="pt-6 border-t border-slate-200/50">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-slate-500">
              © {currentYear} NiFi Migrator AI. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
