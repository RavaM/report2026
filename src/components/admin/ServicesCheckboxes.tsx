'use client'

import { CheckboxInput, useConfig, useField, usePayloadAPI } from '@payloadcms/ui'
import type { RelationshipFieldClientComponent } from 'payload'
import type { Service } from '@/payload-types'

const ServicesCheckboxes: RelationshipFieldClientComponent = ({ path, readOnly }) => {
  const { config } = useConfig()

  const { value, setValue, disabled, formProcessing, showError, errorMessage } = useField<
    Array<Service['id']>
  >({ path })

  const [{ data, isLoading, isError }] = usePayloadAPI(`${config.routes.api}/services`, {
    initialParams: {
      depth: 0,
      limit: 0,
      pagination: false,
      sort: 'title',
    },
  })

  const selected = value ?? []
  const services: Service[] = data?.docs ?? []

  function toggleService(id: Service['id']) {
    setValue(
      selected.includes(id)
        ? selected.filter((selectedId) => selectedId !== id)
        : [...selected, id],
    )
  }

  return (
    <fieldset
      disabled={readOnly || disabled || formProcessing}
      style={{ border: 0, padding: 0, margin: '0 0 24px' }}
    >
      <legend style={{ marginBottom: 12 }}>Services</legend>

      {isLoading && <p>Loading services…</p>}
      {isError && <p role="alert">Could not load services.</p>}

      {!isLoading && !isError && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 12,
          }}
        >
          {services.map((service) => (
            <CheckboxInput
              key={service.id}
              id={`${path}-${service.id}`}
              label={service.title}
              checked={selected.includes(service.id)}
              readOnly={readOnly || disabled || formProcessing}
              onToggle={() => toggleService(service.id)}
            />
          ))}

          {services.length === 0 && <p>Add services in the Services collection.</p>}
        </div>
      )}

      {showError && <p role="alert">{errorMessage}</p>}
    </fieldset>
  )
}

export default ServicesCheckboxes
