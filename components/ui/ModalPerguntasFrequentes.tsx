"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  overlayVariant,
  modalVariant,
  fadeStaggerContainer,
  fadeItemUp,
} from "./motionConfig";

interface ModalPerguntasFrequentesProps {
  isOpen: boolean;
  onClose: () => void;
}

const faqs = [
  {
    q: "Como posso enviar uma informação?",
    a: 'Clique no botão "Adicionar Informações" no rodapé ou no perfil da pessoa e preencha o formulário. Suas informações serão analisadas de forma confidencial.',
  },
  {
    q: "Posso enviar fotos?",
    a: "Sim, até 3 fotos (máx 5MB cada) que ajudem na identificação ou último avistamento.",
  },
  {
    q: "Quem valida os dados?",
    a: "A Polícia Civil realiza verificação e cruzamento com registros oficiais antes de publicar ou agir.",
  },
  {
    q: "O que significa pessoa localizada?",
    a: "Indica que a pessoa foi encontrada e o caso foi encerrado para buscas públicas.",
  },
];

export function ModalPerguntasFrequentes({
  isOpen,
  onClose,
}: ModalPerguntasFrequentesProps) {
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
                    Perguntas Frequentes
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Principais dúvidas sobre a plataforma
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
                className="p-6 space-y-4"
                variants={fadeStaggerContainer}
                initial="hidden"
                animate="visible"
              >
                {faqs.map((f) => (
                  <motion.details
                    key={f.q}
                    variants={fadeItemUp}
                    className="group border border-gray-200 rounded-lg p-4 open:bg-gray-50"
                  >
                    <summary className="cursor-pointer select-none font-medium text-gray-800 flex items-center justify-between">
                      {f.q}
                      <span className="ml-2 text-gray-400 group-open:rotate-180 transition-transform">
                        ▾
                      </span>
                    </summary>
                    <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                      {f.a}
                    </p>
                  </motion.details>
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default ModalPerguntasFrequentes;
