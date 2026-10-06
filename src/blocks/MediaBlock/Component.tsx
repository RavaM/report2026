import type { MediaBlock as MediaBlockProps } from '@/payload-types'
import Media from '@/components/Media'
import RichText from '@/components/RichText'

export const MediaBlock = ({ media }: MediaBlockProps) => {
  if (typeof media !== 'object' || media === null || !media.url) return null

  return (
    <div className="container my-16">
      <Media
        url={media.url}
        alt={media.alt ?? ''}
        type={media.mimeType?.startsWith('video/') ? 'video' : 'image'}
        width={media.width ?? 800}
        height={media.height ?? 600}
        className="w-full"
      />
      {media.caption && <RichText data={media.caption} enableGutter={false} />}
    </div>
  )
}
