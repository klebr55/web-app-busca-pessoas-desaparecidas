"use client";
import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  overlayVariant,
  modalVariant,
  fadeStaggerContainer,
  buttonHover,
  buttonTap,
} from "./ui/motionConfig";
import { usePessoas } from "@/api/hooks";
import { PessoaDesaparecida } from "@/api/api";

interface InformationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InformationModal: React.FC<InformationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPerson, setSelectedPerson] =
    useState<PessoaDesaparecida | null>(null);
  const [informationText, setInformationText] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClose = () => {
    setSearchTerm("");
    setSelectedPerson(null);
    setInformationText("");
    setContactName("");
    setContactPhone("");
    onClose();
  };

  const { data: pessoas, buscar } = usePessoas();

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
  }, [searchTerm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="overlay"
            className="fixed inset-0 bg-gray-500/70 backdrop-blur-sm"
            variants={overlayVariant}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={handleClose}
            style={{ zIndex: 50 }}
          />

          <motion.div
            key="wrapper"
            className="fixed inset-0 z-50 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <motion.div
                key="modal"
                className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl sm:my-8 sm:w-full sm:max-w-lg"
                variants={modalVariant}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                      <svg
                        className="h-6 w-6 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                      <h3 className="text-lg font-semibold leading-6 text-gray-900">
                        Adicionar Informações
                      </h3>
                      <div className="mt-4">
                        <motion.form
                          onSubmit={handleSubmit}
                          className="space-y-4"
                          variants={fadeStaggerContainer}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                        >
                          <div>
                            <label
                              htmlFor="search"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Buscar pessoa desaparecida
                            </label>
                            <div className="mt-1 relative">
                              <motion.input
                                type="text"
                                id="search"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Digite o nome da pessoa..."
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                                whileFocus={{ scale: 1.01 }}
                              />

                              {searchTerm.length > 2 && (
                                <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto">
                                  {pessoas.length > 0 ? (
                                    pessoas.map((pessoa) => (
                                      <div
                                        key={pessoa.id}
                                        onClick={() => {
                                          setSelectedPerson(pessoa);
                                          setSearchTerm(pessoa.nome);
                                        }}
                                        className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-blue-50"
                                      >
                                        <div className="flex items-center">
                                          <span className="font-normal block truncate">
                                            {pessoa.nome}
                                          </span>
                                          <span className="text-gray-500 ml-2 text-sm">
                                            {pessoa.idade} anos
                                          </span>
                                        </div>
                                      </div>
                                    ))
                                  ) : (
                                    <div className="py-2 pl-3 pr-9 text-gray-500">
                                      Nenhuma pessoa encontrada
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>

                          {selectedPerson && (
                            <>
                              <div className="bg-gray-50 p-3 rounded-md">
                                <p className="text-sm text-gray-600">
                                  Pessoa selecionada:
                                </p>
                                <p className="font-medium">
                                  {selectedPerson.nome}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {selectedPerson.idade} anos •{" "}
                                  {selectedPerson.sexo}
                                </p>
                              </div>

                              <div>
                                <label
                                  htmlFor="information"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  Informações adicionais *
                                </label>
                                <textarea
                                  id="information"
                                  rows={4}
                                  value={informationText}
                                  onChange={(e) =>
                                    setInformationText(e.target.value)
                                  }
                                  placeholder="Descreva qualquer informação que possa ajudar na localização..."
                                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                                  required
                                />
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label
                                    htmlFor="contactName"
                                    className="block text-sm font-medium text-gray-700"
                                  >
                                    Seu nome
                                  </label>
                                  <input
                                    type="text"
                                    id="contactName"
                                    value={contactName}
                                    onChange={(e) =>
                                      setContactName(e.target.value)
                                    }
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                                  />
                                </div>
                                <div>
                                  <label
                                    htmlFor="contactPhone"
                                    className="block text-sm font-medium text-gray-700"
                                  >
                                    Telefone
                                  </label>
                                  <input
                                    type="tel"
                                    id="contactPhone"
                                    value={contactPhone}
                                    onChange={(e) =>
                                      setContactPhone(e.target.value)
                                    }
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                                  />
                                </div>
                              </div>
                            </>
                          )}
                        </motion.form>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <motion.button
                    type="submit"
                    onClick={handleSubmit}
                    disabled={
                      !selectedPerson || !informationText.trim() || isSubmitting
                    }
                    className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed sm:ml-3 sm:w-auto"
                    whileHover={!isSubmitting ? buttonHover : {}}
                    whileTap={!isSubmitting ? buttonTap : {}}
                  >
                    {isSubmitting ? "Enviando..." : "Enviar Informações"}
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={handleClose}
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    whileHover={buttonHover}
                    whileTap={buttonTap}
                  >
                    Cancelar
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default InformationModal;
