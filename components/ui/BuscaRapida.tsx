"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { buscarPessoasComFiltro } from "@/api/api";
import { PessoaDesaparecida } from "@/api/api";

interface BuscaRapidaProps {
  className?: string;
}

export function BuscaRapida({ className = "" }: BuscaRapidaProps) {
  const [termo, setTermo] = useState("");
  const [mostrarResultados, setMostrarResultados] = useState(false);
  const [resultados, setResultados] = useState<PessoaDesaparecida[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const buscarPessoas = useCallback(async (buscarTermo: string) => {
    if (buscarTermo.length < 2) {
      setResultados([]);
      setMostrarResultados(false);
      return;
    }

    setLoading(true);

    try {
      const resultado = await buscarPessoasComFiltro({
        nome: buscarTermo,
        pagina: 0,
        porPagina: 5,
      });

      setResultados(resultado.data);
      setMostrarResultados(true);
    } catch (error) {
      setResultados([]);
      setMostrarResultados(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      buscarPessoas(termo);
    }, 300);

    return () => clearTimeout(timer);
  }, [termo, buscarPessoas]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setMostrarResultados(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    setTermo(valor);

    if (valor.length >= 2) {
      setMostrarResultados(true);
    } else {
      setMostrarResultados(false);
      setResultados([]);
    }
  };

  const handleSelectPessoa = () => {
    setTermo("");
    setMostrarResultados(false);
    setResultados([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setMostrarResultados(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={termo}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => termo.length >= 2 && setMostrarResultados(true)}
          placeholder="Buscar pessoa por nome..."
          className="w-full px-4 py-2 pl-10 pr-4 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#101828] focus:border-[#101828] bg-white"
        />

        <svg
          className="absolute left-3 top-2.5 h-4 w-4 text-gray-400"
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

        {loading && (
          <div className="absolute right-3 top-2.5">
            <svg
              className="animate-spin h-4 w-4 text-gray-400"
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
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        )}
      </div>

      {mostrarResultados && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center">
              <div className="flex items-center justify-center space-x-2">
                <svg
                  className="animate-spin h-5 w-5 text-gray-400"
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
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span className="text-sm text-gray-500">Buscando...</span>
              </div>
            </div>
          ) : resultados.length > 0 ? (
            <>
              {resultados.map((pessoa) => (
                <Link
                  key={pessoa.id}
                  href={`/${pessoa.id}`}
                  onClick={handleSelectPessoa}
                  className="block p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden relative">
                        {pessoa.urlFoto && (
                          <Image
                            src={pessoa.urlFoto}
                            alt={pessoa.nome}
                            fill
                            className="object-cover"
                            sizes="40px"
                            unoptimized={true}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = "none";
                            }}
                          />
                        )}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {pessoa.nome}
                      </p>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <span>{pessoa.idade} anos</span>
                        <span>•</span>
                        <span>{pessoa.sexo}</span>
                        <span>•</span>
                        <span
                          className={`font-medium ${
                            pessoa.status === "DESAPARECIDO"
                              ? "text-red-600"
                              : "text-green-600"
                          }`}
                        >
                          {pessoa.status === "DESAPARECIDO"
                            ? "Desaparecido"
                            : "Localizado"}
                        </span>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <svg
                        className="w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}

              {resultados.length >= 5 && (
                <div className="p-3 text-center border-t border-gray-100">
                  <Link
                    href="/"
                    onClick={handleSelectPessoa}
                    className="text-sm text-[#101828] hover:text-[#1447E6] font-medium"
                  >
                    Ver todos os resultados
                  </Link>
                </div>
              )}
            </>
          ) : termo.length >= 2 ? (
            <div className="p-4 text-center">
              <div className="text-gray-500">
                <svg
                  className="w-8 h-8 mx-auto mb-2 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <p className="text-sm">Nenhuma pessoa encontrada</p>
                <p className="text-xs text-gray-400 mt-1">
                  Tente buscar com outro nome
                </p>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
