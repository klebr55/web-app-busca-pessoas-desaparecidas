"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, PanInfo } from "framer-motion";
import { useCarrosselPessoas } from "@/api/hooks";
import {
  FaUser,
  FaTransgender,
  FaCalendarMinus,
  FaLocationDot,
} from "react-icons/fa6";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function CarrosselPessoas() {
  const { pessoas, loading, error } = useCarrosselPessoas();
  const containerRef = useRef<HTMLDivElement>(null);
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

  const pessoasDuplicadas =
    pessoas.length > 0 ? [...pessoas, ...pessoas, ...pessoas] : [];

  const getStatusText = (status: string, sexo: string) => {
    if (status === "DESAPARECIDO") {
      return sexo === "MASCULINO" ? "DESAPARECIDO" : "DESAPARECIDA";
    } else {
      return sexo === "MASCULINO" ? "LOCALIZADO" : "LOCALIZADA";
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Outras Pessoas Desaparecidas
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Ajude-nos a localizar mais pessoas. Cada informação pode fazer a
              diferença.
            </p>
          </div>
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#101828]"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !pessoas.length) {
    return null;
  }

  const Card = ({ pessoa, index }: { pessoa: any; index: number }) => (
    <motion.div
      layout
      className="flex-shrink-0 w-[280px] md:w-[300px] group"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: Math.min(index * 0.06, 0.3) }}
    >
      <Link href={`/${pessoa.id}`}>
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col min-h-[400px] md:min-h-[430px] transform hover:scale-[1.02]">
          <div className="relative h-44 md:h-48 bg-slate-200 flex-shrink-0">
            {pessoa.urlFoto || pessoa.foto ? (
              <Image
                src={pessoa.urlFoto || pessoa.foto || ""}
                alt={pessoa.nome}
                fill
                className="object-cover"
                sizes="300px"
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-gradient-to-br from-slate-200 to-slate-300">
                <FaUser className="w-16 h-16 text-slate-400" />
              </div>
            )}
            <div className="absolute top-3 right-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-600 text-white">
                {getStatusText(pessoa.status, pessoa.sexo)}
              </span>
            </div>
          </div>
          <div className="p-5 md:p-6 flex flex-col flex-1">
            <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-3 md:mb-4 line-clamp-2">
              {pessoa.nome}
            </h3>
            <div className="space-y-2 md:space-y-3 flex-1">
              <div className="flex items-center text-slate-600 text-sm">
                <FaUser className="w-4 h-4 mr-3 text-[#101828] flex-shrink-0" />
                <span>{pessoa.idade} anos</span>
              </div>
              <div className="flex items-center text-slate-600 text-sm">
                <FaTransgender className="w-4 h-4 mr-3 text-purple-500 flex-shrink-0" />
                <span>
                  {pessoa.sexo === "MASCULINO" ? "Masculino" : "Feminino"}
                </span>
              </div>
              <div className="flex items-center text-slate-600 text-sm">
                <FaCalendarMinus className="w-4 h-4 mr-3 text-orange-500 flex-shrink-0" />
                <span>{formatarData(pessoa.dataDesaparecimento)}</span>
              </div>
              {(pessoa.ultimaOcorrencia?.localDesaparecimentoConcat ||
                pessoa.localDesaparecimento) && (
                <div className="flex items-start text-slate-600 text-sm">
                  <FaLocationDot className="w-4 h-4 mr-3 mt-0.5 text-red-500 flex-shrink-0" />
                  <span className="line-clamp-2">
                    {pessoa.ultimaOcorrencia?.localDesaparecimentoConcat ||
                      pessoa.localDesaparecimento}
                  </span>
                </div>
              )}
            </div>
            <div className="mt-4 md:mt-6 pt-3 md:pt-4 border-t border-slate-100">
              <span className="text-[#101828] font-semibold text-sm group-hover:text-[#1447E6] transition-colors">
                Ver detalhes →
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );


  const CardMobile = ({ pessoa }: { pessoa: any }) => (
    <Link href={`/${pessoa.id}`} className="snap-start shrink-0 w-[280px]">
      <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col min-h-[400px] transform hover:scale-[1.02]">
        <div className="relative h-44 bg-slate-200 flex-shrink-0">
          {pessoa.urlFoto || pessoa.foto ? (
            <Image
              src={pessoa.urlFoto || pessoa.foto || ""}
              alt={pessoa.nome}
              fill
              className="object-cover"
              sizes="280px"
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gradient-to-br from-slate-200 to-slate-300">
              <FaUser className="w-16 h-16 text-slate-400" />
            </div>
          )}
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-600 text-white">
              {getStatusText(pessoa.status, pessoa.sexo)}
            </span>
          </div>
        </div>
        <div className="p-5 flex flex-col flex-1">
          <h3 className="text-lg font-bold text-slate-900 mb-3 line-clamp-2">
            {pessoa.nome}
          </h3>
          <div className="space-y-2 flex-1">
            <div className="flex items-center text-slate-600 text-sm">
              <FaUser className="w-4 h-4 mr-3 text-[#101828] flex-shrink-0" />
              <span>{pessoa.idade} anos</span>
            </div>
            <div className="flex items-center text-slate-600 text-sm">
              <FaTransgender className="w-4 h-4 mr-3 text-purple-500 flex-shrink-0" />
              <span>{pessoa.sexo === "MASCULINO" ? "Masculino" : "Feminino"}</span>
            </div>
            <div className="flex items-center text-slate-600 text-sm">
              <FaCalendarMinus className="w-4 h-4 mr-3 text-orange-500 flex-shrink-0" />
              <span>{formatarData(pessoa.dataDesaparecimento)}</span>
            </div>
            {(pessoa.ultimaOcorrencia?.localDesaparecimentoConcat || pessoa.localDesaparecimento) && (
              <div className="flex items-start text-slate-600 text-sm">
                <FaLocationDot className="w-4 h-4 mr-3 mt-0.5 text-red-500 flex-shrink-0" />
                <span className="line-clamp-2">
                  {pessoa.ultimaOcorrencia?.localDesaparecimentoConcat || pessoa.localDesaparecimento}
                </span>
              </div>
            )}
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100">
            <span className="text-[#101828] font-semibold text-sm">Ver detalhes →</span>
          </div>
        </div>
      </div>
    </Link>
  );

  return (
    <section className="py-12 md:py-16 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
            Outras Pessoas Desaparecidas
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Ajude-nos a localizar mais pessoas. Cada informação pode fazer a
            diferença.
          </p>
        </div>

    
        {isMobile ? (
          <div className="relative overflow-hidden">
            <div
              className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-pb-4 pb-2 [-ms-overflow-style:none] [scrollbar-width:none]"
              style={{ scrollbarWidth: "none" as any }}
            >
              {pessoas.map((p) => (
                <CardMobile key={p.id} pessoa={p} />
              ))}
            </div>
            <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-slate-50 via-blue-50 to-transparent z-10"></div>
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-slate-50 via-blue-50 to-transparent z-10"></div>
          </div>
        ) : (
          <div className="relative overflow-hidden">
          <motion.div
            ref={containerRef}
            className="flex gap-4 md:gap-6 cursor-grab active:cursor-grabbing"
            drag="x"
            dragConstraints={(() => {
              const itemW = isMobile ? 290 : 310;
              const viewportW = isMobile
                ? Math.max(320, window.innerWidth - 32)
                : containerRef.current?.offsetWidth || 0;
              const maxScroll = pessoas.length * itemW - viewportW;
              const left = Number.isFinite(maxScroll) && maxScroll > 0 ? -maxScroll : 0;
              return { left, right: 0 } as const;
            })()}
            dragElastic={0.1}
            dragMomentum={false}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            animate={
              isDragging
                ? undefined
                : {
                    x: -currentIndex * (isMobile ? 290 : 310),
                    opacity: 1,
                  }
            }
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 28,
            }}
          >
            {pessoas.map((pessoa, index) => (
              <Card key={pessoa.id} pessoa={pessoa} index={index} />
            ))}
          </motion.div>

          <div className="flex justify-center mt-6 space-x-2">
            {pessoas.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-[#101828] scale-125"
                    : "bg-slate-300 hover:bg-slate-400"
                }`}
              />
            ))}
          </div>

          {!isMobile && (
            <>
              <motion.button
                onClick={() =>
                  setCurrentIndex((prev) =>
                    prev === 0 ? pessoas.length - 1 : prev - 1,
                  )
                }
                className="absolute left-2 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center text-slate-700 hover:text-[#101828] backdrop-blur-sm"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
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
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </motion.button>

              <motion.button
                onClick={() =>
                  setCurrentIndex((prev) => (prev + 1) % pessoas.length)
                }
                className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center text-slate-700 hover:text-[#101828] backdrop-blur-sm"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
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
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </motion.button>
            </>
          )}

          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 md:w-20 bg-gradient-to-r from-slate-50 via-blue-50 to-transparent z-10"></div>
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 md:w-20 bg-gradient-to-l from-slate-50 via-blue-50 to-transparent z-10"></div>
          </div>
        )}

        {isMobile && (
          <div className="text-center mt-4">
            <p className="text-xs text-slate-500 flex items-center justify-center gap-2">
              <span className="inline-block w-6 h-1 bg-slate-300 rounded-full"></span>
              Arraste para navegar
              <span className="inline-block w-6 h-1 bg-slate-300 rounded-full"></span>
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
