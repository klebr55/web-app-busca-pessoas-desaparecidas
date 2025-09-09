"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { createPortal } from "react-dom";
import {
  X,
  HelpCircle,
  Search,
  MapPin,
  UploadCloud,
  Share2,
  ShieldCheck,
  Info,
} from "lucide-react";

interface ModalComoAjudarProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAdicionar?: () => void;
}

const passos = [
  {
    titulo: "1. Busque antes de enviar",
    descricao:
      "Use a barra de busca e filtros (status, idade, sexo) para verificar se a pessoa já está cadastrada antes de criar um novo registro ou enviar informação.",
    icon: Search,
    cor: "from-blue-500 to-blue-600",
  },
  {
    titulo: "2. Acesse os detalhes do caso",
    descricao:
      'Clique em "Ver Detalhes" para visualizar informações existentes, datas, características físicas e possíveis atualizações.',
    icon: Info,
    cor: "from-indigo-500 to-indigo-600",
  },
  {
    titulo: "3. Verifique o mapa de ocorrências",
    descricao:
      "Abra o Mapa de Casos para entender a distribuição dos desaparecimentos e localizar cidades com maior concentração.",
    icon: MapPin,
    cor: "from-emerald-500 to-emerald-600",
  },
  {
    titulo: "4. Envie informações relevantes",
    descricao:
      'Se tiver visto a pessoa, souber de deslocamentos recentes ou possuir fotos novas, utilize o botão "Adicionar Informações" e preencha com o máximo de detalhes verificáveis.',
    icon: UploadCloud,
    cor: "from-orange-500 to-orange-600",
  },
  {
    titulo: "5. Priorize precisão e segurança",
    descricao:
      "Evite boatos ou especulações. Só compartilhe o que puder ser confirmado. Informações falsas atrasam as buscas e sobrecarregam as equipes.",
    icon: ShieldCheck,
    cor: "from-red-500 to-red-600",
  },
  {
    titulo: "6. Compartilhe de forma responsável",
    descricao:
      "Divulgue o link oficial do caso ao invés de prints desatualizados. Assim garantimos que todos vejam sempre os dados mais recentes.",
    icon: Share2,
    cor: "from-pink-500 to-pink-600",
  },
];

export default function ModalComoAjudar({
  isOpen,
  onClose,
  onOpenAdicionar,
}: ModalComoAjudarProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      requestAnimationFrame(() => {
        scrollRef.current?.scrollTo({ top: 0 });
      });
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white w-full max-w-5xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200"
            initial={{ y: 40, opacity: 0, scale: 0.97 }}
            animate={{
              y: 0,
              opacity: 1,
              scale: 1,
              transition: { type: "spring", stiffness: 220, damping: 26 },
            }}
            exit={{
              y: 25,
              opacity: 0,
              scale: 0.98,
              transition: { duration: 0.18 },
            }}
          >
            <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b bg-gradient-to-r from-[#101828] via-[#1a1f2e] to-[#101828] text-white">
              <div className="flex items-center gap-3">
                <HelpCircle className="w-6 h-6" />
                <h2 className="text-lg sm:text-xl font-bold">
                  Como Ajudar nas Buscas
                </h2>
              </div>
              <button
                onClick={onClose}
                aria-label="Fechar"
                className="p-2 rounded-lg hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto px-5 sm:px-8 py-6 space-y-8 scroll-smooth"
            >
              <div className="bg-gray-50/80 border border-gray-200 rounded-xl p-4 sm:p-5">
                <p className="text-sm sm:text-base text-[#101828] leading-relaxed">
                  Esta plataforma conecta a sociedade aos dados oficiais da
                  Polícia Judiciária Civil de Mato Grosso. Sua colaboração é
                  essencial para agilizar as buscas e aumentar as chances de
                  localização. Siga o passo a passo abaixo para contribuir de
                  forma eficaz e responsável.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {passos.map((p) => (
                  <div
                    key={p.titulo}
                    className="relative group rounded-xl border border-gray-200/60 bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                  >
                    <div
                      className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#101828] via-[#1a1f2e] to-[#101828]`}
                    />
                    <div className="p-4 sm:p-5 flex flex-col h-full">
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className={`p-2 rounded-lg bg-gradient-to-br from-[#101828] to-[#1a1f2e] text-white shadow`}
                        >
                          {React.createElement(p.icon, {
                            className: "w-5 h-5",
                          })}
                        </div>
                        <h3 className="font-semibold text-gray-800 text-sm sm:text-base leading-snug">
                          {p.titulo}
                        </h3>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed flex-1">
                        {p.descricao}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-gray-800 text-sm sm:text-base flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-[#101828] ring-2 ring-gray-200" />{" "}
                  Boas Práticas
                </h4>
                <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-gray-600">
                  <li>
                    Verifique datas de desaparecimento e atualização antes de
                    compartilhar.
                  </li>
                  <li>
                    Evite publicar números pessoais de familiares sem
                    autorização.
                  </li>
                  <li>
                    Priorize fotos recentes e nítidas ao enviar novas
                    informações.
                  </li>
                  <li>
                    Não duplique cadastros: busque primeiro pelo nome e
                    variações.
                  </li>
                  <li>
                    Informações urgentes devem também ser reportadas diretamente
                    à polícia (190 / canais oficiais).
                  </li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 bg-gray-50/60 border border-gray-200 rounded-xl p-5">
                <div className="flex-1">
                  <p className="text-sm text-gray-700 font-medium mb-1">
                    Tem algo que possa ajudar agora?
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Envie uma informação verificada ou acompanhe os casos mais
                    recentes.
                  </p>
                </div>
                <div className="flex gap-3">
                  {onOpenAdicionar && (
                    <button
                      onClick={() => {
                        onClose();
                        onOpenAdicionar();
                      }}
                      className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-[#101828] text-white hover:bg-[#1a1f2e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#101828] shadow"
                    >
                      Adicionar Informação
                    </button>
                  )}
                  <button
                    onClick={onClose}
                    className="px-5 py-2.5 rounded-lg text-sm font-medium bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#101828]"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </div>

            <div className="border-t bg-gray-50 px-5 sm:px-6 py-3 flex items-center justify-between text-[11px] sm:text-xs text-gray-500">
              <span>Conteúdo orientativo · Não substitui canais oficiais</span>
              <span>Atualizado {new Date().toLocaleDateString()}</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
