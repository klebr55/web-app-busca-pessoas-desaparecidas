"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { usePessoaDetalhe, useInformacoesOcorrencia } from "@/api/hooks";
import { LoadingSpinner, ErrorMessage } from "@/components/ui/LoadingStates";
import { FormularioInformacao } from "@/components/ui/FormularioInformacao";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  FaUser,
  FaTransgender,
  FaCalendarMinus,
  FaLocationDot,
  FaFilePdf,
  FaFileVideo,
  FaFile,
  FaWhatsapp,
  FaFileArrowDown,
  FaCircleExclamation,
} from "react-icons/fa6";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import CarrosselPessoas from "@/components/ui/CarrosselPessoas";

export default function PaginaDetalhes() {
  const params = useParams();
  const { pessoa, loading, error, carregarPessoa } = usePessoaDetalhe();
  const { informacoes: informacoesOcorrencia, loading: loadingInformacoes } =
    useInformacoesOcorrencia(pessoa?.ultimaOcorrencia?.ocoId || null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const id = params?.id ? parseInt(params.id as string) : null;

  const formatarData = (dataIso?: string | null) => {
    if (!dataIso) return "-";
    try {
      return format(new Date(dataIso), "dd/MM/yyyy", { locale: ptBR });
    } catch {
      return "-";
    }
  };

  const calcularIdadeAtual = (
    idadeNaEpoca?: number,
    dataDesap?: string | null,
  ) => {
    if (!idadeNaEpoca || !dataDesap) return idadeNaEpoca || 0;
    try {
      const d = new Date(dataDesap);
      const hoje = new Date();
      let anosPassados = hoje.getFullYear() - d.getFullYear();
      const mDiff = hoje.getMonth() - d.getMonth();
      if (mDiff < 0 || (mDiff === 0 && hoje.getDate() < d.getDate()))
        anosPassados--;
      return idadeNaEpoca + (anosPassados > 0 ? anosPassados : 0);
    } catch {
      return idadeNaEpoca;
    }
  };

  const anexosFotos = React.useMemo(() => {
    const lista: { url: string; data: string }[] = [];
    informacoesOcorrencia.forEach((info) => {
      info.anexos.forEach((an) => {
        if (/\.(jpe?g|png|webp|gif|avif)$/i.test(an)) {
          lista.push({ url: an, data: info.data });
        }
      });
    });
    return lista;
  }, [informacoesOcorrencia]);

  interface ModalItem {
    src: string;
    type: "image" | "pdf" | "video";
    caption?: string;
  }
  const [modal, setModal] = useState<{
    open: boolean;
    items: ModalItem[];
    index: number;
  }>({ open: false, items: [], index: 0 });
  const [isModalSemCartazOpen, setIsModalSemCartazOpen] = useState(false);

  const openModal = (items: ModalItem[], index: number) => {
    setModal({ open: true, items, index });
  };
  const closeModal = () => setModal((m) => ({ ...m, open: false }));
  const prevModal = () =>
    setModal((m) => ({
      ...m,
      index: (m.index - 1 + m.items.length) % m.items.length,
    }));
  const nextModal = () =>
    setModal((m) => ({ ...m, index: (m.index + 1) % m.items.length }));

  useEffect(() => {
    if (modal.open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [modal.open]);

  useEffect(() => {
    if (id) {
      carregarPessoa(id);
    }
  }, [id, carregarPessoa]);

  useEffect(() => {
    if (!modal.open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowLeft") prevModal();
      if (e.key === "ArrowRight") nextModal();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [modal.open]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !pessoa) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <ErrorMessage
            message={error || "Pessoa não encontrada"}
            onRetry={() => id && carregarPessoa(id)}
          />

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Voltar à busca
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const statusColor =
    pessoa.status === "DESAPARECIDO" ? "bg-red-600" : "bg-green-600";

  const getStatusText = (status: string, sexo: string) => {
    if (status === "DESAPARECIDO") {
      return sexo === "MASCULINO" ? "DESAPARECIDO" : "DESAPARECIDA";
    } else {
      return sexo === "MASCULINO" ? "LOCALIZADO" : "LOCALIZADA";
    }
  };

  const statusText = getStatusText(pessoa.status, pessoa.sexo);
  const idadeAtual = calcularIdadeAtual(
    pessoa.idade,
    pessoa.dataDesaparecimento,
  );

  const hasCartazOficial = (() => {
    const hasValidUrl =
      pessoa.cartaz?.urlCartaz &&
      typeof pessoa.cartaz.urlCartaz === "string" &&
      pessoa.cartaz.urlCartaz.trim() !== "";
    const hasValidType =
      pessoa.cartaz?.tipoCartaz &&
      [
        "PDF_DESAPARECIDO",
        "PDF_LOCALIZADO",
        "JPG_DESAPARECIDO",
        "JPG_LOCALIZADO",
        "INSTA_DESAPARECIDO",
        "INSTA_LOCALIZADO",
      ].includes(pessoa.cartaz.tipoCartaz);
    return Boolean(hasValidUrl && hasValidType);
  })();

  const compartilharWhatsapp = () => {
    try {
      const baseUrl = typeof window !== "undefined" ? window.location.href : "";
      const statusTextoMinusculo =
        pessoa.status === "DESAPARECIDO"
          ? pessoa.sexo === "MASCULINO"
            ? "desaparecido"
            : "desaparecida"
          : pessoa.sexo === "MASCULINO"
            ? "localizado"
            : "localizada";

      const texto = [
        `🆘 Pessoa ${statusTextoMinusculo}: ${pessoa.nome}`,
        `${pessoa.idade} anos - ${pessoa.sexo}`,
        pessoa.ultimaOcorrencia?.localDesaparecimentoConcat ||
        pessoa.localDesaparecimento
          ? `Último local: ${pessoa.ultimaOcorrencia?.localDesaparecimentoConcat || pessoa.localDesaparecimento}`
          : null,
        `Data do desaparecimento: ${formatarData(pessoa.dataDesaparecimento)}`,
        "",
        "Ajude a compartilhar! ✅",
        baseUrl,
      ]
        .filter(Boolean)
        .join("\n");
      const url = `https://wa.me/?text=${encodeURIComponent(texto)}`;
      if (typeof window !== "undefined") window.open(url, "_blank", "noopener");
    } catch (e) {}
  };

  const gerarCartaz = async () => {
    const largura = 1080;
    const altura = 1350;
    const dpr = Math.max(1, Math.min(2, Math.floor(window.devicePixelRatio || 1)));

    const canvas = document.createElement("canvas");
    canvas.width = largura * dpr;
    canvas.height = altura * dpr;
    canvas.style.width = `${largura}px`;
    canvas.style.height = `${altura}px`;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    
    const fundo = ctx.createLinearGradient(0, 0, 0, altura);
    fundo.addColorStop(0, "#0b1220");
    fundo.addColorStop(0.55, "#0b1220");
    fundo.addColorStop(1, "#06251f");
    ctx.fillStyle = fundo;
    ctx.fillRect(0, 0, largura, altura);

    const paddingX = 72;
    const topH = Math.round(altura * 0.6);

    
    const fotoUrl = pessoa.urlFoto || pessoa.foto || "";
    let fotoCarregada = false;
    if (fotoUrl) {
      try {
        const img: HTMLImageElement = document.createElement("img");
        img.crossOrigin = "anonymous";
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = fotoUrl;
        });

        const scale = Math.max(largura / img.width, topH / img.height);
        const drawW = img.width * scale;
        const drawH = img.height * scale;
        const dx = (largura - drawW) / 2;
        const dy = (topH - drawH) / 2;
        ctx.drawImage(img, dx, dy, drawW, drawH);

        
        const overlay = ctx.createLinearGradient(0, topH - 260, 0, topH);
        overlay.addColorStop(0, "rgba(0,0,0,0)");
        overlay.addColorStop(1, "rgba(0,0,0,0.65)");
        ctx.fillStyle = overlay;
        ctx.fillRect(0, topH - 260, largura, 260);
        fotoCarregada = true;
      } catch {
        fotoCarregada = false;
      }
    }

    if (!fotoCarregada) {
      ctx.fillStyle = "#1e293b";
      ctx.fillRect(0, 0, largura, topH);
      ctx.fillStyle = "#94a3b8";
      ctx.font = '600 44px "Inter", system-ui';
      ctx.textAlign = "center";
      ctx.fillText("SEM FOTO", largura / 2, Math.round(topH * 0.52));
    }

    
    const statusTexto = pessoa.status === "DESAPARECIDO" ? "DESAPARECIDO(A)" : "LOCALIZADO(A)";
    const statusBg = pessoa.status === "DESAPARECIDO" ? "#dc2626" : "#059669";
    const pillX = paddingX;
    const pillY = 24;
    const pillH = 40;
    ctx.font = '800 20px "Inter", system-ui';
    const pillTextW = ctx.measureText(statusTexto).width;
    const pillW = Math.ceil(pillTextW + 24);
    ctx.fillStyle = statusBg;
    ctx.beginPath();
    const r = 10;
    ctx.moveTo(pillX + r, pillY);
    ctx.lineTo(pillX + pillW - r, pillY);
    ctx.quadraticCurveTo(pillX + pillW, pillY, pillX + pillW, pillY + r);
    ctx.lineTo(pillX + pillW, pillY + pillH - r);
    ctx.quadraticCurveTo(
      pillX + pillW,
      pillY + pillH,
      pillX + pillW - r,
      pillY + pillH,
    );
    ctx.lineTo(pillX + r, pillY + pillH);
    ctx.quadraticCurveTo(pillX, pillY + pillH, pillX, pillY + pillH - r);
    ctx.lineTo(pillX, pillY + r);
    ctx.quadraticCurveTo(pillX, pillY, pillX + r, pillY);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "left";
    ctx.fillText(statusTexto, pillX + 12, pillY + 26);

    
    const nome = pessoa.nome.toUpperCase();
    const maxNomeW = largura - paddingX * 2;
    ctx.textAlign = "left";
    ctx.fillStyle = "#ffffff";
    ctx.font = '900 68px "Inter", system-ui';

    const wrap = (text: string, maxW: number, maxLines = 2) => {
      const words = text.split(/\s+/);
      const lines: string[] = [];
      let line = "";
      for (let i = 0; i < words.length; i++) {
        const test = line ? line + " " + words[i] : words[i];
        if (ctx.measureText(test).width <= maxW) {
          line = test;
        } else {
          if (lines.length === maxLines - 1) {
            
            let shortened = test;
            while (ctx.measureText(shortened + "…").width > maxW && shortened.length) {
              shortened = shortened.substring(0, shortened.lastIndexOf(" ")) || shortened.slice(0, -1);
            }
            lines.push(shortened + "…");
            return lines;
          }
          lines.push(line);
          line = words[i];
        }
      }
      if (line) lines.push(line);
      return lines.slice(0, maxLines);
    };

    const nomeLinhas = wrap(nome, maxNomeW, 2);
    let baseY = topH - 100 - (nomeLinhas.length - 1) * 72;
    nomeLinhas.forEach((l, idx) => {
      ctx.fillText(l, paddingX, baseY + idx * 72);
    });

   
    ctx.font = '700 28px "Inter", system-ui';
    ctx.fillStyle = "#e2e8f0";
    ctx.fillText(`${pessoa.idade} anos • ${pessoa.sexo}`, paddingX, topH - 40);

    
    const panelY = topH;
    ctx.fillStyle = "#0b2335";
    ctx.fillRect(0, panelY, largura, altura - panelY);

 
    let cursorY = panelY + 80;
    ctx.textAlign = "left";
    ctx.fillStyle = "#f8fafc";
    ctx.font = '800 36px "Inter", system-ui';
    ctx.fillText("Dados:", paddingX, cursorY);
    cursorY += 48;

    ctx.font = '500 30px "Inter", system-ui';
    ctx.fillStyle = "#e2e8f0";
    const linhasInfo: string[] = [
      `Data: ${formatarData(pessoa.dataDesaparecimento)}`,
      pessoa.ultimaOcorrencia?.localDesaparecimentoConcat || pessoa.localDesaparecimento
        ? `Local: ${pessoa.ultimaOcorrencia?.localDesaparecimentoConcat || pessoa.localDesaparecimento}`
        : "",
    ].filter(Boolean);

    
    const truncateToWidth = (text: string, maxW: number) => {
      if (ctx.measureText(text).width <= maxW) return text;
      let lo = 0, hi = text.length;
      while (lo < hi) {
        const mid = Math.floor((lo + hi) / 2);
        const sample = text.slice(0, mid) + "…";
        if (ctx.measureText(sample).width <= maxW) lo = mid + 1; else hi = mid;
      }
      return text.slice(0, lo - 1) + "…";
    };

    const infoMaxW = largura - paddingX * 2;
    linhasInfo.forEach((l) => {
      ctx.fillText(truncateToWidth(l, infoMaxW), paddingX, cursorY);
      cursorY += 44;
    });

    if (pessoa.status === "DESAPARECIDO") {
      cursorY += 8;
      ctx.font = '900 40px "Inter", system-ui';
      ctx.fillStyle = "#f59e0b";
      ctx.fillText("AJUDE A ENCONTRAR", paddingX, cursorY);
      cursorY += 56;
    }

    ctx.font = '500 24px "Inter", system-ui';
    ctx.fillStyle = "#94a3b8";
    ctx.fillText("Compartilhe • Portal Desenvolve MT", paddingX, altura - 48);

    const slug = pessoa.nome
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.download = `cartaz-${slug}.png`;
      a.href = url;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 4000);
    }, "image/png");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Nav />

      <div className="bg-white/80 backdrop-blur-lg border-b border-slate-200/60 mt-16">
        <div className="mx-auto max-w-[1800px] px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center text-slate-600 hover:text-slate-900 transition-colors group"
            >
              <svg
                className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              <span className="text-sm font-medium">Voltar à busca</span>
            </Link>

            {pessoa.status === "DESAPARECIDO" && (
              <button
                onClick={() => setMostrarFormulario(true)}
                className="inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg transition-all"
              >
                <svg
                  className="w-4 h-4 mr-2"
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
                Tenho informações sobre esta pessoa
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1800px] px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-5 lg:gap-8">
          <div className="lg:col-span-2">
            <div className="relative rounded-xl shadow-sm border border-slate-200 overflow-hidden lg:sticky top-6 bg-slate-200 h-[82vh] md:h-[85vh] min-h-[560px] max-h-[1100px] flex">
              <button
                type="button"
                onClick={() =>
                  openModal(
                    [
                      {
                        src:
                          pessoa.urlFoto ||
                          pessoa.foto ||
                          "/placeholder-avatar.svg",
                        type: "image",
                        caption: pessoa.nome,
                      },
                    ],
                    0,
                  )
                }
                className="absolute inset-0 group cursor-zoom-in text-left"
              >
                <Image
                  src={
                    pessoa.urlFoto || pessoa.foto || "/placeholder-avatar.svg"
                  }
                  alt={`Foto de ${pessoa.nome}`}
                  fill
                  className="object-cover md:object-cover w-full h-full transition duration-500 group-hover:scale-[1.01] group-hover:brightness-105"
                  unoptimized
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 40vw, 25vw"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "/placeholder-avatar.svg";
                  }}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/75 via-slate-900/10 to-transparent" />
                <span
                  className={`absolute top-3 right-3 inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-wide shadow ring-1 ring-black/5 ${pessoa.status === "DESAPARECIDO" ? "bg-red-600 text-white" : "bg-emerald-600 text-white"}`}
                >
                  {statusText}
                </span>
                <span className="absolute top-3 left-3 inline-flex items-center gap-1 text-[10px] font-medium text-white/90 backdrop-blur-sm bg-white/10 px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition">
                  Ampliar
                </span>
              </button>
              <div className="absolute inset-x-0 bottom-0 p-4 pt-8 bg-gradient-to-t from-slate-900/85 via-slate-900/60 to-transparent">
                <h1 className="text-base md:text-lg font-bold text-white tracking-tight mb-4 leading-snug line-clamp-2 drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">
                  {pessoa.nome}
                </h1>
                <ul className="space-y-2.5 md:space-y-3">
                  <li className="flex items-center gap-2 text-[12px] md:text-[13px] text-slate-100">
                    <FaUser className="w-5 h-5 text-slate-200 drop-shadow" />
                    <div className="flex flex-col leading-tight">
                      <span className="font-semibold text-white">
                        {pessoa.idade} anos
                      </span>
                      {pessoa.status === "DESAPARECIDO" &&
                        idadeAtual !== pessoa.idade && (
                          <span className="text-[10px] md:text-[11px] text-slate-300/80">
                            Hoje teria {idadeAtual}
                          </span>
                        )}
                    </div>
                  </li>
                  <li className="flex items-center gap-2 text-[12px] md:text-[13px] text-slate-100">
                    <FaTransgender className="w-5 h-5 text-slate-200 drop-shadow" />
                    <span className="font-semibold tracking-wide uppercase">
                      {pessoa.sexo}
                    </span>
                  </li>
                  <li className="flex items-center gap-2 text-[12px] md:text-[13px] text-slate-100">
                    <FaCalendarMinus className="w-5 h-5 text-slate-200 drop-shadow" />
                    <div className="flex flex-col leading-tight">
                      <span className="font-semibold">
                        {pessoa.status === "DESAPARECIDO"
                          ? "Desaparecido em:"
                          : "Localizado em:"}
                      </span>
                      <span className="text-[10px] md:text-[11px] text-slate-300/80">
                        {formatarData(pessoa.dataDesaparecimento)}
                      </span>
                    </div>
                  </li>
                  {(pessoa.ultimaOcorrencia?.localDesaparecimentoConcat ||
                    pessoa.localDesaparecimento) && (
                    <li className="flex items-center gap-2 text-[12px] md:text-[13px] text-slate-100">
                      <FaLocationDot className="w-5 h-5 text-slate-200 drop-shadow" />
                      <span
                        className="leading-tight truncate"
                        title={
                          pessoa.ultimaOcorrencia?.localDesaparecimentoConcat ||
                          pessoa.localDesaparecimento
                        }
                      >
                        {pessoa.ultimaOcorrencia?.localDesaparecimentoConcat ||
                          pessoa.localDesaparecimento}
                      </span>
                    </li>
                  )}
                </ul>
                {pessoa.status === "DESAPARECIDO" && (
                  <div className="mt-4">
                    <button
                      onClick={() => setMostrarFormulario(true)}
                      className="relative w-full inline-flex items-center justify-center gap-2 rounded-md bg-emerald-600/90 backdrop-blur px-4 py-2.5 text-[12px] font-semibold text-white shadow-sm ring-1 ring-emerald-600/20 hover:bg-emerald-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 transition"
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
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      Tenho informações
                    </button>
                    <p className="text-[10px] text-slate-300 text-center mt-2">
                      Ajude na busca por {pessoa.nome}
                    </p>
                  </div>
                )}

                <div className="mt-3 border-t border-white/10 pt-3">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={compartilharWhatsapp}
                      className="inline-flex items-center justify-center gap-1.5 rounded-md bg-emerald-600/90 px-2.5 py-2 text-[11px] font-semibold text-white shadow ring-1 ring-emerald-500/20 hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
                    >
                      <FaWhatsapp className="w-4 h-4" />
                      <span className="hidden sm:inline">WhatsApp</span>
                      <span className="sm:hidden">Wpp</span>
                    </button>
                    <button
                      onClick={() => {
                        if (!hasCartazOficial) {
                          setIsModalSemCartazOpen(true);
                        } else {
                          gerarCartaz();
                        }
                      }}
                      className="inline-flex items-center justify-center gap-1.5 rounded-md bg-slate-800/90 px-2.5 py-2 text-[11px] font-semibold text-white shadow ring-1 ring-slate-700/30 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 transition"
                      aria-label="Baixar cartaz PNG"
                    >
                      <FaFileArrowDown className="w-4 h-4" />
                      <span className="hidden sm:inline">Cartaz</span>
                      <span className="sm:hidden">PNG</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 lg:mt-0 lg:col-span-3">
            <div className="space-y-8">
              <div className="space-y-6">
                {pessoa.descricao && (
                  <div className="bg-white rounded-xl border border-slate-200/60 p-6">
                    <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-3">
                      Descrição
                    </h3>
                    <p className="text-slate-700 leading-relaxed">
                      {pessoa.descricao}
                    </p>
                  </div>
                )}
                {pessoa.caracteristicas && (
                  <div className="bg-white rounded-xl border border-slate-200/60 p-6">
                    <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-3">
                      Características
                    </h3>
                    <p className="text-slate-700 leading-relaxed">
                      {pessoa.caracteristicas}
                    </p>
                  </div>
                )}

                {pessoa.observacoes && (
                  <div className="bg-white rounded-xl border border-slate-200/60 p-6">
                    <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-3">
                      Observações
                    </h3>
                    <p className="text-slate-700 leading-relaxed">
                      {pessoa.observacoes}
                    </p>
                  </div>
                )}

                {pessoa.ultimaLocalizacao && (
                  <div className="bg-white rounded-xl border border-slate-200/60 p-6">
                    <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-3">
                      Última localização conhecida
                    </h3>
                    <p className="text-slate-700 leading-relaxed">
                      {pessoa.ultimaLocalizacao}
                    </p>
                  </div>
                )}

                {pessoa.telefoneContato && (
                  <div className="bg-white rounded-xl border border-slate-200/60 p-6">
                    <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-3">
                      Contato para informações
                    </h3>
                    <div className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-2 text-slate-400"
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
                      <span className="text-slate-700 font-medium">
                        {pessoa.telefoneContato}
                      </span>
                    </div>
                  </div>
                )}

                {informacoesOcorrencia.length > 0 && (
                  <div className="rounded-3xl border border-slate-200/70 bg-white p-6 sm:p-6 max-h-screen flex flex-col">
                    <div className="mb-8">
                      <h3 className="text-2xl font-bold text-slate-900 leading-tight">
                        Informações adicionais da ocorrência
                      </h3>
                      <p className="text-sm text-slate-500 mt-1">
                        Atualizações recebidas sobre esta ocorrência
                      </p>
                    </div>
                    <div
                      className="flex flex-col gap-8 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-300/60 scrollbar-track-transparent"
                      style={{ scrollbarGutter: "stable" }}
                    >
                      {informacoesOcorrencia.map((info, index) => {
                        const dataFormatada = format(
                          new Date(info.data),
                          "dd/MM/yyyy",
                          { locale: ptBR },
                        );
                        return (
                          <div
                            key={info.id}
                            className="w-full p-5 sm:p-7 bg-white rounded-3xl border border-slate-200 shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] flex flex-col gap-4"
                          >
                            <div className="flex items-start justify-between gap-4 flex-wrap">
                              <div className="flex items-center gap-3 flex-wrap">
                                <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-[11px] font-semibold tracking-wide ring-1 ring-blue-200 uppercase">
                                  Atualização #{index + 1}
                                </span>
                                <time className="text-xs text-slate-500 font-medium">
                                  {dataFormatada}
                                </time>
                                {info.anexos.length > 0 && (
                                  <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                                    {info.anexos.length}{" "}
                                    {info.anexos.length === 1
                                      ? "anexo"
                                      : "anexos"}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div>
                              <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">
                                {info.informacao}
                              </p>
                            </div>
                            {info.anexos.length > 0 && (
                              <div className="flex flex-col gap-3">
                                <span className="text-xs font-semibold text-slate-600 tracking-wide uppercase flex items-center gap-2">
                                  Anexos
                                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 text-blue-600 px-2 py-0.5 text-[10px] font-medium ring-1 ring-blue-200">
                                    {info.anexos.length}
                                  </span>
                                  <span className="flex items-center gap-1 text-[11px] text-slate-400">
                                    {info.anexos.some((a) =>
                                      /\.(jpe?g|png|webp|gif|avif)$/i.test(a),
                                    ) && <span title="Imagens">🖼️</span>}
                                    {info.anexos.some((a) =>
                                      /\.(mp4|webm|ogg|mov|m4v)$/i.test(a),
                                    ) && <span title="Vídeos">🎬</span>}
                                    {info.anexos.some((a) =>
                                      /\.pdf$/i.test(a),
                                    ) && <span title="PDFs">📄</span>}
                                  </span>
                                </span>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                  {info.anexos.map((anexo, anexoIndex) => {
                                    const lower = anexo.toLowerCase();
                                    const isImage =
                                      /\.(jpe?g|png|webp|gif|avif)$/i.test(
                                        lower,
                                      );
                                    const isPdf = /\.(pdf)$/i.test(lower);
                                    const isVideo =
                                      /\.(mp4|webm|ogg|mov|m4v)$/i.test(lower);
                                    const fancyboxCaption = `Atualização #${index + 1} - ${dataFormatada}`;
                                    if (isImage) {
                                      const ext = (
                                        lower
                                          .split(/[?#]/)[0]
                                          .split(".")
                                          .pop() || "img"
                                      )
                                        .replace(/[^a-z0-9]/g, "")
                                        .substring(0, 4)
                                        .toUpperCase();
                                      return (
                                        <div
                                          key={anexoIndex}
                                          className="group relative"
                                        >
                                          <button
                                            type="button"
                                            onClick={() => {
                                              const imageAttachments =
                                                info.anexos.filter((a) =>
                                                  /\.(jpe?g|png|webp|gif|avif)$/i.test(
                                                    a,
                                                  ),
                                                );
                                              const currentIndex =
                                                imageAttachments.indexOf(anexo);
                                              const items =
                                                imageAttachments.map((a) => ({
                                                  src: a,
                                                  type: "image" as const,
                                                  caption: fancyboxCaption,
                                                }));
                                              openModal(items, currentIndex);
                                            }}
                                            className="group block w-full aspect-square overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 ring-0 hover:ring-2 hover:ring-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all relative cursor-zoom-in"
                                          >
                                            <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-slate-200 to-slate-300 group-[.loaded]:opacity-0 transition-opacity duration-300" />

                                            <div className="relative w-full h-full">
                                              <Image
                                                src={anexo}
                                                alt={`Imagem ${anexoIndex + 1}`}
                                                fill
                                                className="object-cover transition-all duration-500 group-hover:scale-105 group-hover:brightness-110"
                                                loading="lazy"
                                                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                                                unoptimized
                                              />
                                            </div>

                                            <span className="absolute top-1.5 left-1.5 rounded-md bg-black/55 text-[10px] font-semibold tracking-wide text-white px-1.5 py-0.5 backdrop-blur-sm">
                                              {ext}
                                            </span>
                                            <span className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                            <span className="absolute bottom-1 left-1 bg-black/60 backdrop-blur px-1.5 py-0.5 rounded text-[10px] font-medium tracking-wide text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                              VER
                                            </span>
                                          </button>
                                        </div>
                                      );
                                    }
                                    if (isPdf) {
                                      return (
                                        <div
                                          key={anexoIndex}
                                          className="group relative"
                                        >
                                          <button
                                            type="button"
                                            onClick={() => {
                                              openModal(
                                                [
                                                  {
                                                    src: anexo,
                                                    type: "pdf",
                                                    caption: fancyboxCaption,
                                                  },
                                                ],
                                                0,
                                              );
                                            }}
                                            className="flex flex-col items-center justify-center gap-2 w-full aspect-square rounded-2xl border border-slate-200 bg-gradient-to-br from-red-50 to-red-100 text-red-700 hover:border-red-300 hover:shadow transition p-3 text-center"
                                          >
                                            <FaFilePdf className="w-8 h-8" />
                                            <span className="text-[11px] font-semibold tracking-wide">
                                              PDF
                                            </span>
                                            <span className="absolute top-1 left-1 bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded shadow">
                                              PDF
                                            </span>
                                          </button>
                                        </div>
                                      );
                                    }
                                    if (isVideo) {
                                      const ext = (
                                        lower
                                          .split(/[?#]/)[0]
                                          .split(".")
                                          .pop() || "mp4"
                                      )
                                        .replace(/[^a-z0-9]/g, "")
                                        .substring(0, 5)
                                        .toUpperCase();
                                      return (
                                        <div
                                          key={anexoIndex}
                                          className="group relative"
                                        >
                                          <button
                                            type="button"
                                            onClick={() => {
                                              openModal(
                                                [
                                                  {
                                                    src: anexo,
                                                    type: "video",
                                                    caption: fancyboxCaption,
                                                  },
                                                ],
                                                0,
                                              );
                                            }}
                                            className="flex flex-col items-center justify-center gap-2 w-full aspect-square rounded-2xl border border-slate-200 bg-gradient-to-br from-purple-50 to-indigo-100 text-indigo-700 hover:border-indigo-300 hover:shadow transition p-3 text-center"
                                          >
                                            <FaFileVideo className="w-8 h-8" />
                                            <span className="text-[11px] font-semibold tracking-wide">
                                              VÍDEO
                                            </span>
                                            <span className="absolute top-1 left-1 bg-indigo-600 text-white text-[10px] px-1.5 py-0.5 rounded shadow">
                                              {ext}
                                            </span>
                                          </button>
                                        </div>
                                      );
                                    }

                                    return (
                                      <div
                                        key={anexoIndex}
                                        className="group relative"
                                      >
                                        <button
                                          type="button"
                                          onClick={() =>
                                            openModal(
                                              [
                                                {
                                                  src: anexo,
                                                  type: "pdf",
                                                  caption: fancyboxCaption,
                                                },
                                              ],
                                              0,
                                            )
                                          }
                                          className="flex flex-col items-center justify-center gap-2 w-full aspect-square rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 text-slate-600 hover:border-slate-300 hover:shadow transition p-3 text-center relative"
                                        >
                                          <FaFile className="w-8 h-8" />
                                          <span className="text-[11px] font-semibold tracking-wide">
                                            ARQUIVO
                                          </span>
                                          <span className="absolute top-1 left-1 bg-slate-500 text-white text-[10px] px-1.5 py-0.5 rounded shadow">
                                            FILE
                                          </span>
                                        </button>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    {loadingInformacoes && (
                      <div className="text-center pt-8">
                        <div className="inline-flex items-center">
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-slate-500"
                            xmlns="http://www.w3.org/2000/svg"
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
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          <span className="text-sm text-slate-500">
                            Carregando informações adicionais...
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {anexosFotos.length > 0 && (
                  <div className="bg-white rounded-xl border border-slate-200/60 p-6">
                    <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-4">
                      Galeria de Avistamentos
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                      {anexosFotos.slice(0, 25).map((item, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() =>
                            openModal(
                              anexosFotos.map((f) => ({
                                src: f.url,
                                type: "image" as const,
                                caption: `Avistamento em ${format(new Date(f.data), "dd/MM/yyyy")}`,
                              })),
                              i,
                            )
                          }
                          className="group relative block w-full aspect-square overflow-hidden rounded-lg ring-1 ring-slate-200 hover:ring-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-zoom-in"
                        >
                          <div className="relative w-full h-full">
                            <Image
                              src={item.url}
                              alt={`Foto de avistamento ${i + 1}`}
                              fill
                              className="object-cover transition-all duration-300 group-hover:scale-105 group-hover:brightness-110"
                              loading="lazy"
                              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                              unoptimized
                            />
                          </div>

                          <span className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          <span className="absolute bottom-1 left-1 bg-black/55 text-white px-1.5 py-0.5 rounded text-[10px] tracking-wide font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                            ABRIR
                          </span>
                        </button>
                      ))}
                    </div>
                    {anexosFotos.length > 25 && (
                      <p className="text-[11px] text-slate-500 mt-3">
                        Mostrando 25 de {anexosFotos.length} fotos.
                      </p>
                    )}
                  </div>
                )}

                <div className="bg-gradient-to-br from-emerald-50 via-green-50 to-blue-50 rounded-2xl border border-emerald-200/60 p-8">
                  <div className="text-center max-w-lg mx-auto">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-100 rounded-full mb-4">
                      <svg
                        className="w-6 h-6 text-emerald-600"
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
                    <h3 className="text-xl font-bold text-slate-900 mb-3">
                      Você pode ajudar!
                    </h3>
                    <p className="text-slate-600 mb-6 leading-relaxed">
                      Tem informações sobre{" "}
                      <span className="font-semibold text-slate-900">
                        {pessoa.nome}
                      </span>
                      ? Qualquer detalhe pode ser fundamental para{" "}
                      {pessoa.status === "DESAPARECIDO"
                        ? "o reencontro com a família"
                        : "a investigação"}
                      .
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <a
                        href="tel:190"
                        className="inline-flex items-center justify-center px-6 py-3 bg-red-600 text-white font-semibold text-sm rounded-lg hover:bg-red-700 transition-all"
                      >
                        <svg
                          className="w-4 h-4 mr-2"
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
                        EMERGÊNCIA - 190
                      </a>
                      {pessoa.status === "DESAPARECIDO" && (
                        <button
                          onClick={() => setMostrarFormulario(true)}
                          className="inline-flex items-center justify-center px-6 py-3 bg-emerald-600 text-white font-semibold text-sm rounded-lg hover:bg-emerald-700 transition-all"
                        >
                          <svg
                            className="w-4 h-4 mr-2"
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
                          ENVIAR INFORMAÇÃO
                        </button>
                      )}

                      {(() => {
                        const hasValidUrl =
                          pessoa.cartaz?.urlCartaz &&
                          typeof pessoa.cartaz.urlCartaz === "string" &&
                          pessoa.cartaz.urlCartaz.trim() !== "";

                        const hasValidType =
                          pessoa.cartaz?.tipoCartaz &&
                          [
                            "PDF_DESAPARECIDO",
                            "PDF_LOCALIZADO",
                            "JPG_DESAPARECIDO",
                            "JPG_LOCALIZADO",
                            "INSTA_DESAPARECIDO",
                            "INSTA_LOCALIZADO",
                          ].includes(pessoa.cartaz.tipoCartaz);

                        return hasValidUrl && hasValidType;
                      })() && (
                        <a
                          href={pessoa.cartaz?.urlCartaz || "#"}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold text-sm rounded-lg hover:bg-blue-700 transition-all"
                        >
                          <FaFileArrowDown className="w-4 h-4 mr-2" />
                          BAIXAR CARTAZ
                        </a>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-4">
                      Suas informações serão tratadas com total
                      confidencialidade
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CarrosselPessoas />

      <Footer />

      {mostrarFormulario && (
        <FormularioInformacao
          pessoa={pessoa}
          onFechar={() => setMostrarFormulario(false)}
        />
      )}

      {modal.open && (
        <div className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-sm flex items-center justify-center">
          <div className="fixed top-4 left-4 right-4 flex items-center justify-between text-white text-sm z-50">
            <div className="font-medium truncate max-w-[60%]">
              {modal.items[modal.index]?.caption || "Visualização"}
            </div>
            <div className="flex items-center gap-3">
              {modal.items.length > 1 && (
                <span className="text-xs px-2 py-1 rounded bg-white/10 border border-white/20">
                  {modal.index + 1} / {modal.items.length}
                </span>
              )}
              <button
                onClick={closeModal}
                aria-label="Fechar"
                className="rounded-md bg-white/10 hover:bg-white/20 text-white px-3 py-1 text-xs font-semibold"
              >
                ✕
              </button>
            </div>
          </div>

          {modal.items.length > 1 && (
            <>
              <button
                onClick={prevModal}
                aria-label="Anterior"
                className="fixed left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-2xl font-bold z-50"
              >
                ‹
              </button>
              <button
                onClick={nextModal}
                aria-label="Próximo"
                className="fixed right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-2xl font-bold z-50"
              >
                ›
              </button>
            </>
          )}

          <div className="w-full h-full flex items-center justify-center p-8">
            {modal.items[modal.index].type === "image" && (
              <div className="relative w-[90vw] h-[85vh]">
                <Image
                  src={modal.items[modal.index].src}
                  alt={modal.items[modal.index].caption || ""}
                  fill
                  className="object-contain rounded-lg shadow-2xl"
                  sizes="90vw"
                  unoptimized
                />
              </div>
            )}
            {modal.items[modal.index].type === "pdf" && (
              <iframe
                src={modal.items[modal.index].src}
                className="w-full h-full max-w-[90vw] max-h-[85vh] bg-white rounded-lg shadow-2xl"
                title={modal.items[modal.index].caption || "PDF"}
              />
            )}
            {modal.items[modal.index].type === "video" && (
              <video
                controls
                src={modal.items[modal.index].src}
                className="max-w-[90vw] max-h-[85vh] rounded-lg shadow-2xl"
              />
            )}
          </div>

          <button
            onClick={closeModal}
            className="absolute inset-0 -z-10"
            aria-hidden="true"
          />
        </div>
      )}

      {isModalSemCartazOpen && (
        <div className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl ring-1 ring-black/10 p-6">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                <FaCircleExclamation className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h4 className="text-base font-semibold text-slate-900">
                  Cartaz oficial indisponível
                </h4>
                <p className="mt-1.5 text-sm text-slate-600">
                  A API não retornou um cartaz oficial para esta pessoa. Você pode gerar um cartaz compartilhável agora mesmo.
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-2 sm:justify-end">
              <button
                onClick={() => setIsModalSemCartazOpen(false)}
                className="inline-flex items-center justify-center rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Fechar
              </button>
              <button
                onClick={() => {
                  setIsModalSemCartazOpen(false);
                  gerarCartaz();
                }}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-slate-800 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-900"
              >
                <FaFileArrowDown className="h-4 w-4" />
                Gerar cartaz agora
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
