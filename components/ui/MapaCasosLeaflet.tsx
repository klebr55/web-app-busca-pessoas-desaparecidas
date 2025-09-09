"use client";

import React, { useMemo, useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Tooltip,
  ZoomControl,
  useMap,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { EstatisticasCidade } from "@/api/api";
import { cidadeLatLon } from "@/lib/cidades";

const CENTER: [number, number] = [-12.9, -55.9];

interface MapaCasosLeafletProps {
  onSelectCidade?: (cidade: string) => void;
  filtroStatus: "TODOS" | "DESAPARECIDO" | "LOCALIZADO";
  dadosFiltrados: EstatisticasCidade[];
  loading?: boolean;
  error?: string | null;
  onRefetch?: () => void;
}

const corPorIntensidade = (
  intensidade: number,
  tipo: "TOTAL" | "DESAPARECIDO" | "LOCALIZADO",
) => {
  const t = Math.max(0, Math.min(1, intensidade));

  const paletas: Record<string, [string, string, string]> = {
    TOTAL: ["#facc15", "#f97316", "#dc2626"],
    DESAPARECIDO: ["#fee2e2", "#f87171", "#b91c1c"],
    LOCALIZADO: ["#dcfce7", "#4ade80", "#15803d"],
  };
  const [c0, c1, c2] = paletas[tipo];

  const hexToRgb = (h: string) => {
    const m = h.replace("#", "");
    return [
      parseInt(m.substring(0, 2), 16),
      parseInt(m.substring(2, 4), 16),
      parseInt(m.substring(4, 6), 16),
    ] as [number, number, number];
  };
  const rgbToHex = (r: number, g: number, b: number) =>
    "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
  const mix = (a: string, b: string, tt: number) => {
    const ra = hexToRgb(a);
    const rb = hexToRgb(b);
    return rgbToHex(
      Math.round(ra[0] + (rb[0] - ra[0]) * tt),
      Math.round(ra[1] + (rb[1] - ra[1]) * tt),
      Math.round(ra[2] + (rb[2] - ra[2]) * tt),
    );
  };
  if (t < 0.5) {
    return mix(c0, c1, t / 0.5);
  }
  return mix(c1, c2, (t - 0.5) / 0.5);
};

export function MapaCasosLeaflet({
  onSelectCidade,
  filtroStatus,
  dadosFiltrados,
  loading = false,
  error = null,
  onRefetch,
}: MapaCasosLeafletProps) {
  const [hoverCidade, setHoverCidade] = useState<string | null>(null);

  const AnyMap: any = MapContainer;
  const AnyTile: any = TileLayer;
  const AnyTooltip: any = Tooltip;

  const AutoResize: React.FC = () => {
    const map = useMap();
    useEffect(() => {
      const attempts = [50, 180, 400, 800];
      const timers: number[] = [];
      attempts.forEach((ms) => {
        const id = window.setTimeout(() => {
          try {
            map.invalidateSize?.();
          } catch {}
        }, ms);
        timers.push(id);
      });

      const container = map.getContainer();
      let lastWidth = container.clientWidth;
      let lastHeight = container.clientHeight;
      let ro: ResizeObserver | null = null;
      try {
        const RObs = (window as any).ResizeObserver;
        if (typeof RObs === "function") {
          ro = new RObs((entries: any[]) => {
            const w = container.clientWidth;
            const h = container.clientHeight;
            if (w !== lastWidth || h !== lastHeight) {
              lastWidth = w;
              lastHeight = h;
              try {
                map.invalidateSize?.();
              } catch {}
            }
          });
          if (ro) ro.observe(container);
        }
      } catch {}

      const onResize = () => {
        try {
          map.invalidateSize?.();
        } catch {}
      };
      window.addEventListener("orientationchange", onResize);
      window.addEventListener("resize", onResize);
      return () => {
        timers.forEach((t) => clearTimeout(t));
        window.removeEventListener("orientationchange", onResize);
        window.removeEventListener("resize", onResize);
        try {
          ro?.disconnect();
        } catch {}
      };
    }, [map]);
    return null;
  };

  const markers = useMemo(() => {
    const cidadesConsideradas = dadosFiltrados
      .map((c) => {
        const g = cidadeLatLon[c.cidade];
        if (!g) return null;

        const valorBase =
          filtroStatus === "DESAPARECIDO"
            ? c.totalDesaparecidos
            : filtroStatus === "LOCALIZADO"
              ? c.totalEncontrados
              : c.totalDesaparecidos + c.totalEncontrados;

        if (
          (filtroStatus === "DESAPARECIDO" || filtroStatus === "LOCALIZADO") &&
          valorBase === 0
        ) {
          return null;
        }

        return {
          cidade: c.cidade,
          lat: g.lat,
          lon: g.lon,
          totalDesaparecidos: c.totalDesaparecidos,
          totalEncontrados: c.totalEncontrados,
          valorBase,
        };
      })
      .filter(Boolean) as Array<{
      cidade: string;
      lat: number;
      lon: number;
      totalDesaparecidos: number;
      totalEncontrados: number;
      valorBase: number;
    }>;

    if (!cidadesConsideradas.length) return [] as any[];

    const maxValor = Math.max(
      1,
      ...cidadesConsideradas.map((c) => c.valorBase),
    );
    const result = cidadesConsideradas.map((c) => ({
      ...c,
      intensidade: c.valorBase / maxValor,
      total: c.totalDesaparecidos + c.totalEncontrados,
    }));

    return result;
  }, [dadosFiltrados, filtroStatus]);

  const CLUSTER_THRESHOLD = 40;
  const clusterData = useMemo(() => {
    if (markers.length <= CLUSTER_THRESHOLD)
      return { isCluster: false, clusters: [] as any[] };
    const precision = 0.9;
    const mapAgg = new Map<
      string,
      {
        latSum: number;
        lonSum: number;
        count: number;
        valorSum: number;
        cidades: string[];
        desaparecidos: number;
        encontrados: number;
      }
    >();
    markers.forEach((m) => {
      const key = `${Math.round(m.lat / precision)}:${Math.round(m.lon / precision)}`;
      const ref = mapAgg.get(key) || {
        latSum: 0,
        lonSum: 0,
        count: 0,
        valorSum: 0,
        cidades: [],
        desaparecidos: 0,
        encontrados: 0,
      };
      ref.latSum += m.lat;
      ref.lonSum += m.lon;
      ref.count += 1;
      ref.valorSum += (m as any).valorBase;
      ref.cidades.push(m.cidade);
      ref.desaparecidos += m.totalDesaparecidos;
      ref.encontrados += m.totalEncontrados;
      mapAgg.set(key, ref);
    });
    const clusters = Array.from(mapAgg.values()).map((v) => ({
      lat: v.latSum / v.count,
      lon: v.lonSum / v.count,
      count: v.count,
      valorSum: v.valorSum,
      cidades: v.cidades,
      desaparecidos: v.desaparecidos,
      encontrados: v.encontrados,
    }));
    if (!clusters.length) return { isCluster: false, clusters: [] as any[] };
    const maxValor = Math.max(1, ...clusters.map((c) => c.valorSum));
    return {
      isCluster: true,
      clusters: clusters.map((c) => ({
        ...c,
        intensidade: c.valorSum / maxValor,
      })),
    };
  }, [markers]);

  const ClusterMarkers: React.FC = () => {
    const map = useMap();
    return (
      <>
        {clusterData.clusters.map((c) => {
          const intensidade = c.intensidade;
          const baseColor = corPorIntensidade(
            intensidade,
            filtroStatus === "TODOS" ? "TOTAL" : filtroStatus,
          );
          const size = 30 + intensidade * 26;
          return (
            <CircleMarker
              key={`cluster-${c.lat}-${c.lon}-${c.count}`}
              center={[c.lat, c.lon] as any}
              radius={(size / 2) as any}
              pathOptions={
                {
                  color: "#ffffff",
                  weight: 2,
                  fillColor: baseColor,
                  fillOpacity: 0.9,
                } as any
              }
              eventHandlers={{
                click: () => {
                  try {
                    map.setView(
                      [c.lat, c.lon] as any,
                      Math.min((map.getZoom?.() || 5) + 2, 9),
                    );
                  } catch {}
                },
              }}
            >
              <Tooltip
                direction="top"
                offset={[0, -4] as any}
                opacity={1 as any}
                permanent={false as any}
                className="!bg-white !text-gray-800 !rounded-lg !px-3 !py-2 shadow-lg"
              >
                <div className="text-xs font-semibold mb-1 text-center">
                  {c.count} cidades agrupadas
                </div>
                <div className="text-[11px] text-gray-600 text-center">
                  Zoom para detalhar
                </div>
                {filtroStatus !== "LOCALIZADO" && (
                  <div className="text-[11px] text-red-500 font-medium">
                    🔴 Desap: {c.desaparecidos}
                  </div>
                )}
                {filtroStatus !== "DESAPARECIDO" && (
                  <div className="text-[11px] text-green-600 font-medium">
                    🟢 Loc: {c.encontrados}
                  </div>
                )}
              </Tooltip>
            </CircleMarker>
          );
        })}
      </>
    );
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-full text-sm text-gray-600">
        Carregando mapa...
      </div>
    );
  if (error)
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 text-sm text-red-600">
        Erro ao carregar dados
        <button
          onClick={onRefetch}
          className="px-3 py-1 rounded bg-red-600 text-white text-xs"
        >
          Tentar novamente
        </button>
      </div>
    );

  return (
    <div className="w-full h-full relative rounded-xl overflow-hidden [&_.leaflet-container]:!w-full [&_.leaflet-container]:!h-full [&_.leaflet-container]:block">
      <AnyMap
        center={CENTER}
        zoom={5.3}
        minZoom={4}
        maxZoom={10}
        zoomControl={false}
        style={{ width: "100%", height: "100%", display: "block" }}
        attributionControl={false}
      >
        <AutoResize />
        <ZoomControl position="bottomright" />
        <AnyTile
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
        />
        {markers.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-white/90 backdrop-blur px-4 py-3 rounded-lg shadow text-xs text-gray-600 border border-gray-200">
              Nenhuma cidade com casos{" "}
              {filtroStatus === "DESAPARECIDO"
                ? "de desaparecidos"
                : filtroStatus === "LOCALIZADO"
                  ? "de localizados"
                  : ""}
              .
            </div>
          </div>
        )}
        {!clusterData.isCluster &&
          markers.map((m, idx) => {
            const color = corPorIntensidade(
              m.intensidade,
              filtroStatus === "TODOS" ? "TOTAL" : filtroStatus,
            );
            const radius = 8 + m.intensidade * 18;
            return (
              <CircleMarker
                key={m.cidade}
                center={[m.lat, m.lon] as any}
                radius={radius as any}
                pathOptions={
                  {
                    color: "#ffffff",
                    weight: 2,
                    fillColor: color,
                    fillOpacity: 0.9,
                  } as any
                }
                eventHandlers={{
                  click: () => onSelectCidade?.(m.cidade),
                  mouseover: () => setHoverCidade(m.cidade),
                  mouseout: () =>
                    setHoverCidade((h) => (h === m.cidade ? null : h)),
                }}
              >
                <AnyTooltip
                  direction="top"
                  offset={[0, -4] as any}
                  opacity={1 as any}
                  permanent={false as any}
                  className="!bg-white !text-gray-800 !rounded-lg !px-3 !py-2 shadow-lg"
                >
                  <div className="text-xs font-semibold mb-1 text-center">
                    {m.cidade}
                  </div>
                  <div className="text-[11px] flex flex-col items-center gap-1">
                    {filtroStatus !== "LOCALIZADO" && (
                      <span className="text-red-500 font-medium">
                        🔴 Desaparecidos: {m.totalDesaparecidos}
                      </span>
                    )}
                    {filtroStatus !== "DESAPARECIDO" && (
                      <span className="text-green-600 font-medium">
                        🟢 Localizados: {m.totalEncontrados}
                      </span>
                    )}
                  </div>
                  {filtroStatus === "TODOS" && (
                    <div className="text-[10px] mt-1 text-gray-500 text-center">
                      Total: {m.total}
                    </div>
                  )}
                </AnyTooltip>
              </CircleMarker>
            );
          })}
        {clusterData.isCluster && <ClusterMarkers />}
      </AnyMap>
      {hoverCidade && (
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-4 py-2 rounded-lg shadow text-xs text-gray-700">
          {hoverCidade}
        </div>
      )}
    </div>
  );
}
