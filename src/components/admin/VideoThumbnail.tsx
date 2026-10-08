'use client'

import { FieldLabel, useDocumentInfo, useField } from '@payloadcms/ui'
import type { TextFieldClientComponent } from 'payload'
import { useState } from 'react'

const VideoThumbnail: TextFieldClientComponent = ({ field, path, readOnly }) => {
  const { data } = useDocumentInfo()
  const { value, setValue, disabled, formProcessing } = useField<string>({ path })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  if (!data?.mimeType?.startsWith('video/')) return null

  const generate = async () => {
    setBusy(true)
    setError('')
    const video = document.createElement('video')
    const timeout = window.setTimeout(() => {
      video.dispatchEvent(new Event('error'))
    }, 20000)

    try {
      video.crossOrigin = 'anonymous'
      video.muted = true
      video.playsInline = true
      video.preload = 'auto'

      await new Promise<void>((resolve, reject) => {
        video.onerror = () =>
          reject(
            new Error(
              'Could not load the video. Check that its URL is accessible and the video format is supported.',
            ),
          )
        video.onloadeddata = () => {
          const time = Math.min(0.5, Number.isFinite(video.duration) ? video.duration / 2 : 0)
          if (time > 0) video.currentTime = time
          else resolve()
        }
        video.onseeked = () => resolve()
        video.src = data.url
      })

      const canvas = document.createElement('canvas')
      canvas.width = Math.min(300, video.videoWidth)
      canvas.height = Math.max(1, Math.round((canvas.width * video.videoHeight) / video.videoWidth))
      const context = canvas.getContext('2d')
      if (!context || !video.videoWidth) throw new Error('Could not read a frame from this video.')
      context.drawImage(video, 0, 0, canvas.width, canvas.height)
      setValue(canvas.toDataURL('image/jpeg', 0.8))
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not generate the preview.')
    } finally {
      window.clearTimeout(timeout)
      video.removeAttribute('src')
      video.load()
      setBusy(false)
    }
  }

  return (
    <div style={{ marginBottom: 24 }}>
      <FieldLabel label={field.label} path={path} />
      {value && (
        <img
          src={value}
          alt="Video preview"
          style={{ display: 'block', maxWidth: 300, maxHeight: 200, marginBottom: 12 }}
        />
      )}
      <button
        type="button"
        disabled={readOnly || disabled || formProcessing || busy || !data.url}
        onClick={generate}
      >
        {busy
          ? 'Generating preview…'
          : value
            ? 'Regenerate video preview'
            : 'Generate video preview'}
      </button>
      <p>
        Generate a frame preview, then save this media item to show it in the media library and
        pickers.
      </p>
      {error && <p role="alert">{error}</p>}
    </div>
  )
}

export default VideoThumbnail
