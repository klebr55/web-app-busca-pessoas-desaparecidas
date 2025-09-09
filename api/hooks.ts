"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import * as React from "react";
import {
  PessoaDesaparecida,
  FiltrosPessoas,
  buscarPessoasDesaparecidas,
  enviarInformacaoAdicional,
  InformacaoAdicional,
  EstatisticasPessoas,
  buscarEstatisticasPessoas,
  buscarPessoasDinamico,
  InformacaoOcorrencia,
  buscarInformacoesOcorrencia,
  MotivoOcorrencia,
  buscarMotivosOcorrencia,
  NovaInformacaoOcorrencia,
  adicionarInformacaoOcorrencia,
  NovaOcorrenciaDelegaciaDigital,
  RespostaCriacaoOcorrencia,
  criarOcorrenciaDelegaciaDigital,
  testarConectividadeAPI,
  DadosVerificacaoDuplicidade,
  RespostaVerificacaoDuplicidade,
  verificarDuplicidadeDelegaciaDigital,
  TokensAutenticacao,
  atualizarToken,
  CredenciaisLogin,
  realizarLogin,
  buscarPessoaPorIdEspecifico,
  buscarPessoasComFiltro,
  buscarPessoasAberto,
  EstatisticasAvancadas,
  buscarEstatisticasAvancadas,
  EstatisticasCidade,
  buscarDadosMapa,
} from "./api";

interface UsePessoasState {
  data: PessoaDesaparecida[];
  loading: boolean;
  error: string | null;
  total: number;
  pagina: number;
  porPagina: number;
  totalPaginas: number;
}

interface UsePessoasActions {
  buscar: (filtros?: FiltrosPessoas) => Promise<void>;
  limparErro: () => void;
  proximaPagina: () => Promise<void>;
  paginaAnterior: () => Promise<void>;
  irParaPagina: (pagina: number) => Promise<void>;
}

export function usePessoas(
  filtrosIniciais: FiltrosPessoas = {},
): UsePessoasState & UsePessoasActions {
  const [state, setState] = useState<UsePessoasState>({
    data: [],
    loading: false,
    error: null,
    total: 0,
    pagina: filtrosIniciais.pagina ?? 0,
    porPagina: filtrosIniciais.porPagina ?? 10,
    totalPaginas: 0,
  });

  const filtrosRef = useRef<FiltrosPessoas>(filtrosIniciais);

  const buscar = useCallback(async (novosFiltros?: FiltrosPessoas) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    const filtros = novosFiltros || filtrosRef.current;
    if (novosFiltros) {
      filtrosRef.current = filtros;
    }

    try {
      const resultado = await buscarPessoasComFiltro(filtros);

      setState((prev) => ({
        ...prev,
        data: resultado.data,
        total: resultado.total,
        pagina: resultado.pagina,
        porPagina: resultado.porPagina,
        totalPaginas: resultado.totalPaginas,
        loading: false,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "Erro desconhecido",
        loading: false,
      }));
    }
  }, []);

  const limparErro = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  const proximaPagina = useCallback(async () => {
    if (state.pagina < state.totalPaginas - 1) {
      await buscar({
        ...filtrosRef.current,
        pagina: state.pagina + 1,
      });
    }
  }, [state.pagina, state.totalPaginas, buscar]);

  const paginaAnterior = useCallback(async () => {
    if (state.pagina > 0) {
      await buscar({
        ...filtrosRef.current,
        pagina: state.pagina - 1,
      });
    }
  }, [state.pagina, buscar]);

  const irParaPagina = useCallback(
    async (novaPagina: number) => {
      if (novaPagina >= 0 && novaPagina < state.totalPaginas) {
        await buscar({
          ...filtrosRef.current,
          pagina: novaPagina,
        });
      }
    },
    [state.totalPaginas, buscar],
  );

  useEffect(() => {
    if (Object.keys(filtrosIniciais).length > 0) {
      buscar(filtrosIniciais);
    }
  }, []);

  return {
    ...state,
    buscar,
    limparErro,
    proximaPagina,
    paginaAnterior,
    irParaPagina,
  };
}

