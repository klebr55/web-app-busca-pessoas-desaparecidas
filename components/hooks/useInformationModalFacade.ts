import { useState, useEffect, useCallback } from "react";
import { usePessoas } from "@/api/hooks";
import { PessoaDesaparecida } from "@/api/api";

interface UseInformationModalFacadeProps {
  onClose: () => void;
}

export function useInformationModalFacade({
  onClose,
}: UseInformationModalFacadeProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPerson, setSelectedPerson] =
    useState<PessoaDesaparecida | null>(null);
  const [informationText, setInformationText] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: pessoas, buscar } = usePessoas();

  const handleClose = useCallback(() => {
    setSearchTerm("");
    setSelectedPerson(null);
    setInformationText("");
    setContactName("");
    setContactPhone("");
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (searchTerm.length > 2) {
      const timeoutId = setTimeout(() => {
        buscar({
          nome: searchTerm,
          status: "DESAPARECIDO",
          porPagina: 10,
        });
      }, 300);

      return () => clearTimeout(timeoutId);
    }
  }, [searchTerm, buscar]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    if (!selectedPerson || !informationText.trim()) return;

    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSearchTerm("");
      setSelectedPerson(null);
      setInformationText("");
      setContactName("");
      setContactPhone("");
      handleClose();
    } catch (error) {
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    searchTerm,
    setSearchTerm,
    selectedPerson,
    setSelectedPerson,
    informationText,
    setInformationText,
    contactName,
    setContactName,
    contactPhone,
    setContactPhone,
    isSubmitting,
    pessoas,
    handleClose,
    handleSubmit,
  };
}
