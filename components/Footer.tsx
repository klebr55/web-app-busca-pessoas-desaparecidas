"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import Link from "next/link";
import { ModalAdicionarInformacao } from "./ui/ModalAdicionarInformacao";
import { ModalBuscarPessoa } from "./ui/ModalBuscarPessoa";
import ModalEstatisticasAvancadas from "./ui/ModalEstatisticasAvancadas";
import ModalMapaCasos from "./ui/ModalMapaCasos";
import ModalComoAjudar from "./ui/ModalComoAjudar";
import { ModalPerguntasFrequentes } from "./ui/ModalPerguntasFrequentes";
import { ModalContato } from "./ui/ModalContato";
import { ModalPoliticaPrivacidade } from "./ui/ModalPoliticaPrivacidade";
import { ModalTermosUso } from "./ui/ModalTermosUso";
import { ModalCookies } from "./ui/ModalCookies";
import { ModalEmergencia190 } from "./ui/ModalEmergencia190";

const Footer = () => {
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

  return (
    <>
      <footer className="bg-gray-50 border-t border-gray-200 transition-colors">
        <div className="bg-gray-900">
          <div className="mx-auto max-w-[1800px] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
            <div className="lg:grid lg:grid-cols-2 lg:items-center lg:gap-8">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Possui informações adicionais sobre alguém desaparecido?
                </h2>
                <p className="mt-3 max-w-3xl text-lg text-gray-300">
                  Se sim, ajude-nos clicando no botão abaixo para adicionar mais
                  informações que podem ser cruciais para localizar a pessoa.
                </p>
              </div>
              <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0 lg:justify-end">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center rounded-md bg-[#1447E6] px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-[#1161ff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#101828] transition-colors"
                >
                  Adicionar Informações
                  <svg
                    className="ml-2 h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="mx-auto max-w-[1800px] px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
            <div className="col-span-1 lg:col-span-1">
              <div className="flex items-center space-x-3">
                <div className="relative h-8 w-8">
                  <Image
                    className="object-contain"
                    src="/pjc_logo.svg"
                    alt="Polícia Civil de Mato Grosso"
                    fill
                    sizes="32px"
                    priority={false}
                  />
                </div>
                <span className="text-lg font-semibold text-gray-900">
                  Polícia Judiciária Civil - MT
                </span>
              </div>
              <p className="mt-4 text-sm text-gray-600">
                Plataforma não oficial para consulta e acompanhamento de pessoas
                desaparecidas em Mato Grosso feito para a Desenvolve MT.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Buscar</h3>
              <ul className="mt-6 space-y-4">
                <li>
                  <button
                    onClick={() => {
                      setBuscarStatusInicial("DESAPARECIDO");
                      setIsBuscarOpen(true);
                    }}
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors text-left"
                  >
                    Pessoas Desaparecidas
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setBuscarStatusInicial("LOCALIZADO");
                      setIsBuscarOpen(true);
                    }}
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors text-left"
                  >
                    Pessoas Localizadas
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setIsEstatisticasOpen(true)}
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors text-left"
                  >
                    Estatísticas
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setIsMapaOpen(true)}
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors text-left"
                  >
                    Mapa de Casos
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Suporte</h3>
              <ul className="mt-6 space-y-4">
                <li>
                  <button
                    onClick={() => setIsComoAjudarOpen(true)}
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors text-left"
                  >
                    Como Ajudar
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setIsFaqOpen(true)}
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors text-left"
                  >
                    Perguntas Frequentes
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setIsContatoOpen(true)}
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors text-left"
                  >
                    Contato
                  </button>
                </li>
                <li>
                  <a
                    href="https://delegaciadigital.pjc.mt.gov.br"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Delegacia Online
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Legal</h3>
              <ul className="mt-6 space-y-4">
                <li>
                  <button
                    onClick={() => setIsPrivOpen(true)}
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors text-left"
                  >
                    Política de Privacidade
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setIsTermosOpen(true)}
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors text-left"
                  >
                    Termos de Uso
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setIsCookiesOpen(true)}
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors text-left"
                  >
                    Política de Cookies
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setIsEmergenciaOpen(true)}
                    className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors text-left"
                  >
                    Emergência 190
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-200 pt-8">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row w-full">
              <div className="flex flex-col items-center sm:flex-row sm:items-center text-center sm:text-left text-xs text-gray-500">
                <span>
                  © 2025 Polícia Judiciária Civil de Mato Grosso. Todos os direitos
                  reservados.
                </span>
                <span className="hidden sm:inline mx-3 text-gray-400">•</span>
                <span className="mt-1 sm:mt-0 flex items-center gap-1 text-[11px] text-gray-400">
                  <a
                    href="https://www.linkedin.com/in/klebervinicius08/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2 py-0.5 rounded-full bg-gray-100 border border-gray-200 font-medium text-gray-600 tracking-tight hover:bg-gray-200/70 hover:border-gray-300 transition-colors"
                    aria-label="LinkedIn Kleber Vinícius Moreira Silva"
                  >
                    Desenvolvido por Kleber Vinícius Moreira Silva
                  </a>
                </span>
              </div>
              <div className="flex space-x-6">
                <a
                  href="https://github.com/klebr55"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-900 transition-colors"
                  aria-label="GitHub"
                >
                  <FaGithub className="h-5 w-5" />
                </a>
                <a
                  href="https://www.linkedin.com/in/klebervinicius08/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-[#0a66c2] transition-colors"
                  aria-label="LinkedIn"
                >
                  <FaLinkedin className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <ModalAdicionarInformacao
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <ModalEstatisticasAvancadas
        isOpen={isEstatisticasOpen}
        onClose={() => setIsEstatisticasOpen(false)}
      />

      <ModalMapaCasos
        isOpen={isMapaOpen}
        onClose={() => setIsMapaOpen(false)}
      />

      <ModalComoAjudar
        isOpen={isComoAjudarOpen}
        onClose={() => setIsComoAjudarOpen(false)}
        onOpenAdicionar={() => setIsModalOpen(true)}
      />

      <ModalPerguntasFrequentes
        isOpen={isFaqOpen}
        onClose={() => setIsFaqOpen(false)}
      />
      <ModalContato
        isOpen={isContatoOpen}
        onClose={() => setIsContatoOpen(false)}
      />
      <ModalPoliticaPrivacidade
        isOpen={isPrivOpen}
        onClose={() => setIsPrivOpen(false)}
      />
      <ModalTermosUso
        isOpen={isTermosOpen}
        onClose={() => setIsTermosOpen(false)}
      />
      <ModalCookies
        isOpen={isCookiesOpen}
        onClose={() => setIsCookiesOpen(false)}
      />
      <ModalEmergencia190
        isOpen={isEmergenciaOpen}
        onClose={() => setIsEmergenciaOpen(false)}
      />
      <ModalBuscarPessoa
        isOpen={isBuscarOpen}
        onClose={() => {
          setIsBuscarOpen(false);
          setBuscarStatusInicial(undefined);
        }}
        initialStatus={buscarStatusInicial}
      />
    </>
  );
};

export default Footer;
