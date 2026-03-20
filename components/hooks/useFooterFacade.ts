import { useState, useEffect } from "react";

export function useFooterFacade() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEstatisticasOpen, setIsEstatisticasOpen] = useState(false);
  const [isMapaOpen, setIsMapaOpen] = useState(false);
  const [isComoAjudarOpen, setIsComoAjudarOpen] = useState(false);
  const [isBuscarOpen, setIsBuscarOpen] = useState(false);
  const [buscarStatusInicial, setBuscarStatusInicial] = useState<
    "DESAPARECIDO" | "LOCALIZADO" | undefined
  >(undefined);
  const [isFaqOpen, setIsFaqOpen] = useState(false);
  const [isContatoOpen, setIsContatoOpen] = useState(false);
  const [isPrivOpen, setIsPrivOpen] = useState(false);
  const [isTermosOpen, setIsTermosOpen] = useState(false);
  const [isCookiesOpen, setIsCookiesOpen] = useState(false);
  const [isEmergenciaOpen, setIsEmergenciaOpen] = useState(false);

  useEffect(() => {
    const handler = () => setIsContatoOpen(true);

    window.addEventListener("open-contato-modal", handler as EventListener);
    return () =>
      window.removeEventListener(
        "open-contato-modal",
        handler as EventListener,
      );
  }, []);

  return {
    isModalOpen,
    setIsModalOpen,
    isEstatisticasOpen,
    setIsEstatisticasOpen,
    isMapaOpen,
    setIsMapaOpen,
    isComoAjudarOpen,
    setIsComoAjudarOpen,
    isBuscarOpen,
    setIsBuscarOpen,
    buscarStatusInicial,
    setBuscarStatusInicial,
    isFaqOpen,
    setIsFaqOpen,
    isContatoOpen,
    setIsContatoOpen,
    isPrivOpen,
    setIsPrivOpen,
    isTermosOpen,
    setIsTermosOpen,
    isCookiesOpen,
    setIsCookiesOpen,
    isEmergenciaOpen,
    setIsEmergenciaOpen,
  };
}
