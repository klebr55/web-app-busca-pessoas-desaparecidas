"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  overlayVariant,
  modalVariant,
  fadeStaggerContainer,
  fadeItemUp,
} from "./motionConfig";

interface ModalCookiesProps {
  isOpen: boolean;
  onClose: () => void;
}

const infos = [
  {
    t: "O que são cookies?",
    c: "Pequenos arquivos armazenados no navegador para lembrar preferências e melhorar a experiência.",
  },
  {
    t: "Cookies Essenciais",
    c: "Necessários para funcionamento básico (ex: manter sessão de navegação e acessibilidade).",
  },
  {
    t: "Cookies de Métricas",
    c: "Podem ser usados futuramente para entender acessos e melhorar a ferramenta (anonimizados).",
  },
  {
    t: "Controle",
    c: "Você pode limpar ou bloquear cookies nas configurações do seu navegador.",
  },
];

export function ModalCookies({ isOpen, onClose }: ModalCookiesProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            variants={overlayVariant}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-0 z-50 flex items-start justify-center p-4 md:p-8 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative w-full max-w-2xl bg-white rounded-xl shadow-xl"
              variants={modalVariant}
              initial="hidden"
              animate="visible"
              exit="exit"
              layout
            >
              <motion.div
                className="flex items-start justify-between p-6 border-b border-gray-200"
                variants={fadeStaggerContainer}
                initial="hidden"
                animate="visible"
              >
                <motion.div variants={fadeItemUp}>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Política de Cookies
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Como usamos e controlamos
                  </p>
                </motion.div>
                <motion.button
                  variants={fadeItemUp}
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </motion.button>
              </motion.div>
              <motion.div
                className="p-6 space-y-6"
                variants={fadeStaggerContainer}
                initial="hidden"
                animate="visible"
              >
                {infos.map((i) => (
                  <motion.div
                    key={i.t}
                    variants={fadeItemUp}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <h3 className="font-semibold text-gray-900 mb-1">{i.t}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {i.c}
                    </p>
                  </motion.div>
                ))}
                <motion.p
                  variants={fadeItemUp}
                  className="text-xs text-gray-500"
                >
                  Nenhum cookie de rastreamento sensível está ativo nesta
                  versão.
                </motion.p>
              </motion.div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default ModalCookies;
