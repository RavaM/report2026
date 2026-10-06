import React from 'react'

import type { Page } from '@/payload-types'

import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ContentBlock } from '@/blocks/Content/Component'

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
}> = ({ blocks }) => {
  if (!Array.isArray(blocks) || blocks.length === 0) return null

  return (
    <>
      {blocks.map((block, index) => {
        switch (block.blockType) {
          case 'content':
            return (
              <div className="my-16" key={index}>
                <ContentBlock {...block} />
              </div>
            )
          case 'cta':
            return (
              <div className="my-16" key={index}>
                <CallToActionBlock {...block} />
              </div>
            )
          default:
            return null
        }
      })}
    </>
  )
}
