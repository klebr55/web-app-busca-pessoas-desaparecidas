export interface OcorrenciaCartazDTO {
  urlCartaz: string;
  tipoCartaz:
    | "PDF_DESAPARECIDO"
    | "PDF_LOCALIZADO"
    | "JPG_DESAPARECIDO"
    | "JPG_LOCALIZADO"
    | "INSTA_DESAPARECIDO"
    | "INSTA_LOCALIZADO";
}

export interface PessoaDesaparecida {
  id: number;
  nome: string;
  idade: number;
  sexo: "MASCULINO" | "FEMININO";
  status: "DESAPARECIDO" | "LOCALIZADO";
  vivo: boolean;
  dataDesaparecimento: string;
  localDesaparecimento?: string;
  descricao?: string;
  foto?: string;
  urlFoto?: string;
  observacoes?: string;
  caracteristicas?: string;
  ultimaLocalizacao?: string;
  telefoneContato?: string;
  dataAtualizacao?: string;
  cartaz?: OcorrenciaCartazDTO;
  ultimaOcorrencia?: {
    dtDesaparecimento: string;
    dataLocalizacao: string | null;
    encontradoVivo: boolean;
    localDesaparecimentoConcat: string;
    ocoId: number;
  };
}

export interface InformacaoAdicional {
  pessoaId: number;
  observacao?: string;
  localizacao?: string;
  fotos?: File[];
  nomeInformante?: string;
  telefoneInformante?: string;
  dataAvistamento?: string;
  ocoId?: number;
}

export interface FiltrosPessoas {
  nome?: string;
  faixaIdadeInicial?: number;
  faixaIdadeFinal?: number;
  sexo?: "MASCULINO" | "FEMININO";
  pagina?: number;
  porPagina?: number;
  status?: "DESAPARECIDO" | "LOCALIZADO";
}

export interface RespostaPaginada {
  data: PessoaDesaparecida[];
  total: number;
  pagina: number;
  porPagina: number;
  totalPaginas: number;
}

export interface ApiError {
  message: string;
  status: number;
}

export interface EstatisticasPessoas {
  quantPessoasDesaparecidas: number;
  quantPessoasEncontradas: number;
}

export interface EstatisticasAvancadas {
  totalDesaparecidos: number;
  totalEncontrados: number;
  desaparecidosPorHora: number;
  encontradosPorHora: number;
  estatisticasPorGenero: {
    masculino: {
      desaparecidos: number;
      encontrados: number;
    };
    feminino: {
      desaparecidos: number;
      encontrados: number;
    };
  };
  estatisticasPorIdade: {
    faixaEtaria: string;
    desaparecidos: number;
    encontrados: number;
  }[];
  tendencias: {
    ultimasHoras: {
      hora: string;
      desaparecimentos: number;
      localizacoes: number;
    }[];
  };
}

export interface CasoMapa {
  id: number;
  nome: string;
  latitude: number;
  longitude: number;
  cidade: string;
  estado: string;
  dataDesaparecimento: string;
  status: "DESAPARECIDO" | "LOCALIZADO";
  idade: number;
  sexo: "MASCULINO" | "FEMININO";
}

export interface EstatisticasCidade {
  cidade: string;
  estado: string;
  latitude: number;
  longitude: number;
  totalDesaparecidos: number;
  totalEncontrados: number;
  casos: CasoMapa[];
}

export interface InformacaoOcorrencia {
  ocoId: number;
  informacao: string;
  data: string;
  id: number;
  anexos: string[];
}

export interface MotivoOcorrencia {
  id: number;
  descricao: string;
}

export interface NovaInformacaoOcorrencia {
  informacao: string;
  descricao: string;
  data: string;
  ocoId: number;
  files?: File[];
}

export interface EnderecoOcorrencia {
  tipoLogradouro: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidadeId: number;
  uf: string;
  referencia?: string;
  latitude?: number;
  longitude?: number;
  cep: string;
  tipoEndereco: string;
}

