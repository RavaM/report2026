import { Banner } from '@payloadcms/ui/elements/Banner'
import React from 'react'

import './index.scss'

const baseClass = 'before-dashboard'

const BeforeDashboard: React.FC = () => {
  return (
    <div className={baseClass} lang="it">
      <Banner className={`${baseClass}__banner`} type="success">
        <h4>Report 2026 · Guida rapida</h4>
      </Banner>
      <ol className={`${baseClass}__instructions`}>
        <li>
          <a href="/admin/collections/media">Media</a>: carica immagini e video, compila Alt e
          riutilizza i file già presenti.
        </li>
        <li>
          <a href="/admin/collections/services">Services</a>: prepara i servizi da associare ai
          progetti, evitando duplicati.
        </li>
        <li>
          <a href="/admin/collections/projects">Projects</a>: inserisci titolo, descrizione,
          servizi, gallery, colori e 1–2 pulsanti con testo e URL. Quote, Numbers e Nel 2026 sono
          facoltativi.
        </li>
        <li>
          <a href="/admin/collections/pages">Pages</a>: completa Hero → Intro → Projects List →
          Outro e SEO. Mantieni lo slug <strong>homepage</strong>. La lista include automaticamente
          i progetti pubblicati, in ordine di creazione.
        </li>
        <li>
          <strong>Verifica e pubblica</strong>: lavora in bozza, controlla l’anteprima e pubblica
          progetti e pagina. I progetti in bozza non appaiono nella lista. Infine{' '}
          <a href="/" target="_blank" rel="noopener noreferrer">
            controlla il sito
          </a>
          .
        </li>
      </ol>
    </div>
  )
}

export default BeforeDashboard
