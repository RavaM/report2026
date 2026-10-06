import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { Project } from '@/payload-types'
import { ProjectsList } from '@/blocks/ProjectsList/Component'
import { projectToProps } from '@/blocks/ProjectsList/projectToProps'
import {
  revalidateProject,
  revalidateProjectDelete,
} from '@/collections/Projects/hooks/revalidateProject'
import { revalidatePath } from 'next/cache'

const { find } = vi.hoisted(() => ({ find: vi.fn() }))
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }))
vi.mock('@payload-config', () => ({ default: {} }))
vi.mock('payload', () => ({ getPayload: vi.fn(async () => ({ find })) }))
vi.mock('@/components/Project', () => ({ default: () => null }))

const project = (id: number): Project => ({
  id,
  title: `Project ${id}`,
  color: '#B6050F',
  textColor: '#FFFFFF',
  ctas: [{ label: 'Visit', url: 'https://example.com' }],
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  _status: 'published',
})

describe('ProjectsList', () => {
  beforeEach(() => {
    find.mockReset()
    vi.mocked(revalidatePath).mockClear()
  })

  it('renders projects across all result pages using public published access', async () => {
    find.mockResolvedValueOnce({ docs: [project(1)], hasNextPage: true })
    find.mockResolvedValueOnce({ docs: [project(2)], hasNextPage: false })

    const elements = await ProjectsList({ blockType: 'projectsList' })
    expect(elements.map((element) => element.props.title)).toEqual(['Project 1', 'Project 2'])
    expect(find).toHaveBeenCalledTimes(2)
    expect(find.mock.calls[0][0]).toMatchObject({
      collection: 'projects',
      depth: 1,
      page: 1,
      sort: 'createdAt',
      draft: false,
      overrideAccess: false,
      where: { _status: { equals: 'published' } },
    })
    expect(find.mock.calls[1][0].page).toBe(2)
  })

  it('renders no project cards when no published projects exist', async () => {
    find.mockResolvedValueOnce({ docs: [], hasNextPage: false })
    expect(await ProjectsList({ blockType: 'projectsList' })).toEqual([])
  })

  it('maps populated services and media, skips unresolved IDs, and hides empty quotes', () => {
    const doc: Project = {
      ...project(1),
      services: [99, { id: 2, title: 'Design', createdAt: '', updatedAt: '' }],
      gallery: [
        99,
        { id: 3, url: '/video.mp4', mimeType: 'video/mp4', createdAt: '', updatedAt: '' },
      ],
      quote: { text: '  ' },
      spoiler: { image: 99, text: null },
    }
    const props = projectToProps(doc)
    expect(props.services).toEqual(['Design'])
    expect(props.gallery).toEqual([{ url: '/video.mp4', type: 'video', width: 800, height: 600 }])
    expect(props.quote).toBeUndefined()
    expect(props.spoiler).toBeUndefined()
    expect(props.cta).toEqual({ url: 'https://example.com', cta: 'Visit' })
  })
  it('maps populated spoiler media with fallback video dimensions', () => {
    const text = {
      root: {
        type: 'root',
        children: [],
        direction: null,
        format: '' as const,
        indent: 0,
        version: 1,
      },
    }
    const props = projectToProps({
      ...project(1),
      spoiler: {
        image: { id: 3, url: '/spoiler.mp4', mimeType: 'video/mp4', createdAt: '', updatedAt: '' },
        text,
        width: 700,
        height: 500,
      },
    })
    expect(props.spoiler).toEqual({
      image: '/spoiler.mp4',
      type: 'video',
      text,
      width: 700,
      height: 500,
    })
  })

  it('revalidates every page when a published project is unpublished', () => {
    const doc = { ...project(1), _status: 'draft' as const }
    revalidateProject({ doc, previousDoc: project(1), req: { context: {} } } as Parameters<
      typeof revalidateProject
    >[0])
    expect(revalidatePath).toHaveBeenCalledWith('/', 'layout')
  })

  it('respects the revalidation opt-out when projects are deleted', () => {
    revalidateProjectDelete({
      doc: project(1),
      req: { context: { disableRevalidate: true } },
    } as unknown as Parameters<typeof revalidateProjectDelete>[0])
    expect(revalidatePath).not.toHaveBeenCalled()
  })
})
