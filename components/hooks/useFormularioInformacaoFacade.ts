import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PessoaDesaparecida, InformacaoAdicional } from "@/api/api";
import { useEnviarInformacao } from "@/api/hooks";

const esquemaFormulario = z.object({
  observacao: z
    .string()
    .min(10, "A observação deve ter pelo menos 10 caracteres"),
  localizacao: z.string().optional(),
  nomeInformante: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  telefoneInformante: z
    .string()
    .min(10, "Telefone deve ter pelo menos 10 dígitos"),
  dataAvistamento: z.string().optional(),
});

type DadosFormulario = z.infer<typeof esquemaFormulario>;

interface UseFormularioInformacaoFacadeProps {
  pessoa: PessoaDesaparecida;
  onFechar: () => void;
}

export function useFormularioInformacaoFacade({
  pessoa,
  onFechar,
}: UseFormularioInformacaoFacadeProps) {
  const [fotos, setFotos] = useState<File[]>([]);
  const { enviar, loading, error, sucesso, resetar } = useEnviarInformacao();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<DadosFormulario>({
    resolver: zodResolver(esquemaFormulario),
  });

  const handleArquivos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const arquivos = Array.from(e.target.files || []);
    const arquivosImagem = arquivos.filter(
      (arquivo) =>
        arquivo.type.startsWith("image/") && arquivo.size <= 5 * 1024 * 1024,
    );
    setFotos((prev) => [...prev, ...arquivosImagem].slice(0, 3));
  };

  const removerFoto = (index: number) => {
    setFotos((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (dados: DadosFormulario) => {
    const informacao: InformacaoAdicional = {
      pessoaId: pessoa.id,
      observacao: dados.observacao,
      localizacao: dados.localizacao || undefined,
      nomeInformante: dados.nomeInformante,
      telefoneInformante: dados.telefoneInformante,
      dataAvistamento: dados.dataAvistamento || undefined,
      fotos: fotos.length > 0 ? fotos : undefined,
      ocoId: pessoa.ultimaOcorrencia?.ocoId,
    };

    await enviar(informacao);
  };

  const handleFechar = () => {
    reset();
    resetar();
    setFotos([]);
    onFechar();
  };

  const aplicarMascaraTelefone = (valor: string) => {
    const numeros = valor.replace(/\D/g, "");
    if (numeros.length <= 11) {
      return numeros.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    }
    return valor;
  };

  return {
    fotos,
    loading,
    error,
    sucesso,
    register,
    handleSubmit,
    errors,
    handleArquivos,
    removerFoto,
    onSubmit,
    handleFechar,
    aplicarMascaraTelefone,
  };
}
