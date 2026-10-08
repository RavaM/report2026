import type { CollectionAfterReadHook } from 'payload'

// Run after storage field hooks have resolved the public URLs. Payload's built-in
// thumbnailURL hook reads the original document, before Blob URLs are resolved.
export const setMediaThumbnail: CollectionAfterReadHook = ({ doc }) => {
  doc.thumbnailURL = doc.mimeType?.startsWith('video/')
    ? doc.videoThumbnail
      ? `/api/media/${doc.id}/video-thumbnail`
      : null
    : doc.sizes?.thumbnail?.url || doc.url || null

  return doc
}
