import { describe, expect, it, vi } from 'vitest'
import { setMediaThumbnail } from '@/collections/hooks/setMediaThumbnail'
import { videoThumbnail } from '@/collections/endpoints/videoThumbnail'

describe('media thumbnails', () => {
  const read = (doc: Record<string, unknown>) =>
    setMediaThumbnail({ doc } as Parameters<typeof setMediaThumbnail>[0])

  it('replaces the broken local thumbnail route with the resolved Blob URL', () => {
    const doc = {
      mimeType: 'image/png',
      thumbnailURL: '/api/media/file/preview.png',
      url: 'https://store.public.blob.vercel-storage.com/original.png',
      sizes: { thumbnail: { url: 'https://store.public.blob.vercel-storage.com/preview.png' } },
    }
    expect(read(doc).thumbnailURL).toBe(doc.sizes.thumbnail.url)
  })

  it('keeps local uploads and images without a generated size visible', () => {
    expect(read({ mimeType: 'image/svg+xml', url: '/api/media/file/icon.svg' }).thumbnailURL).toBe(
      '/api/media/file/icon.svg',
    )
  })

  it('provides a JPEG endpoint only for videos with a saved preview', () => {
    expect(
      read({ id: 16, mimeType: 'video/mp4', videoThumbnail: 'data:image/jpeg;base64,/9j/' })
        .thumbnailURL,
    ).toBe('/api/media/16/video-thumbnail')
    expect(read({ id: 16, mimeType: 'video/mp4' }).thumbnailURL).toBeNull()
  })

  it('serves the saved JPEG and enforces media read access', async () => {
    const findByID = vi
      .fn()
      .mockResolvedValue({ mimeType: 'video/mp4', videoThumbnail: 'data:image/jpeg;base64,/9j/' })
    const req = { routeParams: { id: '16' }, payload: { findByID } } as unknown as Parameters<
      typeof videoThumbnail.handler
    >[0]
    const response = await videoThumbnail.handler(req)
    expect(response.status).toBe(200)
    expect(response.headers.get('Content-Type')).toBe('image/jpeg')
    expect(new Uint8Array(await response.arrayBuffer())).toEqual(new Uint8Array([255, 216, 255]))
    expect(findByID).toHaveBeenCalledWith(
      expect.objectContaining({ overrideAccess: false, req, depth: 0 }),
    )
  })

  it('returns 404 when a video has no preview', async () => {
    const req = {
      routeParams: { id: '16' },
      payload: { findByID: vi.fn().mockResolvedValue({ mimeType: 'video/mp4' }) },
    } as unknown as Parameters<typeof videoThumbnail.handler>[0]
    expect((await videoThumbnail.handler(req)).status).toBe(404)
  })
})
