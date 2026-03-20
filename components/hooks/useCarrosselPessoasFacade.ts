import { useState, useEffect } from "react";
import { useCarrosselPessoas } from "@/api/hooks";
import { PanInfo } from "framer-motion";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export function useCarrosselPessoasFacade() {
  const { pessoas, loading, error } = useCarrosselPessoas();
  const [isMobile, setIsMobile] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isDragging || isMobile || pessoas.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % pessoas.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isDragging, isMobile, pessoas.length]);

  const formatarData = (dataIso?: string | null) => {
    if (!dataIso) return "-";
    try {
      return format(new Date(dataIso), "dd/MM/yyyy", { locale: ptBR });
    } catch {
      return "-";
    }
  };

  const handleDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    const threshold = isMobile ? 50 : 100;
    const velocity = Math.abs(info.velocity.x);
    const offset = info.offset.x;

    if (Math.abs(offset) > threshold || velocity > 500) {
      if (offset > 0) {
        setCurrentIndex((prev) => (prev === 0 ? pessoas.length - 1 : prev - 1));
      } else {
        setCurrentIndex((prev) => (prev + 1) % pessoas.length);
      }
    }

    setIsDragging(false);
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const getStatusText = (status: string, sexo: string) => {
    if (status === "DESAPARECIDO") {
      return sexo === "MASCULINO" ? "DESAPARECIDO" : "DESAPARECIDA";
    } else {
      return sexo === "MASCULINO" ? "LOCALIZADO" : "LOCALIZADA";
    }
  };

  const pessoasDuplicadas =
    pessoas.length > 0 ? [...pessoas, ...pessoas, ...pessoas] : [];

  return {
    pessoas,
    loading,
    error,
    isMobile,
    isDragging,
    currentIndex,
    formatarData,
    handleDragEnd,
    handleDragStart,
    getStatusText,
    pessoasDuplicadas,
    setCurrentIndex,
  };
}
