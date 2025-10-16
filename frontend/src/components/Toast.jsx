import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Toast = ({ message, type = "info", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => onClose(), 3500);
    return () => clearTimeout(timer);
  }, [onClose]);

  const colors = {
    success: "bg-green-500/90 text-white",
    error: "bg-red-500/90 text-white",
    info: "bg-blue-600/90 text-white",
  };

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg backdrop-blur-md ${colors[type]} flex items-center gap-3`}
        >
          {type === "success" && <span>✅</span>}
          {type === "error" && <span>❌</span>}
          {type === "info" && <span>ℹ️</span>}
          <p className="font-medium text-sm">{message}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
