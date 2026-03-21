# Raízes — E-commerce de Luxo

Site de moda de luxo construído com **Next.js 15**, **Tailwind CSS v4**, **Supabase** e **Lucide React**.

## Stack

| Camada       | Tecnologia              |
| ------------ | ----------------------- |
| Framework    | Next.js 15 (App Router) |
| Estilização  | Tailwind CSS v4         |
| Ícones       | Lucide React            |
| Backend / DB | Supabase (PostgreSQL)   |
| Auth         | Supabase Auth           |
| Storage      | Supabase Storage        |
| Linguagem    | TypeScript              |

## Estrutura de Pastas

```
raizes/
├── app/                    # App Router (páginas e layouts)
│   ├── globals.css         # Estilos globais + utilitários de marca
│   ├── layout.tsx          # Root layout (fontes, metadata)
│   └── page.tsx            # Home page
├── components/             # Componentes React reutilizáveis
│   ├── ui/                 # Primitivos de UI (Button, Input, etc.)
│   ├── layout/             # Navbar, Footer, etc.
│   └── product/            # Cards, grids de produtos
├── hooks/                  # Custom React hooks
│   └── useUser.ts          # Hook de autenticação
├── lib/                    # Lógica de negócio e utilitários
│   ├── supabase/
│   │   ├── client.ts       # Supabase client (browser)
│   │   ├── server.ts       # Supabase client (servidor)
│   │   └── middleware.ts   # Supabase + Next.js middleware
│   ├── queries/
│   │   ├── products.ts     # Queries de produtos
│   │   └── orders.ts       # Queries de pedidos
│   └── utils.ts            # Formatação (moeda, datas, slugs)
├── types/
│   └── database.types.ts   # Tipos TypeScript do schema Supabase
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql  # Schema completo + RLS
├── middleware.ts            # Next.js middleware (auth)
├── tailwind.config.ts       # Paleta de luxo personalizada
└── .env.local               # Variáveis de ambiente
```

## Banco de Dados (Supabase)

### Tabelas

| Tabela        | Descrição                             |
| ------------- | ------------------------------------- |
| `categories`  | Categorias de produtos                |
| `products`    | Catálogo com status (draft/published) |
| `orders`      | Pedidos dos usuários                  |
| `order_items` | Itens individuais de cada pedido      |

### Rodando a migração

1. Acesse o **SQL Editor** no dashboard do Supabase
2. Execute o arquivo `supabase/migrations/001_initial_schema.sql`
3. Ou use o Supabase CLI:

```bash
npx supabase db push
```

## Configuração

### 1. Variáveis de Ambiente

Copie `.env.example` para `.env.local` e preencha:

```env
NEXT_PUBLIC_SUPABASE_URL=https://dvzoitubgjhzvfxochzv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key
```

> As chaves estão no painel do Supabase: **Settings → API**

### 2. Instalar dependências

```bash
npm install
```

### 3. Rodar em desenvolvimento

```bash
npm run dev
```

### 4. Regenerar tipos TypeScript do banco

```bash
npm run db:types
```

## Design System

### Paleta de Cores

| Token      | Hex       | Uso                     |
| ---------- | --------- | ----------------------- |
| `obsidian` | `#0A0A0A` | Preto principal, textos |
| `ivory`    | `#F8F5F0` | Background principal    |
| `linen`    | `#E8DFD0` | Seções alternadas       |
| `stone-*`  | família   | Cinzas para UI          |
| `gold`     | `#C8A96E` | Detalhes premium        |

### Fontes

- **Playfair Display** — Serifada elegante, títulos e headlines
- **Inter** — Sans-serif premium, corpo de texto
- **Cormorant Garamond** — Editorial, citações e destaques
