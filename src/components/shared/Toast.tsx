"use client";

import { motion } from "framer-motion";

interface ToastProps {
  msg: string;
  tone: "success" | "info" | "error";
}

export function Toast({ msg, tone }: ToastProps) {
  const bgColor =
    tone === "success"
      ? "bg-green-500/80 text-white"
      : tone === "error"
        ? "bg-red-500/80 text-white"
        : "bg-blue-500/80 text-white";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9 }}
      className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-6 py-3 text-sm font-medium rounded-full shadow-lg backdrop-blur-md border border-white/10 ${bgColor}`}
    >
      {msg}
    </motion.div>
  );
}
