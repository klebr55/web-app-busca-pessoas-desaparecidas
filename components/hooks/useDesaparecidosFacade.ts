import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { usePessoas } from "@/api/hooks";
import { FiltrosPessoas } from "@/api/api";

export function useDesaparecidosFacade() {
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

  useEffect(() => {
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
  }, [statusParam, loading, pessoas, total, error, mostrarResultados, buscar]);

  useEffect(() => {
    if (mostrarResultados && statusParam !== ultimoStatusParam) {
      const statusFiltro =
        statusParam === "localizado" ? "LOCALIZADO" : "DESAPARECIDO";
      buscar({ status: statusFiltro, pagina: 0, porPagina: 12 });
      setUltimoStatusParam(statusParam);
    }
  }, [statusParam, ultimoStatusParam, mostrarResultados, buscar]);

  const handleBuscar = useCallback(
    (filtros: FiltrosPessoas) => {
      buscar({ ...filtros, porPagina: 12 });
      setMostrarResultados(true);
    },
    [buscar],
  );

  return {
    pessoas,
    loading,
    error,
    total,
    paginaAtual,
    porPagina,
    totalPaginas,
    buscar,
    proximaPagina,
    paginaAnterior,
    irParaPagina,
    mostrarResultados,
    mostrarFiltros,
    setMostrarFiltros,
    handleBuscar,
    statusParam,
  };
}
