import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEnviarInformacao } from "@/api/hooks";
import { buscarPessoasComFiltro } from "@/api/api";
import type { PessoaDesaparecida } from "@/api/api";

const informacaoSchema = z.object({
  pessoaId: z.number().min(1, "Selecione uma pessoa"),
  nomePessoa: z.string().min(2, "Digite o nome da pessoa desaparecida"),
  nomeInformante: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  telefoneInformante: z
    .string()
    .min(10, "Telefone deve ter pelo menos 10 dígitos"),
  observacao: z
    .string()
    .min(10, "Observação deve ter pelo menos 10 caracteres"),
  localizacao: z
    .string()
    .min(3, "Localização deve ter pelo menos 3 caracteres"),
  dataAvistamento: z.string().optional(),
  fotos: z.any().optional(),
});

type InformacaoFormData = z.infer<typeof informacaoSchema>;

interface UseModalAdicionarInformacaoFacadeProps {
  onClose: () => void;
  isOpen?: boolean;
}

export function useModalAdicionarInformacaoFacade({
  onClose,
  isOpen,
}: UseModalAdicionarInformacaoFacadeProps) {
  const [uploading, setUploading] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [pessoasSugeridas, setPessoasSugeridas] = useState<
    PessoaDesaparecida[]
  >([]);
  const [buscandoPessoas, setBuscandoPessoas] = useState(false);
  const [mostrarSugestoes, setMostrarSugestoes] = useState(false);
  const [pessoaSelecionada, setPessoaSelecionada] =
    useState<PessoaDesaparecida | null>(null);

  const { enviar, loading, sucesso, error } = useEnviarInformacao();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<InformacaoFormData>({
    resolver: zodResolver(informacaoSchema),
    defaultValues: {
      pessoaId: 0,
      nomePessoa: "",
      nomeInformante: "",
      telefoneInformante: "",
      observacao: "",
      localizacao: "",
      dataAvistamento: "",
    },
  });

  const buscarPessoas = useCallback(async (nome: string) => {
    if (nome.length < 2) {
      setPessoasSugeridas([]);
      setMostrarSugestoes(false);
      return;
    }

    setBuscandoPessoas(true);
    try {
      const resultado = await buscarPessoasComFiltro({
        nome: nome,
        porPagina: 10,
      });

      setPessoasSugeridas(resultado.data);
      setMostrarSugestoes(true);
    } catch (error) {
      setPessoasSugeridas([]);
    } finally {
      setBuscandoPessoas(false);
    }
  }, []);

  const handleNomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nome = e.target.value;
    setValue("nomePessoa", nome);

    if (nome.length === 0) {
      setPessoaSelecionada(null);
      setValue("pessoaId", 0);
      setPessoasSugeridas([]);
      setMostrarSugestoes(false);
      return;
    }

    if (nome.length >= 2) {
      const timeoutId = setTimeout(() => {
        buscarPessoas(nome);
      }, 300);

      return () => clearTimeout(timeoutId);
    }
  };

  const selecionarPessoa = (pessoa: PessoaDesaparecida) => {
    setPessoaSelecionada(pessoa);
    setValue("pessoaId", pessoa.id);
    setValue("nomePessoa", pessoa.nome);
    setMostrarSugestoes(false);
  };

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const onSubmit = async (data: InformacaoFormData) => {
    try {
      setUploading(true);

      const pessoaCompleta =
        pessoasSugeridas.find((p) => p.id === data.pessoaId) ||
        pessoaSelecionada;

      const informacao = {
        pessoaId: data.pessoaId,
        nomeInformante: data.nomeInformante,
        telefoneInformante: data.telefoneInformante,
        observacao: data.observacao,
        localizacao: data.localizacao,
        dataAvistamento: data.dataAvistamento,
        fotos: data.fotos?.[0] ? [data.fotos[0]] : undefined,
        ocoId: pessoaCompleta?.ultimaOcorrencia?.ocoId,
      };

      await enviar(informacao);

      if (sucesso) {
        reset();
        onClose();
      }
    } catch (error) {
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    reset();
    setPessoaSelecionada(null);
    setPessoasSugeridas([]);
    setMostrarSugestoes(false);
    onClose();
  };

  const limparPessoaSelecionada = () => {
    setPessoaSelecionada(null);
    setValue("pessoaId", 0);
    setValue("nomePessoa", "");
  };

  return {
    uploading,
    mounted,
    pessoasSugeridas,
    buscandoPessoas,
    mostrarSugestoes,
    pessoaSelecionada,
    loading,
    sucesso,
    error,
    register,
    handleSubmit,
    errors,
    handleNomeChange,
    selecionarPessoa,
    onSubmit,
    handleClose,
    setMostrarSugestoes,
    limparPessoaSelecionada,
  };
}
