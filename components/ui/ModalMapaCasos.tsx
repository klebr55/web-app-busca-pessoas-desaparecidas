"use client";

import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Map, MapPin, Users, Filter } from "lucide-react";
import dynamic from "next/dynamic";
import { useDadosMapa } from "@/api/hooks";
import { EstatisticasCidade } from "@/api/api";

interface ModalMapaCasosProps {
  isOpen: boolean;
  onClose: () => void;
}

interface LegendaDinamicaProps {
  filtroStatus: "TODOS" | "DESAPARECIDO" | "LOCALIZADO";
  dados: EstatisticasCidade[];
}

const LegendaDinamica: React.FC<LegendaDinamicaProps> = ({
  filtroStatus,
  dados,
}) => {
  const [expanded, setExpanded] = useState(true);
  const valores = useMemo(() => {
    if (!dados.length) return [] as number[];
    return dados
      .map((c) =>
        filtroStatus === "DESAPARECIDO"
          ? c.totalDesaparecidos
          : filtroStatus === "LOCALIZADO"
            ? c.totalEncontrados
            : c.totalDesaparecidos + c.totalEncontrados,
      )
      .filter((v) => v > 0);
  }, [dados, filtroStatus]);

  const escala = useMemo(() => {
    if (!valores.length)
      return null as null | {
        min: number;
        mid: number;
        max: number;
        unico: boolean;
      };
    const sorted = [...valores].sort((a, b) => a - b);
    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    if (min === max) return { min, mid: min, max, unico: true };

    const mid = sorted[Math.floor(sorted.length / 2)];
    return { min, mid, max, unico: false };
  }, [valores]);

  const titulo =
    filtroStatus === "DESAPARECIDO"
      ? "Intensidade (Desaparecidos)"
      : filtroStatus === "LOCALIZADO"
        ? "Intensidade (Localizados)"
        : "Intensidade (Total)";

  const gradiente =
    filtroStatus === "DESAPARECIDO"
      ? ["#fee2e2", "#f87171", "#dc2626"]
      : filtroStatus === "LOCALIZADO"
        ? ["#dcfce7", "#4ade80", "#16a34a"]
        : ["#facc15", "#f97316", "#dc2626"];

  return (
    <motion.div
      className="absolute bottom-3 left-3 sm:bottom-6 sm:left-6 bg-white/95 backdrop-blur-md rounded-lg px-3 py-2 sm:px-3 sm:py-2 shadow-lg ring-1 ring-gray-200 text-[11px] sm:text-xs md:text-sm z-[400] pointer-events-auto max-w-[92%] sm:max-w-xs md:max-w-sm"
      initial={{ x: 40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ opacity: 0, x: 30 }}
      transition={{ delay: 0.55, type: "spring", stiffness: 240, damping: 24 }}
    >
      <div className="flex items-start justify-between gap-2">
        <h4 className="font-medium text-gray-800 mb-1 sm:mb-2 flex flex-wrap items-center gap-x-2 gap-y-1 leading-snug">
          {titulo}
          {escala && !escala.unico && (
            <span className="text-[9px] sm:text-[10px] text-gray-500 font-normal">
              (min / med / máx)
            </span>
          )}
        </h4>
        <button
          aria-label={expanded ? "Fechar legenda" : "Abrir legenda"}
          onClick={() => setExpanded((s) => !s)}
          className="ml-2 p-1 rounded text-gray-600 hover:text-gray-900 bg-white/0 focus:outline-none focus:ring-2 focus:ring-[#101828]"
        >
          {expanded ? (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
              <path d="M6 15l6-6 6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
              <path d="M18 9l-6 6-6-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>
      </div>
      <AnimatePresence>
        {expanded && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="overflow-hidden"
          >
            {!escala && (
              <p className="text-[10px] text-gray-500">Sem dados para legenda.</p>
            )}
            {escala && escala.unico && (
              <div className="text-[10px] text-gray-600">
                Todos os pontos possuem valor {escala.max}.
              </div>
            )}
            {escala && !escala.unico && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 rounded overflow-hidden">
                    <div
                      className="h-full w-full"
                      style={{
                        background: `linear-gradient(to right, ${gradiente[0]}, ${gradiente[1]}, ${gradiente[2]})`,
                      }}
                    />
                  </div>
                </div>
                <div className="flex justify-between text-[10px] text-gray-600 font-medium tracking-tight">
                  <span>{escala.min}</span>
                  <span>{escala.mid}</span>
                  <span>{escala.max}</span>
                </div>
                <div className="flex justify-between text-[9px] text-gray-500 mt-0.5">
                  <span>Menor</span>
                  <span>Médio</span>
                  <span>Maior</span>
                </div>
              </div>
            )}
            <div className="mt-2 space-y-1 text-[10px] text-gray-500">
              {filtroStatus === "TODOS" && (
                <p>Base: total (desap + loc) normalizado.</p>
              )}
              {filtroStatus === "DESAPARECIDO" && <p>Base: apenas desaparecidos.</p>}
              {filtroStatus === "LOCALIZADO" && <p>Base: apenas localizados.</p>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const LeafletMap = dynamic(
  () => import("./MapaCasosLeaflet").then((m) => m.MapaCasosLeaflet),
  { ssr: false },
);

const overlayVariants: Record<string, any> = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.35, ease: "easeOut" } },
  exit: { opacity: 0, transition: { duration: 0.25, ease: "easeIn" } },
};

const modalVariants: Record<string, any> = {
  hidden: {
    opacity: 0,
    y: 60,
    scale: 0.92,
    rotateX: 8,
    filter: "blur(8px) saturate(60%)",
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
    filter: "blur(0px) saturate(100%)",
    transition: {
      duration: 0.65,
      ease: "easeOut",
      opacity: { duration: 0.4, ease: "linear" },
      rotateX: { type: "spring", stiffness: 140, damping: 18 },
      scale: { type: "spring", stiffness: 220, damping: 26 },
    },
  },
  exit: {
    opacity: 0,
    y: 40,
    scale: 0.96,
    rotateX: -4,
    filter: "blur(6px) saturate(70%)",
    transition: { duration: 0.28, ease: [0.4, 0, 1, 1] },
  },
};

const sectionStagger: Record<string, any> = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.25,
    },
  },
};

