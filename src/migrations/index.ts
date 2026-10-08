import * as vercelBlob from './20261008_120000_vercel_blob'

export const migrations = [
  {
    up: vercelBlob.up,
    down: vercelBlob.down,
    name: '20261008_120000_vercel_blob',
  },
]