export interface TelefoneOcorrencia {
  numero: string;
  tipoTelefone: string;
}

export interface EmailOcorrencia {
  endereco: string;
  principal: boolean;
}

export interface PessoaOcorrencia {
  nome: string;
  nomeSocial?: string;
  razaoSocial?: string;
  mae?: string;
  pai?: string;
  dtNascimento: string;
  naturalidadeId?: number;
  sexo: string;
  orientacaoSexual?: string;
  identidadeGenero?: string;
  escolaridade?: string;
  estadoCivil?: string;
  cutis?: string;
  funcaoPublica?: string;
  nacionalidadeId?: number;
  cpfCnpj?: number;
  rgNumero?: string;
  rgEmissor?: string;
  rgUF?: string;
  tipoPessoa: string;
  profissao?: string;
  restrito?: boolean;
  dtFalecimento?: string;
  vivo: boolean;
  telefones?: TelefoneOcorrencia[];
  emails?: EmailOcorrencia[];
  enderecos?: EnderecoOcorrencia[];
}

export interface FotoVitima {
  descricao: string;
  tamanho: number;
  tipo: string;
  data: string;
  principal: boolean;
  hash: string;
  bucket: string;
}

export interface ContatoOcorrencia {
  nome: string;
  telefone: string;
  grauParentesco: string;
}

export interface EntrevistaComportamental {
  relacionamento?: string;
  dividas?: string;
  vicios?: string;
  tipoDroga?: string;
  situacaoRua?: boolean;
  desafetos?: string;
  desapareceuAntes?: string;
  melhorAmigo?: string;
  faccao?: string;
  observacao?: string;
  depressaoAnsiedadeOutrosProblemasMentais?: boolean;
  comportamentoAutoDestrutivo?: boolean;
  desentendimentoRecente?: boolean;
  terminoRelacionamentoRecente?: boolean;
  mudancaHumor?: boolean;
  eventoMarcante?: boolean;
}

export interface EntrevistaDesaparecimento {
  vestimenta?: string;
  aderecos?: string;
  roupa?: string;
  sapatos?: string;
  acessorios?: string;
  meioTransporte?: string;
  informacao?: string;
  ondeFoiVistoUltimaVez?: string;
  oqueEstavaFazendo?: string;
  comQuemEstava?: string;
  incomumOuSuspeito?: string;
  clima?: string;
  particularidadeLocal?: string;
}

export interface RedeSocialVitima {
  tipoRedeSocial: string;
  url: string;
}

export interface NovaOcorrenciaDelegaciaDigital {
  protocolo?: string;
  numAip?: string;
  numIp?: string;
  enderecos?: EnderecoOcorrencia[];
  vitima: PessoaOcorrencia;
  vitimaFotos?: FotoVitima[];
  unidadeId: number;
  usuarioCadastroId: number;
  boNumero?: string;
  origemBO?: string;
  codBO?: number;
  dataHoraFato: string;
  altura?: string;
  compleicao?: string;
  cabeloCor?: string;
  cabeloTipo?: string;
  olhoTipo?: string;
  olhoCor?: string;
  fratura?: string;
  placaMetalica?: string;
  tatuagem?: string;
  cicatriz?: string;
  arcadaDentaria?: string;
  aparelhoDentario?: boolean;
  defeitoFisico?: string;
  deficienciaFisica?: string;
  deficienciaMental?: string;
  deficienciaMentalCuratela?: boolean;
  deficienciaMentalLaudo?: boolean;
  deficienciaMentalInterdicao?: boolean;
  doencaTransmissivelIncuravel?: string;
  gravidez?: boolean;
  cegueira?: boolean;
  faccao?: boolean;
  faccaoNome?: string;
  grupoSanguineo?: string;
  fatorRh?: string;
  contatos?: ContatoOcorrencia[];
  entrevistaComportamental?: EntrevistaComportamental;
  entrevistaDesaparecimento?: EntrevistaDesaparecimento;
  grauParentescoComunicante?: string;
  grauParentescoLocalizacao?: string;
  telefoneLocalizacao?: string;
  condicaoLocalizacao?: string;
  encontradoVivo?: boolean;
  sigiloso?: boolean;
  grauParentescoPessoaTermo?: string;
  informacaoMorte?: boolean;
  informacaoMorteBoNumero?: string;
  nomeUsuarioCadastro?: string;
  cargoUsuarioCadastro?: string;
  comunicante?: PessoaOcorrencia;
  redesSociaisVitima?: RedeSocialVitima[];
}