export function useBuscaPessoas() {
  const [filtros, setFiltros] = useState<FiltrosPessoas>({});
  const { data, loading, error, total, buscar } = usePessoas();

  const buscarComFiltros = useCallback(
    (novosFiltros: FiltrosPessoas) => {
      setFiltros(novosFiltros);
      return buscar(novosFiltros);
    },
    [buscar],
  );

  const buscarPorNome = useCallback(
    (nome: string) => {
      return buscarComFiltros({ ...filtros, nome, pagina: 0 });
    },
    [filtros, buscarComFiltros],
  );

  const filtrarPorSexo = useCallback(
    (sexo: "MASCULINO" | "FEMININO") => {
      return buscarComFiltros({ ...filtros, sexo, pagina: 0 });
    },
    [filtros, buscarComFiltros],
  );

  const filtrarPorIdade = useCallback(
    (idadeInicial: number, idadeFinal: number) => {
      return buscarComFiltros({
        ...filtros,
        faixaIdadeInicial: idadeInicial,
        faixaIdadeFinal: idadeFinal,
        pagina: 0,
      });
    },
    [filtros, buscarComFiltros],
  );

  return {
    data,
    loading,
    error,
    total,
    filtros,
    buscarComFiltros,
    buscarPorNome,
    filtrarPorSexo,
    filtrarPorIdade,
  };
}

export function usePessoaDetalhe() {
  const [pessoa, setPessoa] = useState<PessoaDesaparecida | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const carregarPessoa = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);

    try {
      const resultado = await buscarPessoaPorIdEspecifico(id);
      setPessoa(resultado);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar pessoa");
    } finally {
      setLoading(false);
    }
  }, []);

  const limparDados = useCallback(() => {
    setPessoa(null);
    setError(null);
  }, []);

  return {
    pessoa,
    loading,
    error,
    carregarPessoa,
    limparDados,
  };
}

