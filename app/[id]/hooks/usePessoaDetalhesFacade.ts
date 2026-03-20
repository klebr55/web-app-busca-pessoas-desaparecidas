import { useCallback, useMemo, useEffect } from "react";
import { useParams } from "next/navigation";
import { usePessoaDetalhe, useInformacoesOcorrencia } from "@/api/hooks";
import { calcularIdadeAtual, getStatusText } from "@/lib/domain/pessoaUtils";

export function usePessoaDetalhesFacade() {
  const params = useParams();
  const id = params?.id ? parseInt(params.id as string) : null;

  const { pessoa, loading, error, carregarPessoa } = usePessoaDetalhe();
  const { informacoes: informacoesOcorrencia, loading: loadingInformacoes } =
    useInformacoesOcorrencia(pessoa?.ultimaOcorrencia?.ocoId || null);

  useEffect(() => {
    if (id) {
      carregarPessoa(id);
    }
  }, [id, carregarPessoa]);

  const anexosFotos = useMemo(() => {
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

  const getCartazInfo = useCallback(() => {
    if (!pessoa)
      return {
        hasCartazOficial: false,
        statusColor: "",
        statusText: "",
        idadeAtual: 0,
      };

    const statusColor =
      pessoa.status === "DESAPARECIDO" ? "bg-red-600" : "bg-green-600";
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

    return { hasCartazOficial, statusColor, statusText, idadeAtual };
  }, [pessoa]);

  return {
    id,
    pessoa,
    loading,
    error,
    carregarPessoa,
    informacoesOcorrencia,
    loadingInformacoes,
    anexosFotos,
    getCartazInfo,
  };
}
