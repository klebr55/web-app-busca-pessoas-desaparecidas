"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { PessoaDesaparecida } from "@/api/api";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { MapPin, Calendar, User, Phone, Eye, Cake } from "lucide-react";

interface PessoaCardProps {
  pessoa: PessoaDesaparecida;
  className?: string;
}

export function PessoaCard({ pessoa, className = "" }: PessoaCardProps) {
  const formatarData = (data: string) => {
    try {
      return format(new Date(data), "dd/MM/yyyy", { locale: ptBR });
    } catch {
      return data;
    }
  };

  const imagemSrc = (pessoa.urlFoto && pessoa.urlFoto.trim() !== "")
    ? pessoa.urlFoto
    : (pessoa.foto && pessoa.foto.trim() !== "")
      ? pessoa.foto
      : "/placeholder-avatar.svg";
  const isDesaparecido = pessoa.status === "DESAPARECIDO";

  return (
    <Link href={`/${pessoa.id}`}>
      <div
        className={`
        relative flex w-full max-w-[26rem] flex-col rounded-xl bg-white  bg-clip-border text-gray-700  shadow-lg
        transition-all duration-300 hover:shadow-xl hover:scale-[1.02] cursor-pointer h-full border border-transparent  hover:border-gray-200 
        ${className}
      `}
      >
        <div className="relative mx-4 mt-4 overflow-hidden text-white shadow-lg rounded-xl bg-blue-gray-500 bg-clip-border shadow-blue-gray-500/40 h-60">
          <Image
            src={imagemSrc}
            alt={`Foto de ${pessoa.nome}`}
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            className="object-cover"
            unoptimized
          />

          <div className="absolute inset-0 w-full h-full bg-gradient-to-tr from-transparent via-transparent to-black/60"></div>

          <div
            className={`
            absolute bottom-4 left-4 px-3 py-1 rounded-full text-xs font-semibold
            ${isDesaparecido ? "bg-red-500 text-white" : "bg-green-500 text-white"}
          `}
          >
            {isDesaparecido ? "DESAPARECIDO" : "LOCALIZADO"}
          </div>
        </div>

        <div className="p-6 flex-grow flex flex-col">
          <div className="mb-3">
            <h5 className="block font-sans text-xl antialiased font-medium leading-snug tracking-normal text-blue-gray-900  line-clamp-1">
              {pessoa.nome}
            </h5>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm text-gray-600 ">
              <Cake className="w-4 h-4 mr-2 text-gray-400 " />
              <span>{pessoa.idade} anos</span>
            </div>

            <div className="flex items-center text-sm text-gray-600 ">
              <Calendar className="w-4 h-4 mr-2 text-gray-400 " />
              <span>Desde: {formatarData(pessoa.dataDesaparecimento)}</span>
            </div>

            {pessoa.localDesaparecimento && (
              <div className="flex items-center text-sm text-gray-600 ">
                <MapPin className="w-4 h-4 mr-2 text-gray-400 " />
                <span className="line-clamp-1">
                  {pessoa.localDesaparecimento}
                </span>
              </div>
            )}

            <div className="flex items-center text-sm text-gray-600 ">
              <User className="w-4 h-4 mr-2 text-gray-400 " />
              <span>{pessoa.sexo}</span>
            </div>
          </div>

          <div className="flex-grow">
            <p className="block font-sans text-base antialiased font-light leading-relaxed text-gray-700  line-clamp-3">
              {pessoa.descricao ||
                `Pessoa ${isDesaparecido ? "desaparecida" : "localizada"} com ${pessoa.idade} anos. ${pessoa.localDesaparecimento ? `Última localização conhecida: ${pessoa.localDesaparecimento}.` : ""}`}
            </p>
          </div>

          <div className="inline-flex flex-wrap items-center gap-3 mt-6 group">
            <span className="cursor-pointer rounded-full border border-gray-900/5  bg-gray-900/5  p-3 text-gray-900  transition-colors hover:border-gray-900/10  hover:bg-gray-900/10  hover:!opacity-100 group-hover:opacity-70">
              <Eye className="w-5 h-5" />
            </span>
            <span className="cursor-pointer rounded-full border border-gray-900/5  bg-gray-900/5  p-3 text-gray-900  transition-colors hover:border-gray-900/10  hover:bg-gray-900/10  hover:!opacity-100 group-hover:opacity-70">
              <MapPin className="w-5 h-5" />
            </span>
            <span className="cursor-pointer rounded-full border border-gray-900/5  bg-gray-900/5  p-3 text-gray-900  transition-colors hover:border-gray-900/10  hover:bg-gray-900/10  hover:!opacity-100 group-hover:opacity-70">
              <Phone className="w-5 h-5" />
            </span>
            <span className="cursor-pointer rounded-full border border-gray-900/5  bg-gray-900/5  p-3 text-gray-900  transition-colors hover:border-gray-900/10  hover:bg-gray-900/10  hover:!opacity-100 group-hover:opacity-70">
              <Calendar className="w-5 h-5" />
            </span>
            {pessoa.descricao && pessoa.descricao.length > 100 && (
              <span className="cursor-pointer rounded-full border border-gray-900/5  bg-gray-900/5  px-3 py-2 text-gray-900  transition-colors hover:border-gray-900/10  hover:bg-gray-900/10  hover:!opacity-100 group-hover:opacity-70 text-sm font-medium">
                +detalhes
              </span>
            )}
          </div>
        </div>

        <div className="p-6 pt-3">
          <button
            className="block w-full select-none rounded-lg bg-gray-900  py-3.5 px-7 text-center align-middle font-sans text-sm font-bold uppercase text-white shadow-md shadow-gray-900/10  transition-all hover:shadow-lg hover:shadow-gray-900/20  focus:opacity-[0.90] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              window.open(`/${pessoa.id}`, "_blank");
            }}
          >
            Ver Detalhes
          </button>
        </div>
      </div>
    </Link>
  );
}