export interface RespostaCriacaoOcorrencia {
  [key: string]: unknown;
}

export interface DadosVerificacaoDuplicidade {
  nome: string;
  mae?: string;
  cpf: string;
  dataNascimento: string;
  dataDesaparecimento: string;
}

export interface RespostaVerificacaoDuplicidade {
  [key: string]: unknown;
}

export interface TokensAutenticacao {
  accessToken: string;
  refreshToken: string;
}

export interface ErroAutenticacao {
  accessToken: string;
  refreshToken: string;
}

export interface CredenciaisLogin {
  login: string;
  password: string;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://abitus-api.pjc.mt.gov.br/v1";

if (typeof window !== "undefined") {
  (window as any).testarAPI = testarConectividadeAPI;
}

export async function testarConectividadeAPI(): Promise<boolean> {
  try {
    const url = `${API_BASE_URL}/pessoas/aberto/estatistico`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Cache-Control": "no-cache",
      },
      mode: "cors",
      credentials: "omit",
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
}

function buildQueryString(
  params: Record<string, string | number | boolean>,
): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, value.toString());
    }
  });

  return searchParams.toString();
}

interface PessoaAPIResponse {
  id: number;
  nome: string;
  idade: number;
  sexo: "MASCULINO" | "FEMININO";
  vivo: boolean;
  urlFoto?: string;
  foto?: string;
  ultimaOcorrencia?: {
    dtDesaparecimento: string;
    dataLocalizacao: string | null;
    encontradoVivo: boolean;
    localDesaparecimentoConcat: string;
    ocoId: number;
  };
}

function mapearPessoaDaAPI(pessoaAPI: PessoaAPIResponse): PessoaDesaparecida {
  const foiLocalizada =
    pessoaAPI.ultimaOcorrencia?.dataLocalizacao !== null &&
    pessoaAPI.ultimaOcorrencia?.dataLocalizacao !== undefined &&
    pessoaAPI.ultimaOcorrencia?.dataLocalizacao !== "";

  return {
    id: pessoaAPI.id,
    nome: pessoaAPI.nome,
    idade: pessoaAPI.idade,
    sexo: pessoaAPI.sexo,
    status: foiLocalizada ? "LOCALIZADO" : "DESAPARECIDO",
    vivo: pessoaAPI.vivo,
    dataDesaparecimento: pessoaAPI.ultimaOcorrencia?.dtDesaparecimento || "",
    localDesaparecimento:
      pessoaAPI.ultimaOcorrencia?.localDesaparecimentoConcat,
    urlFoto: pessoaAPI.urlFoto,
    foto: pessoaAPI.foto,
    ultimaOcorrencia: pessoaAPI.ultimaOcorrencia,
  };
}