export function useEnviarInformacao() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState(false);

  const enviar = useCallback(async (informacao: InformacaoAdicional) => {
    setLoading(true);
    setError(null);
    setSucesso(false);

    try {
      await enviarInformacaoAdicional(informacao);
      setSucesso(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao enviar informação",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const resetar = useCallback(() => {
    setError(null);
    setSucesso(false);
  }, []);

  return {
    loading,
    error,
    sucesso,
    enviar,
    resetar,
  };
}

export function useDesaparecidosPhotosDinamico(
  registros: number = 50,
  autoRefreshMinutes: number = 5,
) {
  const [photos, setPhotos] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        setLoading(true);
        setError(null);

        const pessoas = await buscarPessoasDinamico(registros);

        const fotosEncontradas = pessoas
          .filter((pessoa) => pessoa.urlFoto && pessoa.urlFoto.trim() !== "")
          .map((pessoa) => pessoa.urlFoto!);

        if (fotosEncontradas.length === 0) {
          const placeholderPhotos = Array.from(
            { length: Math.min(registros, 20) },
            (_, i) => `https://i.pravatar.cc/300?img=${(i % 70) + 1}`,
          );
          setPhotos(placeholderPhotos);
        } else {
          setPhotos(fotosEncontradas);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erro ao buscar fotos dinâmicas",
        );

        const placeholderPhotos = Array.from(
          { length: Math.min(registros, 20) },
          (_, i) => `https://i.pravatar.cc/300?img=${(i % 70) + 1}`,
        );
        setPhotos(placeholderPhotos);
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();

    if (autoRefreshMinutes > 0) {
      const interval = setInterval(fetchPhotos, autoRefreshMinutes * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [registros, autoRefreshMinutes]);

  const refetch = useCallback(async () => {
    const fetchPhotos = async () => {
      try {
        setLoading(true);
        setError(null);

        const pessoas = await buscarPessoasDinamico(registros);

        const fotosEncontradas = pessoas
          .filter((pessoa) => pessoa.urlFoto && pessoa.urlFoto.trim() !== "")
          .map((pessoa) => pessoa.urlFoto!);

        if (fotosEncontradas.length === 0) {
          const placeholderPhotos = Array.from(
            { length: Math.min(registros, 20) },
            (_, i) => `https://i.pravatar.cc/300?img=${(i % 70) + 1}`,
          );
          setPhotos(placeholderPhotos);
        } else {
          setPhotos(fotosEncontradas);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erro ao buscar fotos dinâmicas",
        );

        const placeholderPhotos = Array.from(
          { length: Math.min(registros, 20) },
          (_, i) => `https://i.pravatar.cc/300?img=${(i % 70) + 1}`,
        );
        setPhotos(placeholderPhotos);
      } finally {
        setLoading(false);
      }
    };

    await fetchPhotos();
  }, [registros]);

  return {
    photos,
    loading,
    error,
    refetch,
  };
}

export function useEstatisticasPessoas() {
  const [estatisticas, setEstatisticas] = useState<EstatisticasPessoas | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const buscarEstatisticas = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await buscarEstatisticasPessoas();
      setEstatisticas(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao buscar estatísticas",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    buscarEstatisticas();
  }, [buscarEstatisticas]);

  return {
    estatisticas,
    loading,
    error,
    refetch: buscarEstatisticas,
  };
}

export function useInformacoesOcorrencia(ocorrenciaId: number | null) {
  const [informacoes, setInformacoes] = useState<InformacaoOcorrencia[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const buscarInformacoes = useCallback(async () => {
    if (!ocorrenciaId) {
      setInformacoes([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await buscarInformacoesOcorrencia(ocorrenciaId);
      setInformacoes(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erro ao buscar informações da ocorrência",
      );
      setInformacoes([]);
    } finally {
      setLoading(false);
    }
  }, [ocorrenciaId]);

  useEffect(() => {
    buscarInformacoes();
  }, [buscarInformacoes]);

  return {
    informacoes,
    loading,
    error,
    refetch: buscarInformacoes,
  };
}

export function useMotivosOcorrencia() {
  const [motivos, setMotivos] = useState<MotivoOcorrencia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const buscarMotivos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await buscarMotivosOcorrencia();
      setMotivos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao buscar motivos");
      setMotivos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    buscarMotivos();
  }, [buscarMotivos]);

  return {
    motivos,
    loading,
    error,
    refetch: buscarMotivos,
  };
}

export function useAdicionarInformacaoOcorrencia() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState(false);

  const adicionarInformacao = useCallback(
    async (informacao: NovaInformacaoOcorrencia) => {
      try {
        setLoading(true);
        setError(null);
        setSucesso(false);

        const resultado = await adicionarInformacaoOcorrencia(informacao);
        setSucesso(true);
        return resultado;
      } catch (err) {
        const mensagem =
          err instanceof Error ? err.message : "Erro ao adicionar informação";
        setError(mensagem);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const resetar = useCallback(() => {
    setError(null);
    setSucesso(false);
    setLoading(false);
  }, []);

  return {
    adicionarInformacao,
    loading,
    error,
    sucesso,
    resetar,
  };
}

export function useCriarOcorrenciaDelegaciaDigital() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState(false);
  const [resultado, setResultado] = useState<RespostaCriacaoOcorrencia | null>(
    null,
  );

  const criarOcorrencia = useCallback(
    async (ocorrencia: NovaOcorrenciaDelegaciaDigital) => {
      setLoading(true);
      setError(null);
      setSucesso(false);
      setResultado(null);

      try {
        const response = await criarOcorrenciaDelegaciaDigital(ocorrencia);
        setResultado(response);
        setSucesso(true);
        return response;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Erro desconhecido ao criar ocorrência";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const resetar = useCallback(() => {
    setError(null);
    setSucesso(false);
    setLoading(false);
    setResultado(null);
  }, []);

  return {
    criarOcorrencia,
    loading,
    error,
    sucesso,
    resultado,
    resetar,
  };
}

export function useVerificarDuplicidadeDelegaciaDigital() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultado, setResultado] =
    useState<RespostaVerificacaoDuplicidade | null>(null);

  const verificarDuplicidade = useCallback(
    async (dados: DadosVerificacaoDuplicidade) => {
      setLoading(true);
      setError(null);
      setResultado(null);

      try {
        const response = await verificarDuplicidadeDelegaciaDigital(dados);
        setResultado(response);
        return response;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Erro desconhecido ao verificar duplicidade";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const resetar = useCallback(() => {
    setError(null);
    setLoading(false);
    setResultado(null);
  }, []);

  return {
    verificarDuplicidade,
    loading,
    error,
    resultado,
    resetar,
  };
}

export function useRenovarToken() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tokens, setTokens] = useState<TokensAutenticacao | null>(null);

  const renovarToken = useCallback(async (authorizationHeader: string) => {
    setLoading(true);
    setError(null);
    setTokens(null);

    try {
      const novosTokens = await atualizarToken(authorizationHeader);
      setTokens(novosTokens);

      if (typeof window !== "undefined") {
        localStorage.setItem("accessToken", novosTokens.accessToken);
        localStorage.setItem("refreshToken", novosTokens.refreshToken);
      }

      return novosTokens;
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Erro desconhecido ao renovar token";
      setError(errorMessage);

      if (
        typeof window !== "undefined" &&
        errorMessage.includes("não autorizado")
      ) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      }

      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const resetar = useCallback(() => {
    setError(null);
    setLoading(false);
    setTokens(null);
  }, []);

  return {
    renovarToken,
    loading,
    error,
    tokens,
    resetar,
  };
}

export function useAuth() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { renovarToken, loading } = useRenovarToken();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedAccessToken = localStorage.getItem("accessToken");
      const storedRefreshToken = localStorage.getItem("refreshToken");

      setAccessToken(storedAccessToken);
      setRefreshToken(storedRefreshToken);
      setIsAuthenticated(!!storedAccessToken);
    }
  }, []);

  const logout = useCallback(() => {
    setAccessToken(null);
    setRefreshToken(null);
    setIsAuthenticated(false);

    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }
  }, []);

  const renovarTokenSeNecessario = useCallback(async (): Promise<
    string | null
  > => {
    if (refreshToken) {
      try {
        const novosTokens = await renovarToken(`Bearer ${refreshToken}`);
        setAccessToken(novosTokens.accessToken);
        setRefreshToken(novosTokens.refreshToken);
        setIsAuthenticated(true);
        return novosTokens.accessToken;
      } catch (error) {
        logout();
        throw error;
      }
    }
    return null;
  }, [refreshToken, renovarToken, logout]);

  const login = useCallback((tokens: TokensAutenticacao) => {
    setAccessToken(tokens.accessToken);
    setRefreshToken(tokens.refreshToken);
    setIsAuthenticated(true);

    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", tokens.accessToken);
      localStorage.setItem("refreshToken", tokens.refreshToken);
    }
  }, []);

  return {
    accessToken,
    refreshToken,
    isAuthenticated,
    renovarTokenSeNecessario,
    logout,
    login,
    loading,
  };
}

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tokens, setTokens] = useState<TokensAutenticacao | null>(null);
  const [sucesso, setSucesso] = useState(false);

  const fazerLogin = useCallback(async (credenciais: CredenciaisLogin) => {
    setLoading(true);
    setError(null);
    setTokens(null);
    setSucesso(false);

    try {
      const novosTokens = await realizarLogin(credenciais);
      setTokens(novosTokens);
      setSucesso(true);

      if (typeof window !== "undefined") {
        localStorage.setItem("accessToken", novosTokens.accessToken);
        localStorage.setItem("refreshToken", novosTokens.refreshToken);
      }

      return novosTokens;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro desconhecido ao fazer login";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const resetar = useCallback(() => {
    setError(null);
    setLoading(false);
    setTokens(null);
    setSucesso(false);
  }, []);

  return {
    fazerLogin,
    loading,
    error,
    tokens,
    sucesso,
    resetar,
  };
}

