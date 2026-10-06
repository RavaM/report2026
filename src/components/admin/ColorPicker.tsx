'use client'

import { FieldLabel, useField } from '@payloadcms/ui'
import type { TextFieldClientComponent } from 'payload'

const ColorPicker: TextFieldClientComponent = ({ field, path, readOnly }) => {
  const { value, setValue, disabled, formProcessing, showError, errorMessage } = useField<string>({
    path,
  })

  const isDisabled = readOnly || disabled || formProcessing

  return (
    <div style={{ marginBottom: 24 }}>
      <FieldLabel label={field.label} path={path} required={field.required} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <input
          id={`field-${path}`}
          type="color"
          value={/^#[0-9a-f]{6}$/i.test(value ?? '') ? value : '#000000'}
          onChange={(event) => setValue(event.target.value)}
          disabled={isDisabled}
          aria-label={`${field.name} color picker`}
          style={{ width: 48, height: 36, cursor: 'pointer' }}
        />

        <input
          type="text"
          value={value ?? ''}
          onChange={(event) => setValue(event.target.value)}
          disabled={isDisabled}
          aria-label={`${field.name} hex value`}
          placeholder="#000000"
          maxLength={7}
          style={{ width: 110 }}
        />
      </div>

      {showError && <p role="alert">{errorMessage}</p>}
    </div>
  )
}

export default ColorPicker
