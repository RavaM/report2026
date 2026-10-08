import { createReadStream } from 'node:fs'
import { readdir, stat } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { BlobNotFoundError, head, put } from '@vercel/blob'
import dotenv from 'dotenv'

dotenv.config()

const upload = process.argv.includes('--upload')
const directory = new URL('../public/media/', import.meta.url)
const files = (await readdir(directory, { withFileTypes: true }))
  .filter((entry) => entry.isFile() && !entry.name.startsWith('.'))
  .map((entry) => entry.name)
  .sort()

console.log(`${files.length} media files in public/media (including thumbnails).`)

if (!upload) {
  console.log('Dry run. Set BLOB_READ_WRITE_TOKEN in .env, then run pnpm media:upload --upload.')
} else {
  const token = process.env.BLOB_READ_WRITE_TOKEN
  if (!token) throw new Error('Missing BLOB_READ_WRITE_TOKEN in .env.')

  for (const filename of files) {
    const file = new URL(encodeURIComponent(filename), directory)
    const local = await stat(file)
    let existing
    try {
      existing = await head(filename, { token })
    } catch (error) {
      if (!(error instanceof BlobNotFoundError)) throw error
    }

    if (existing) {
      if (existing.size !== local.size) {
        throw new Error(`Blob ${filename} already exists with a different size. Resolve the conflict before retrying.`)
      }
      console.log(`Skip existing: ${filename}`)
      continue
    }

    await put(filename, createReadStream(fileURLToPath(file)), {
      access: 'public',
      addRandomSuffix: false,
      allowOverwrite: false,
      token,
    })
    console.log(`Uploaded: ${filename}`)
  }
  console.log('Media copied to Blob. Local files and CMS records were retained.')
}
