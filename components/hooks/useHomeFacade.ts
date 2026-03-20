import { useState } from "react";

export function useHomeFacade() {
  const [openMapa, setOpenMapa] = useState(false);
  const [openEstatisticas, setOpenEstatisticas] = useState(false);
  const [openComoAjudar, setOpenComoAjudar] = useState(false);

  return {
    openMapa,
    setOpenMapa,
    openEstatisticas,
    setOpenEstatisticas,
    openComoAjudar,
    setOpenComoAjudar,
  };
}
