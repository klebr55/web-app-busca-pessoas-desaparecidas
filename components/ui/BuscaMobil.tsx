"use client";

import React, { useState } from "react";
import { BuscaRapida } from "./BuscaRapida";

interface BuscaMobilProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BuscaMobil({ isOpen, onClose }: BuscaMobilProps) {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 md:hidden transition-all duration-300 ${
        isClosing ? "opacity-0" : "opacity-100"
      }`}
    >
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ${
          isClosing ? "opacity-0" : "opacity-100"
        }`}
        onClick={handleClose}
      />

      <div
        className={`fixed top-0 left-0 right-0 bg-white shadow-lg transition-all duration-300 ease-out ${
          isClosing
            ? "opacity-0 -translate-y-full"
            : "opacity-100 translate-y-0"
        }`}
      >
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Buscar Pessoa
            </h3>
            <button
              onClick={handleClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <svg
                className="w-5 h-5"
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
            </button>
          </div>

          <BuscaRapida className="w-full" />
        </div>

        <div className="p-4 bg-gray-50">
          <p className="text-sm text-gray-600 text-center">
            Digite pelo menos 2 caracteres para buscar
          </p>
        </div>
      </div>
    </div>
  );
}
