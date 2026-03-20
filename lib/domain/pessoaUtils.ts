import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export function formatarData(dataIso?: string | null): string {
  if (!dataIso) return "-";
  try {
    return format(new Date(dataIso), "dd/MM/yyyy", { locale: ptBR });
  } catch {
    return "-";
  }
}

export function calcularIdadeAtual(
  idadeNaEpoca?: number,
  dataDesap?: string | null,
): number {
  if (!idadeNaEpoca || !dataDesap) return idadeNaEpoca || 0;
  try {
    const d = new Date(dataDesap);
    const hoje = new Date();
    let anosPassados = hoje.getFullYear() - d.getFullYear();
    const mDiff = hoje.getMonth() - d.getMonth();
    if (mDiff < 0 || (mDiff === 0 && hoje.getDate() < d.getDate())) {
      anosPassados--;
    }
    return idadeNaEpoca + (anosPassados > 0 ? anosPassados : 0);
  } catch {
    return idadeNaEpoca;
  }
}

export function getStatusText(status: string, sexo: string): string {
  if (status === "DESAPARECIDO") {
    return sexo === "MASCULINO" ? "DESAPARECIDO" : "DESAPARECIDA";
  } else {
    return sexo === "MASCULINO" ? "LOCALIZADO" : "LOCALIZADA";
  }
}
