"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  overlayVariant,
  modalVariant,
  fadeStaggerContainer,
  fadeItemUp,
} from "./motionConfig";

interface ModalPoliticaPrivacidadeProps {
  isOpen: boolean;
  onClose: () => void;
}

const sections = [
  {
    t: "Finalidade dos Dados",
    c: "Utilizamos informações fornecidas voluntariamente para apoiar buscas e investigações. Dados pessoais de contato só são compartilhados com autoridades competentes.",
  },
  {
    t: "Retenção",
    c: "As informações ficam armazenadas enquanto forem úteis para apuração ou exigidas por lei.",
  },
  {
    t: "Direitos do Usuário",
    c: "Você pode solicitar correção ou remoção de dados sensíveis enviando mensagem pelo canal de contato oficial.",
  },
  {
    t: "Segurança",
    c: "Medidas técnicas e administrativas são adotadas para proteger contra acesso não autorizado ou uso indevido.",
  },
];

export function ModalPoliticaPrivacidade({
  isOpen,
  onClose,
}: ModalPoliticaPrivacidadeProps) {
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
              className="relative w-full max-w-3xl bg-white rounded-xl shadow-xl"
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
                    Política de Privacidade
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Resumo simplificado
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
                {sections.map((s) => (
                  <motion.div
                    key={s.t}
                    variants={fadeItemUp}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <h3 className="font-semibold text-gray-900 mb-1">{s.t}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {s.c}
                    </p>
                  </motion.div>
                ))}
                <motion.p
                  variants={fadeItemUp}
                  className="text-xs text-gray-500"
                >
                  Este resumo não substitui a versão completa que poderá ser
                  publicada futuramente.
                </motion.p>
              </motion.div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default ModalPoliticaPrivacidade;
