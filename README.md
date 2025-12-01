Nuxt + **TypeScript** step-by-step with hands-on lessons, commands, short code examples, and exercises you can do right now. I’ll target the modern Nuxt ecosystem (Nuxt 3 / Nuxt 4 family) and point out where things are changing (Nuxt 4.2 / Nuxt 5). Sources for the most important facts are included so you can follow the official docs as versions shift. ([Nuxt][1])

---

# Quick orientation (what you need)

* Node 18+ (LTS recommended) and npm or pnpm/yarn.
* Basic Vue 3 + Composition API knowledge helps but I’ll show the patterns.
* We’ll use the official CLI `nuxi` to scaffold projects.

Important: Nuxt is now fully typed and provides excellent TypeScript DX; new releases keep improving TS support (Nuxt 4.2 has TypeScript DX improvements and Nuxt 5 is evolving). Use the official docs for the exact API for your Nuxt version. ([Nuxt][2])

---

# Learning path (8 lessons — do them in order)

1. Setup & scaffold a TypeScript Nuxt app — minimal working app
2. Pages, routing & layouts (file-based routing)
3. Components + auto-imports + props typing
4. Composables & Composition API with TypeScript generics
5. Data fetching (useAsyncData / useFetch) & SSR vs CSR
6. Server routes (server/api), server-side logic & Nitro functions (TypeScript)
7. Plugins, modules, middleware, and runtime config (typed)
8. Testing, linting, building and deployment (Vercel/Netlify/Node)

I’ll give each lesson: goals, commands, example code, and a tiny exercise.

---

# Lesson 1 — Scaffold a Nuxt + TypeScript app (20–30 min)

Goal: create a working Nuxt app with TypeScript.

Commands

```bash
# scaffold
npx nuxi init my-nuxt-app
cd my-nuxt-app

# install deps (npm example)
npm install

# start dev server
npm run dev
```

Notes:

* `nuxi init` creates a Nuxt app (Nuxt 3/4 style). The project is TypeScript-ready by default in modern Nuxt. If you need explicit TS packages older guides mention `@nuxt/typescript-build` — but current Nuxt has built-in typing. See docs. ([Nuxt][2])

Minimal `pages/index.vue` using TypeScript + `<script setup>`:

```vue
<template>
  <h1>{{ title }}</h1>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const title = ref<string>('Welcome to Nuxt + TypeScript')
</script>
```

Exercise: scaffold and run dev, open `http://localhost:3000` and confirm the page shows the title.

---

# Lesson 2 — Pages, routing & layouts (30–45 min)

Goal: learn file-based routing and layouts.

Create pages:

```
pages/
  index.vue         -> /
  about.vue         -> /about
  blog/[slug].vue   -> dynamic route /blog/:slug
```

Example dynamic page (`pages/blog/[slug].vue`):

```vue
<template>
  <div>
    <h2>Post: {{ slug }}</h2>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
const route = useRoute()
const slug = route.params.slug as string
</script>
```

Layouts (`layouts/default.vue`):

```vue
<template>
  <header>Top nav</header>
  <NuxtPage />
  <footer>Footer</footer>
</template>
```

Exercise: add `about.vue` and a `blog/[slug].vue`, visit routes, test dynamic routing.

---

# Lesson 3 — Components, auto-imports & prop typing (20–30 min)

Goal: create typed components and use Nuxt’s auto-imported components.

Create a typed component `components/UserCard.vue`:

```vue
<template>
  <div>
    <h3>{{ user.name }}</h3>
    <p>{{ user.email }}</p>
  </div>
</template>

<script setup lang="ts">
interface User { id: number; name: string; email?: string }
const props = defineProps<{ user: User }>()
</script>
```

Nuxt auto-imports components placed in `components/` — you can use `<UserCard />` directly in pages.

Exercise: create a `UserCard` and render it from `pages/index.vue` with typed sample data.

---

# Lesson 4 — Composables & Composition API (30–45 min)

Goal: write reusable logic with TypeScript generics.

Create `composables/useCounter.ts`:

```ts
import { ref } from 'vue'

export function useCounter(initial = 0) {
  const count = ref<number>(initial)
  function inc() { count.value++ }
  function dec() { count.value-- }
  return { count, inc, dec }
}
```

Use it in a page:

```vue
<script setup lang="ts">
import { useCounter } from '~/composables/useCounter'
const { count, inc } = useCounter(5)
</script>
```

Exercise: create a composable that fetches JSON and returns typed data using generics:

```ts
export function useFetchTyped<T>(url: string) {
  // returns Promise<T> or a ref<T | null>
}
```