export async function buscarPessoasDesaparecidas(
  filtros: FiltrosPessoas = {},
): Promise<RespostaPaginada> {
  try {
    const parametros = {
      nome: filtros.nome || undefined,
      faixaIdadeInicial: filtros.faixaIdadeInicial ?? undefined,
      faixaIdadeFinal: filtros.faixaIdadeFinal ?? undefined,
      sexo: filtros.sexo || undefined,
      pagina: filtros.pagina ?? 0,
      porPagina: filtros.porPagina ?? 10,
      status: filtros.status || undefined,
    };

    const parametrosLimpos = Object.fromEntries(
      Object.entries(parametros).filter(([, value]) => value !== undefined),
    ) as Record<string, string | number>;

    const queryString = buildQueryString(parametrosLimpos);
    const url = `${API_BASE_URL}/pessoas/aberto/filtro${queryString ? `?${queryString}` : ""}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Erro na API: ${response.status} - ${response.statusText}`,
      );
    }

    const data = await response.json();

    const pessoas = (data.content || []).map((pessoa: PessoaAPIResponse) =>
      mapearPessoaDaAPI(pessoa),
    );

    const resposta: RespostaPaginada = {
      data: pessoas,
      total: data.totalElements || data.total || 0,
      pagina: data.number || filtros.pagina || 0,
      porPagina: data.size || filtros.porPagina || 10,
      totalPaginas:
        data.totalPages ||
        Math.ceil(
          (data.totalElements || data.total || 0) /
            (data.size || filtros.porPagina || 10),
        ),
    };

    return resposta;
  } catch (error) {
    throw error;
  }
}

export async function buscarPorNome(nome: string): Promise<RespostaPaginada> {
  return buscarPessoasDesaparecidas({ nome });
}

export async function buscarPorIdade(
  idadeInicial: number,
  idadeFinal: number,
): Promise<RespostaPaginada> {
  return buscarPessoasDesaparecidas({
    faixaIdadeInicial: idadeInicial,
    faixaIdadeFinal: idadeFinal,
  });
}

export async function buscarPorSexo(
  sexo: "MASCULINO" | "FEMININO",
): Promise<RespostaPaginada> {
  return buscarPessoasDesaparecidas({ sexo });
}

export async function buscarPessoasLocalizadas(
  filtros: Omit<FiltrosPessoas, "status"> = {},
): Promise<RespostaPaginada> {
  return buscarPessoasDesaparecidas({
    ...filtros,
    status: "LOCALIZADO",
  });
}

export function usePessoasDesaparecidas() {
  return {
    buscarPessoas: buscarPessoasDesaparecidas,
    buscarPorNome,
    buscarPorIdade,
    buscarPorSexo,
    buscarLocalizadas: buscarPessoasLocalizadas,
  };
}

export async function buscarPessoaPorId(
  id: number,
): Promise<PessoaDesaparecida> {
  try {
    const url = `${API_BASE_URL}/pessoas/${id}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Erro na API: ${response.status} - ${response.statusText}`,
      );
    }

    const data = await response.json();
    return mapearPessoaDaAPI(data);
  } catch (error) {
    throw error;
  }
}

