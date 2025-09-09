"use client";

import React, { useState, useMemo, useRef } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RTooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
  Customized,
} from "recharts";
import {
  X,
  TrendingUp,
  Users,
  Clock,
  BarChart3,
  RefreshCw,
  ArrowUpRight,
  FileSpreadsheet,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEstatisticasAvancadas } from "@/api/hooks";

interface ModalEstatisticasAvancadasProps {
  isOpen: boolean;
  onClose: () => void;
}

type Periodo = "24h" | "7d" | "30d";

export default function ModalEstatisticasAvancadas({
  isOpen,
  onClose,
}: ModalEstatisticasAvancadasProps) {
  const { estatisticas, loading, error, refetch } = useEstatisticasAvancadas();
  const [periodo, setPeriodo] = useState<Periodo>("24h");
  const chartRef = useRef<HTMLDivElement | null>(null);
  const barChartContainerRef = useRef<HTMLDivElement | null>(null);

  const horasSelecionadas = useMemo(() => {
    if (!estatisticas) return [] as any[];
    const base = estatisticas.tendencias.ultimasHoras;
    const sizeMap: Record<Periodo, number> = {
      "24h": 24,
      "7d": 24 * 7,
      "30d": 24 * 30,
    };
    const needed = sizeMap[periodo];
    if (base.length <= needed) return base;
    return base.slice(-needed);
  }, [estatisticas, periodo]);

  const movingAverage = useMemo(() => {
    const win = 6;
    return horasSelecionadas.map((h, idx, arr) => {
      const start = Math.max(0, idx - win + 1);
      const slice = arr.slice(start, idx + 1);
      const media =
        slice.reduce((acc: number, s: any) => acc + s.desaparecimentos, 0) /
        slice.length;
      return { hora: h.hora, media: parseFloat(media.toFixed(2)) };
    });
  }, [horasSelecionadas]);

  const exportCSV = () => {
    if (!horasSelecionadas.length) return;
    const header = "hora,desaparecimentos,localizacoes\n";
    const rows = horasSelecionadas
      .map((h) => `${h.hora},${h.desaparecimentos},${h.localizacoes}`)
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `estatisticas_${periodo}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden border border-gray-200"
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
                <BarChart3 className="w-6 h-6" />
                <h2 className="text-lg sm:text-xl font-semibold tracking-tight">
                  Estatísticas em Tempo Real
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-1 bg-white/10 rounded-lg p-1">
                  {(["24h", "7d", "30d"] as Periodo[]).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPeriodo(p)}
                      className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${p === periodo ? "bg-white text-[#101828] shadow-sm" : "text-white/70 hover:text-white hover:bg-white/10"}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                <button
                  onClick={exportCSV}
                  className="p-2 hover:bg-white/15 active:bg-white/25 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/40"
                  title="Exportar CSV"
                >
                  <FileSpreadsheet className="w-5 h-5" />
                </button>
                <button
                  onClick={refetch}
                  className="p-2 hover:bg-white/15 active:bg-white/25 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/40"
                  title="Atualizar dados"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/15 active:bg-white/25 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/40"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-5 sm:p-6 overflow-y-auto max-h-[calc(90vh-72px)]">
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center h-64 text-red-600">
                  <div className="text-center">
                    <p className="mb-2">Erro ao carregar estatísticas</p>
                    <button
                      onClick={refetch}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Tentar novamente
                    </button>
                  </div>
                </div>
              ) : estatisticas ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0 * 0.05 }}
                      className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#101828] to-[#1a1f2e] p-4 text-white shadow ring-1 ring-inset ring-white/10 backdrop-blur-sm before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.08),transparent_60%)] before:pointer-events-none"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-2xs uppercase tracking-wide text-white/70 font-medium">
                            Total Desaparecidos
                          </p>
                          <p className="text-xl sm:text-2xl font-semibold leading-tight">
                            {estatisticas.totalDesaparecidos.toLocaleString()}
                          </p>
                        </div>
                        <Users className="w-8 h-8 text-white/70" />
                      </div>
                    </motion.div>
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 1 * 0.05 }}
                      className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#101828] to-[#1a1f2e] p-4 text-white shadow ring-1 ring-inset ring-white/10 backdrop-blur-sm before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.06),transparent_65%)] before:pointer-events-none"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-2xs uppercase tracking-wide text-white/70 font-medium">
                            Total Encontrados
                          </p>
                          <p className="text-xl sm:text-2xl font-semibold leading-tight">
                            {estatisticas.totalEncontrados.toLocaleString()}
                          </p>
                        </div>
                        <Users className="w-8 h-8 text-white/70" />
                      </div>
                    </motion.div>
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 2 * 0.05 }}
                      className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#101828] to-[#1a1f2e] p-4 text-white shadow ring-1 ring-inset ring-white/10 backdrop-blur-sm before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_40%_70%,rgba(255,255,255,0.07),transparent_60%)] before:pointer-events-none"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-2xs uppercase tracking-wide text-white/70 font-medium">
                            Desaparecimentos/Hora
                          </p>
                          <p className="text-xl sm:text-2xl font-semibold leading-tight">
                            {estatisticas.desaparecidosPorHora}
                          </p>
                        </div>
                        <Clock className="w-8 h-8 text-white/70" />
                      </div>
                    </motion.div>
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 3 * 0.05 }}
                      className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#101828] to-[#1447E6] p-4 text-white shadow ring-1 ring-inset ring-white/10 backdrop-blur-sm before:absolute before:inset-0 before:bg-[linear-gradient(130deg,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0)_60%)] before:pointer-events-none"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-2xs uppercase tracking-wide text-white/70 font-medium">
                            Localizações/Hora
                          </p>
                          <p className="text-xl sm:text-2xl font-semibold leading-tight">
                            {estatisticas.encontradosPorHora}
                          </p>
                        </div>
                        <TrendingUp className="w-8 h-8 text-white/70" />
                      </div>
                    </motion.div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white border rounded-xl p-5 sm:p-6 shadow-sm">
                      <h3 className="text-base sm:text-lg font-semibold mb-4 text-gray-900">
                        Estatísticas por Gênero
                      </h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <span className="font-medium text-gray-700">
                            Masculino
                          </span>
                          <div className="text-right">
                            <div className="text-sm text-red-600">
                              {
                                estatisticas.estatisticasPorGenero.masculino
                                  .desaparecidos
                              }{" "}
                              desaparecidos
                            </div>
                            <div className="text-sm text-green-600">
                              {
                                estatisticas.estatisticasPorGenero.masculino
                                  .encontrados
                              }{" "}
                              encontrados
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-100 rounded-lg border border-gray-300">
                          <span className="font-medium text-gray-700">
                            Feminino
                          </span>
                          <div className="text-right">
                            <div className="text-sm text-red-600">
                              {
                                estatisticas.estatisticasPorGenero.feminino
                                  .desaparecidos
                              }{" "}
                              desaparecidas
                            </div>
                            <div className="text-sm text-green-600">
                              {
                                estatisticas.estatisticasPorGenero.feminino
                                  .encontrados
                              }{" "}
                              encontrados
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border rounded-xl p-5 sm:p-6 shadow-sm">
                      <h3 className="text-base sm:text-lg font-semibold mb-4 text-gray-900">
                        Estatísticas por Faixa Etária
                      </h3>
                      <div className="space-y-3">
                        {estatisticas.estatisticasPorIdade.map(
                          (faixa, index) => (
                            <div
                              key={index}
                              className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                            >
                              <span className="font-medium text-gray-700">
                                {faixa.faixaEtaria}
                              </span>
                              <div className="text-right">
                                <div className="text-sm text-red-600">
                                  {faixa.desaparecidos} desap.
                                </div>
                                <div className="text-sm text-green-600">
                                  {faixa.encontrados} enc.
                                </div>
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    <div
                      className="bg-white border rounded-xl p-5 sm:p-6 shadow-sm xl:col-span-2 flex flex-col"
                      ref={barChartContainerRef}
                      data-export-root="true"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
                          Tendências{" "}
                          <span className="text-[10px] font-normal text-gray-500 uppercase tracking-wide">
                            {periodo}
                          </span>
                        </h3>
                        <span className="text-xs text-gray-500">
                          Atualizado {new Date().toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="h-72 -mx-2" ref={chartRef}>
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={horasSelecionadas}
                            margin={{
                              top: 10,
                              right: 10,
                              left: -20,
                              bottom: 0,
                            }}
                          >
                            <CartesianGrid
                              strokeDasharray="3 3"
                              stroke="#e5e7eb"
                            />
                            <XAxis
                              dataKey="hora"
                              tick={{ fontSize: 10 }}
                              stroke="#94a3b8"
                            />
                            <YAxis tick={{ fontSize: 10 }} stroke="#94a3b8" />
                            <RTooltip
                              content={({ active, payload, label }) => {
                                if (active && payload && payload.length) {
                                  return (
                                    <div className="rounded-md border bg-white shadow p-2 text-[11px] space-y-1">
                                      <div className="font-medium text-gray-700">
                                        {label}h
                                      </div>
                                      {payload.map((p) => (
                                        <div
                                          key={p.dataKey}
                                          className="flex items-center justify-between gap-4"
                                        >
                                          <span
                                            className={`font-medium ${p.dataKey === "desaparecimentos" ? "text-rose-600" : "text-emerald-600"}`}
                                          >
                                            {p.dataKey === "desaparecimentos"
                                              ? "Desap."
                                              : "Localiz."}
                                          </span>
                                          <span className="font-semibold tabular-nums">
                                            {p.value}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  );
                                }
                                return null;
                              }}
                            />
                            <Legend
                              wrapperStyle={{ fontSize: 11 }}
                              content={() => {
                                const dados = estatisticas.estatisticasPorIdade;
                                const ordenados = [...dados].sort(
                                  (a, b) => b.desaparecidos - a.desaparecidos,
                                );
                                const maior = ordenados[0];
                                return (
                                  <div className="mt-4 flex flex-wrap gap-3 justify-center text-[11px]">
                                    {ordenados.map((f, i) => {
                                      const cor =
                                        i === 0
                                          ? "#1447E6"
                                          : [
                                              "#111827",
                                              "#1f2937",
                                              "#374151",
                                              "#4b5563",
                                              "#6b7280",
                                              "#9ca3af",
                                            ][i - 1] || "#9ca3af";
                                      const total = dados.reduce(
                                        (acc, x) => acc + x.desaparecidos,
                                        0,
                                      );
                                      const pct = (
                                        (f.desaparecidos / total) *
                                        100
                                      ).toFixed(1);
                                      return (
                                        <div
                                          key={f.faixaEtaria}
                                          className="flex items-center gap-1"
                                        >
                                          <span
                                            className="inline-block w-3 h-3 rounded-sm"
                                            style={{ background: cor }}
                                          />
                                          <span className="text-gray-600 font-medium">
                                            {f.faixaEtaria}
                                          </span>
                                          <span className="text-gray-400">
                                            {pct}%
                                          </span>
                                          {i === 0 && (
                                            <span className="ml-1 text-[10px] text-indigo-600 font-semibold tracking-tight">
                                              MAIOR
                                            </span>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                );
                              }}
                            />

                            <Bar
                              dataKey="desaparecimentos"
                              name="Desap."
                              fill="rgba(244,63,94,0.55)"
                              radius={[4, 4, 0, 0]}
                            />
                            <Bar
                              dataKey="localizacoes"
                              name="Localiz."
                              fill="rgba(16,24,40,0.75)"
                              radius={[4, 4, 0, 0]}
                            />
                            <Customized
                              component={
                                <MovingAverageLine data={movingAverage} />
                              }
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>

                      <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                        {(() => {
                          const ultimas = horasSelecionadas;
                          const totalDesap = ultimas.reduce(
                            (acc, h) => acc + h.desaparecimentos,
                            0,
                          );
                          const totalLoc = ultimas.reduce(
                            (acc, h) => acc + h.localizacoes,
                            0,
                          );
                          const picoDesap = Math.max(
                            ...ultimas.map((h) => h.desaparecimentos),
                          );
                          const picoLoc = Math.max(
                            ...ultimas.map((h) => h.localizacoes),
                          );
                          const mediaDesap = (
                            totalDesap / ultimas.length
                          ).toFixed(1);
                          const mediaLoc = (totalLoc / ultimas.length).toFixed(
                            1,
                          );
                          const cards = [
                            {
                              label: "Total Desap.",
                              value: totalDesap,
                              color: "text-rose-600",
                              subtle: "bg-rose-50",
                            },
                            {
                              label: "Total Localiz.",
                              value: totalLoc,
                              color: "text-emerald-600",
                              subtle: "bg-emerald-50",
                            },
                            {
                              label: "Média/h Desap.",
                              value: mediaDesap,
                              color: "text-rose-600",
                              subtle: "bg-rose-50",
                            },
                            {
                              label: "Média/h Localiz.",
                              value: mediaLoc,
                              color: "text-emerald-600",
                              subtle: "bg-emerald-50",
                            },
                            {
                              label: "Pico Desap.",
                              value: picoDesap,
                              color: "text-rose-600",
                              subtle: "bg-rose-50",
                            },
                            {
                              label: "Pico Localiz.",
                              value: picoLoc,
                              color: "text-emerald-600",
                              subtle: "bg-emerald-50",
                            },
                          ];

                          return cards.map((c) => (
                            <div
                              key={c.label}
                              className={`rounded-lg border border-gray-200 ${c.subtle} px-3 py-2 flex flex-col shadow-sm hover:shadow-md transition-shadow`}
                            >
                              <span className="text-[11px] font-medium text-gray-600">
                                {c.label}
                              </span>
                              <span
                                className={`text-sm font-semibold tabular-nums ${c.color}`}
                              >
                                {c.value}
                              </span>
                            </div>
                          ));
                        })()}
                      </div>
                    </div>

                    <div className="bg-white border rounded-xl p-5 sm:p-6 shadow-sm flex flex-col">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                          Distribuição por Idade
                        </h3>
                        <span className="text-[10px] text-gray-500 uppercase tracking-wide">
                          % casos
                        </span>
                      </div>
                      <div className="flex-1">
                        <ResponsiveContainer width="100%" height={260}>
                          <PieChart>
                            <Pie
                              data={estatisticas.estatisticasPorIdade}
                              dataKey="desaparecidos"
                              nameKey="faixaEtaria"
                              cx="50%"
                              cy="50%"
                              innerRadius={55}
                              outerRadius={100}
                              paddingAngle={3}
                              stroke="#fff"
                              startAngle={90}
                              endAngle={-270}
                            >
                              {(() => {
                                const dados = estatisticas.estatisticasPorIdade;

                                const ordenados = [...dados.keys()].sort(
                                  (a, b) =>
                                    dados[b].desaparecidos -
                                    dados[a].desaparecidos,
                                );

                                const neutros = [
                                  "#111827",
                                  "#1f2937",
                                  "#374151",
                                  "#4b5563",
                                  "#6b7280",
                                  "#9ca3af",
                                ];
                                const colorMap: Record<number, string> = {};
                                if (ordenados.length) {
                                  colorMap[ordenados[0]] = "#1447E6";
                                  ordenados.slice(1).forEach((idx, i) => {
                                    colorMap[idx] = neutros[i % neutros.length];
                                  });
                                }
                                return dados.map((_, index) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={colorMap[index] || "#ccc"}
                                    className="transition-all duration-300 hover:opacity-80"
                                  />
                                ));
                              })()}
                            </Pie>
                            <RTooltip
                              formatter={(
                                value: number,
                                name: string,
                                props: any,
                              ) => [value, "Desap."]}
                              contentStyle={{
                                fontSize: "11px",
                                borderRadius: "8px",
                              }}
                            />
                            <Legend wrapperStyle={{ fontSize: 11 }} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="mt-4 grid grid-cols-2 gap-2 text-[11px]">
                        {(() => {
                          const dados = estatisticas.estatisticasPorIdade;
                          const total = dados.reduce(
                            (acc, f) => acc + f.desaparecidos,
                            0,
                          );
                          const ordenados = [...dados].sort(
                            (a, b) => b.desaparecidos - a.desaparecidos,
                          );
                          const cores = [
                            "#1447E6",
                            "#111827",
                            "#1f2937",
                            "#374151",
                            "#4b5563",
                            "#6b7280",
                          ];
                          return ordenados.map((faixa, i) => {
                            const pct = (
                              (faixa.desaparecidos / total) *
                              100
                            ).toFixed(1);
                            return (
                              <div
                                key={faixa.faixaEtaria}
                                className="flex items-center justify-between rounded-md border px-2 py-1"
                                style={{
                                  background: i === 0 ? "#eff6ff" : "#f8fafc",
                                  borderColor: "#e2e8f0",
                                }}
                              >
                                <span className="flex items-center gap-1 font-medium text-gray-700">
                                  <span
                                    className="inline-block w-2.5 h-2.5 rounded-sm"
                                    style={{ background: cores[i] }}
                                  />{" "}
                                  {faixa.faixaEtaria}
                                </span>
                                <span className="text-gray-900 font-semibold tabular-nums">
                                  {pct}%
                                </span>
                              </div>
                            );
                          });
                        })()}
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-slate-50 to-white border rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3 text-xs text-gray-600">
                      <ArrowUpRight className="w-4 h-4 text-indigo-500" />
                      <span>Dados auto-atualizados a cada 5 min.</span>
                    </div>
                    <span className="text-xs text-gray-500">
                      Última atualização: {new Date().toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ) : null}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface HoraRegistro {
  hora: string;
  desaparecimentos: number;
  localizacoes: number;
}

interface EnhancedTrendChartProps {
  horas: HoraRegistro[];
}

const EnhancedTrendChart: React.FC<EnhancedTrendChartProps> = ({ horas }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const { globalMax, marks } = useMemo(() => {
    const valores = horas.flatMap((h) => [h.desaparecimentos, h.localizacoes]);
    const gm = Math.max(1, ...valores);

    const step = Math.ceil(gm / 4);
    const arr = Array.from({ length: 5 }, (_, i) => i * step).filter(
      (v) => v <= gm,
    );
    if (arr[arr.length - 1] !== gm) arr[arr.length - 1] = gm;
    return { globalMax: gm, marks: arr };
  }, [horas]);

  return (
    <div className="relative">
      <div
        className="overflow-x-auto pb-3"
        role="group"
        aria-label="Gráfico de tendências das últimas 24 horas"
      >
        <div className="relative flex items-end h-48 min-w-[720px] gap-3 px-2 select-none">
          <div className="pointer-events-none absolute inset-0">
            <div className="flex flex-col h-full">
              {marks.map((m, idx) => (
                <div key={m} className="relative flex-1">
                  {idx > 0 && (
                    <div className="absolute top-0 left-0 right-0 border-t border-dashed border-gray-200" />
                  )}
                  {idx === marks.length - 1 && (
                    <div className="absolute -top-2 left-0 text-[10px] text-gray-400">
                      {m}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          {horas.map((hora, i) => {
            const desaparecimentosPct =
              (hora.desaparecimentos / globalMax) * 100;
            const localizacoesPct = (hora.localizacoes / globalMax) * 100;
            const isActive = activeIndex === i;
            return (
              <button
                key={i}
                type="button"
                onMouseEnter={() => setActiveIndex(i)}
                onMouseLeave={() =>
                  setActiveIndex((prev) => (prev === i ? null : prev))
                }
                onFocus={() => setActiveIndex(i)}
                onBlur={() =>
                  setActiveIndex((prev) => (prev === i ? null : prev))
                }
                className={`relative flex flex-col items-center w-6 focus:outline-none group ${isActive ? "" : ""}`}
                aria-label={`Hora ${hora.hora}. Desaparecimentos: ${hora.desaparecimentos}. Localizações: ${hora.localizacoes}.`}
              >
                <div className="relative flex-1 w-full flex flex-col justify-end gap-1">
                  <div className="relative h-32 flex flex-col-reverse gap-1">
                    <div
                      className="w-full rounded-sm bg-emerald-500/25 border border-emerald-400/40 backdrop-blur-sm transition-[height] duration-500 ease-out"
                      style={{ height: `${Math.max(localizacoesPct, 3)}%` }}
                    >
                      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-medium text-emerald-600 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity">
                        {hora.localizacoes}
                      </span>
                    </div>
                    <div
                      className="w-full rounded-sm bg-rose-500/30 border border-rose-400/50 backdrop-blur-sm transition-[height] duration-500 ease-out"
                      style={{ height: `${Math.max(desaparecimentosPct, 3)}%` }}
                    >
                      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-medium text-rose-600 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity">
                        {hora.desaparecimentos}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-1 text-[10px] text-gray-500 tabular-nums tracking-tight rotate-[-35deg] origin-top-left">
                  {hora.hora}
                </div>

                {isActive && (
                  <div className="pointer-events-none absolute -top-24 z-10 w-40 -translate-x-1/2 left-1/2">
                    <div className="rounded-lg border bg-white shadow-lg p-2 text-[11px] text-left space-y-1">
                      <div className="font-medium text-gray-700 flex items-center gap-1">
                        {hora.hora}
                        <span className="text-[9px] text-gray-400">h</span>
                      </div>
                      <div className="flex items-center justify-between text-rose-600">
                        <span>Desap.</span>
                        <span className="font-semibold">
                          {hora.desaparecimentos}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-emerald-600">
                        <span>Localiz.</span>
                        <span className="font-semibold">
                          {hora.localizacoes}
                        </span>
                      </div>
                      <div className="h-px bg-gray-100" />
                      <div className="flex items-center justify-between text-gray-500">
                        <span>Partic. máx</span>
                        <span className="font-medium">{globalMax}</span>
                      </div>
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-6 text-xs">
        <div className="flex items-center gap-2 text-rose-600">
          <span className="inline-block w-3 h-3 rounded-sm bg-rose-500/70 border border-rose-400/60" />{" "}
          Desaparecimentos
        </div>
        <div className="flex items-center gap-2 text-emerald-600">
          <span className="inline-block w-3 h-3 rounded-sm bg-emerald-500/70 border border-emerald-400/60" />{" "}
          Localizações
        </div>
        <div className="text-gray-400 text-[10px]">
          Altura proporcional ao valor máximo (escala global)
        </div>
      </div>
    </div>
  );
};

interface MALineProps {
  data?: { hora: string; media: number }[];

  xAxisMap?: any;
  yAxisMap?: any;
  offset?: any;
  width?: number;
  height?: number;
  barCategoryGap?: any;
  barGap?: any;
  dataStartIndex?: number;
  dataEndIndex?: number;
  syncMethod?: any;
  stackGroups?: any;
  graphicalItems?: any[];
}

const MovingAverageLine: React.FC<MALineProps> = (props) => {
  const { data = [], xAxisMap, yAxisMap, offset, graphicalItems } = props;
  if (
    !data.length ||
    !xAxisMap ||
    !yAxisMap ||
    !graphicalItems ||
    !graphicalItems.length
  )
    return null;

  const xKey = Object.keys(xAxisMap)[0];
  const yKey = Object.keys(yAxisMap)[0];
  const xAxis = xAxisMap[xKey];
  const yAxis = yAxisMap[yKey];
  if (!xAxis || !yAxis) return null;

  const barItem = graphicalItems[0];
  const sourceData = barItem?.props?.data || [];
  if (!sourceData.length) return null;

  const points: { x: number; y: number }[] = [];
  data.forEach((m) => {
    const idx = sourceData.findIndex((d: any) => d.hora === m.hora);
    if (idx >= 0) {
      const range = xAxis.scale?.range?.() || [0, 0];
      const domain = xAxis.scale?.domain?.() || [];
      const step = (range[1] - range[0]) / Math.max(1, domain.length);
      const x = offset.left + range[0] + idx * step + step / 2;
      const y = offset.top + (yAxis.scale ? yAxis.scale(m.media) : 0);
      if (!isNaN(x) && !isNaN(y)) points.push({ x, y });
    }
  });

  if (points.length < 2) return null;
  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`)
    .join(" ");

  return (
    <g className="moving-average-line pointer-events-none">
      <path
        d={pathD}
        fill="none"
        stroke="#1447E6"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={2.5} fill="#1447E6" />
      ))}
    </g>
  );
};
