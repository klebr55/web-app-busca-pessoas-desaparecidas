"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PessoaDesaparecida, InformacaoAdicional } from "@/api/api";
import { useEnviarInformacao } from "@/api/hooks";
import { Button } from "./Button";
import { AnimatePresence, motion } from "framer-motion";
import {
  overlayVariant,
  modalVariant,
  fadeStaggerContainer,
  fadeItemUp,
} from "./motionConfig";

const esquemaFormulario = z.object({
  observacao: z
    .string()
    .min(10, "A observação deve ter pelo menos 10 caracteres"),
  localizacao: z.string().optional(),
  nomeInformante: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  telefoneInformante: z
    .string()
    .min(10, "Telefone deve ter pelo menos 10 dígitos"),
  dataAvistamento: z.string().optional(),
});

type DadosFormulario = z.infer<typeof esquemaFormulario>;

interface FormularioInformacaoProps {
  pessoa: PessoaDesaparecida;
  onFechar: () => void;
}

export function FormularioInformacao({
  pessoa,
  onFechar,
}: FormularioInformacaoProps) {
  const [fotos, setFotos] = useState<File[]>([]);
  const { enviar, loading, error, sucesso, resetar } = useEnviarInformacao();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<DadosFormulario>({
    resolver: zodResolver(esquemaFormulario),
  });

  const handleArquivos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const arquivos = Array.from(e.target.files || []);
    const arquivosImagem = arquivos.filter(
      (arquivo) =>
        arquivo.type.startsWith("image/") && arquivo.size <= 5 * 1024 * 1024,
    );
    setFotos((prev) => [...prev, ...arquivosImagem].slice(0, 3));
  };

  const removerFoto = (index: number) => {
    setFotos((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (dados: DadosFormulario) => {
    const informacao: InformacaoAdicional = {
      pessoaId: pessoa.id,
      observacao: dados.observacao,
      localizacao: dados.localizacao || undefined,
      nomeInformante: dados.nomeInformante,
      telefoneInformante: dados.telefoneInformante,
      dataAvistamento: dados.dataAvistamento || undefined,
      fotos: fotos.length > 0 ? fotos : undefined,
      ocoId: pessoa.ultimaOcorrencia?.ocoId,
    };

    await enviar(informacao);
  };

  const handleFechar = () => {
    reset();
    resetar();
    setFotos([]);
    onFechar();
  };

  const aplicarMascaraTelefone = (valor: string) => {
    const numeros = valor.replace(/\D/g, "");
    if (numeros.length <= 11) {
      return numeros.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    }
    return valor;
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
      <motion.div
        className="fixed inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/70 backdrop-blur-sm"
        variants={overlayVariant}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={handleFechar}
      />

      <motion.div
        className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative z-10"
        variants={modalVariant}
        initial="hidden"
        animate="visible"
        exit="exit"
        layout
      >
        <AnimatePresence mode="wait">
          {sucesso ? (
            <motion.div
              key="sucesso"
              variants={fadeStaggerContainer}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="p-6 text-center space-y-4"
            >
              <motion.div
                variants={fadeItemUp}
                className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2"
              >
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </motion.div>
              <motion.h3
                variants={fadeItemUp}
                className="text-lg font-semibold text-gray-900"
              >
                Informação enviada com sucesso!
              </motion.h3>
              <motion.p variants={fadeItemUp} className="text-gray-600">
                Sua informação foi recebida e será analisada pelas autoridades
                competentes. Muito obrigado por ajudar!
              </motion.p>
              <motion.div variants={fadeItemUp}>
                <Button onClick={handleFechar} className="w-full">
                  Fechar
                </Button>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="formulario"
              variants={fadeStaggerContainer}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <motion.div
                className="flex items-center justify-between p-6 border-b border-gray-200"
                variants={fadeItemUp}
              >
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Enviar informação sobre {pessoa.nome}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Preencha os campos abaixo com as informações que você possui
                  </p>
                </div>
                <button
                  onClick={handleFechar}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
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
              </motion.div>

              <motion.form
                onSubmit={handleSubmit(onSubmit)}
                className="p-6 space-y-6"
                variants={fadeStaggerContainer}
              >
                {error && (
                  <motion.div
                    variants={fadeItemUp}
                    className="bg-red-50 border border-red-200 rounded-lg p-4"
                  >
                    <div className="flex">
                      <svg
                        className="w-5 h-5 text-red-400 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <p className="text-red-700 text-sm">{error}</p>
                    </div>
                  </motion.div>
                )}

                <motion.div variants={fadeItemUp}>
                  <label
                    htmlFor="observacao"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Informação/Observação *
                  </label>
                  <textarea
                    {...register("observacao")}
                    id="observacao"
                    rows={4}
                    placeholder="Descreva o que você viu, ouviu ou sabe sobre esta pessoa..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#101828] focus:border-[#101828] transition-colors resize-none"
                  />

                  {errors.observacao && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.observacao.message}
                    </p>
                  )}
                </motion.div>

                <motion.div variants={fadeItemUp}>
                  <label
                    htmlFor="localizacao"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Local onde a pessoa foi vista
                  </label>
                  <input
                    {...register("localizacao")}
                    type="text"
                    id="localizacao"
                    placeholder="Ex: Rua das Flores, Centro, Cuiabá-MT"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </motion.div>

                <motion.div variants={fadeItemUp}>
                  <label
                    htmlFor="dataAvistamento"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Data do avistamento
                  </label>
                  <input
                    {...register("dataAvistamento")}
                    type="date"
                    id="dataAvistamento"
                    max={new Date().toISOString().split("T")[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </motion.div>

                <motion.div
                  variants={fadeItemUp}
                  className="border-t border-gray-200 pt-6"
                >
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Seus dados para contato
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="nomeInformante"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Seu nome *
                      </label>
                      <input
                        {...register("nomeInformante")}
                        type="text"
                        id="nomeInformante"
                        placeholder="Nome completo"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#101828] focus:border-[#101828] transition-colors"
                      />

                      {errors.nomeInformante && (
                        <p className="text-red-600 text-sm mt-1">
                          {errors.nomeInformante.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="telefoneInformante"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Seu telefone *
                      </label>
                      <input
                        {...register("telefoneInformante")}
                        type="tel"
                        id="telefoneInformante"
                        placeholder="(xx) xxxxx-xxxx"
                        onChange={(e) => {
                          e.target.value = aplicarMascaraTelefone(
                            e.target.value,
                          );
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />

                      {errors.telefoneInformante && (
                        <p className="text-red-600 text-sm mt-1">
                          {errors.telefoneInformante.message}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>

                <motion.div variants={fadeItemUp}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fotos (opcional)
                  </label>
                  <p className="text-xs text-gray-500 mb-3">
                    Você pode enviar até 3 fotos. Máximo 5MB por foto.
                  </p>
                  {fotos.length < 3 && (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleArquivos}
                        className="hidden"
                        id="upload-fotos"
                      />

                      <label htmlFor="upload-fotos" className="cursor-pointer">
                        <svg
                          className="w-8 h-8 text-gray-400 mx-auto mb-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                        <p className="text-sm text-gray-600">
                          Clique para selecionar fotos
                        </p>
                      </label>
                    </div>
                  )}
                  {fotos.length > 0 && (
                    <div className="grid grid-cols-3 gap-3 mt-3">
                      {fotos.map((foto, index) => (
                        <div key={index} className="relative h-20">
                          <Image
                            src={URL.createObjectURL(foto)}
                            alt={`Foto ${index + 1}`}
                            fill
                            className="object-cover rounded-lg border"
                            loading="lazy"
                            unoptimized
                          />

                          <button
                            type="button"
                            onClick={() => removerFoto(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>

                <motion.div
                  variants={fadeItemUp}
                  className="bg-yellow-50 border border-yellow-200 rounded-lg p-4"
                >
                  <div className="flex">
                    <svg
                      className="w-5 h-5 text-yellow-400 mr-2 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                    <div className="text-sm text-yellow-700">
                      <p className="font-medium mb-1">Importante:</p>
                      <p>
                        Suas informações serão tratadas com confidencialidade e
                        utilizadas exclusivamente para auxiliar nas
                        investigações.
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  variants={fadeItemUp}
                  className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200"
                >
                  <Button
                    type="submit"
                    disabled={loading}
                    loading={loading}
                    className="flex-1 bg-[#101828] hover:bg-[#1447E6] text-white"
                  >
                    {loading ? "Enviando..." : "Enviar informação"}
                  </Button>
                  <Button
                    type="button"
                    onClick={handleFechar}
                    disabled={loading}
                    variant="outline"
                    className="sm:w-auto"
                  >
                    Cancelar
                  </Button>
                </motion.div>
              </motion.form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