const fadeSlide: Record<string, any> = {
  hidden: { opacity: 0, y: 22, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    y: 16,
    filter: "blur(4px)",
    transition: { duration: 0.25, ease: "easeIn" },
  },
};

const panelVariants: Record<string, any> = {
  hidden: { opacity: 0, x: 40, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 0.55, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    x: 30,
    filter: "blur(4px)",
    transition: { duration: 0.25, ease: "easeIn" },
  },
};

const badgeVariants: Record<string, any> = {
  hidden: { scale: 0.6, opacity: 0 },
  visible: (i: number) => ({
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 280,
      damping: 20,
      delay: 0.3 + i * 0.05,
    },
  }),
};

export default function ModalMapaCasos({
  isOpen,
  onClose,
}: ModalMapaCasosProps) {
  const { dadosMapa, loading, error, refetch } = useDadosMapa();
  const [filtroStatus, setFiltroStatus] = useState<
    "TODOS" | "DESAPARECIDO" | "LOCALIZADO"
  >("TODOS");
  const [cidadeSelecionada, setCidadeSelecionada] =
    useState<EstatisticasCidade | null>(null);

  const dadosFiltrados = dadosMapa.filter((cidade) => {
    if (filtroStatus === "TODOS") return true;
    if (filtroStatus === "DESAPARECIDO") return cidade.totalDesaparecidos > 0;
    if (filtroStatus === "LOCALIZADO") return cidade.totalEncontrados > 0;
    return true;
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="overlay"
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
          style={{
            background:
              "radial-gradient(circle at 30% 30%, rgba(20,71,230,0.25), rgba(0,0,0,0.72))",
          }}
        >
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.2, duration: 1 } }}
          >
            <motion.div
              className="absolute -top-32 -left-24 w-96 h-96 rounded-full bg-[#1447E6]/15 blur-3xl"
              animate={{
                scale: [1, 1.15, 1],
                opacity: [0.5, 0.8, 0.5],
                rotate: [0, 25, 0],
              }}
              transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            />

            <motion.div
              className="absolute -bottom-40 -right-24 w-[500px] h-[500px] rounded-full bg-[#101828]/30 blur-3xl"
              animate={{
                scale: [1.1, 0.95, 1.1],
                opacity: [0.35, 0.55, 0.35],
              }}
              transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>

          <motion.div
            key="modal"
            className="relative bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_20px_60px_-15px_rgba(16,24,40,0.55)] w-full max-w-7xl max-h-[90vh] overflow-hidden flex flex-col ring-1 ring-white/60 border border-white/30"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            layout
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(20,71,230,0.08),transparent_60%)]" />

            <motion.div
              className="flex flex-col h-full"
              variants={sectionStagger}
              initial="hidden"
              animate="visible"
            >
              <motion.div
                variants={fadeSlide}
                className="flex items-center justify-between p-4 sm:p-6 border-b bg-[#101828] text-white relative"
              >
                <div className="flex items-center gap-3">
                  <motion.div
                    initial={{ scale: 0.6, rotate: -12, opacity: 0 }}
                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 16,
                      delay: 0.15,
                    }}
                  >
                    <Map className="w-6 h-6 drop-shadow" />
                  </motion.div>
                  <h2 className="text-lg sm:text-xl font-bold tracking-tight">
                    Mapa de Casos - Mato Grosso
                  </h2>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9, rotate: 45 }}
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors relative"
                  aria-label="Fechar modal"
                >
                  <X className="w-5 h-5" />
                  <span className="absolute -inset-1 rounded-lg ring-2 ring-white/0 hover:ring-white/40 transition" />
                </motion.button>
              </motion.div>

              <motion.div
                variants={fadeSlide}
                className="p-3 sm:p-4 border-b bg-gray-50/70 backdrop-blur"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <Filter className="w-5 h-5 text-[#101828]" />
                  <div className="flex gap-2 flex-wrap">
                    {(["TODOS", "DESAPARECIDO", "LOCALIZADO"] as const).map(
                      (status, i) => (
                        <motion.button
                          custom={i}
                          variants={badgeVariants}
                          key={status}
                          onClick={() => setFiltroStatus(status)}
                          whileHover={{ y: -3 }}
                          whileTap={{ scale: 0.9 }}
                          className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#101828] ${
                            filtroStatus === status
                              ? "bg-[#101828] text-white shadow"
                              : "bg-white text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          {status === "TODOS"
                            ? "Todos os Casos"
                            : status === "DESAPARECIDO"
                              ? "Desaparecidos"
                              : "Localizados"}
                          {filtroStatus === status && (
                            <motion.span
                              layoutId="filterActiveGlow"
                              className="absolute inset-0 rounded-lg ring-2 ring-[#1447E6]/60"
                              style={{
                                boxShadow: "0 0 0 4px rgba(20,71,230,0.15)",
                              }}
                              transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 30,
                              }}
                            />
                          )}
                        </motion.button>
                      ),
                    )}
                  </div>
                </div>
              </motion.div>

              <div className="flex flex-col md:flex-row flex-1 h-full relative">
                <motion.div
                  className="flex-1 bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 relative overflow-hidden min-h-[360px] h-[360px] md:h-auto md:min-h-0"
                  variants={fadeSlide}
                >
                  {loading ? (
                    <div className="flex items-center justify-center h-full">
                      <motion.div
                        className="rounded-full h-14 w-14 border-4 border-[#101828]/20 border-t-[#101828]"
                        animate={{ rotate: 360 }}
                        transition={{
                          repeat: Infinity,
                          ease: "linear",
                          duration: 1.2,
                        }}
                      />
                    </div>
                  ) : error ? (
                    <div className="flex items-center justify-center h-full text-red-600">
                      <div className="text-center">
                        <p className="mb-2">Erro ao carregar dados do mapa</p>
                        <button
                          onClick={refetch}
                          className="px-4 py-2 bg-[#101828] text-white rounded-lg hover:bg-[#1447E6] transition-colors"
                        >
                          Tentar novamente
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <motion.div
                        className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg ring-1 ring-gray-200 max-w-[70%] sm:max-w-none"
                        initial={{ y: -18, opacity: 0, scale: 0.9 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        transition={{
                          delay: 0.45,
                          type: "spring",
                          stiffness: 260,
                          damping: 22,
                        }}
                      >
                        <h3 className="font-bold text-gray-800 text-sm sm:text-base">
                          Estado de Mato Grosso
                        </h3>
                        <p className="text-[11px] sm:text-sm text-gray-600">
                          {dadosFiltrados.length} cidades com casos registrados
                        </p>
                      </motion.div>
                      <div className="relative w-full h-full p-2 sm:p-4 flex items-center justify-center">
                        <motion.div
                          className="w-full h-full min-h-[340px] md:min-h-0"
                          initial={{ opacity: 0, scale: 0.97 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{
                            delay: 0.35,
                            duration: 0.6,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                        >
                          <LeafletMap
                            filtroStatus={filtroStatus}
                            dadosFiltrados={dadosFiltrados}
                            loading={loading}
                            error={error}
                            onRefetch={refetch}
                            onSelectCidade={(nome: string) => {
                              const cityData = dadosMapa.find(
                                (c) => c.cidade === nome,
                              );
                              if (cityData) setCidadeSelecionada(cityData);
                            }}
                          />
                        </motion.div>
                      </div>
                      <LegendaDinamica
                        filtroStatus={filtroStatus}
                        dados={dadosFiltrados}
                      />
                    </>
                  )}
                </motion.div>

                <motion.div
                  className="w-full md:w-96 border-t md:border-t-0 md:border-l bg-white/90 backdrop-blur-sm overflow-y-auto max-h-80 md:max-h-none relative"
                  variants={panelVariants}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {cidadeSelecionada ? (
                      <motion.div
                        key="detalhes"
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -30 }}
                        transition={{
                          duration: 0.45,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className="p-5 sm:p-6"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-base sm:text-lg font-bold text-gray-800">
                            {cidadeSelecionada.cidade}
                          </h3>
                          <motion.button
                            whileHover={{ rotate: 90, scale: 1.05 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setCidadeSelecionada(null)}
                            className="p-1 hover:bg-gray-100 rounded"
                            aria-label="Fechar detalhes"
                          >
                            <X className="w-4 h-4" />
                          </motion.button>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="bg-red-50 border border-red-200 rounded-lg p-3 relative overflow-hidden"
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <Users className="w-5 h-5 text-red-600" />
                              <span className="font-medium text-red-800 text-sm">
                                Desaparecidos
                              </span>
                            </div>
                            <p className="text-xl sm:text-2xl font-bold text-red-600">
                              {cidadeSelecionada.totalDesaparecidos}
                            </p>
                            <motion.span
                              aria-hidden
                              className="absolute -bottom-6 -right-6 w-20 h-20 rounded-full bg-red-200/50"
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{
                                delay: 0.25,
                                type: "spring",
                                stiffness: 180,
                                damping: 20,
                              }}
                            />
                          </motion.div>
                          <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.18 }}
                            className="bg-green-50 border border-green-200 rounded-lg p-3 relative overflow-hidden"
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <Users className="w-5 h-5 text-green-600" />
                              <span className="font-medium text-green-800 text-sm">
                                Localizados
                              </span>
                            </div>
                            <p className="text-xl sm:text-2xl font-bold text-green-600">
                              {cidadeSelecionada.totalEncontrados}
                            </p>
                            <motion.span
                              aria-hidden
                              className="absolute -bottom-6 -right-6 w-20 h-20 rounded-full bg-green-200/50"
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{
                                delay: 0.3,
                                type: "spring",
                                stiffness: 180,
                                damping: 20,
                              }}
                            />
                          </motion.div>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800 mb-3 text-sm sm:text-base">
                            Casos Recentes
                          </h4>
                          <div className="space-y-2 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
                            {cidadeSelecionada.casos
                              .slice(0, 10)
                              .map((caso, i) => (
                                <motion.div
                                  key={caso.id}
                                  initial={{ opacity: 0, y: 14 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{
                                    delay: 0.25 + i * 0.05,
                                    ease: [0.22, 1, 0.36, 1],
                                  }}
                                  className="border rounded-lg p-3 hover:bg-gray-50 transition-colors"
                                >
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1 min-w-0">
                                      <p
                                        className="font-medium text-sm text-gray-800 truncate"
                                        title={caso.nome}
                                      >
                                        {caso.nome}
                                      </p>
                                      <p className="text-xs text-gray-600">
                                        {caso.idade} anos,{" "}
                                        {caso.sexo.toLowerCase()}
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        {new Date(
                                          caso.dataDesaparecimento,
                                        ).toLocaleDateString()}
                                      </p>
                                    </div>
                                    <span
                                      className={`px-2 py-1 rounded-full shrink-0 text-xs font-medium ${
                                        caso.status === "DESAPARECIDO"
                                          ? "bg-red-100 text-red-800"
                                          : "bg-green-100 text-green-800"
                                      }`}
                                    >
                                      {caso.status === "DESAPARECIDO"
                                        ? "Desaparecido"
                                        : "Localizado"}
                                    </span>
                                  </div>
                                </motion.div>
                              ))}
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="placeholder"
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -30 }}
                        transition={{
                          duration: 0.45,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className="p-6"
                      >
                        <div className="text-center text-gray-500">
                          <MapPin className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 text-gray-400" />
                          <h3 className="font-medium mb-2 text-sm sm:text-base">
                            Selecione uma cidade
                          </h3>
                          <p className="text-xs sm:text-sm">
                            Clique em um marcador no mapa para ver os detalhes
                            dos casos
                          </p>
                        </div>
                        <div className="mt-6 sm:mt-8 space-y-4">
                          <h4 className="font-medium text-gray-800 text-sm sm:text-base">
                            Resumo Geral
                          </h4>
                          {dadosFiltrados.slice(0, 5).map((cidade, i) => (
                            <motion.div
                              key={cidade.cidade}
                              initial={{ opacity: 0, y: 16 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.25 + i * 0.08 }}
                              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                            >
                              <span
                                className="font-medium text-sm truncate pr-2"
                                title={cidade.cidade}
                              >
                                {cidade.cidade}
                              </span>
                              <div className="text-right text-[11px] sm:text-xs">
                                <div className="text-red-600">
                                  {cidade.totalDesaparecidos} desap.
                                </div>
                                <div className="text-green-600">
                                  {cidade.totalEncontrados} loc.
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
