"use client";

import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  fadeStaggerContainer,
  fadeItemUp,
  buttonHover,
  buttonTap,
} from "./motionConfig";
import { FiltrosPessoas } from "@/api/api";
import { Search, ChevronDown, X } from "lucide-react";

interface FiltrosBuscaProps {
  onBuscar: (filtros: FiltrosPessoas) => void;
  loading?: boolean;
  className?: string;
}

export function FiltrosBusca({
  onBuscar,
  loading = false,
  className = "",
}: FiltrosBuscaProps) {
  const [filtros, setFiltros] = useState<FiltrosPessoas>({
    nome: "",
    sexo: undefined,
    faixaIdadeInicial: undefined,
    faixaIdadeFinal: undefined,
    status: "DESAPARECIDO",
  });

  const [mostrarFiltrosAvancados, setMostrarFiltrosAvancados] = useState(false);

  const handleInputChange = useCallback(
    (field: keyof FiltrosPessoas, value: string | number | undefined) => {
      setFiltros((prev) => ({
        ...prev,
        [field]: value === "" ? undefined : value,
      }));
    },
    [],
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      onBuscar({ ...filtros, pagina: 0 });
    },
    [filtros, onBuscar],
  );

  const limparFiltros = useCallback(() => {
    const filtrosLimpos = {
      nome: "",
      sexo: undefined,
      faixaIdadeInicial: undefined,
      faixaIdadeFinal: undefined,
      status: "DESAPARECIDO" as const,
    };
    setFiltros(filtrosLimpos);
    onBuscar({ ...filtrosLimpos, pagina: 0 });
  }, [onBuscar]);

  const hasActiveFilters =
    filtros.nome ||
    filtros.sexo ||
    filtros.faixaIdadeInicial ||
    filtros.faixaIdadeFinal;

  return (
    <motion.div
      className={`space-y-4 ${className}`}
      variants={fadeStaggerContainer}
      initial="hidden"
      animate="visible"
    >
      <motion.form
        onSubmit={handleSubmit}
        className="space-y-4"
        variants={fadeStaggerContainer}
      >
        <motion.div variants={fadeItemUp}>
          <label
            htmlFor="search"
            className="block text-xs font-medium text-gray-700 mb-1"
          >
            Buscar por nome
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <motion.input
              type="text"
              id="search"
              name="search"
              value={filtros.nome || ""}
              onChange={(e) => handleInputChange("nome", e.target.value)}
              className="block w-full rounded-md border-0 py-1.5 pl-9 pr-3 text-sm text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
              placeholder="Digite o nome..."
              disabled={loading}
              whileFocus={{ scale: 1.02 }}
            />
          </div>
        </motion.div>

        <motion.fieldset variants={fadeItemUp}>
          <legend className="block text-xs font-medium text-gray-700 mb-2">
            Status
          </legend>
          <div className="space-y-1">
            <div className="flex items-center">
              <motion.input
                id="status-desaparecido"
                name="status"
                type="radio"
                value="DESAPARECIDO"
                checked={filtros.status === "DESAPARECIDO"}
                onChange={(e) =>
                  handleInputChange(
                    "status",
                    e.target.value as "DESAPARECIDO" | "LOCALIZADO",
                  )
                }
                className="h-3 w-3 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                disabled={loading}
                whileTap={{ scale: 0.85 }}
              />

              <label
                htmlFor="status-desaparecido"
                className="ml-2 block text-xs text-gray-700"
              >
                Desaparecidos
              </label>
            </div>
            <div className="flex items-center">
              <motion.input
                id="status-localizado"
                name="status"
                type="radio"
                value="LOCALIZADO"
                checked={filtros.status === "LOCALIZADO"}
                onChange={(e) =>
                  handleInputChange(
                    "status",
                    e.target.value as "DESAPARECIDO" | "LOCALIZADO",
                  )
                }
                className="h-3 w-3 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                disabled={loading}
                whileTap={{ scale: 0.85 }}
              />

              <label
                htmlFor="status-localizado"
                className="ml-2 block text-xs text-gray-700"
              >
                Localizados
              </label>
            </div>
          </div>
        </motion.fieldset>

        <motion.div
          className="border-t border-gray-200 pt-3"
          variants={fadeItemUp}
        >
          <motion.button
            type="button"
            onClick={() => setMostrarFiltrosAvancados(!mostrarFiltrosAvancados)}
            className="flex w-full items-center justify-between text-xs font-medium text-gray-700 hover:text-gray-900"
            disabled={loading}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.97 }}
          >
            <span>Filtros avançados</span>
            <ChevronDown
              className={`h-3 w-3 transform transition-transform duration-200 ${
                mostrarFiltrosAvancados ? "rotate-180" : ""
              }`}
            />
          </motion.button>
        </motion.div>

        <motion.div className="border-t border-gray-200" initial={false}>
          <motion.div
            variants={{
              closed: {
                height: 0,
                opacity: 0,
                transition: { duration: 0.25, ease: "easeInOut" },
              },
              open: {
                height: "auto",
                opacity: 1,
                transition: {
                  duration: 0.35,
                  ease: "easeOut",
                  when: "beforeChildren",
                },
              },
            }}
            initial={mostrarFiltrosAvancados ? "open" : "closed"}
            animate={mostrarFiltrosAvancados ? "open" : "closed"}
            style={{ overflow: "hidden" }}
          >
            <div className="pt-3 space-y-3">
              <motion.div variants={fadeItemUp}>
                <label
                  htmlFor="sexo"
                  className="block text-xs font-medium text-gray-700 mb-1"
                >
                  Sexo
                </label>
                <select
                  id="sexo"
                  name="sexo"
                  value={filtros.sexo || ""}
                  onChange={(e) =>
                    handleInputChange("sexo", e.target.value || undefined)
                  }
                  className="block w-full rounded-md border-0 py-1.5 pl-3 pr-8 text-sm text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                  disabled={loading}
                >
                  <option value="">Todos</option>
                  <option value="MASCULINO">Masculino</option>
                  <option value="FEMININO">Feminino</option>
                </select>
              </motion.div>

              <motion.div variants={fadeItemUp}>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Faixa etária
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <input
                      type="number"
                      placeholder="Mín."
                      value={filtros.faixaIdadeInicial || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "faixaIdadeInicial",
                          e.target.value ? parseInt(e.target.value) : undefined,
                        )
                      }
                      min="0"
                      max="120"
                      className="block w-full rounded-md border-0 py-1.5 px-2 text-sm text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      placeholder="Máx."
                      value={filtros.faixaIdadeFinal || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "faixaIdadeFinal",
                          e.target.value ? parseInt(e.target.value) : undefined,
                        )
                      }
                      min="0"
                      max="120"
                      className="block w-full rounded-md border-0 py-1.5 px-2 text-sm text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                      disabled={loading}
                    />
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="border-t border-gray-200 pt-3 space-y-2"
          variants={fadeItemUp}
        >
          <motion.button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center rounded-md bg-[#101828] px-2 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-indigo-400 disabled:cursor-not-allowed"
            whileHover={!loading ? buttonHover : {}}
            whileTap={!loading ? buttonTap : {}}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-1 h-3 w-3 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Buscando...
              </>
            ) : (
              <>
                <Search className="h-3 w-3 mr-1" />
                Buscar
              </>
            )}
          </motion.button>

          {hasActiveFilters && (
            <motion.button
              type="button"
              onClick={limparFiltros}
              disabled={loading}
              className="w-full flex justify-center items-center rounded-md bg-white px-2 py-1.5 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:bg-gray-50 disabled:cursor-not-allowed"
              whileHover={!loading ? buttonHover : {}}
              whileTap={!loading ? buttonTap : {}}
            >
              <X className="h-3 w-3 mr-1" />
              Limpar
            </motion.button>
          )}
        </motion.div>
      </motion.form>
    </motion.div>
  );
}
