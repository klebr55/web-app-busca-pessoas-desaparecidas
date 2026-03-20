import { useState, useCallback } from "react";
import { FiltrosPessoas } from "@/api/api";

interface UseFiltrosBuscaFacadeProps {
  onBuscar: (filtros: FiltrosPessoas) => void;
}

export function useFiltrosBuscaFacade({
  onBuscar,
}: UseFiltrosBuscaFacadeProps) {
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

  const hasActiveFilters = Boolean(
    filtros.nome ||
      filtros.sexo ||
      filtros.faixaIdadeInicial ||
      filtros.faixaIdadeFinal,
  );

  return {
    filtros,
    mostrarFiltrosAvancados,
    setMostrarFiltrosAvancados,
    handleInputChange,
    handleSubmit,
    limparFiltros,
    hasActiveFilters,
  };
}
