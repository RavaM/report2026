import * as vercelBlob from './20261008_120000_vercel_blob'
import * as videoThumbnails from './20261008_140000_video_thumbnails'

export const migrations = [
  {
    up: vercelBlob.up,
    down: vercelBlob.down,
    name: '20261008_120000_vercel_blob',
  },
  {
    up: videoThumbnails.up,
    down: videoThumbnails.down,
    name: '20261008_140000_video_thumbnails',
  },
]
