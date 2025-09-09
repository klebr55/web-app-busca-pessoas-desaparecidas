# Pessoas Desaparecidas MT — Front-end

Projeto front-end em Next.js para consulta e acompanhamento de pessoas desaparecidas no estado de Mato Grosso.

## Dados de inscrição

Os dados abaixo referem-se à minha inscrição no processo seletivo. Caso algum campo precise de ajuste, posso atualizar conforme o documento oficial.

- Nome: Kleber Vinícius Moreira Silva
- E-mail: klebervinicius_@hotmail.com
- Telefone: (65) 98416-1537
- Vaga: Desenvolvedor Júnior
- Data da inscrição: 08/09/2025
- LinkedIn: https://www.linkedin.com/in/klebervinicius08/
- GitHub: https://github.com/klebr55
- Projeto disponível na Vercel: https://web-app-busca-pessoas-desaparecidas.vercel.app

## Requisitos

- Node.js 18 ou superior (recomendado LTS atual)
- npm 9 ou superior
- (Opcional) Docker e Docker Compose

## Dependências

Runtime (dependencies):

- @fancyapps/ui ^5.0.35
- @gsap/react ^2.1.2
- @hookform/resolvers ^5.2.1
- @tabler/icons-react ^3.34.1
- @tailwindcss/line-clamp ^0.4.4
- axios ^1.11.0
- class-variance-authority ^0.7.1
- clsx ^2.1.1
- date-fns ^4.1.0
- framer-motion ^12.23.12
- gsap ^3.13.0
- html2canvas ^1.4.1
- leaflet ^1.9.4
- lucide-react ^0.542.0
- motion ^12.23.12
- next 15.5.2
- ogl ^1.0.11
- react 19.1.0
- react-dom 19.1.0
- react-element-to-jsx-string ^17.0.1
- react-hook-form ^7.62.0
- react-icons ^5.5.0
- react-leaflet ^5.0.0
- recharts ^3.1.2
- sonner ^2.0.7
- tailwind-merge ^3.3.1
- tailwindcss-animate ^1.0.7
- zod ^4.1.5

Desenvolvimento (devDependencies):

- @babel/generator ^7.22.5
- @babel/parser ^7.22.11
- @eslint/eslintrc ^3
- @tailwindcss/postcss ^4.1.12
- @types/leaflet ^1.9.20
- @types/node ^20
- @types/react ^19
- @types/react-dom ^19
- eslint ^9
- eslint-config-next 15.5.2
- fs-extra ^11.3.1
- glob ^11.0.3
- prettier ^3.6.2
- tailwindcss ^4.1.12
- typescript ^5

## Instalação

```powershell
# Instalar dependências
npm install
```

> Observação: O projeto não exige configuração obrigatória de variáveis de ambiente para rodar em desenvolvimento. A API base possui valor padrão.

## Execução

- Ambiente de desenvolvimento (hot reload)

```powershell
npm run dev
```

- Build de produção

```powershell
npm run build
```

- Servir build de produção

```powershell
npm start
```

### Docker (opcional)

- Build da imagem

```powershell
# Usando scripts do projeto
npm run docker:build

# OU, diretamente com Docker (nome da imagem: web-app-busca-pessoas-desaparecidas)
docker build -t web-app-busca-pessoas-desaparecidas .
```

- Executar o container localmente (porta 3000)

```powershell
# Usando scripts do projeto
npm run docker:run

# OU, diretamente com Docker
docker run -p 3000:3000 web-app-busca-pessoas-desaparecidas
```

- Subir via Docker Compose

```powershell
# Usando scripts do projeto
npm run docker:compose

# OU, diretamente com docker-compose
docker compose up --build
```

## Testes e qualidade

- Testes automatizados

```powershell
npm test
```

Observação: o script de testes atual é um placeholder (não há testes unitários implementados neste repositório).

- Verificação de tipos

```powershell
npm run type-check
```

- Lint

```powershell
npm run lint
```

- Lint com correção automática

```powershell
npm run lint:fix
```

## Variáveis de ambiente

As variáveis abaixo são opcionais para desenvolvimento. Em produção (Vercel ou Docker), configure conforme o ambiente de deploy.

- `NEXT_PUBLIC_API_BASE_URL` (opcional)
  - Padrão configurado em `next.config.ts`: `https://abitus-api.geia.vip/v1`

## Observações

- Versões principais:
  - Next.js 15
  - React 19
  - TypeScript 5
  - Tailwind CSS 4.1
  - Framer Motion 12
- Para dúvidas sobre execução ou ajustes de ambiente, entre em contato pelo LinkedIn informado acima.
