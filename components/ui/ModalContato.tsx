"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  overlayVariant,
  modalVariant,
  fadeStaggerContainer,
  fadeItemUp,
} from "./motionConfig";

interface ModalContatoProps {
  isOpen: boolean;
  onClose: () => void;
}

const contatosPrincipais = [
  {
    titulo: "Diretoria Geral",
    endereco:
      "Av. Coronel Escolástico, 346 - Bairro Bandeirantes – Cuiabá - CEP 78010-200",
    telefones: ["(65) 3613-5602", "3613-5609", "3613-5676"],
    emails: ["gabdir@pjc.mt.gov.br", "diretoriageral@pjc.mt.gov.br"],
  },
  {
    titulo: "Corregedoria Geral",
    endereco: "Rua Esmeralda, 669 - Bosque da Saúde – Cuiabá",
    telefones: ["3613-8701", "Plantão (65) 98173-0543"],
    emails: ["corregedoria@pjc.mt.gov.br"],
  },
  {
    titulo: "Diretoria de Inteligência",
    endereco: "Av. Coronel Escolástico, 346 - Bandeirantes – Cuiabá",
    telefones: ["(65) 3613-5656", "3613-5667", "3613-5698"],
    emails: ["diretoriadeinteligencia@pjc.mt.gov.br"],
  },
];

export function ModalContato({ isOpen, onClose }: ModalContatoProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="overlay-contato"
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            variants={overlayVariant}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
          />

          <motion.div
            key="wrapper-contato"
            className="fixed inset-0 z-50 flex items-start justify-center p-4 md:p-8 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              key="modal-contato"
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
                    Contatos Principais
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Informações institucionais resumidas da Polícia Civil de MT
                  </p>
                </motion.div>
                <motion.button
                  onClick={onClose}
                  variants={fadeItemUp}
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
                {contatosPrincipais.map((c) => (
                  <motion.div
                    key={c.titulo}
                    variants={fadeItemUp}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {c.titulo}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">{c.endereco}</p>
                    <div className="flex flex-wrap gap-2 text-sm">
                      {c.telefones.map((t) => (
                        <a
                          key={t}
                          href={`tel:${t.replace(/[^\d]/g, "")}`}
                          className="px-2 py-1 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                        >
                          {t}
                        </a>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2 text-sm">
                      {c.emails.map((e) => (
                        <a
                          key={e}
                          href={`mailto:${e}`}
                          className="px-2 py-1 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                        >
                          {e}
                        </a>
                      ))}
                    </div>
                  </motion.div>
                ))}
                <motion.div
                  variants={fadeItemUp}
                  className="text-xs text-gray-500"
                >
                  Fonte: pjc.mt.gov.br (conteúdo resumido)
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default ModalContato;
