# 5A Design Report 2026

A Next.js website with Payload CMS and PostgreSQL, based on the Payload Website Template.

## Development

1. Copy `.env.example` to `.env` and configure `DATABASE_URL`, `PAYLOAD_SECRET`, and `PREVIEW_SECRET`.
2. Run `pnpm install`.
3. Run `pnpm dev`.
4. Open `http://localhost:3000/admin` and create your first admin user.
5. Create and publish a Pages document with the slug `home`, then open `http://localhost:3000`.

The homepage uses `src/app/(frontend)/[slug]/page.tsx`. It renders the layout of the published `home` page. Other page slugs use the same template and render their own layout. Missing pages return a 404. Content is managed manually in the admin panel.

Add Hero, Intro, Projects List, and Outro blocks to the `home` page layout in the admin panel and publish it. Projects List displays all published projects in creation order, including their populated services, buttons, galleries, quotes, statistics, and spoiler media. Outro is placed through the page layout and exposes its greeting, signature, team media, contact button, footer links, and copyright in the CMS. Hero and Outro render without the content padding.

The previous hardcoded page is preserved unchanged in `src/app/(frontend)/[slug]/home.fallback.tsx` for reference. It is not imported by the active page route.

## CMS structure

- **Users**: authentication and admin access.
- **Pages**: titles, slugs, layout fields, SEO metadata, drafts, and scheduled publishing. The configured layout blocks are Hero, Intro, Projects List, Outro, Content, Media, and Call To Action. The frontend renders these blocks in their saved order.
- **Projects**: report entries with descriptions, services, colors, buttons, quotes, statistics, and spoiler media, and an ordered media gallery. Projects support drafts.
- **Services**: reusable service labels linked to projects.
- **Media**: uploaded images, videos, and other assets.
- **Categories**: a taxonomy with nested document support.
- **Header and Footer**: global navigation and footer configuration.

Registered plugins provide SEO fields, nested categories, and form management. The form builder remains configured in the CMS, but the frontend form block has been removed.

Authenticated users can manage content. Public reads of Pages and Projects are limited to published documents. Services, Categories, and Media are publicly readable.

Pages support draft and live preview through the preview routes. Page, Header, and Footer changes trigger cache revalidation through their hooks. Publishing, unpublishing, or deleting a Project revalidates pages so Projects List blocks reflect those changes. Projects List only displays published projects, including during page preview.

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

### Vercel media storage

The Media collection uses Vercel Blob when `BLOB_READ_WRITE_TOKEN` is set.
Without the token, uploads are saved locally to `public/media`. That directory
is ignored by Git and is not persistent upload storage on Vercel.

1. In Vercel, create a **public** Blob store and connect it to this project.
   Ensure `BLOB_READ_WRITE_TOKEN` is available in the deployment environments.
2. Add the same token to your local `.env` to transfer the existing media.
   Keep the token server-only; it must not have a `NEXT_PUBLIC_` prefix.
3. Review the additive `20261008_120000_vercel_blob` migration, then run
   `pnpm payload migrate` against the existing deployment database. It adds
   `prefix` and `_objectkey` to the Media table. It assumes the existing CMS
   tables are already present; it is not an initial database migration.
4. Run `pnpm media:upload` to check the local file count, then
   `pnpm media:upload --upload` to copy the originals and all generated image
   sizes. It preserves filenames, skips existing files of the same size, and
   refuses to overwrite conflicts. It does not change CMS records or delete
   local files. Use an empty store to avoid unrelated filename collisions.
5. Deploy this code after the migration and transfer. Existing media IDs and
   relationships remain valid because the files keep their original names.

Client uploads are enabled so large original files can upload directly to Blob.
No production migration, transfer, or redeploy is performed automatically.

### CMS media previews

Image thumbnails use the URL resolved by the storage adapter after reading each
media record. This avoids pointing the admin library at the local file route
when files are stored in Blob.

For video thumbnails, run the additive `20261008_140000_video_thumbnails`
migration before deploying this version. In local development, Payload adds the
column through schema push. Open a saved video in Media, click **Generate video
preview**, then **Save**. The browser captures a small JPEG frame; it is stored
with the media record and served by `/api/media/:id/video-thumbnail`. Existing
videos need this step once. The source video must be accessible to the browser
and use a supported codec; public Vercel Blob permits frame capture through CORS.

Configure the environment variables and persistent media storage for your deployment, then run:

```sh
pnpm build
pnpm start
```

The build needs access to the configured database to generate page routes and metadata.
