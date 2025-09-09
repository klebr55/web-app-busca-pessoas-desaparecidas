"use client";

import React from "react";
import { Button } from "./Button";

interface PaginacaoProps {
  paginaAtual: number;
  totalPaginas: number;
  total: number;
  porPagina: number;
  onProximaPagina: () => void;
  onPaginaAnterior: () => void;
  onIrParaPagina: (pagina: number) => void;
  loading?: boolean;
  className?: string;
}

export function Paginacao({
  paginaAtual,
  totalPaginas,
  total,
  porPagina,
  onProximaPagina,
  onPaginaAnterior,
  onIrParaPagina,
  loading = false,
  className = "",
}: PaginacaoProps) {
  if (totalPaginas <= 1) return null;

  const inicioItem = paginaAtual * porPagina + 1;
  const fimItem = Math.min((paginaAtual + 1) * porPagina, total);

  const gerarPaginas = () => {
    const paginas: (number | string)[] = [];
    const maxPaginasVisiveis = 7;

    if (totalPaginas <= maxPaginasVisiveis) {
      for (let i = 0; i < totalPaginas; i++) {
        paginas.push(i);
      }
    } else {
      if (paginaAtual <= 3) {
        for (let i = 0; i <= 4; i++) {
          paginas.push(i);
        }
        if (totalPaginas > 6) {
          paginas.push("...");
        }
        paginas.push(totalPaginas - 1);
      } else if (paginaAtual >= totalPaginas - 4) {
        paginas.push(0);
        if (totalPaginas > 6) {
          paginas.push("...");
        }
        for (let i = totalPaginas - 5; i < totalPaginas; i++) {
          paginas.push(i);
        }
      } else {
        paginas.push(0);
        paginas.push("...");
        for (let i = paginaAtual - 1; i <= paginaAtual + 1; i++) {
          paginas.push(i);
        }
        paginas.push("...");
        paginas.push(totalPaginas - 1);
      }
    }

    return paginas;
  };

  const paginas = gerarPaginas();

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 ${className}`}
    >
      <div className="text-sm text-gray-700">
        Mostrando <span className="font-medium">{inicioItem}</span> a{" "}
        <span className="font-medium">{fimItem}</span> de{" "}
        <span className="font-medium">{total}</span> resultados
      </div>

      <div className="flex items-center space-x-1">
        <Button
          variant="outline"
          size="sm"
          onClick={onPaginaAnterior}
          disabled={paginaAtual === 0 || loading}
          className="px-3 py-1 rounded-l-md"
        >
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span className="sr-only">Página anterior</span>
        </Button>

        <div className="flex">
          {paginas.map((pagina, index) => {
            if (pagina === "...") {
              return (
                <span
                  key={index}
                  className="px-3 py-1 text-gray-500 border border-gray-300 border-l-0"
                >
                  ...
                </span>
              );
            }

            const numeroPagina = pagina as number;
            const isAtual = numeroPagina === paginaAtual;

            return (
              <Button
                key={numeroPagina}
                variant={isAtual ? "primary" : "outline"}
                size="sm"
                onClick={() => onIrParaPagina(numeroPagina)}
                disabled={loading}
                className={`
                  px-3 py-1 border-l-0 rounded-none
                  ${isAtual ? "z-10" : ""}
                `}
              >
                {numeroPagina + 1}
              </Button>
            );
          })}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onProximaPagina}
          disabled={paginaAtual >= totalPaginas - 1 || loading}
          className="px-3 py-1 rounded-r-md border-l-0"
        >
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
              d="M9 5l7 7-7 7"
            />
          </svg>
          <span className="sr-only">Próxima página</span>
        </Button>
      </div>
    </div>
  );
}