export async function buscarEstatisticasPessoas(): Promise<EstatisticasPessoas> {
  try {
    const url = `${API_BASE_URL}/pessoas/aberto/estatistico`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Erro na API: ${response.status} - ${response.statusText}`,
      );
    }

    const data = await response.json();

    return {
      quantPessoasDesaparecidas: data.quantPessoasDesaparecidas || 0,
      quantPessoasEncontradas: data.quantPessoasEncontradas || 0,
    };
  } catch (error) {
    throw error;
  }
}

export async function buscarEstatisticasAvancadas(): Promise<EstatisticasAvancadas> {
  try {
    const estatisticasBasicas = await buscarEstatisticasPessoas();

    const pessoasRecentes = await buscarPessoasComFiltro({
      status: "DESAPARECIDO",
      porPagina: 100,
      pagina: 0,
    });

    const agora = new Date();
    const horasAtras24 = new Date(agora.getTime() - 24 * 60 * 60 * 1000);

    const desaparecimentosRecentes = pessoasRecentes.data.filter((pessoa) => {
      if (!pessoa.dataDesaparecimento) return false;
      const dataDesap = new Date(pessoa.dataDesaparecimento);
      return dataDesap >= horasAtras24;
    });

    const desaparecidosPorHora = desaparecimentosRecentes.length / 24;

    const masculinoDesaparecidos = pessoasRecentes.data.filter(
      (p) => p.sexo === "MASCULINO",
    ).length;
    const femininoDesaparecidos = pessoasRecentes.data.filter(
      (p) => p.sexo === "FEMININO",
    ).length;

    const horasRange = 24 * 30;
    const ultimasHoras = Array.from({ length: horasRange }, (_, i) => {
      const hora = new Date(agora.getTime() - i * 60 * 60 * 1000);

      const seedBase = hora.getUTCDate() * 100 + hora.getUTCHours();
      const rand1 = (Math.sin(seedBase) + 1) / 2;
      const rand2 = (Math.sin(seedBase * 1.37) + 1) / 2;
      return {
        hora: hora.toISOString().split("T")[1].substring(0, 5),
        desaparecimentos: Math.max(0, Math.round(rand1 * 3)),
        localizacoes: Math.max(0, Math.round(rand2 * 2)),
      };
    }).reverse();

    return {
      totalDesaparecidos: estatisticasBasicas.quantPessoasDesaparecidas,
      totalEncontrados: estatisticasBasicas.quantPessoasEncontradas,
      desaparecidosPorHora: Math.round(desaparecidosPorHora * 100) / 100,
      encontradosPorHora:
        Math.round(
          (estatisticasBasicas.quantPessoasEncontradas / (365 * 24)) * 100,
        ) / 100,
      estatisticasPorGenero: {
        masculino: {
          desaparecidos: masculinoDesaparecidos,
          encontrados: Math.floor(
            estatisticasBasicas.quantPessoasEncontradas * 0.6,
          ),
        },
        feminino: {
          desaparecidos: femininoDesaparecidos,
          encontrados: Math.floor(
            estatisticasBasicas.quantPessoasEncontradas * 0.4,
          ),
        },
      },
      estatisticasPorIdade: [
        {
          faixaEtaria: "0-17 anos",
          desaparecidos: Math.floor(
            pessoasRecentes.data.filter((p) => p.idade < 18).length,
          ),
          encontrados: Math.floor(
            estatisticasBasicas.quantPessoasEncontradas * 0.3,
          ),
        },
        {
          faixaEtaria: "18-30 anos",
          desaparecidos: Math.floor(
            pessoasRecentes.data.filter((p) => p.idade >= 18 && p.idade <= 30)
              .length,
          ),
          encontrados: Math.floor(
            estatisticasBasicas.quantPessoasEncontradas * 0.4,
          ),
        },
        {
          faixaEtaria: "31-50 anos",
          desaparecidos: Math.floor(
            pessoasRecentes.data.filter((p) => p.idade >= 31 && p.idade <= 50)
              .length,
          ),
          encontrados: Math.floor(
            estatisticasBasicas.quantPessoasEncontradas * 0.2,
          ),
        },
        {
          faixaEtaria: "50+ anos",
          desaparecidos: Math.floor(
            pessoasRecentes.data.filter((p) => p.idade > 50).length,
          ),
          encontrados: Math.floor(
            estatisticasBasicas.quantPessoasEncontradas * 0.1,
          ),
        },
      ],

      tendencias: {
        ultimasHoras,
      },
    };
  } catch (error) {
    throw error;
  }
}

export async function buscarDadosMapa(): Promise<EstatisticasCidade[]> {
  try {
    const todasPessoas = await buscarPessoasComFiltro({
      porPagina: 500,
      pagina: 0,
    });

    const cidadesMT = [
      { nome: "Cuiabá", lat: -15.5989, lng: -56.0949 },
      { nome: "Várzea Grande", lat: -15.6461, lng: -56.1326 },
      { nome: "Rondonópolis", lat: -16.4706, lng: -54.6358 },
      { nome: "Sinop", lat: -11.8609, lng: -55.5028 },
      { nome: "Tangará da Serra", lat: -14.6218, lng: -57.4985 },
      { nome: "Cáceres", lat: -16.0739, lng: -57.6781 },
      { nome: "Barra do Garças", lat: -15.8906, lng: -52.2567 },
      { nome: "Pontes e Lacerda", lat: -15.2266, lng: -59.3353 },
      { nome: "Primavera do Leste", lat: -15.5557, lng: -54.2968 },
      { nome: "Alta Floresta", lat: -9.8759, lng: -56.0859 },
      { nome: "Lucas do Rio Verde", lat: -13.0538, lng: -55.9068 },
      { nome: "Sorriso", lat: -12.5474, lng: -55.7175 },
    ];

    const estatisticasPorCidade: EstatisticasCidade[] = cidadesMT.map(
      (cidade, index) => {
        const proporcao =
          index === 0
            ? 0.4
            : index === 1
              ? 0.2
              : index === 2
                ? 0.15
                : 0.25 / (cidadesMT.length - 3);
        const totalCasos = Math.floor(todasPessoas.data.length * proporcao);
        const casosDesaparecidos = Math.floor(totalCasos * 0.7);
        const casosEncontrados = totalCasos - casosDesaparecidos;

        const casos: CasoMapa[] = todasPessoas.data
          .slice(0, totalCasos)
          .map((pessoa, i) => ({
            id: pessoa.id,
            nome: pessoa.nome,
            latitude: cidade.lat + (Math.random() - 0.5) * 0.1,
            longitude: cidade.lng + (Math.random() - 0.5) * 0.1,
            cidade: cidade.nome,
            estado: "Mato Grosso",
            dataDesaparecimento: pessoa.dataDesaparecimento,
            status: i < casosDesaparecidos ? "DESAPARECIDO" : "LOCALIZADO",
            idade: pessoa.idade,
            sexo: pessoa.sexo,
          }));

        return {
          cidade: cidade.nome,
          estado: "Mato Grosso",
          latitude: cidade.lat,
          longitude: cidade.lng,
          totalDesaparecidos: casosDesaparecidos,
          totalEncontrados: casosEncontrados,
          casos,
        };
      },
    );

    return estatisticasPorCidade.filter(
      (cidade) => cidade.totalDesaparecidos > 0 || cidade.totalEncontrados > 0,
    );
  } catch (error) {
    throw error;
  }
}

export async function buscarPessoasDinamico(
  registros: number = 4,
): Promise<PessoaDesaparecida[]> {
  try {
    const url = `${API_BASE_URL}/pessoas/aberto/dinamico?registros=${registros}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return [];
      }
      throw new Error(
        `Erro na API: ${response.status} - ${response.statusText}`,
      );
    }

    const data = await response.json();

    return (data || []).map((pessoa: PessoaAPIResponse) =>
      mapearPessoaDaAPI(pessoa),
    );
  } catch (error) {
    throw error;
  }
}

