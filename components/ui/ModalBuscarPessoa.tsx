"use client";

import React, { useState, useEffect, useRef } from "react";
import { useBuscarPessoasComFiltro } from "@/api/hooks";
import { PessoaCard } from "./PessoaCard";
import { LoadingSpinner } from "./LoadingStates";
import { AnimatePresence, motion } from "framer-motion";
import {
  overlayVariant,
  modalVariant,
  fadeStaggerContainer,
  fadeItemUp,
} from "./motionConfig";

interface ModalBuscarPessoaProps {
  isOpen: boolean;
  onClose: () => void;
  initialStatus?: "DESAPARECIDO" | "LOCALIZADO";
}

export function ModalBuscarPessoa({
  isOpen,
  onClose,
  initialStatus,
}: ModalBuscarPessoaProps) {
  const [termoBusca, setTermoBusca] = useState("");
  const [sexoFiltro, setSexoFiltro] = useState<
    "TODOS" | "MASCULINO" | "FEMININO"
  >("TODOS");
  const [statusFiltro, setStatusFiltro] = useState<
    "TODOS" | "DESAPARECIDO" | "LOCALIZADO"
  >(initialStatus || "TODOS");
  const [idadeMin, setIdadeMin] = useState("");
  const [idadeMax, setIdadeMax] = useState("");
  const [resultadosBusca, setResultadosBusca] = useState<any[]>([]);
  const [foiBuscado, setFoiBuscado] = useState(false);
  const abriuComStatusRef = useRef<string | null>(null);

  const {
    data: pessoas,
    loading,
    error,
    total,
    buscar,
  } = useBuscarPessoasComFiltro();
  const [filtrosAbertos, setFiltrosAbertos] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setStatusFiltro(initialStatus || "TODOS");
      setResultadosBusca([]);
      setFoiBuscado(false);

      if (initialStatus) {
        abriuComStatusRef.current = initialStatus;
        setFoiBuscado(true);
        buscar({ status: initialStatus, pagina: 0, porPagina: 20 });
      }
    } else {
      setTermoBusca("");
      setSexoFiltro("TODOS");
      setIdadeMin("");
      setIdadeMax("");
      abriuComStatusRef.current = null;
    }
  }, [isOpen, initialStatus]);

  useEffect(() => {
    setResultadosBusca(pessoas);
  }, [pessoas]);

  const handleClose = () => {
    onClose();
  };

  const handleBuscar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !termoBusca.trim() &&
      sexoFiltro === "TODOS" &&
      statusFiltro === "TODOS" &&
      !idadeMin &&
      !idadeMax
    ) {
      alert("Preencha pelo menos um campo para buscar");
      return;
    }
    setFoiBuscado(true);
    const filtros: any = { pagina: 0, porPagina: 20 };
    if (termoBusca.trim()) filtros.nome = termoBusca.trim();
    if (sexoFiltro !== "TODOS") filtros.sexo = sexoFiltro;
    if (statusFiltro !== "TODOS") filtros.status = statusFiltro;
    if (idadeMin && !isNaN(Number(idadeMin)))
      filtros.faixaIdadeInicial = Number(idadeMin);
    if (idadeMax && !isNaN(Number(idadeMax)))
      filtros.faixaIdadeFinal = Number(idadeMax);
    await buscar(filtros);
  };

  const limparFiltros = () => {
    setTermoBusca("");
    setSexoFiltro("TODOS");
    setStatusFiltro(initialStatus || "TODOS");
    setIdadeMin("");
    setIdadeMax("");
    setResultadosBusca([]);
    setFoiBuscado(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="overlay-buscar"
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            variants={overlayVariant}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={handleClose}
          />

          <motion.div
            key="wrapper-buscar"
            className="fixed inset-0 z-50 flex"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              key="modal-buscar"
              className="inset-4 md:inset-8 lg:inset-16 m-auto bg-white rounded-xl shadow-2xl flex flex-col w-[calc(100%-2rem)] md:w-[calc(100%-4rem)] lg:w-[calc(100%-8rem)] h-[calc(100%-2rem)] md:h-[calc(100%-4rem)] lg:h-[calc(100%-8rem)]"
              variants={modalVariant}
              initial="hidden"
              animate="visible"
              exit="exit"
              layout
            >
              <motion.div
                className="flex items-center justify-between p-6 border-b border-gray-200"
                variants={fadeStaggerContainer}
                initial="hidden"
                animate="visible"
              >
                <motion.div variants={fadeItemUp}>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Buscar Pessoa
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Use os filtros abaixo para encontrar pessoas específicas
                  </p>
                </motion.div>
                <motion.button
                  variants={fadeItemUp}
                  onClick={handleClose}
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
                className="border-b border-gray-100 bg-gray-50"
                variants={fadeStaggerContainer}
                initial="hidden"
                animate="visible"
              >
                <div className="px-6 pt-5 pb-3 flex items-center justify-between md:block">
                  <div className="md:hidden flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setFiltrosAbertos((o) => !o)}
                      className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border border-gray-300 bg-white shadow-sm hover:bg-gray-100 transition-colors"
                      aria-expanded={filtrosAbertos}
                      aria-controls="filtros-busca"
                    >
                      <svg
                        className={`w-4 h-4 transition-transform ${filtrosAbertos ? "rotate-0" : "-rotate-90"}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                      Filtros
                      <span className="text-xs text-gray-500 font-normal">
                        {filtrosResumoLabel({
                          termoBusca,
                          statusFiltro,
                          sexoFiltro,
                          idadeMin,
                          idadeMax,
                        })}
                      </span>
                    </button>
                  </div>
                  <div className="hidden md:block"></div>
                </div>
                <motion.form
                  onSubmit={handleBuscar}
                  className={`px-6 pb-6 md:pt-0 space-y-4 origin-top md:block ${filtrosAbertos ? "block" : "hidden md:block"}`}
                  id="filtros-busca"
                  variants={fadeStaggerContainer}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <motion.div variants={fadeItemUp}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome da pessoa
                    </label>
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
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                      <input
                        type="text"
                        placeholder="Digite o nome da pessoa..."
                        value={termoBusca}
                        onChange={(e) => setTermoBusca(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    variants={fadeItemUp}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                      </label>
                      <select
                        value={statusFiltro}
                        onChange={(e) =>
                          setStatusFiltro(
                            e.target.value as
                              | "TODOS"
                              | "DESAPARECIDO"
                              | "LOCALIZADO",
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="TODOS">Todos</option>
                        <option value="DESAPARECIDO">Desaparecidos</option>
                        <option value="LOCALIZADO">Localizados</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sexo
                      </label>
                      <select
                        value={sexoFiltro}
                        onChange={(e) =>
                          setSexoFiltro(
                            e.target.value as
                              | "TODOS"
                              | "MASCULINO"
                              | "FEMININO",
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="TODOS">Todos</option>
                        <option value="MASCULINO">Masculino</option>
                        <option value="FEMININO">Feminino</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Idade mínima
                      </label>
                      <input
                        type="number"
                        placeholder="Ex: 18"
                        value={idadeMin}
                        onChange={(e) => setIdadeMin(e.target.value)}
                        min="0"
                        max="150"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Idade máxima
                      </label>
                      <input
                        type="number"
                        placeholder="Ex: 65"
                        value={idadeMax}
                        onChange={(e) => setIdadeMax(e.target.value)}
                        min="0"
                        max="150"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    variants={fadeItemUp}
                    className="flex gap-4 justify-end"
                  >
                    <button
                      type="button"
                      onClick={limparFiltros}
                      className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Limpar filtros
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                    >
                      {loading ? (
                        <>
                          <LoadingSpinner size="sm" color="text-white" />
                          Buscando...
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-4 h-4"
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
                          Buscar
                        </>
                      )}
                    </button>
                  </motion.div>
                </motion.form>

                {!filtrosAbertos && (
                  <div className="md:hidden px-6 pb-4 flex flex-wrap gap-2 text-[11px]">
                    {renderResumoChips({
                      termoBusca,
                      statusFiltro,
                      sexoFiltro,
                      idadeMin,
                      idadeMax,
                      limparFiltros,
                    })}
                  </div>
                )}
              </motion.div>

              <div className="flex-1 overflow-hidden">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <motion.div
                      className="flex flex-col items-center gap-4"
                      initial="hidden"
                      animate="visible"
                      variants={fadeStaggerContainer}
                    >
                      <motion.div variants={fadeItemUp}>
                        <LoadingSpinner size="lg" />
                      </motion.div>
                      <motion.p variants={fadeItemUp} className="text-gray-600">
                        Buscando pessoas...
                      </motion.p>
                    </motion.div>
                  </div>
                ) : error ? (
                  <motion.div
                    className="flex flex-col items-center justify-center h-full text-center p-8"
                    variants={fadeStaggerContainer}
                    initial="hidden"
                    animate="visible"
                  >
                    <motion.svg
                      variants={fadeItemUp}
                      className="w-16 h-16 text-red-300 mb-4"
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
                    </motion.svg>
                    <motion.h3
                      variants={fadeItemUp}
                      className="text-lg font-medium text-gray-900 mb-2"
                    >
                      Erro na busca
                    </motion.h3>
                    <motion.p
                      variants={fadeItemUp}
                      className="text-gray-600 mb-4"
                    >
                      {error}
                    </motion.p>
                    <motion.button
                      variants={fadeItemUp}
                      onClick={handleBuscar}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Tentar novamente
                    </motion.button>
                  </motion.div>
                ) : !foiBuscado ? (
                  <motion.div
                    className="flex flex-col items-center justify-center h-full text-center p-8"
                    variants={fadeStaggerContainer}
                    initial="hidden"
                    animate="visible"
                  >
                    <motion.svg
                      variants={fadeItemUp}
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
                    </motion.svg>
                    <motion.h3
                      variants={fadeItemUp}
                      className="text-lg font-medium text-gray-900 mb-2"
                    >
                      Pronto para buscar
                    </motion.h3>
                    <motion.p variants={fadeItemUp} className="text-gray-600">
                      Preencha os filtros acima e clique em "Buscar" para
                      encontrar pessoas
                    </motion.p>
                  </motion.div>
                ) : resultadosBusca.length === 0 ? (
                  <motion.div
                    className="flex flex-col items-center justify-center h-full text-center p-8"
                    variants={fadeStaggerContainer}
                    initial="hidden"
                    animate="visible"
                  >
                    <motion.svg
                      variants={fadeItemUp}
                      className="w-16 h-16 text-gray-300 mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 0a4 4 0 014-4h0a4 4 0 014 4M9 12v0M15 12v0"
                      />
                    </motion.svg>
                    <motion.h3
                      variants={fadeItemUp}
                      className="text-lg font-medium text-gray-900 mb-2"
                    >
                      Nenhuma pessoa encontrada
                    </motion.h3>
                    <motion.p
                      variants={fadeItemUp}
                      className="text-gray-600 mb-4"
                    >
                      Não encontramos pessoas com os critérios especificados
                    </motion.p>
                    <motion.button
                      variants={fadeItemUp}
                      onClick={limparFiltros}
                      className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      Limpar filtros e tentar novamente
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.div
                    className="h-full overflow-y-auto p-6"
                    initial="hidden"
                    animate="visible"
                    variants={fadeStaggerContainer}
                  >
                    <motion.div variants={fadeItemUp} className="mb-4">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">
                          {total} pessoas encontradas
                        </span>
                        {termoBusca && ` para "${termoBusca}"`}
                      </p>
                    </motion.div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {resultadosBusca.map((pessoa, idx) => (
                        <motion.div
                          key={pessoa.id}
                          initial={{ opacity: 0, y: 18, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{
                            duration: 0.45,
                            ease: "easeOut",
                            delay: idx * 0.03,
                          }}
                          onClick={() => {
                            handleClose();

                            setTimeout(() => {
                              window.location.href = `/${pessoa.id}`;
                            }, 220);
                          }}
                        >
                          <PessoaCard pessoa={pessoa} />
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function filtrosResumoLabel({
  termoBusca,
  statusFiltro,
  sexoFiltro,
  idadeMin,
  idadeMax,
}: any) {
  const partes: string[] = [];
  if (termoBusca) partes.push("nome");
  if (statusFiltro !== "TODOS")
    partes.push(
      statusFiltro === "DESAPARECIDO" ? "desaparecidos" : "localizados",
    );
  if (sexoFiltro !== "TODOS")
    partes.push(sexoFiltro === "MASCULINO" ? "masc." : "fem.");
  if (idadeMin || idadeMax) partes.push("idade");
  if (!partes.length) return "nenhum";
  return partes.slice(0, 3).join(", ");
}

function renderResumoChips({
  termoBusca,
  statusFiltro,
  sexoFiltro,
  idadeMin,
  idadeMax,
  limparFiltros,
}: any) {
  const chips: { label: string; key: string }[] = [];
  if (termoBusca) chips.push({ label: `Nome: ${termoBusca}`, key: "nome" });
  if (statusFiltro !== "TODOS")
    chips.push({
      label: statusFiltro === "DESAPARECIDO" ? "Desaparecidos" : "Localizados",
      key: "status",
    });
  if (sexoFiltro !== "TODOS")
    chips.push({
      label: sexoFiltro === "MASCULINO" ? "Masculino" : "Feminino",
      key: "sexo",
    });
  if (idadeMin || idadeMax)
    chips.push({
      label: `Idade: ${idadeMin || "?"}-${idadeMax || "?"}`,
      key: "idade",
    });
  if (!chips.length) {
    return <span className="text-gray-400">Nenhum filtro ativo</span>;
  }
  return (
    <>
      {chips.map((c) => (
        <span
          key={c.key}
          className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-white border border-gray-200 text-gray-700 shadow-sm"
        >
          {c.label}
        </span>
      ))}
      <button
        onClick={limparFiltros}
        className="text-[10px] font-medium text-blue-600 hover:underline ml-1"
      >
        Limpar
      </button>
    </>
  );
}
