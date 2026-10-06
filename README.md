# 5A Design Report 2026

A Next.js website with Payload CMS and PostgreSQL, based on the Payload Website Template.

## Development

1. Copy `.env.example` to `.env` and configure `DATABASE_URL`, `PAYLOAD_SECRET`, and `PREVIEW_SECRET`.
2. Run `pnpm install`.
3. Run `pnpm dev`.
4. Open `http://localhost:3000/admin` and create your first admin user.
5. Create and publish a Pages document with the slug `home`, then open `http://localhost:3000`.

The homepage uses `src/app/(frontend)/[slug]/page.tsx`. It looks up the published `home` page and reads the first published project. Other page slugs use the same template. Content is managed manually in the admin panel.

## CMS structure

- **Users**: authentication and admin access.
- **Pages**: titles, slugs, layout fields, SEO metadata, drafts, and scheduled publishing. The configured layout blocks are Content, Media, and Call To Action. The current frontend template renders the report directly rather than using the page layout renderer; that renderer currently supports Content and Call To Action.
- **Projects**: report entries with descriptions, services, colors, buttons, quotes, statistics, and spoiler media. Projects support drafts.
- **Services**: reusable service labels linked to projects.
- **Media**: uploaded images, videos, and other assets.
- **Categories**: a taxonomy with nested document support.
- **Header and Footer**: global navigation and footer configuration.

Registered plugins provide SEO fields, nested categories, and form management. The form builder remains configured in the CMS, but the frontend form block has been removed.

Authenticated users can manage content. Public reads of Pages and Projects are limited to published documents. Services, Categories, and Media are publicly readable.

Pages support draft and live preview through the preview routes. Page, Header, and Footer changes trigger cache revalidation through their hooks. Project data is queried by the frontend template; Projects currently have no revalidation hooks.

## Generated files

After changing collection or field configuration, run:

```sh
pnpm generate:types
```

After changing admin component registrations, run:

```sh
pnpm generate:importmap
```

Do not edit `src/payload-types.ts` or the admin import map manually. The Payload development reference is in `.agents/skills/payload/`.

## Validation

```sh
pnpm exec tsc --noEmit --incremental false
pnpm lint
pnpm test:int
pnpm test:e2e
```

Integration tests require the configured database. End-to-end tests require the application and its configured database. The frontend smoke test still contains template-specific title and heading expectations; update those to match the report before using it as a release check.

## Sitemaps

`/pages-sitemap.xml` lists published Pages and maps the `home` slug to `/`. The build's `next-sitemap` step generates sitemap and robots files using `NEXT_PUBLIC_SERVER_URL` or the configured deployment URL.

## PostgreSQL migrations

Development uses the PostgreSQL adapter's schema push behavior. Use a local development database for schema changes.

For production schema changes, create and review a migration:

```sh
pnpm payload migrate:create
```

Run pending migrations against the intended deployment database before starting the application:

```sh
pnpm payload migrate
```

## Production

Configure the environment variables and persistent media storage for your deployment, then run:

```sh
pnpm build
pnpm start
```

The build needs access to the configured database to generate page routes and metadata.