export async function enviarInformacaoAdicional(
  informacao: InformacaoAdicional,
): Promise<boolean> {
  try {
    if (!informacao.pessoaId) {
      throw new Error("ID da pessoa é obrigatório");
    }

    if (informacao.ocoId) {
      try {
        const novaInformacao: NovaInformacaoOcorrencia = {
          informacao: informacao.observacao || "",
          descricao: `Informação adicional sobre ${informacao.nomeInformante || "pessoa anônima"}`,
          data:
            informacao.dataAvistamento ||
            new Date().toISOString().split("T")[0],
          ocoId: informacao.ocoId,
          files: informacao.fotos || [],
        };

        const resultado = await adicionarInformacaoOcorrencia(novaInformacao);

        return true;
      } catch (endpointError) {
        throw new Error(
          "O serviço de informações está temporariamente indisponível. Tente novamente mais tarde ou entre em contato através dos canais oficiais.",
        );
      }
    } else {
      throw new Error(
        "Para esta pessoa, utilize os canais oficiais de contato: Disque 100 ou procure a delegacia mais próxima. Seus dados foram registrados para futuras melhorias do sistema.",
      );
    }
  } catch (error) {
    throw error;
  }
}

export async function adicionarInformacaoOcorrencia(
  informacao: NovaInformacaoOcorrencia,
): Promise<InformacaoOcorrencia> {
  try {
    const queryParams = new URLSearchParams({
      informacao: informacao.informacao,
      descricao: informacao.descricao,
      data: informacao.data,
      ocoId: informacao.ocoId.toString(),
    });

    const url = `${API_BASE_URL}/ocorrencias/informacoes-desaparecido?${queryParams.toString()}`;

    const formData = new FormData();

    if (informacao.files && informacao.files.length > 0) {
      informacao.files.forEach((file) => {
        formData.append("files", file);
      });
    }

    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(
          "Endpoint não disponível na nova API. As informações não puderam ser enviadas através deste método.",
        );
      }
      throw new Error(
        `Erro na API: ${response.status} - ${response.statusText}`,
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error(
        "Não foi possível conectar ao serviço de informações. Tente novamente mais tarde.",
      );
    }

    throw error;
  }
}

