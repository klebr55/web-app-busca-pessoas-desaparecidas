"use client";

import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useBuscarPessoasComFiltro } from "@/api/hooks";
import { PessoaCard } from "./PessoaCard";
import { LoadingSpinner } from "./LoadingStates";
import { Paginacao } from "./Paginacao";

interface ModalVerListaProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ModalVerLista({ isOpen, onClose }: ModalVerListaProps) {
  const [termoBusca, setTermoBusca] = useState("");
  const [statusFiltro, setStatusFiltro] = useState<
    "TODOS" | "DESAPARECIDO" | "LOCALIZADO"
  >("TODOS");
  const [paginaAtual, setPaginaAtual] = useState(0);
  const buscaTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const {
    data: pessoas,
    loading,
    error,
    total,
    totalPaginas,
    buscar,
  } = useBuscarPessoasComFiltro();

  const executarBusca = (filtros: any) => {
    buscar(filtros);
  };

  useEffect(() => {
    if (!isOpen) return;

    if (buscaTimeoutRef.current) {
      clearTimeout(buscaTimeoutRef.current);
    }

    buscaTimeoutRef.current = setTimeout(() => {
      const filtros: any = {
        pagina: paginaAtual,
        porPagina: 8,
      };

      if (termoBusca.trim()) {
        filtros.nome = termoBusca.trim();
      }

      if (statusFiltro !== "TODOS") {
        filtros.status = statusFiltro;
      }

      executarBusca(filtros);
    }, 300);

    return () => {
      if (buscaTimeoutRef.current) {
        clearTimeout(buscaTimeoutRef.current);
      }
    };
  }, [isOpen, termoBusca, statusFiltro, paginaAtual]);

  useEffect(() => {
    if (!isOpen) {
      setTermoBusca("");
      setStatusFiltro("TODOS");
      setPaginaAtual(0);
    }
  }, [isOpen]);

  const handleClose = () => {
    onClose();
  };

  const handleBuscar = (e: React.FormEvent) => {
    e.preventDefault();
    setPaginaAtual(0);
  };

  const handleStatusChange = (
    novoStatus: "TODOS" | "DESAPARECIDO" | "LOCALIZADO",
  ) => {
    setStatusFiltro(novoStatus);
    setPaginaAtual(0);
  };

  const handlePaginaChange = (novaPagina: number) => {
    setPaginaAtual(novaPagina);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="overlay"
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={handleClose}
          />

          <motion.div
            key="modal"
            className="fixed inset-4 md:inset-8 lg:inset-16 z-50 bg-white rounded-xl shadow-2xl flex flex-col"
            initial={{ opacity: 0, scale: 0.92, y: 30, filter: "blur(8px)" }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.94, y: 20, filter: "blur(6px)" }}
            transition={{
              duration: 0.35,
              ease: "easeOut",
              scale: { type: "spring", stiffness: 220, damping: 24 },
            }}
          >
            <motion.div
              className="flex items-center justify-between p-6 border-b border-gray-200"
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08, duration: 0.4 }}
            >
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Lista de Pessoas
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {total > 0
                    ? `${total} pessoas encontradas`
                    : "Nenhuma pessoa encontrada"}
                </p>
              </div>
              <motion.button
                onClick={handleClose}
                whileHover={{ rotate: 90, scale: 1.05 }}
                whileTap={{ scale: 0.9, rotate: 45 }}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors relative"
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
                <span className="absolute -inset-1 rounded-lg ring-2 ring-transparent hover:ring-gray-300 transition" />
              </motion.button>
            </motion.div>

            <motion.div
              className="p-6 border-b border-gray-100 bg-gray-50"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.4 }}
            >
              <form onSubmit={handleBuscar} className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Buscar pessoa por nome..."
                    value={termoBusca}
                    onChange={(e) => setTermoBusca(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>

                <div className="flex gap-2 flex-wrap">
                  {(
                    [
                      { value: "TODOS" as const, label: "Todos", count: total },
                      {
                        value: "DESAPARECIDO" as const,
                        label: "Desaparecidos",
                        count: null,
                      },
                      {
                        value: "LOCALIZADO" as const,
                        label: "Localizados",
                        count: null,
                      },
                    ] as const
                  ).map((status) => (
                    <motion.button
                      key={status.value}
                      type="button"
                      onClick={() => handleStatusChange(status.value)}
                      whileHover={{ y: -3 }}
                      whileTap={{ scale: 0.9 }}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        statusFiltro === status.value
                          ? "bg-[#101828] text-white"
                          : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {status.label}
                      {status.count && ` (${status.count})`}
                    </motion.button>
                  ))}
                </div>
              </form>
            </motion.div>

            <motion.div
              className="flex-1 overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.18, duration: 0.45 }}
            >
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="flex flex-col items-center gap-4">
                    <LoadingSpinner size="lg" />
                    <p className="text-gray-600">Carregando pessoas...</p>
                  </div>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                  <svg
                    className="w-16 h-16 text-gray-300 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 19c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Erro ao carregar dados
                  </h3>
                  <p className="text-gray-600 mb-4">{error}</p>
                  <button
                    onClick={() =>
                      buscar({ pagina: paginaAtual, porPagina: 8 })
                    }
                    className="px-4 py-2 bg-[#101828] text-white rounded-lg hover:bg-[#1447E6] transition-colors"
                  >
                    Tentar novamente
                  </button>
                </div>
              ) : pessoas.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                  <svg
                    className="w-16 h-16 text-gray-300 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Nenhuma pessoa encontrada
                  </h3>
                  <p className="text-gray-600">
                    Tente ajustar os filtros ou termos de busca
                  </p>
                </div>
              ) : (
                <div className="h-full overflow-y-auto p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {pessoas.map((pessoa, i) => (
                      <motion.div
                        key={pessoa.id}
                        initial={{ opacity: 0, y: 18, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{
                          delay: 0.22 + i * 0.04,
                          type: "spring",
                          stiffness: 240,
                          damping: 20,
                        }}
                        onClick={() => {
                          handleClose();
                          setTimeout(() => {
                            window.location.href = `/${pessoa.id}`;
                          }, 280);
                        }}
                        className="cursor-pointer"
                      >
                        <PessoaCard pessoa={pessoa} />
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {!loading && !error && pessoas.length > 0 && totalPaginas > 1 && (
              <motion.div
                className="p-6 border-t border-gray-200 bg-gray-50"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.4 }}
              >
                <Paginacao
                  paginaAtual={paginaAtual}
                  totalPaginas={totalPaginas}
                  total={total}
                  porPagina={8}
                  onProximaPagina={() => handlePaginaChange(paginaAtual + 1)}
                  onPaginaAnterior={() => handlePaginaChange(paginaAtual - 1)}
                  onIrParaPagina={handlePaginaChange}
                  loading={loading}
                />
              </motion.div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
