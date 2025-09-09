"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  overlayVariant,
  modalVariant,
  fadeItemUp,
  fadeStaggerContainer,
  buttonHover,
  buttonTap,
  listItemInitial,
  listItemStagger,
} from "./motionConfig";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEnviarInformacao } from "@/api/hooks";
import { buscarPessoasComFiltro } from "@/api/api";
import type { PessoaDesaparecida } from "@/api/api";

const informacaoSchema = z.object({
  pessoaId: z.number().min(1, "Selecione uma pessoa"),
  nomePessoa: z.string().min(2, "Digite o nome da pessoa desaparecida"),
  nomeInformante: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  telefoneInformante: z
    .string()
    .min(10, "Telefone deve ter pelo menos 10 dígitos"),
  observacao: z
    .string()
    .min(10, "Observação deve ter pelo menos 10 caracteres"),
  localizacao: z
    .string()
    .min(3, "Localização deve ter pelo menos 3 caracteres"),
  dataAvistamento: z.string().optional(),
  fotos: z.any().optional(),
});

type InformacaoFormData = z.infer<typeof informacaoSchema>;

interface ModalAdicionarInformacaoProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ModalAdicionarInformacao({
  isOpen,
  onClose,
}: ModalAdicionarInformacaoProps) {
  const [uploading, setUploading] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [pessoasSugeridas, setPessoasSugeridas] = useState<
    PessoaDesaparecida[]
  >([]);
  const [buscandoPessoas, setBuscandoPessoas] = useState(false);
  const [mostrarSugestoes, setMostrarSugestoes] = useState(false);
  const [pessoaSelecionada, setPessoaSelecionada] =
    useState<PessoaDesaparecida | null>(null);

  const { enviar, loading, sucesso, error } = useEnviarInformacao();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<InformacaoFormData>({
    resolver: zodResolver(informacaoSchema),
    defaultValues: {
      pessoaId: 0,
      nomePessoa: "",
      nomeInformante: "",
      telefoneInformante: "",
      observacao: "",
      localizacao: "",
      dataAvistamento: "",
    },
  });

  const buscarPessoas = useCallback(async (nome: string) => {
    if (nome.length < 2) {
      setPessoasSugeridas([]);
      setMostrarSugestoes(false);
      return;
    }

    setBuscandoPessoas(true);
    try {
      const resultado = await buscarPessoasComFiltro({
        nome: nome,
        porPagina: 10,
      });

      setPessoasSugeridas(resultado.data);
      setMostrarSugestoes(true);
    } catch (error) {
      setPessoasSugeridas([]);
    } finally {
      setBuscandoPessoas(false);
    }
  }, []);

  const handleNomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nome = e.target.value;
    setValue("nomePessoa", nome);

    if (nome.length === 0) {
      setPessoaSelecionada(null);
      setValue("pessoaId", 0);
      setPessoasSugeridas([]);
      setMostrarSugestoes(false);
      return;
    }

    if (nome.length >= 2) {
      const timeoutId = setTimeout(() => {
        buscarPessoas(nome);
      }, 300);

      return () => clearTimeout(timeoutId);
    }
  };

  const selecionarPessoa = (pessoa: PessoaDesaparecida) => {
    setPessoaSelecionada(pessoa);
    setValue("pessoaId", pessoa.id);
    setValue("nomePessoa", pessoa.nome);
    setMostrarSugestoes(false);
  };

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const onSubmit = async (data: InformacaoFormData) => {
    try {
      setUploading(true);

      const pessoaCompleta =
        pessoasSugeridas.find((p) => p.id === data.pessoaId) ||
        pessoaSelecionada;

      const informacao = {
        pessoaId: data.pessoaId,
        nomeInformante: data.nomeInformante,
        telefoneInformante: data.telefoneInformante,
        observacao: data.observacao,
        localizacao: data.localizacao,
        dataAvistamento: data.dataAvistamento,
        fotos: data.fotos?.[0] ? [data.fotos[0]] : undefined,
        ocoId: pessoaCompleta?.ultimaOcorrencia?.ocoId,
      };

      await enviar(informacao);

      if (sucesso) {
        reset();
        onClose();
      }
    } catch (error) {
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    reset();
    setPessoaSelecionada(null);
    setPessoasSugeridas([]);
    setMostrarSugestoes(false);
    onClose();
  };

  if (!mounted || !isOpen) return null;

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="overlay"
            className="fixed inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/70 backdrop-blur-sm"
            variants={overlayVariant}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ zIndex: 9999998 }}
            onClick={handleClose}
          />

          <motion.div
            key="wrapper"
            className="fixed inset-0 flex min-h-full items-start sm:items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ zIndex: 9999999 }}
          >
            <motion.div
              key="modal"
              className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 flex flex-col max-h-[92vh]"
              variants={modalVariant}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-20">
                <h3
                  id="modal-adicionar-informacao-heading"
                  className="text-lg font-semibold text-gray-900 "
                >
                  Adicionar Informação
                </h3>
                <button
                  onClick={handleClose}
                  className="text-gray-400 hover:text-gray-600   transition-colors rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 focus-visible:ring-offset-white "
                  aria-label="Fechar modal"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <motion.form
                onSubmit={handleSubmit(onSubmit)}
                className="flex-1 overflow-y-auto px-5 py-5 space-y-4 text-gray-800"
                variants={fadeStaggerContainer}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <div className="relative">
                  <label
                    htmlFor="nomePessoa"
                    className="block text-sm font-medium text-gray-700  mb-1"
                  >
                    Nome da Pessoa Desaparecida *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="nomePessoa"
                      className="w-full px-3 py-2 border border-gray-300  rounded-lg bg-white  text-gray-900  placeholder:text-gray-400  focus:ring-2 focus:ring-blue-500 focus:border-blue-500  transition-colors"
                      placeholder="Digite o nome da pessoa desaparecida"
                      onChange={handleNomeChange}
                      onFocus={() =>
                        setMostrarSugestoes(pessoasSugeridas.length > 0)
                      }
                    />

                    {buscandoPessoas && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
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
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                      </div>
                    )}
                  </div>

                  <AnimatePresence>
                    {mostrarSugestoes && pessoasSugeridas.length > 0 && (
                      <motion.div
                        key="sugestoes"
                        className="absolute z-50 w-full mt-1 bg-white  border border-gray-300  rounded-xl shadow-xl max-h-60 overflow-y-auto"
                        initial={{ opacity: 0, y: -8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.98 }}
                        transition={{ duration: 0.25 }}
                      >
                        {pessoasSugeridas.map((pessoa, index) => (
                          <motion.button
                            key={pessoa.id}
                            type="button"
                            onClick={() => selecionarPessoa(pessoa)}
                            initial={listItemInitial}
                            animate={listItemStagger(index)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-full px-4 py-3 text-left bg-white/90  hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50   focus:bg-gradient-to-r focus:from-blue-50 focus:to-indigo-50   focus:outline-none border-b border-gray-100  last:border-b-0 transition-colors rounded-none"
                          >
                            <div className="flex items-center space-x-3">
                              {pessoa.urlFoto || pessoa.foto ? (
                                <div className="relative w-10 h-10">
                                  <Image
                                    src={
                                      pessoa.urlFoto ||
                                      pessoa.foto ||
                                      "/placeholder-avatar.svg"
                                    }
                                    alt={pessoa.nome}
                                    fill
                                    className="rounded-full object-cover"
                                    sizes="40px"
                                    loading="lazy"
                                    unoptimized
                                  />
                                </div>
                              ) : (
                                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                  <svg
                                    className="w-6 h-6 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                    />
                                  </svg>
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900  truncate">
                                  {pessoa.nome}
                                </p>
                                <p className="text-xs text-gray-500 ">
                                  {pessoa.idade} anos • {pessoa.sexo} •
                                  <span
                                    className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
                                      pessoa.status === "DESAPARECIDO"
                                        ? "bg-red-100 text-red-800  "
                                        : "bg-green-100 text-green-800  "
                                    }`}
                                  >
                                    {pessoa.status === "DESAPARECIDO"
                                      ? "Desaparecido"
                                      : "Localizado"}
                                  </span>
                                </p>
                                {pessoa.dataDesaparecimento && (
                                  <p className="text-xs text-gray-400 ">
                                    Desapareceu em:{" "}
                                    {new Date(
                                      pessoa.dataDesaparecimento,
                                    ).toLocaleDateString("pt-BR")}
                                  </p>
                                )}
                              </div>
                            </div>
                          </motion.button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <AnimatePresence>
                    {pessoaSelecionada && (
                      <motion.div
                        key="pessoa-selecionada"
                        initial={{ opacity: 0, x: -24, scale: 0.96 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -16, scale: 0.95 }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                        className="mt-2 p-3 bg-gradient-to-r from-green-50 to-emerald-50   border border-green-200  rounded-xl shadow-sm"
                      >
                        <div className="flex items-center space-x-3">
                          {pessoaSelecionada.urlFoto || pessoaSelecionada.foto ? (
                            <div className="relative w-8 h-8">
                              <Image
                                src={
                                  pessoaSelecionada.urlFoto ||
                                  pessoaSelecionada.foto ||
                                  "/placeholder-avatar.svg"
                                }
                                alt={pessoaSelecionada.nome}
                                fill
                                className="rounded-full object-cover"
                                sizes="32px"
                                loading="lazy"
                                unoptimized
                              />
                            </div>
                          ) : (
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
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
                                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                              </svg>
                            </div>
                          )}
                          <div className="flex-1">
                            <p className="text-sm font-medium text-green-900 ">
                              {pessoaSelecionada.nome}
                            </p>
                            <p className="text-xs text-green-700 ">
                              Pessoa selecionada
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setPessoaSelecionada(null);
                              setValue("pessoaId", 0);
                              setValue("nomePessoa", "");
                            }}
                            className="text-green-600 hover:text-green-800  "
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
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {errors.nomePessoa && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.nomePessoa.message}
                    </p>
                  )}
                  {errors.pessoaId && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.pessoaId.message}
                    </p>
                  )}
                </div>

                <input
                  type="hidden"
                  {...register("pessoaId", { valueAsNumber: true })}
                />

                <div>
                  <label
                    htmlFor="nomeInformante"
                    className="block text-sm font-medium text-gray-700  mb-1"
                  >
                    Seu nome completo *
                  </label>
                  <input
                    {...register("nomeInformante")}
                    type="text"
                    id="nomeInformante"
                    className="w-full px-3 py-2 border border-gray-300  rounded-lg bg-white  text-gray-900  placeholder:text-gray-400  focus:ring-2 focus:ring-blue-500 focus:border-blue-500  transition-colors"
                    placeholder="Seu nome completo"
                  />

                  {errors.nomeInformante && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.nomeInformante.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="telefoneInformante"
                    className="block text-sm font-medium text-gray-700  mb-1"
                  >
                    Seu telefone *
                  </label>
                  <input
                    {...register("telefoneInformante")}
                    type="tel"
                    id="telefoneInformante"
                    className="w-full px-3 py-2 border border-gray-300  rounded-lg bg-white  text-gray-900  placeholder:text-gray-400  focus:ring-2 focus:ring-blue-500 focus:border-blue-500  transition-colors"
                    placeholder="(65) 99999-9999"
                  />

                  {errors.telefoneInformante && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.telefoneInformante.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="localizacao"
                    className="block text-sm font-medium text-gray-700  mb-1"
                  >
                    Localização do avistamento *
                  </label>
                  <input
                    {...register("localizacao")}
                    type="text"
                    id="localizacao"
                    className="w-full px-3 py-2 border border-gray-300  rounded-lg bg-white  text-gray-900  placeholder:text-gray-400  focus:ring-2 focus:ring-blue-500 focus:border-blue-500  transition-colors"
                    placeholder="Cidade, bairro ou local específico"
                  />

                  {errors.localizacao && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.localizacao.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="dataAvistamento"
                    className="block text-sm font-medium text-gray-700  mb-1"
                  >
                    Data do avistamento
                  </label>
                  <input
                    {...register("dataAvistamento")}
                    type="date"
                    id="dataAvistamento"
                    className="w-full px-3 py-2 border border-gray-300  rounded-lg bg-white  text-gray-900  placeholder:text-gray-400  focus:ring-2 focus:ring-blue-500 focus:border-blue-500  transition-colors"
                  />

                  {errors.dataAvistamento && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.dataAvistamento.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="observacao"
                    className="block text-sm font-medium text-gray-700  mb-1"
                  >
                    Descrição da informação *
                  </label>
                  <textarea
                    {...register("observacao")}
                    id="observacao"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300  rounded-lg bg-white  text-gray-900  placeholder:text-gray-400  focus:ring-2 focus:ring-blue-500 focus:border-blue-500  transition-colors resize-none"
                    placeholder="Descreva detalhadamente as informações que você possui sobre esta pessoa..."
                  />

                  {errors.observacao && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.observacao.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="fotos"
                    className="block text-sm font-medium text-gray-700  mb-1"
                  >
                    Anexar fotos (opcional)
                  </label>
                  <input
                    {...register("fotos")}
                    type="file"
                    id="fotos"
                    accept="image/*"
                    multiple
                    className="w-full px-3 py-2 border border-gray-300  rounded-lg bg-white  text-gray-900  focus:ring-2 focus:ring-blue-500 focus:border-blue-500  transition-colors file:mr-4 file:py-1 file:px-3 file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100   "
                  />

                  <p className="mt-1 text-xs text-gray-500 ">
                    Formatos aceitos: JPG, PNG (máx. 10MB por foto)
                  </p>
                </div>

                {error && (
                  <div className="bg-red-50  border border-red-200  rounded-lg p-4">
                    <div className="flex items-start space-x-2">
                      <svg
                        className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.502 0L4.732 13.5c-.77.833.192 2.5 1.732 2.5z"
                        />
                      </svg>
                      <div className="flex-1">
                        <p className="text-sm text-red-600  font-medium mb-2">
                          {error}
                        </p>
                        {error.includes("Disque 100") && (
                          <div className="text-xs text-red-700  bg-red-100  rounded-md p-2 mt-2">
                            <p className="font-medium mb-1">
                              📞 Canais oficiais de contato:
                            </p>
                            <p>
                              • <strong>Disque 100:</strong> Disque Direitos
                              Humanos
                            </p>
                            <p>
                              • <strong>Delegacia:</strong> Procure a unidade
                              mais próxima
                            </p>
                            <p>
                              • <strong>Polícia Civil:</strong> 197 (em alguns
                              estados)
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {sucesso && (
                  <div className="bg-green-50  border border-green-200  rounded-lg p-3">
                    <p className="text-sm text-green-600 ">
                      Informação enviada com sucesso!
                    </p>
                  </div>
                )}

                <div className="flex space-x-3 pt-4">
                  <motion.button
                    type="button"
                    onClick={handleClose}
                    whileHover={buttonHover}
                    whileTap={buttonTap}
                    className="flex-1 px-4 py-2 text-gray-700  bg-gray-100  hover:bg-gray-200  rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white "
                  >
                    Cancelar
                  </motion.button>
                  <motion.button
                    type="submit"
                    disabled={loading || uploading}
                    whileHover={!loading && !uploading ? buttonHover : {}}
                    whileTap={!loading && !uploading ? buttonTap : {}}
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white "
                  >
                    {loading || uploading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Enviando...
                      </>
                    ) : (
                      "Enviar Informação"
                    )}
                  </motion.button>
                </div>
              </motion.form>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}