---

# Lesson 5 — Data fetching: `useAsyncData` / `useFetch` (45 min)

Goal: fetch data safely with SSR and TypeScript.

Example (fetch posts from an API):

```vue
<script setup lang="ts">
interface Post { id: number; title: string; body: string }

const { data: posts, pending, error } = await useAsyncData<Post[]>(
  'posts',
  () => $fetch('https://jsonplaceholder.typicode.com/posts')
)
</script>

<template>
  <div v-if="pending">Loading...</div>
  <div v-if="error">Error</div>
  <ul v-else>
    <li v-for="p in posts" :key="p.id">{{ p.title }}</li>
  </ul>
</template>
```

Notes:

* `useAsyncData` runs on server for SSR and hydrates on client; types flow through generics.
* For client-only fetches use `useFetch` or `useLazyAsyncData`. See docs for nuances. ([Nuxt][2])

Exercise: implement a typed `useAsyncData` call for posts and create a `/posts` page.

---

# Lesson 6 — Server routes (server/api) & Nitro (45–60 min)

Goal: write server-side endpoints within the Nuxt app using TypeScript.

Create `server/api/hello.ts`:

```ts
import { defineEventHandler } from 'h3'

export default defineEventHandler((event) => {
  return { message: 'Hello from server api', time: new Date().toISOString() }
})
```

Fetch from the client:

```ts
const { data } = await useFetch('/api/hello') // returns typed any by default
```

You can type responses:

```ts
type Hello = { message: string; time: string }
const { data } = await useFetch<Hello>('/api/hello')
```

Server routes are the recommended place for backend logic inside a Nuxt app (Nitro powers them). ([Medium][3])

Exercise: write a `POST /api/echo` that accepts JSON and replies. Test with the browser or curl.

---

# Lesson 7 — Plugins, modules, middleware, runtime config (45 min)

Goal: add global plugins and typed runtime config.

Example plugin to add a global helper (`plugins/my-plugin.ts`):

```ts
export default defineNuxtPlugin((nuxtApp) => {
  return {
    provide: {
      hello: (name = 'Dev') => `Hello ${name}`
    }
  }
})
```

Use it in components: `const { $hello } = useNuxtApp()` then `$hello('Dhanur')`.

Typed runtime config (`nuxt.config.ts`):

```ts
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '/api'
    }
  }
})
```

Access typed config: `const config = useRuntimeConfig(); const base = config.public.apiBase as string`

Exercise: create a plugin that injects a typed API client.

---

# Lesson 8 — Testing, linting, build & deploy (1–2 hours)

Goal: get production builds and CI-ready.

Suggested tools:

* Unit tests: Vitest + @vue/test-utils (works well with TS)
* E2E: Playwright or Cypress
* Linting: ESLint + `.eslintrc` + TypeScript plugin
* Deployment: Nuxt apps can be deployed as SSR (Node) or static on platforms (Vercel, Netlify). Nitro makes serverless builds simple. See Nuxt docs for deploy workflows. ([Nuxt][4])

Basic build:

```bash
npm run build
npm run start
```

Exercise: add a simple Vitest test for a composable.

---

# Extra: Useful commands & config snippets

`nuxt.config.ts` (basic)

```ts
export default defineNuxtConfig({
  typescript: {
    strict: true
  },
  modules: [],
  css: ['~/assets/css/main.css']
})
```

`tsconfig.json` (nuxt usually generates a good default; ensure `strict: true` if you want stricter checks)

```json
{
  "extends": "./.nuxt/tsconfig.json",
  "compilerOptions": {
    "strict": true
  }
}
```

---

# Recommended learning schedule (4 weeks)

* Week 1: Lessons 1–3 (scaffold + pages + components) — build a small blog skeleton
* Week 2: Lessons 4–5 (composables + data fetching) — integrate external API
* Week 3: Lesson 6–7 (server routes + plugins + auth) — add a simple auth flow or API layer
* Week 4: Testing & deployment — add tests, CI, and deploy to Vercel/Netlify

---

# Further reading & resources

* Official Nuxt docs (TypeScript & config) — a must-read. ([Nuxt][2])
* Nuxt blog / release notes for latest changes (Nuxt 4.2 and TypeScript DX). ([Nuxt][1])
* Guides and tutorials (courses and community tutorials) for real projects. ([masteringnuxt.com][5])

Note: Nuxt is actively evolving — Nuxt 4.2 brought improved TypeScript support and Nuxt 5 / Nitro 3 are on the horizon, so watch release notes if you plan long-term projects. ([Nuxt][1])

---

# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
