import React from 'react'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import VideoThumbnail from '@/components/admin/VideoThumbnail'

const { setValue, data } = vi.hoisted(() => ({
  setValue: vi.fn(),
  data: { mimeType: 'video/mp4', url: 'https://store.public.blob.vercel-storage.com/video.mp4' },
}))
vi.mock('@payloadcms/ui', () => ({
  FieldLabel: () => null,
  useDocumentInfo: () => ({ data }),
  useField: () => ({ value: '', setValue }),
}))

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  setValue.mockReset()
})

describe('video preview generator', () => {
  it('captures a frame into the form field so Save persists the preview', async () => {
    const createElement = document.createElement.bind(document)
    let video: HTMLVideoElement | undefined
    vi.spyOn(document, 'createElement').mockImplementation((tag, options) => {
      const element = createElement(tag, options)
      if (tag === 'video') {
        video = element as HTMLVideoElement
        Object.defineProperties(video, {
          videoWidth: { value: 640 },
          videoHeight: { value: 360 },
          duration: { value: 2 },
          src: { set: () => queueMicrotask(() => element.dispatchEvent(new Event('loadeddata'))) },
          currentTime: {
            set: () => queueMicrotask(() => element.dispatchEvent(new Event('seeked'))),
          },
        })
        video.load = vi.fn()
      }
      return element
    })
    const drawImage = vi.fn()
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
      drawImage,
    } as unknown as CanvasRenderingContext2D)
    vi.spyOn(HTMLCanvasElement.prototype, 'toDataURL').mockReturnValue(
      'data:image/jpeg;base64,/9j/',
    )
    render(
      React.createElement(VideoThumbnail, {
        field: { name: 'videoThumbnail' },
        path: 'videoThumbnail',
      } as React.ComponentProps<typeof VideoThumbnail>),
    )

    fireEvent.click(screen.getByRole('button', { name: 'Generate video preview' }))
    await waitFor(() => expect(setValue).toHaveBeenCalledWith('data:image/jpeg;base64,/9j/'))
    expect(video?.crossOrigin).toBe('anonymous')
    expect(drawImage).toHaveBeenCalledWith(video, 0, 0, 300, 169)
  })

  it('does not permit generating a preview in a read-only form', () => {
    render(
      React.createElement(VideoThumbnail, {
        field: { name: 'videoThumbnail' },
        path: 'videoThumbnail',
        readOnly: true,
      } as React.ComponentProps<typeof VideoThumbnail>),
    )
    expect((screen.getByRole('button') as HTMLButtonElement).disabled).toBe(true)
  })
})
