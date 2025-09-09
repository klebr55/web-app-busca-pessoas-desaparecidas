"use client";

import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { usePessoas } from "@/api/hooks";
import { FiltrosPessoas } from "@/api/api";
import { PessoaCard, PessoaCardSkeleton } from "./ui/PessoaCard";
import { FiltrosBusca } from "./ui/FiltrosBusca";
import { Paginacao } from "./ui/Paginacao";
import { ErrorMessage } from "./ui/LoadingStates";
import { Search, Filter, Users } from "lucide-react";

const Desaparecidos = () => {
  const searchParams = useSearchParams();
  const statusParam = searchParams.get("status");

  const {
    data: pessoas,
    loading,
    error,
    total,
    pagina: paginaAtual,
    porPagina,
    totalPaginas,
    buscar,
    proximaPagina,
    paginaAnterior,
    irParaPagina,
  } = usePessoas();

  const [mostrarResultados, setMostrarResultados] = useState(false);
  const [ultimoStatusParam, setUltimoStatusParam] = useState(statusParam);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  React.useEffect(() => {
    if (
      !loading &&
      (!pessoas || pessoas.length === 0) &&
      total === 0 &&
      !error &&
      !mostrarResultados
    ) {
      const statusFiltro =
        statusParam === "localizado" ? "LOCALIZADO" : "DESAPARECIDO";
      buscar({ status: statusFiltro, pagina: 0, porPagina: 12 });
      setMostrarResultados(true);
      setUltimoStatusParam(statusParam);
    }
  }, [statusParam, loading, pessoas, total, error, mostrarResultados]);

  React.useEffect(() => {
    if (mostrarResultados && statusParam !== ultimoStatusParam) {
      const statusFiltro =
        statusParam === "localizado" ? "LOCALIZADO" : "DESAPARECIDO";
      buscar({ status: statusFiltro, pagina: 0, porPagina: 12 });
      setUltimoStatusParam(statusParam);
    }
  }, [statusParam, ultimoStatusParam, mostrarResultados]);

  const handleBuscar = useCallback((filtros: FiltrosPessoas) => {
    buscar({ ...filtros, porPagina: 12 });
    setMostrarResultados(true);
  }, []);

  const renderSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: 12 }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.04, duration: 0.35, ease: "easeOut" }}
        >
          <PessoaCardSkeleton />
        </motion.div>
      ))}
    </div>
  );

  const renderEmptyState = () => (
    <motion.div
      className="text-center py-12"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35 }}
    >
      <Search className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-sm font-semibold text-gray-900">
        Nenhuma pessoa encontrada
      </h3>
      <p className="mt-1 text-sm text-gray-500">
        Tente ajustar os filtros de busca ou remover alguns critérios.
      </p>
    </motion.div>
  );

  const renderPessoas = () => (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.05 } },
      }}
    >
      {pessoas &&
        pessoas.map((pessoa, idx) => (
          <motion.div
            key={pessoa.id}
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.45, ease: "easeOut", delay: idx * 0.03 }}
          >
            <PessoaCard pessoa={pessoa} className="h-full" />
          </motion.div>
        ))}
    </motion.div>
  );

  return (
    <div className="bg-white  transition-colors" suppressHydrationWarning>
      <motion.div
        className="bg-white  border-b border-gray-200 "
        initial={{ opacity: 0, y: -18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="mx-auto max-w-[1800px] px-4 py-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1
              className="text-3xl font-bold tracking-tight text-gray-900  sm:text-4xl"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.55 }}
            >
              Resultados
            </motion.h1>
            <motion.p
              className="mx-auto mt-2 max-w-3xl text-sm text-gray-500 "
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.5 }}
            >
              Ajude a encontrar pessoas desaparecidas em Mato Grosso. Use os
              filtros abaixo para buscar ou visualizar informações importantes.
            </motion.p>
          </div>
        </div>
      </motion.div>

      <div className="mx-auto max-w-[1800px] px-4 py-6 sm:px-6 lg:px-8 text-gray-800 ">
        {mostrarResultados && !loading && (
          <div className="border-b border-gray-200  pb-3 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-sm text-gray-500 ">
                  <Users className="h-4 w-4 mr-1 text-gray-400 " />
                  {total} {total === 1 ? "pessoa" : "pessoas"}{" "}
                  {statusParam === "localizado" ? "localizada" : "desaparecida"}
                  {total > 1 && statusParam === "localizado" ? "s" : ""}
                </div>
              </div>

              <button
                type="button"
                className="inline-flex items-center lg:hidden rounded-md border border-gray-300  bg-white  px-4 py-2 text-sm font-medium text-gray-700  shadow-sm hover:bg-gray-50  transition-colors"
                onClick={() => setMostrarFiltros(!mostrarFiltros)}
              >
                <Filter className="h-4 w-4 mr-2 text-gray-500 " />
                Filtros
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-x-4 gap-y-4 lg:grid-cols-6">
          <motion.div
            key="sidebar-filtros"
            className={`lg:block ${mostrarFiltros ? "block" : "hidden"} lg:col-span-1`}
            initial={{ opacity: 0, x: -25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <div className="border border-gray-200  rounded-lg sticky top-20 bg-white  backdrop-blur supports-[backdrop-filter]:bg-white/60 ">
              <div className="bg-gray-50  px-3 py-2 border-b border-gray-200  rounded-t-lg">
                <h3 className="text-sm font-medium text-gray-900 ">
                  Filtros de Busca
                </h3>
              </div>
              <div className="p-3 text-gray-700 ">
                <FiltrosBusca
                  onBuscar={handleBuscar}
                  loading={loading}
                  className="w-full"
                />
              </div>
            </div>
          </motion.div>

          <div className="lg:col-span-5">
            {error ? (
              <div className="rounded-lg border border-gray-200  p-8 bg-white ">
                <ErrorMessage
                  message={error}
                  onRetry={() =>
                    buscar({ status: "DESAPARECIDO", pagina: 0, porPagina: 12 })
                  }
                />
              </div>
            ) : loading ? (
              <div className="space-y-6">{renderSkeleton()}</div>
            ) : (!pessoas || pessoas.length === 0) && mostrarResultados ? (
              <motion.div
                className="rounded-lg border border-gray-200  p-8 bg-white "
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                {renderEmptyState()}
              </motion.div>
            ) : pessoas && pessoas.length > 0 ? (
              <div className="space-y-4">
                {renderPessoas()}
                {totalPaginas > 1 && (
                  <div className="border-t border-gray-200  pt-4">
                    <Paginacao
                      paginaAtual={paginaAtual}
                      totalPaginas={totalPaginas}
                      total={total}
                      porPagina={porPagina}
                      onProximaPagina={proximaPagina}
                      onPaginaAnterior={paginaAnterior}
                      onIrParaPagina={irParaPagina}
                      loading={loading}
                    />
                  </div>
                )}
              </div>
            ) : (
              <motion.div
                className="text-center py-20"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.45 }}
              >
                <Search className="mx-auto h-16 w-16 text-gray-300 " />
                <h3 className="mt-4 text-lg font-semibold text-gray-900 ">
                  Comece sua busca
                </h3>
                <p className="mt-2 text-sm text-gray-500  max-w-sm mx-auto">
                  Use os filtros ao lado para buscar pessoas desaparecidas ou
                  encontradas em Mato Grosso.
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Desaparecidos;