interface PessoaCardSkeletonProps {
  className?: string;
}

export function PessoaCardSkeleton({
  className = "",
}: PessoaCardSkeletonProps) {
  return (
    <div
      className={`relative flex w-full max-w-[26rem] flex-col rounded-xl bg-white  bg-clip-border text-gray-700  shadow-lg h-full border border-transparent  ${className}`}
    >
      <div className="relative mx-4 mt-4 overflow-hidden rounded-xl bg-gray-200  animate-pulse h-60">
        <div className="absolute top-4 right-4 h-8 w-8 bg-gray-300  rounded-full animate-pulse" />
        <div className="absolute bottom-4 left-4 h-6 w-20 bg-gray-300  rounded-full animate-pulse" />
      </div>

      <div className="p-6 space-y-4 flex-grow flex flex-col">
        <div>
          <div className="h-6 bg-gray-200  rounded animate-pulse w-40" />
        </div>

        <div className="space-y-2">
          <div className="h-4 bg-gray-200  rounded animate-pulse w-24" />
          <div className="h-4 bg-gray-200  rounded animate-pulse w-32" />
          <div className="h-4 bg-gray-200  rounded animate-pulse w-48" />
          <div className="h-4 bg-gray-200  rounded animate-pulse w-20" />
        </div>

        <div className="space-y-2 flex-grow">
          <div className="h-4 bg-gray-200  rounded animate-pulse w-full" />
          <div className="h-4 bg-gray-200  rounded animate-pulse w-3/4" />
          <div className="h-4 bg-gray-200  rounded animate-pulse w-1/2" />
        </div>

        <div className="flex gap-3 mt-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-11 w-11 bg-gray-200  rounded-full animate-pulse"
            />
          ))}
        </div>
      </div>

      <div className="p-6 pt-3">
        <div className="h-12 bg-gray-200  rounded-lg animate-pulse w-full" />
      </div>
    </div>
  );
}
