"use client";
import React, { useState } from "react";
import Image from "next/image";
import { TbBuildingCircus } from "react-icons/tb";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import Link from "next/link";
import { BuscaRapida } from "./ui/BuscaRapida";
import { BuscaMobil } from "./ui/BuscaMobil";
import { ModalAdicionarInformacao } from "./ui/ModalAdicionarInformacao";
import ModalComoAjudar from "./ui/ModalComoAjudar";

const Nav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isBuscaMobilOpen, setBuscaMobilOpen] = useState(false);
  const [isModalInformacaoOpen, setModalInformacaoOpen] = useState(false);
  const [isComoAjudarOpen, setComoAjudarOpen] = useState(false);

  return (
    <nav className="fixed top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm transition-colors">
      <div className="mx-auto max-w-[1800px] px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-3">
                <div className="relative h-8 w-8 object-contain">
                  <Image
                    className="object-contain"
                    src="https://desaparecidos.pjc.mt.gov.br/assets/img/pjc_logo.svg"
                    alt="Polícia Civil de Mato Grosso"
                    fill
                    sizes="32px"
                    priority
                  />
                </div>
              <span className="text-lg font-semibold text-gray-900 hidden sm:block">
                Polícia Judiciária Civil - MT
              </span>
              <span className="text-lg font-semibold text-gray-900 sm:hidden">
                PJC - MT
              </span>
            </Link>
          </div>

          <div className="hidden md:block flex-1 max-w-lg mx-8">
            <BuscaRapida />
          </div>

          <div className="hidden md:block">
            <div className="flex items-center space-x-6">
              <div className="group relative">
                <button className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium flex items-center space-x-1 transition-colors">
                  <span>Informações</span>
                  <svg
                    className="h-4 w-4 transition-transform group-hover:rotate-180"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                <div className="absolute left-0 mt-2 w-72 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-1 group-hover:translate-y-0">
                  <div className="rounded-xl bg-white shadow-xl ring-1 ring-gray-200 p-3 transition-colors">
                    <button
                      onClick={() => setComoAjudarOpen(true)}
                      className="w-full text-left flex items-center space-x-3 rounded-lg p-3 hover:bg-gray-50 transition-colors cursor-pointer"
                      type="button"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50">
                        <svg
                          className="h-5 w-5 text-purple-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          Como Ajudar
                        </p>
                        <p className="text-xs text-gray-500">
                          Saiba como colaborar nas buscas
                        </p>
                      </div>
                    </button>
                    <button
                      onClick={() =>
                        window.dispatchEvent(new Event("open-contato-modal"))
                      }
                      className="w-full text-left flex items-center space-x-3 rounded-lg p-3 hover:bg-gray-50 transition-colors cursor-pointer"
                      type="button"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50">
                        <svg
                          className="h-5 w-5 text-indigo-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          Contato
                        </p>
                        <p className="text-xs text-gray-500">
                          Entre em contato conosco
                        </p>
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              <div className="group relative">
                <button className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium flex items-center space-x-1 transition-colors">
                  <span>Emergência</span>
                  <svg
                    className="h-4 w-4 transition-transform group-hover:rotate-180"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                <div className="absolute left-0 mt-2 w-72 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-1 group-hover:translate-y-0">
                  <div className="rounded-xl bg-white shadow-xl ring-1 ring-gray-200 p-3 transition-colors">
                    <a
                      href="tel:190"
                      className="flex items-center space-x-3 rounded-lg p-3 hover:bg-red-50 transition-colors"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-600">
                        <svg
                          className="h-5 w-5 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          Ligar 190
                        </p>
                        <p className="text-xs text-gray-500">
                          Emergência da Polícia Civil
                        </p>
                      </div>
                    </a>
                    <a
                      href="https://delegaciadigital.pjc.mt.gov.br"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 rounded-lg p-3 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                        <TbBuildingCircus className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          Delegacia Online
                        </p>
                        <p className="text-xs text-gray-500">
                          Registre um boletim de ocorrência
                        </p>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={() => setModalInformacaoOpen(true)}
              className="bg-[#101828] hover:bg-[#1447E6] text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm flex items-center space-x-2"
            >
              <svg
                className="h-4 w-4"
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
              <span>Adicionar Informação</span>
            </button>
            <div className="flex items-center space-x-3 pl-4 ml-2 border-l border-gray-200">
              <a
                href="https://github.com/klebr55"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-900 transition-colors"
                aria-label="GitHub"
              >
                <FaGithub className="h-5 w-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/klebervinicius08/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-[#0a66c2] transition-colors"
                aria-label="LinkedIn"
              >
                <FaLinkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={() => setBuscaMobilOpen(true)}
              className="text-gray-600 hover:text-gray-900 p-2 transition-colors"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-gray-900 p-2 transition-colors"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200">
          <div className="space-y-1 px-4 pb-4 pt-2 bg-white transition-colors">
            <Link
              href="/"
              className="block px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
            >
              Pessoas Desaparecidas
            </Link>
            <Link
              href="/?status=localizado"
              className="block px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
            >
              Pessoas Localizadas
            </Link>
            <button
              onClick={() => {
                setComoAjudarOpen(true);
                setIsMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors cursor-pointer"
              type="button"
            >
              Como Ajudar
            </button>
            <button
              onClick={() => {
                window.dispatchEvent(new Event("open-contato-modal"));
                setIsMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors cursor-pointer"
              type="button"
            >
              Contato
            </button>
            <a
              href="tel:190"
              className="block px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors font-medium"
            >
              Emergência 190
            </a>
            <div className="flex items-center space-x-4 pt-2 px-1">
              <a
                href="https://github.com/klebr55"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                aria-label="GitHub"
              >
                <FaGithub className="h-5 w-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/klebervinicius08/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-md text-gray-500 hover:text-[#0a66c2] hover:bg-gray-50 transition-colors"
                aria-label="LinkedIn"
              >
                <FaLinkedin className="h-5 w-5" />
              </a>
            </div>
            <button
              onClick={() => setModalInformacaoOpen(true)}
              className="block w-full px-3 py-2 bg-[#101828] text-white rounded-lg mt-3 text-center font-semibold hover:bg-[#1447E6] transition-colors"
            >
              Adicionar Informação
            </button>
          </div>
        </div>
      )}

      <BuscaMobil
        isOpen={isBuscaMobilOpen}
        onClose={() => setBuscaMobilOpen(false)}
      />

      <ModalAdicionarInformacao
        isOpen={isModalInformacaoOpen}
        onClose={() => setModalInformacaoOpen(false)}
      />

      <ModalComoAjudar
        isOpen={isComoAjudarOpen}
        onClose={() => setComoAjudarOpen(false)}
        onOpenAdicionar={() => setModalInformacaoOpen(true)}
      />
    </nav>
  );
};

export default Nav;
