import { useState, useEffect, useRef } from "react";
import { useBuscarPessoasComFiltro } from "@/api/hooks";

interface UseModalBuscarPessoaFacadeProps {
  isOpen: boolean;
  initialStatus?: "DESAPARECIDO" | "LOCALIZADO";
}

export function useModalBuscarPessoaFacade({
  isOpen,
  initialStatus,
}: UseModalBuscarPessoaFacadeProps) {
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
  const [filtrosAbertos, setFiltrosAbertos] = useState(true);

  const abriuComStatusRef = useRef<string | null>(null);

  const {
    data: pessoas,
    loading,
    error,
    total,
    buscar,
  } = useBuscarPessoasComFiltro();

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
  }, [isOpen, initialStatus, buscar]);

  useEffect(() => {
    setResultadosBusca(pessoas);
  }, [pessoas]);

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

  return {
    termoBusca,
    setTermoBusca,
    sexoFiltro,
    setSexoFiltro,
    statusFiltro,
    setStatusFiltro,
    idadeMin,
    setIdadeMin,
    idadeMax,
    setIdadeMax,
    resultadosBusca,
    foiBuscado,
    filtrosAbertos,
    setFiltrosAbertos,
    loading,
    error,
    total,
    handleBuscar,
    limparFiltros,
  };
}