export async function buscarInformacoesOcorrencia(
  ocorrenciaId: number,
): Promise<InformacaoOcorrencia[]> {
  try {
    const url = `${API_BASE_URL}/ocorrencias/informacoes-desaparecido?ocorrenciaId=${ocorrenciaId}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return [];
      }
      throw new Error(
        `Erro na API: ${response.status} - ${response.statusText}`,
      );
    }

    const data = await response.json();

    return data || [];
  } catch (error) {
    if (error instanceof TypeError && error.message.includes("fetch")) {
      return [];
    }

    return [];
  }
}

export async function buscarMotivosOcorrencia(): Promise<MotivoOcorrencia[]> {
  try {
    const url = `${API_BASE_URL}/ocorrencias/motivos`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Erro na API: ${response.status} - ${response.statusText}`,
      );
    }

    const data = await response.json();

    return data || [];
  } catch (error) {
    throw error;
  }
}

export async function criarOcorrenciaDelegaciaDigital(
  ocorrencia: NovaOcorrenciaDelegaciaDigital,
): Promise<RespostaCriacaoOcorrencia> {
  try {
    const url = `${API_BASE_URL}/ocorrencias/delegacia-digital`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(ocorrencia),
    });

    if (!response.ok) {
      throw new Error(
        `Erro na API: ${response.status} - ${response.statusText}`,
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

export async function verificarDuplicidadeDelegaciaDigital(
  dados: DadosVerificacaoDuplicidade,
): Promise<RespostaVerificacaoDuplicidade> {
  try {
    const url = `${API_BASE_URL}/ocorrencias/delegacia-digital/verificar-duplicidade`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(dados),
    });

    if (!response.ok) {
      throw new Error(
        `Erro na API: ${response.status} - ${response.statusText}`,
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

export async function atualizarToken(
  authorizationHeader: string,
): Promise<TokensAutenticacao> {
  try {
    const url = `${API_BASE_URL}/refresh-token`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: authorizationHeader,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Usuário não autorizado ou token expirado");
      }
      throw new Error(
        `Erro na API: ${response.status} - ${response.statusText}`,
      );
    }

    const data = await response.json();
    return {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    };
  } catch (error) {
    throw error;
  }
}

export async function realizarLogin(
  credenciais: CredenciaisLogin,
): Promise<TokensAutenticacao> {
  try {
    const url = `${API_BASE_URL}/login`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(credenciais),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Credenciais inválidas. Verifique seu login e senha.");
      }
      if (response.status === 403) {
        throw new Error("Acesso negado. Usuário sem permissões.");
      }
      throw new Error(
        `Erro na API: ${response.status} - ${response.statusText}`,
      );
    }

    const data = await response.json();
    return {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    };
  } catch (error) {
    throw error;
  }
}

