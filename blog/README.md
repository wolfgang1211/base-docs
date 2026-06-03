# Base engineering blog

This workspace adds a technical blog to the docs repository using Astro, MDX, and React islands.

It is designed for engineering posts that need both long-form Markdown and interactive client-side components such as charts, sandboxes, and data explorers.

The scaffold currently ships with example posts so engineers can see the full pattern end to end before writing additional posts.

## Why this lives in `blog/`

The public docs site is powered by Mintlify. Mintlify supports MDX-style content and embedded snippets, but it does not use Astro island directives like `client:visible`.

This workspace gives you:

- Markdown-first authoring with `.mdx`
- React components inside posts
- Astro hydration directives such as `client:visible`, `client:idle`, and `client:load`
- A content collection for typed frontmatter
- A starter script for creating new posts quickly

## Local development

Install dependencies:

```bash
npm install
```

Run the blog locally:

```bash
npm run dev
```

Run a type/content check:

```bash
npm run check
```

Build production output:

```bash
npm run build
```

## Create a new post

Generate a post from the template:

```bash
npm run new-post -- --title "How we tuned batch posting" --author "Jane Doe"
```

You can also pass a custom slug and description:

```bash
npm run new-post -- --slug protocol/batch-posting --title "How we tuned batch posting" --description "An inside look at the telemetry, bottlenecks, and rollout." --author "Jane Doe" --role "Protocol engineer"
```

This creates a new file under `src/content/posts/`.

## Authoring model

Posts live in `src/content/posts/` and use MDX.

The repository includes example posts already:

- `src/content/posts/designing-interactive-l2-posts.mdx`
- `src/content/posts/scaling-an-l2-evm-chain.mdx`

The homepage automatically lists published example posts from the content collection.

Inside a post, import a React component and hydrate it only when visible:

```mdx
import ThroughputExplorer from '../../components/widgets/ThroughputExplorer';

## Interactive model

<ThroughputExplorer client:visible />
```

## Structure

```text
blog/
├── scripts/
│   └── new-post.mjs
├── src/
│   ├── components/
│   │   └── widgets/
│   ├── content/
│   │   └── posts/
│   ├── layouts/
│   ├── pages/
│   └── styles/
└── templates/
    └── post-template.mdx
```

## Deployment note

The Astro config is set up with `base: '/blog'` so the app is ready to be mounted at `/blog` behind the main docs site.

If you deploy it somewhere else first, adjust `site` and `base` in `astro.config.mjs`.
