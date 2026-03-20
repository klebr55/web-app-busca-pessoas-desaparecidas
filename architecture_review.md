# Revisão Arquitetural: Clean Architecture e Padrão Facade

Como um Arquiteto de Software avaliando a estrutura atual do projeto, esta é a revisão arquitetural focada nos 4 critérios solicitados (Regra de Dependência, Vazamento de Abstração, SRP e Testabilidade), pontuando os acertos e as oportunidades de melhoria (trade-offs) na visão de _Clean Architecture_.

O uso de _Custom Hooks_ atuando no papel de **Presenters / Controllers** (uma camada adaptadora) para isolar a _View_ (Componentes React) da camada de Dados/Serviços foi uma excelente iniciativa para manter a base de código sustentável a longo prazo.

---

### 1. Regra de Dependência (Dependency Rule)

**Avaliação:** Muito Boa (com ressalvas puristas).

- **O Acerto:** O fluxo de dependência está correto na via UI. Seus componentes "burros" (ex: `Desaparecidos.tsx`) não sabem mais que uma API existe. Eles dependem da `Facade`, e a `Facade` depende do serviço (`@/api/hooks`). A UI está perfeitamente protegida contra mudanças na infraestrutura de requisição.
- **Visão Clean Architecture:** Na arquitetura limpa mais estrita, a _Facade/Use Case_ não deveria depender da implementação real do `api/hooks`, mas sim de uma Interface (Porta). No React, fazemos concessões (Pragmatic Clean Architecture), então mapear o hook de serviço diretamente na Facade é aceitável.
- **Veredito:** Passou. O componente foca 100% no JSX/Tailwind, e o Hook resolve a obtenção estrutural dos dados.

### 2. Leaky Abstractions (Vazamento de Abstração)

**Avaliação:** Cuidado com eventos do DOM e Bibliotecas de Animação.

- **O Acerto:** Nenhum tipo de Axios, Fetch ou DTO sujo de HTTP está chegando na View. A Facade está devolvendo modelos da sua aplicação (`PessoaDesaparecida`, `loading`, `error`).
- **O Ponto de Atenção (O Vazamento):** Você possui vazamentos da camada de UI para dentro da sua Facade de Lógica.
  1. No `useCarrosselPessoasFacade.ts`, existe a importação de `PanInfo` do `framer-motion` e argumentos como `MouseEvent | TouchEvent`.
  2. Em facades de formulário, estão sendo passados eventos do DOM (`e: React.FormEvent`) com chamadas de `e.preventDefault()`.
- **O Ideal:** A lógica de negócio/Facade _não deveria saber que o React, a Web ou o Framer Motion existem_. A UI deveria barrar o evento (`e.preventDefault()`) e repassar apenas os valores puros para a Facade (ex: `facade.salvarInformacao(valor)`).

### 3. Responsabilidade Única (SRP)

**Avaliação:** Risco de "God Hooks" (Hooks Deus).

- **O Ponto de Atenção:** Muitas Facades agruparam **duas naturezas completamente diferentes de estado**:
  1. _Estado de UI / Efêmero:_ `isModalOpen`, `isMobile`, `currentIndex`, `filtrosAbertos`.
  2. _Estado de Negócio / Servidor:_ dados de `pessoas`, `loading`, `error`, submissão de formulário.
- **Exemplo (`usePessoaDetalhesFacade`):** Nele, nós temos a lógica complexa de ir buscar dados na API para a página e as lógicas de negócio (`calcularIdadeAtual`), mas _também_ controlamos o índice da galeria de fotos Modal (`nextModal()`, `prevModal()`, eventos de teclado).
- **O Ideal:** Em componentes muito complexos, o padrão separa a _View Model_ em domínios menores. A Facade não precisa ser um guarda-chuva tudo-em-um. É perfeitamente correto a UI consumir `usePessoaData()` (infra/negócio) e `useGalleryModal()` (comportamento de UI pura).

### 4. Testabilidade

**Avaliação:** Excelente para testes de Componente, Boa para Testes de Lógica.

- **Como a UI ficou:** **10/10**. Você consegue fazer o _Mock_ de forma incrivelmente fácil utilizando ferramentas como `jest.mock('./useDesaparecidosFacade')`. Você simula instantaneamente o estado de erro, de loading e o estado preenchido da vitrine sem precisar criar servidores falsos (MSW) ou mockar bibliotecas de terceiros complexas. Sua camada de UI renderá apenas testes visuais/comportamentais.
- **Como a lógica ficou:** **7/10**. Para testar sua lógica isolada, você precisa de um ambiente React (usando `renderHook` do `@testing-library/react`). Isso difere da Clean Arch teórica onde testaríamos domínios usando _Testes Unitários Puros_ em NodeJS/Runtime sem depender da UI library.
- **Recomendação de Ouro:** Funções puras que você adicionou nas suas Facades — como `calcularIdadeAtual(idade, data)`, `formatarData(iso)` e `getStatusText(status, sexo)` — são **Regras de Domínio e Utils**. Mapeie-as e as defina em uma pasta de domínio (ex: `lib/domain/pessoaUtils.ts`). Elas devem ser testadas utilizando frameworks de teste (Jest/Vitest) apenas inserindo inputs e validando outputs, sem precisar instanciar hooks.

---

### Veredito do Arquiteto e Próximos Passos

O re-arquitetamento protege o seu projeto de problemas crônicos de crescimento. Suas views agora se comportam estritamente como Views.

**Recomendações para refinamento nas próximas Sprints:**

1. **Limpe as Facades de eventos de DOM:** Mova o tratamento sintético (ex: `.preventDefault()`, Eventos de Teclado, tipos do `framer-motion`) para os arquivos `.tsx` e repasse para as facades apenas estruturas de dados simples.
2. **Separe Casos de Uso (Business) de Hooks de UI (UX):** Controlar se uma aba ou modal está aberto é uma função comportamental de UI e deve estar num hook próprio se for complexo, e não misturado na mesma facade que consome APIs.
3. **Extraia regras puras de negócios** do meio das suas facades e crie de fato a sua camada de Entidade/Domínio separada (Cálculos de idade, parseamento de cor ou status de processo). A Facade atua como caso de uso (Use Case) que orquestra essas utilidades de domínio com os Repositórios de dados.