export function useAutenticacaoCompleta() {
  const {
    fazerLogin,
    loading: loadingLogin,
    error: errorLogin,
    sucesso: sucessoLogin,
  } = useLogin();
  const { renovarToken, loading: loadingRenovar } = useRenovarToken();
  const { accessToken, refreshToken, isAuthenticated, logout } = useAuth();

  const loginCompleto = useCallback(
    async (credenciais: CredenciaisLogin) => {
      try {
        const tokens = await fazerLogin(credenciais);

        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("userLoggedIn", { detail: tokens }),
          );
        }

        return tokens;
      } catch (error) {
        throw error;
      }
    },
    [fazerLogin],
  );

  const verificarESalvarSessao = useCallback(async () => {
    if (refreshToken) {
      try {
        await renovarToken(`Bearer ${refreshToken}`);
        return true;
      } catch {
        logout();
        return false;
      }
    }
    return false;
  }, [refreshToken, renovarToken, logout]);

  return {
    loginCompleto,
    loadingLogin,
    errorLogin,
    sucessoLogin,

    accessToken,
    refreshToken,
    isAuthenticated,

    logout,
    verificarESalvarSessao,

    loading: loadingLogin || loadingRenovar,
  };
}

export function useBuscarPessoaPorId(id?: number) {
  const [data, setData] = useState<PessoaDesaparecida | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const buscar = useCallback(async (pessoaId: number) => {
    if (!pessoaId) {
      setError("ID da pessoa é obrigatório");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const pessoa = await buscarPessoaPorIdEspecifico(pessoaId);
      setData(pessoa);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao buscar pessoa";
      setError(errorMessage);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (id) {
      buscar(id);
    }
  }, [id, buscar]);

  const limparErro = useCallback(() => {
    setError(null);
  }, []);

  const limparDados = useCallback(() => {
    setData(null);
    setError(null);
  }, []);

  return {
    data,
    loading,
    error,
    buscar,
    limparErro,
    limparDados,
  };
}

export function useBuscarPessoasComFiltro(
  filtrosIniciais: FiltrosPessoas = {},
) {
  const [data, setData] = useState<PessoaDesaparecida[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [pagina, setPagina] = useState(filtrosIniciais.pagina ?? 0);
  const [porPagina, setPorPagina] = useState(filtrosIniciais.porPagina ?? 10);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [filtros, setFiltros] = useState<FiltrosPessoas>(filtrosIniciais);

  const buscar = useCallback(async (novosFiltros?: FiltrosPessoas) => {
    setLoading(true);
    setError(null);

    const filtrosAplicados = { ...filtros, ...novosFiltros };
    setFiltros(filtrosAplicados);

    try {
      const resultado = await buscarPessoasComFiltro(filtrosAplicados);
      setData(resultado.data);
      setTotal(resultado.total);
      setPagina(resultado.pagina);
      setPorPagina(resultado.porPagina);
      setTotalPaginas(resultado.totalPaginas);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao buscar pessoas";
      setError(errorMessage);
      setData([]);
      setTotal(0);
      setTotalPaginas(0);
    } finally {
      setLoading(false);
    }
  }, []);

  const proximaPagina = useCallback(async () => {
    if (pagina < totalPaginas - 1) {
      await buscar({ ...filtros, pagina: pagina + 1 });
    }
  }, [pagina, totalPaginas, filtros, buscar]);

  const paginaAnterior = useCallback(async () => {
    if (pagina > 0) {
      await buscar({ ...filtros, pagina: pagina - 1 });
    }
  }, [pagina, filtros, buscar]);

  const irParaPagina = useCallback(
    async (novaPagina: number) => {
      if (novaPagina >= 0 && novaPagina < totalPaginas) {
        await buscar({ ...filtros, pagina: novaPagina });
      }
    },
    [totalPaginas, filtros, buscar],
  );

  const limparErro = useCallback(() => {
    setError(null);
  }, []);

  const limparFiltros = useCallback(() => {
    setFiltros({});
    setData([]);
    setTotal(0);
    setPagina(0);
    setTotalPaginas(0);
  }, []);

  return {
    data,
    loading,
    error,
    total,
    pagina,
    porPagina,
    totalPaginas,
    filtros,
    buscar,
    proximaPagina,
    paginaAnterior,
    irParaPagina,
    limparErro,
    limparFiltros,
  };
}

export function useBuscarPessoasAberto(
  paginaInicial: number = 0,
  porPaginaInicial: number = 10,
  direcaoInicial: string = "DESC",
  statusInicial: string = "DESAPARECIDO",
) {
  const [data, setData] = useState<PessoaDesaparecida[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [pagina, setPagina] = useState(paginaInicial);
  const [porPagina, setPorPagina] = useState(porPaginaInicial);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [direcao, setDirecao] = useState(direcaoInicial);
  const [status, setStatus] = useState(statusInicial);

  const buscar = useCallback(
    async (
      novaPagina?: number,
      novoPorPagina?: number,
      novaDirecao?: string,
      novoStatus?: string,
    ) => {
      setLoading(true);
      setError(null);

      const paginaAplicada = novaPagina ?? pagina;
      const porPaginaAplicada = novoPorPagina ?? porPagina;
      const direcaoAplicada = novaDirecao ?? direcao;
      const statusAplicado = novoStatus ?? status;

      try {
        const resultado = await buscarPessoasAberto(
          paginaAplicada,
          porPaginaAplicada,
          direcaoAplicada,
          statusAplicado,
        );

        setData(resultado.data);
        setTotal(resultado.total);
        setPagina(resultado.pagina);
        setPorPagina(resultado.porPagina);
        setTotalPaginas(resultado.totalPaginas);
        setDirecao(direcaoAplicada);
        setStatus(statusAplicado);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Erro ao buscar pessoas";
        setError(errorMessage);
        setData([]);
        setTotal(0);
        setTotalPaginas(0);
      } finally {
        setLoading(false);
      }
    },
    [pagina, porPagina, direcao, status],
  );

  const proximaPagina = useCallback(async () => {
    if (pagina < totalPaginas - 1) {
      await buscar(pagina + 1);
    }
  }, [pagina, totalPaginas, buscar]);

  const paginaAnterior = useCallback(async () => {
    if (pagina > 0) {
      await buscar(pagina - 1);
    }
  }, [pagina, buscar]);

  const irParaPagina = useCallback(
    async (novaPagina: number) => {
      if (novaPagina >= 0 && novaPagina < totalPaginas) {
        await buscar(novaPagina);
      }
    },
    [totalPaginas, buscar],
  );

  const alterarStatus = useCallback(
    async (novoStatus: string) => {
      await buscar(0, porPagina, direcao, novoStatus);
    },
    [porPagina, direcao, buscar],
  );

  const alterarDirecao = useCallback(
    async (novaDirecao: string) => {
      await buscar(pagina, porPagina, novaDirecao, status);
    },
    [pagina, porPagina, status, buscar],
  );

  const limparErro = useCallback(() => {
    setError(null);
  }, []);

  useEffect(() => {
    buscar();
  }, []);

  return {
    data,
    loading,
    error,
    total,
    pagina,
    porPagina,
    totalPaginas,
    direcao,
    status,
    buscar,
    proximaPagina,
    paginaAnterior,
    irParaPagina,
    alterarStatus,
    alterarDirecao,
    limparErro,
  };
}

export function useTestarConectividade() {
  const [testando, setTestando] = useState(false);
  const [conectado, setConectado] = useState<boolean | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  const testar = useCallback(async () => {
    setTestando(true);
    setErro(null);

    try {
      const resultado = await testarConectividadeAPI();
      setConectado(resultado);

      if (!resultado) {
        setErro("Falha na conectividade com a API");
      }
    } catch (error) {
      setConectado(false);
      setErro(error instanceof Error ? error.message : "Erro desconhecido");
    } finally {
      setTestando(false);
    }
  }, []);

  return {
    testando,
    conectado,
    erro,
    testar,
  };
}

export function useEstatisticasAvancadas() {
  const [estatisticas, setEstatisticas] =
    useState<EstatisticasAvancadas | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const buscarEstatisticas = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await buscarEstatisticasAvancadas();
      setEstatisticas(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erro ao buscar estatísticas avançadas",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    buscarEstatisticas();

    const interval = setInterval(buscarEstatisticas, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [buscarEstatisticas]);

  return {
    estatisticas,
    loading,
    error,
    refetch: buscarEstatisticas,
  };
}

export function useDadosMapa() {
  const dadosMock: EstatisticasCidade[] = [
    {
      cidade: "Cuiabá",
      estado: "MT",
      latitude: -15.5989,
      longitude: -56.0949,
      totalDesaparecidos: 25,
      totalEncontrados: 15,
      casos: [],
    },
    {
      cidade: "Várzea Grande",
      estado: "MT",
      latitude: -15.6461,
      longitude: -56.1326,
      totalDesaparecidos: 12,
      totalEncontrados: 0,
      casos: [],
    },
    {
      cidade: "Rondonópolis",
      estado: "MT",
      latitude: -16.4706,
      longitude: -54.6358,
      totalDesaparecidos: 0,
      totalEncontrados: 10,
      casos: [],
    },
    {
      cidade: "Sinop",
      estado: "MT",
      latitude: -11.8609,
      longitude: -55.5028,
      totalDesaparecidos: 8,
      totalEncontrados: 5,
      casos: [],
    },
    {
      cidade: "Tangará da Serra",
      estado: "MT",
      latitude: -14.6218,
      longitude: -57.4985,
      totalDesaparecidos: 6,
      totalEncontrados: 0,
      casos: [],
    },
    {
      cidade: "Cáceres",
      estado: "MT",
      latitude: -16.0739,
      longitude: -57.6781,
      totalDesaparecidos: 0,
      totalEncontrados: 4,
      casos: [],
    },
  ];

  const [dadosMapa, setDadosMapa] = useState<EstatisticasCidade[]>(dadosMock);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const buscarDados = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await buscarDadosMapa();

      setDadosMapa(data);
    } catch (err) {
      const dadosMock: EstatisticasCidade[] = [
        {
          cidade: "Cuiabá",
          estado: "MT",
          latitude: -15.5989,
          longitude: -56.0949,
          totalDesaparecidos: 25,
          totalEncontrados: 15,
          casos: [],
        },
        {
          cidade: "Várzea Grande",
          estado: "MT",
          latitude: -15.6461,
          longitude: -56.1326,
          totalDesaparecidos: 12,
          totalEncontrados: 8,
          casos: [],
        },
        {
          cidade: "Rondonópolis",
          estado: "MT",
          latitude: -16.4706,
          longitude: -54.6358,
          totalDesaparecidos: 18,
          totalEncontrados: 10,
          casos: [],
        },
        {
          cidade: "Sinop",
          estado: "MT",
          latitude: -11.8609,
          longitude: -55.5028,
          totalDesaparecidos: 8,
          totalEncontrados: 5,
          casos: [],
        },
        {
          cidade: "Tangará da Serra",
          estado: "MT",
          latitude: -14.6218,
          longitude: -57.4985,
          totalDesaparecidos: 6,
          totalEncontrados: 4,
          casos: [],
        },
      ];

      setDadosMapa(dadosMock);
      setError(
        err instanceof Error ? err.message : "Erro ao buscar dados do mapa",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    buscarDados();
  }, [buscarDados]);

  return {
    dadosMapa,
    loading,
    error,
    refetch: buscarDados,
  };
}

export function useCarrosselPessoas() {
  const [pessoas, setPessoas] = useState<PessoaDesaparecida[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const buscarPessoas = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const filtros: FiltrosPessoas = {
        status: "DESAPARECIDO",
        porPagina: 20,
        pagina: 0,
      };

      const resultado = await buscarPessoasComFiltro(filtros);
      setPessoas(resultado.data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erro ao buscar pessoas para carrossel",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    buscarPessoas();
  }, [buscarPessoas]);

  return {
    pessoas,
    loading,
    error,
    refetch: buscarPessoas,
  };
}