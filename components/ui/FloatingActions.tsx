"use client";
import React from "react";
import { FaChartBar, FaMapMarkedAlt } from "react-icons/fa";
import { HelpCircle } from "lucide-react";

interface FloatingActionsProps {
  onOpenMapa?: () => void;
  onOpenEstatisticas?: () => void;
  onOpenComoAjudar?: () => void;
}

export const FloatingActions: React.FC<FloatingActionsProps> = ({
  onOpenMapa,
  onOpenEstatisticas,
  onOpenComoAjudar,
}) => {
  return (
    <div className="fixed z-[90] bottom-4 right-4 flex flex-col gap-3">
      <button
        onClick={() => onOpenComoAjudar?.()}
        aria-label="Como ajudar nas buscas"
        className="group p-4 rounded-xl shadow-3xl hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.4)] bg-[#101828] backdrop-blur border border-gray-200 text-white hover:bg-[#1447E6] hover:text-white hover:scale-105 transform transition-all duration-300 ease-in-out hover:-translate-y-1 drop-shadow-lg"
      >
        <HelpCircle className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
      </button>
      <button
        onClick={() => onOpenMapa?.()}
        aria-label="Abrir mapa de casos"
        className="group p-4 rounded-xl shadow-3xl hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.4)] bg-[#101828] backdrop-blur border border-gray-200 text-white hover:bg-[#1447E6] hover:text-white hover:scale-105 transform transition-all duration-300 ease-in-out hover:-translate-y-1 drop-shadow-lg"
      >
        <FaMapMarkedAlt className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
      </button>
      <button
        onClick={() => onOpenEstatisticas?.()}
        aria-label="Abrir estatísticas"
        className="group p-4 rounded-xl shadow-3xl hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.4)] bg-[#101828] backdrop-blur border border-gray-200 text-white hover:bg-[#1447E6] hover:text-white hover:scale-105 transform transition-all duration-300 ease-in-out hover:-translate-y-1 drop-shadow-lg"
      >
        <FaChartBar className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
      </button>
    </div>
  );
};
