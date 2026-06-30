# CLAUDE.md

Este arquivo orienta o Claude Code (claude.ai/code) ao trabalhar neste repositório.

## O que é isso

DevFinder API — um backend Express + MongoDB/Mongoose (TypeScript) que cataloga canais e vídeos brasileiros de tecnologia no YouTube. Devs podem se registrar via GitHub OAuth, curtir/descurtir outros devs e seguir/ignorar canais para personalizar seu feed de vídeos. Um serviço auxiliar ("API placeholder", `APP_APIPLACEHOLDER_URL`) faz scraping do YouTube para metadados de canais e vídeos, que esta API ingere pelos endpoints `*RefreshController`.

## Comandos

- `npm run dev` — sobe o servidor com hot reload (`tsx --watch src/server.ts`), lê o `.env`
- `npm run build` — empacota com `tsup src` para `dist/`
- `npm start` — executa o servidor compilado (`node dist/server.js`)
- `npm test` — roda o Jest (arquivos `*.spec.ts`); atualmente não existem arquivos spec em `src/`
- `npm test -- path/to/file.spec.ts` — roda um único arquivo de teste
- `npm run doc` — regenera `swagger_output.json` a partir dos comentários de rota via `swagger-autogen` (`swagger.ts`), servido em `/v1/doc`

Requer um arquivo `.env` (copiar `.env.example`) com `MONGO_URI`, `APP_SECRET` (assinatura JWT), `GITHUB_CLIENT_ID`/`GITHUB_CLIENT_SECRET`, `APP_API_URL`, `APP_WEB_URL`, `APP_APIPLACEHOLDER_URL`.

Não há script de lint configurado no `package.json`; `.eslintrc.json` (airbnb-base + prettier) e `prettier.config.js` (aspas simples, trailing commas, arrow parens) existem e podem ser executados diretamente pelos binários `eslint`/`prettier` se necessário.

## Arquitetura

**Fluxo de requisição**: `src/server.ts` inicializa o Express, conecta o Mongoose, monta o Swagger UI em `/v1/doc` e registra todas as rotas em `/v1` a partir de `src/routes/index.ts`. Um handler de erro global no final de `server.ts` serializa erros lançados para JSON (depende de `express-async-errors` para que métodos `async` de controllers que lançam exceções se propaguem automaticamente — controllers não precisam de try/catch para erros do tipo "não encontrado" que devem retornar 500).

**Modelo de autenticação**: GitHub OAuth via Passport (`src/routes/socialLoginGithub.ts`) emite um JWT (`src/config/auth.ts`, `APP_SECRET`, validade 7 dias) contendo `{ id: devId }`. Dois middlewares o leem:
- `src/middlewares/auth.ts` — auth obrigatória, retorna 401 se ausente/inválido. Montado em `routes/index.ts` no meio da lista de rotas — tudo registrado *após* `routes.use(authMiddleware)` exige token; tudo antes é público.
- `src/middlewares/optionalAuth.ts` — popula `req.user` se um token válido estiver presente, mas nunca rejeita. Montado no início de `routes/index.ts` para que endpoints de listagem públicos (devs, vídeos, trending) possam personalizar resultados (ex.: excluir canais ignorados) quando um token for enviado.

`req.user.id` é tipado via declaração ambient em `src/@types/express.d.ts`.

**Modelos de domínio** (`src/models/*.ts`, schemas Mongoose puros, sem migrations):
- `Dev` — usuário registrado (criado a partir do perfil GitHub via `src/services/findOrCreateDev.ts`, que busca `https://api.github.com/users/:username` para preencher `name`/`bio`/`avatar` quando não fornecidos). Tem `likes`/`deslikes` (outros Devs) e `follow`/`ignore` (Channels) como arrays de ObjectId — esses arrays são mutados diretamente via `.push()`/`.splice()` + `.save()` nos controllers, em vez de atualizações atômicas com `$push`/`$pull`.
- `Channel` — um canal do YouTube, com `category`/`tags` usados para busca e o texto de descrição gerado automaticamente em `Description/*Controller`.
- `Video` — pertence a um `Channel` via ref `channel_id` e strings desnormalizadas `channel`/`channel_url` (mantidas em sincronia manualmente, não via population) — buscas em `VideoController.store` combinam nos campos disponíveis, incluindo um `alternativeLink` legado em `Channel`.

Os schemas de `Dev` e `Video` usam o plugin `mongoose-paginate-v2`; endpoints de listagem paginada seguem um shape consistente: `{ docs, total, itemsPerPage }`, construído com `.paginate(query, { sort: { createdAt: -1 }, limit: 30, page })`.

**Controllers** (`src/controllers/<Dominio>/<Nome>Controller.ts`) são objetos simples exportando handlers async `index`/`show`/`store`/`delete` — sem classes, sem controller base, sem camada de service/repository além de `findOrCreateDev`. As rotas se conectam diretamente a esses handlers em `src/routes/index.ts`, que também carrega comentários inline no estilo JSDoc do `swagger-autogen` (`// #swagger...`) por rota; mantenha-os sincronizados ao alterar shapes de request/response, pois `npm run doc` regenera `swagger_output.json` a partir deles.

Pares simétricos importantes ao editar um dos lados:
- `LikeController` / `DislikeController` (Dev-para-Dev)
- `FollowController` / `IgnoreController` (Dev-para-Channel)
- `ChannelController.store` / `ChannelRefreshController.store` — adição manual de canal único vs. sincronização em lote com o serviço de scraping, ambos fazem upsert de um `Channel` e tentam criar um `Dev` a partir do usuário GitHub vinculado ao canal.
- `VideoController.store` / `VideoRefreshController.store` — adição de vídeo único vs. sincronização em lote; o Refresh acessa os models `Video` e `Channel` diretamente (sem chamada HTTP interna) e distribui os resultados em `videosAdded`/`videosFounded`/`errors`.

`Description/FeedController` e `Description/CategoryController` não acessam o banco diretamente — chamam os próprios endpoints `/v1/channels` e `/v1/feed/trending` desta API via HTTP e renderizam textos legíveis em português (para descrições do YouTube), com hashtags derivadas das `tags` dos canais.

## Convenções / particularidades a preservar

- Aliases de path `@modules/*`, `@config/*`, `@shared/*` estão configurados em `tsconfig.json`/`jest.config.js`, mas apenas `config` existe atualmente sob `src/` — não assuma que os diretórios `modules`/`shared` existem.
- Imports de models Mongoose usam `require()` dentro de arquivos `.ts` (não `import`) em vários models — siga o estilo existente em cada arquivo em vez de converter tudo.
- Os tipos TS simples `TVideo`/`TChannel`/`TDev` são exportados junto a cada model Mongoose e reutilizados por controllers que chamam esta API via HTTP (ex.: `Description/*`, `TrendingController`) para tipar respostas do `axios`.
