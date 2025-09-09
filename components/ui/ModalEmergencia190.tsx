"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  overlayVariant,
  modalVariant,
  fadeStaggerContainer,
  fadeItemUp,
} from "./motionConfig";

interface ModalEmergencia190Props {
  isOpen: boolean;
  onClose: () => void;
}

const passos = [
  "Mantenha a calma e fale claramente.",
  "Informe cidade, bairro, rua e ponto de referência.",
  "Descreva o fato resumidamente (ex: pessoa vista em condição de risco).",
  "Não encerre a ligação até a orientação do atendente.",
  "Evite deslocar-se sozinho para áreas de risco.",
];

export function ModalEmergencia190({
  isOpen,
  onClose,
}: ModalEmergencia190Props) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
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
              className="relative w-full max-w-xl bg-white rounded-xl shadow-xl"
              variants={modalVariant}
              initial="hidden"
              animate="visible"
              exit="exit"
              layout
            >
              <motion.div
                className="flex items-start justify-between p-6 border-b border-red-200 bg-red-50"
                variants={fadeStaggerContainer}
                initial="hidden"
                animate="visible"
              >
                <motion.div variants={fadeItemUp}>
                  <h2 className="text-2xl font-bold text-red-700">
                    Emergência 190
                  </h2>
                  <p className="text-sm text-red-600 mt-1">
                    Use apenas em situações reais de urgência
                  </p>
                </motion.div>
                <motion.button
                  variants={fadeItemUp}
                  onClick={onClose}
                  className="p-2 text-red-400 hover:text-red-600 rounded-lg hover:bg-red-100 transition-colors"
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
                <motion.div variants={fadeItemUp} className="space-y-3">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Ligue imediatamente para{" "}
                    <a
                      href="tel:190"
                      className="font-semibold text-red-600 hover:underline"
                    >
                      190
                    </a>{" "}
                    em situações de risco iminente, violência, flagrante ou
                    necessidade urgente de intervenção policial.
                  </p>
                  <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                    {passos.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                </motion.div>
                <motion.div
                  variants={fadeItemUp}
                  className="border border-yellow-200 bg-yellow-50 rounded-lg p-4 text-xs text-yellow-800"
                >
                  Informações falsas ou uso indevido do canal podem gerar
                  responsabilização legal (art. 266 do Código Penal).
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default ModalEmergencia190;
