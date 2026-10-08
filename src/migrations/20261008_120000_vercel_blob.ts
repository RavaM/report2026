import { type MigrateDownArgs, type MigrateUpArgs, sql } from '@payloadcms/db-postgres'

// Add storage metadata to the existing Media table without changing media IDs.
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "prefix" varchar DEFAULT '';
    ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "_objectkey" varchar;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "media" DROP COLUMN IF EXISTS "_objectkey";
    ALTER TABLE "media" DROP COLUMN IF EXISTS "prefix";
  `)
}