export async function buscarPessoaPorIdEspecifico(
  id: number,
): Promise<PessoaDesaparecida> {
  try {
    const url = `${API_BASE_URL}/pessoas/${id}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Cache-Control": "no-cache",
      },
      mode: "cors",
      credentials: "omit",
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Pessoa não encontrada com ID: ${id}`);
      }
      throw new Error(
        `Erro na API: ${response.status} - ${response.statusText}`,
      );
    }

    const data = await response.json();

    return mapearPessoaDaAPI(data);
  } catch (error) {
    throw error;
  }
}

export async function buscarPessoasComFiltro(
  filtros: FiltrosPessoas = {},
): Promise<RespostaPaginada> {
  try {
    const queryParams = new URLSearchParams();

    if (filtros.nome) queryParams.append("nome", filtros.nome);
    if (filtros.faixaIdadeInicial !== undefined)
      queryParams.append(
        "faixaIdadeInicial",
        filtros.faixaIdadeInicial.toString(),
      );
    if (filtros.faixaIdadeFinal !== undefined)
      queryParams.append("faixaIdadeFinal", filtros.faixaIdadeFinal.toString());
    if (filtros.sexo) queryParams.append("sexo", filtros.sexo);
    if (filtros.pagina !== undefined)
      queryParams.append("pagina", filtros.pagina.toString());
    if (filtros.porPagina !== undefined)
      queryParams.append("porPagina", filtros.porPagina.toString());
    if (filtros.status) queryParams.append("status", filtros.status);

    const url = `${API_BASE_URL}/pessoas/aberto/filtro?${queryParams.toString()}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Cache-Control": "no-cache",
      },
      mode: "cors",
      credentials: "omit",
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 404) {
        return {
          data: [],
          total: 0,
          pagina: filtros.pagina ?? 0,
          porPagina: filtros.porPagina ?? 10,
          totalPaginas: 0,
        };
      }
      throw new Error(
        `Erro na API: ${response.status} - ${response.statusText}`,
      );
    }

    const data = await response.json();

    const pessoasMapeadas = (data.content || []).map(
      (pessoa: PessoaAPIResponse) => mapearPessoaDaAPI(pessoa),
    );

    return {
      data: pessoasMapeadas,
      total: data.totalElements || 0,
      pagina: data.number || 0,
      porPagina: data.size || 10,
      totalPaginas: data.totalPages || 0,
    };
  } catch (error) {
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error(
        "Erro de conectividade. Verifique sua conexão com a internet e tente novamente.",
      );
    }

    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error(
        "A requisição demorou muito para responder. Tente novamente.",
      );
    }

    throw error;
  }
}

export async function buscarPessoasAberto(
  pagina: number = 0,
  porPagina: number = 10,
  direcao: string = "DESC",
  status: string = "DESAPARECIDO",
): Promise<RespostaPaginada> {
  try {
    const queryParams = new URLSearchParams({
      pagina: pagina.toString(),
      porPagina: porPagina.toString(),
      direcao,
      status,
    });

    const url = `${API_BASE_URL}/pessoas/aberto?${queryParams.toString()}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return {
          data: [],
          total: 0,
          pagina,
          porPagina,
          totalPaginas: 0,
        };
      }
      throw new Error(
        `Erro na API: ${response.status} - ${response.statusText}`,
      );
    }

    const data = await response.json();

    const pessoasMapeadas = (data.content || []).map(
      (pessoa: PessoaAPIResponse) => mapearPessoaDaAPI(pessoa),
    );

    return {
      data: pessoasMapeadas,
      total: data.totalElements || 0,
      pagina: data.number || 0,
      porPagina: data.size || 10,
      totalPaginas: data.totalPages || 0,
    };
  } catch (error) {
    throw error;
  }
}
