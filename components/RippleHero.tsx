"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";
import {
  useDesaparecidosPhotosDinamico,
  useEstatisticasPessoas,
  useEstatisticasAvancadas,
} from "@/api/hooks";
import { ModalVerLista } from "@/components/ui/ModalVerLista";
import ModalMapaCasos from "@/components/ui/ModalMapaCasos";

const RippleHero = () => {
  const {
    photos,
    loading: loadingPhotos,
    error: errorPhotos,
  } = useDesaparecidosPhotosDinamico(60, 3);
  const { estatisticas, loading: loadingStats } = useEstatisticasPessoas();
  const {
    estatisticas: estatisticasAvancadas,
    loading: loadingEstatisticasAvancadas,
  } = useEstatisticasAvancadas();

  const [modalVerListaAberto, setModalVerListaAberto] = useState(false);
  const [modalMapaCasosAberto, setModalMapaCasosAberto] = useState(false);

  const isUsingRealData =
    photos && photos.length > 0 && !photos[0]?.includes("pravatar.cc");
  const showApiWarning = errorPhotos && !isUsingRealData;

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative grid h-[30vh] min-h-[760px] w-full items-center justify-items-center overflow-hidden bg-gradient-to-b from-neutral-100 via-neutral-50 to-white px-4 sm:px-6 md:px-8 pt-16"
    >
      <BackgroundRippleEffect
        rows={30}
        cols={40}
        cellSize={46}
        photos={photos}
        className="col-start-1 row-start-1 [--cell-border-color:rgba(0,0,0,0.18)] [--cell-fill-color:rgba(255,255,255,0.55)]"
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-neutral-100/70 via-transparent to-transparent" />

      <div className="relative z-10 col-start-1 row-start-1 flex max-w-5xl flex-col items-center text-center">
        {showApiWarning && (
          <div className="mb-4 rounded-lg bg-yellow-50 border border-yellow-200 px-4 py-2 text-sm text-yellow-800">
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span>
                Usando dados de demonstração - API temporariamente indisponível
              </span>
            </div>
          </div>
        )}

        <h1 className="bg-gradient-to-b from-neutral-900 to-neutral-700 bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-5xl md:text-6xl lg:text-7xl">
          Busca de Pessoas Desaparecidas
        </h1>
        <p className="mt-6 max-w-2xl text-sm leading-relaxed text-neutral-700 sm:text-base md:text-lg">
          Consulta e acompanhamento em tempo real com dados oficiais da Polícia
          Judiciária Civil. Colabore enviando informações que podem ajudar uma
          família.
        </p>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <button
            onClick={() => setModalVerListaAberto(true)}
            className="rounded-full bg-[#101828] px-6 py-3 text-sm font-semibold text-white shadow hover:bg-[#1447E6] focus:outline-none focus:ring-2 focus:ring-[#101828] transition-colors"
          >
            Ver lista
          </button>
          <button
            onClick={() => setModalMapaCasosAberto(true)}
            className="rounded-full border border-[#101828] bg-white px-6 py-3 text-sm font-semibold text-[#101828] shadow-sm hover:bg-[#101828] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#101828] transition-colors"
          >
            Abrir Mapa de Casos
          </button>
        </div>
        <div className="mt-20 grid w-full grid-cols-2 gap-6 sm:grid-cols-4">
          {[
            {
              label: "Desaparecidos Ativos",
              value: loadingStats
                ? "..."
                : estatisticas?.quantPessoasDesaparecidas?.toString() || "0",
            },
            {
              label: "Localizados",
              value: loadingStats
                ? "..."
                : estatisticas?.quantPessoasEncontradas?.toString() || "0",
            },
            {
              label: "Atualizações Hoje",
              value:
                loadingStats || loadingEstatisticasAvancadas
                  ? "..."
                  : (() => {
                      const horas =
                        estatisticasAvancadas?.tendencias?.ultimasHoras || [];
                      if (horas.length === 0) return "0";
                      const ultima24 = horas.slice(-24);
                      const soma = ultima24.reduce(
                        (acc, h) => acc + (h.desaparecimentos || 0) + (h.localizacoes || 0),
                        0,
                      );
                      return soma.toString();
                    })(),
            },
            {
              label: "Colaborações",
              value:
                loadingStats || loadingEstatisticasAvancadas
                  ? "..."
                  : (() => {
                      const num =
                        estatisticasAvancadas?.totalEncontrados ??
                        estatisticas?.quantPessoasEncontradas ??
                        0;
                      if (num >= 1000) return `${Math.floor(num / 1000)}k+`;
                      return num.toString();
                    })(),
            },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center">
              <span className="text-2xl font-semibold text-neutral-900 sm:text-3xl">
                {stat.value}
              </span>
              <span className="mt-1 text-xs font-medium tracking-wide text-neutral-500 sm:text-sm">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <ModalVerLista
        isOpen={modalVerListaAberto}
        onClose={() => setModalVerListaAberto(false)}
      />

      <ModalMapaCasos
        isOpen={modalMapaCasosAberto}
        onClose={() => setModalMapaCasosAberto(false)}
      />
    </motion.section>
  );
};

export default RippleHero;
