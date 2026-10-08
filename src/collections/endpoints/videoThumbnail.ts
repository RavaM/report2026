import type { Endpoint } from 'payload'

export const videoThumbnail: Endpoint = {
  path: '/:id/video-thumbnail',
  method: 'get',
  handler: async (req) => {
    const id = req.routeParams?.id
    if (typeof id !== 'string' && typeof id !== 'number') {
      return new Response(null, { status: 404 })
    }
    const doc = await req.payload.findByID({
      collection: 'media',
      id,
      depth: 0,
      overrideAccess: false,
      req,
    })
    if (!doc.mimeType?.startsWith('video/') || !doc.videoThumbnail) {
      return new Response(null, { status: 404 })
    }
    const jpeg = doc.videoThumbnail.match(/^data:image\/jpeg;base64,([A-Za-z0-9+/]+=*)$/)?.[1]
    if (!jpeg) return new Response(null, { status: 404 })

    return new Response(new Uint8Array(Buffer.from(jpeg, 'base64')), {
      headers: {
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'public, max-age=0, must-revalidate',
      },
    })
  },
}
