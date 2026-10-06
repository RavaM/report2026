import type { ProjectProps } from '@/components/Project/Project'
import type { Project } from '@/payload-types'

export function projectToProps(project: Project): ProjectProps {
  const [primary, secondary] = project.ctas
  const spoiler = project.spoiler
  const media = typeof spoiler?.image === 'object' ? spoiler.image : null

  return {
    title: project.title,
    color: project.color,
    textColor: project.textColor,
    text: project.description,
    services: (project.services ?? []).flatMap((service) =>
      typeof service === 'object' && service !== null ? [service.title] : [],
    ),
    cta: primary ? { url: primary.url, cta: primary.label } : undefined,
    cta2: secondary ? { url: secondary.url, cta: secondary.label } : undefined,
    numbers: project.statistics,
    quote: project.quote?.text?.trim()
      ? {
          ...project.quote,
          author: project.quote.author?.name?.trim() ? project.quote.author : undefined,
        }
      : undefined,
    gallery: (project.gallery ?? []).flatMap((image) =>
      typeof image === 'object' && image !== null && image.url
        ? [
            {
              url: image.url,
              width: image.width ?? 800,
              height: image.height ?? 600,
              type: image.mimeType?.startsWith('video/') ? ('video' as const) : ('image' as const),
            },
          ]
        : [],
    ),
    spoiler:
      media?.url && spoiler?.text
        ? {
            image: media.url,
            text: spoiler.text,
            type: media.mimeType?.startsWith('video/') ? 'video' : 'image',
            width: media.width ?? spoiler.width ?? 500,
            height: media.height ?? spoiler.height ?? 400,
          }
        : undefined,
  }
}
