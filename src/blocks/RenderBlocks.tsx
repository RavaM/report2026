import type { Page } from '@/payload-types'
import { Hero } from '@/blocks/Hero/Component'
import { Intro } from '@/blocks/Intro/Component'
import { ProjectsList } from '@/blocks/ProjectsList/Component'
import Outro from '@/blocks/Outro/Component'

type Props = {
  blocks: Page['layout']
  contentClassName?: string
}

export const RenderBlocks = ({ blocks, contentClassName }: Props) => {
  return (blocks ?? []).map((block, index) => {
    const key = block.id ?? index
    if (block.blockType === 'hero') return <Hero key={key} {...block} />
    if (block.blockType === 'outro') return <Outro key={key} {...block} />

    return (
      <div key={key} className={contentClassName}>
        <RenderContentBlock block={block} />
      </div>
    )
  })
}

const RenderContentBlock = ({
  block,
}: {
  block: Exclude<Page['layout'][number], { blockType: 'hero' | 'outro' }>
}) => {
  switch (block.blockType) {
    case 'intro':
      return <Intro {...block} />
    case 'projectsList':
      return <ProjectsList {...block} />
  }
}
