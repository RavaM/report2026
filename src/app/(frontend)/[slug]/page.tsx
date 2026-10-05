import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload, type RequiredDataFromCollectionSlug } from 'payload'
import { draftMode } from 'next/headers'
import { cache } from 'react'
import { homeStatic } from '@/endpoints/seed/home-static'
import styles from './page.module.scss'

import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import Hero from '@/components/Hero'
import Intro from '@/components/Intro'
import Project from '@/components/Project'
import { useInView } from 'react-intersection-observer'
import Outro from '@/components/Outro'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const pages = await payload.find({
    collection: 'pages',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  const params = pages.docs
    ?.filter((doc) => {
      return doc.slug !== 'home'
    })
    .map(({ slug }) => {
      return { slug }
    })

  return params
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = 'home' } = await paramsPromise
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const url = '/' + decodedSlug
  let page: RequiredDataFromCollectionSlug<'pages'> | null

  // const { ref, inView, entry } = useInView({
  //   rootMargin: '-50% 0% -50% 0%',
  // })

  page = await queryPageBySlug({
    slug: decodedSlug,
  })

  // Remove this code once your website is seeded
  if (!page && slug === 'home') {
    page = homeStatic
  }

  if (!page) {
    return <PayloadRedirects url={url} />
  }

  return (
    <article className="pt-16 pb-24">
      <PageClient />
      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      <>
        {/* <PasswordProtection> */}
        <Hero />
        <main id="main-content" className={styles.body}>
          <Intro />
          <div
          // ref={ref}
          >
            <Project
              color="#B6050F"
              textColor="#fff"
              title="Corriere dello Sport"
              services={[
                'Information architecture',
                'Design sprint e information design',
                'Visual design',
                'Full responsive experience',
                'Frontend development (React/Next.js)',
              ]}
              text={
                <>
                  <p>
                    Nel 2025 abbiamo consolidato la <strong>visione di sistema</strong> dei siti
                    periodici del Corriere dello Sport: <strong>Auto.it</strong>,{' '}
                    <strong>Autosprint</strong>, <strong>Motosprint</strong> e{' '}
                    <strong>InMoto</strong>.
                  </p>
                  <p>
                    {' '}
                    Ogni sito mantiene la propria voce editoriale con un framework condiviso, un
                    design system comune e un’immagine distintiva. I lettori trovano rapidamente
                    live, classifiche, listini e prove. La redazione e il commerciale hanno nuovi
                    strumenti flessibili.
                  </p>
                </>
              }
              cta={{
                url: 'https://journal.5adesign.it/',
                cta: 'Leggi sul Journal',
              }}
              gallery={[
                {
                  type: 'image',
                  url: '/media/cds/01-corriere-dello-sport.png',
                  width: 800,
                  height: 1000,
                },
                {
                  type: 'video',
                  url: '/media/cds/02-corriere-dello-sport-comp.mp4',
                  width: 800,
                  height: 1000,
                },
                {
                  type: 'image',
                  url: '/media/cds/03-corriere-dello-sport.jpg',
                  width: 800,
                  height: 642,
                },
                {
                  type: 'video',
                  url: '/media/cds/04-corriere-dello-sport-comp.mp4',
                  width: 800,
                  height: 1000,
                },
                {
                  type: 'video',
                  url: '/media/cds/05-corriere-dello-sport-comp.mp4',
                  width: 800,
                  height: 1000,
                },
              ]}
              quote={{
                text: '5A Design è un partner con cui portiamo avanti una collaborazione consistente e duratura. Ti spingono sempre a fare un passo in avanti, senza mai perdere solidità, funzionalità e un approccio concreto alle cose.',
                author: {
                  name: 'Ivo D’Antoni',
                  role: 'Head of UI / UX in Sport Network',
                },
              }}
              numbers={[
                {
                  value: 4,
                  prefix: null,
                  suffix: null,
                  label: 'Siti un’unica piattaforma',
                },
                {
                  value: 18,
                  prefix: '+',
                  suffix: '%',
                  label: 'incremento medio della ADV viewability',
                },
              ]}
              spoiler={{
                image: '/media/cds/06-tobe-corriere-dello-sport.png',
                text: (
                  <>
                    <p>
                      Applicare lo stesso approccio ai siti Corriere dello Sport e Tutto Sport,
                      estendendo il refactoring oltre l’ecosistema automotive.
                    </p>
                  </>
                ),
              }}
            />
            <Project
              color="#BFEBFD"
              textColor="#111"
              title="AI per il Credito Cooperativo e i giovani soci e socie delle BCC"
              services={[
                'Systemic design',
                'Workshop design',
                'Training design',
                'AI strategy & prompting coaching',
                'Educational content design',
              ]}
              serviceColor={'#466D7D'}
              text={
                <>
                  <p>
                    Dal 2024 dialoghiamo con Federcasse e le Federazioni Locali sull’
                    <strong>impatto che l’AI Generativa</strong> ha sul loro lavoro.
                  </p>
                  <p>
                    Nel 2025 abbiamo guidato <strong>otto incontri laboratoriali</strong> con
                    giovani soci e socie, dipendenti e amministratori per sperimentare l’uso
                    dell’intelligenza artificiale nelle attività quotidiane rispettando i valori
                    cooperativi.
                  </p>
                  <p>
                    Abbiamo <strong>trasferito competenze operative</strong> — prompt, checklist,
                    guide — con un approccio orientato alle giuste domande.
                  </p>
                </>
              }
              cta={{
                url: 'mailto:info@5adesign.it?subject=AI',
                cta: 'Scrivici per saperne di più',
              }}
              gallery={[
                {
                  type: 'video',
                  url: '/media/ai/01-ai.mp4',
                  width: 1000,
                  height: 800,
                },
                {
                  type: 'image',
                  url: '/media/ai/02-ai.jpg',
                  width: 1000,
                  height: 1000,
                },
                {
                  type: 'video',
                  url: '/media/ai/03-ai.mp4',
                  width: 800,
                  height: 642,
                },
              ]}
              numbers={[
                {
                  value: 300,
                  prefix: '+',
                  suffix: null,
                  label: 'giovani soci e dipendenti coinvolti',
                },
              ]}
            />
            <Project
              isLight
              isContinue
              color="#BFEBFD"
              textColor="#111"
              title="Chi semina intelligenza, raccoglie futuro"
              text={
                <>
                  <p>
                    Al convegno annuale ANGA di Napoli abbiamo presentato{' '}
                    <strong>ai giovani imprenditori agricoli casi concreti di uso dell’AI</strong>.
                  </p>
                  <p>
                    Il nostro punto di vista è che l’intelligenza artificiale non sostituisce il
                    sapere contadino, lo amplifica per liberare tempo dalle attività ripetitive e
                    concentrarsi sulle relazioni umane.{' '}
                  </p>
                </>
              }
              cta={{
                url: 'https://journal.5adesign.it/lintelligenza-artificiale-sta-per-cambiare-l-agricoltura-ma-non-come-pensate-fa76694af2e1?source=friends_link&sk=2549baf268938922fa56a738b59664af',
                cta: 'Leggi l’articolo',
              }}
              cta2={{
                url: 'https://5adesign.notion.site/Guida-alla-scrittura-del-Prompt-perfetto-per-GPT-5-e-Agent-AI-2a198ea4938080488f2df616a8ce5494?source=copy_link',
                cta: 'Guida alla scrittura del Prompt perfetto',
              }}
              gallery={[
                {
                  type: 'image',
                  url: '/media/ai/04-ai.jpg',
                  width: 800,
                  height: 1000,
                },
              ]}
              quote={{
                text: 'Ho apprezzato l’uso di esempi per il nostro settore e come sono stati esposti i concetti',
              }}
              numbers={[
                {
                  value: 70,
                  prefix: '+',
                  suffix: null,
                  label: 'Partecipanti',
                },
              ]}
              spoiler={{
                image: '/media/ai/05-ai.jpg',
                text: (
                  <>
                    <p>
                      Aumenta la produttività con automazioni e nuovi modi di lavorare. Scopri come
                      l’AI può integrarsi nei processi della tua azienda.{' '}
                      <a href="mailto:info@5adesign.it">Scrivici per saperne di più</a>.
                    </p>
                  </>
                ),
              }}
            />
            <Project
              color="#012C6D"
              textColor="#fff"
              title="GS1 Italy - Tendenze"
              services={[
                'User and Market analysis',
                'Information Architecture',
                'Design Sprint and information Design',
                'Visual Design',
                'Full responsive Experience',
                'Frontend Development',
              ]}
              text={
                <>
                  <p>
                    Tendenze, il magazine di GS1 Italy, racconta dal 1994 in modo indipendente di
                    economia e consumi, innovazione, logistica, retail e brand, sostenibilità.
                  </p>
                  <p>
                    Abbiamo{' '}
                    <strong>organizzato questo patrimonio per temi e settori merceologici</strong>{' '}
                    correlandoli all’ecosistema dei servizi e standard GS1 Italy.
                  </p>
                  <p>
                    Survey, interviste con i lettori e card sorting con la redazione hanno guidato
                    la progettazione restituendo percorsi chiari tra articoli, numeri, dossier,
                    podcast e video che sostengono il piano editoriale e le newsletter.
                  </p>
                </>
              }
              cta={{
                url: 'https://journal.5adesign.it/il-redesign-di-tendenze-il-magazine-di-gs1-italy-quelli-del-codice-a-barre-463356f7025e?source=friends_link&sk=59e4a7303a04a68cc80ee52f3cc9c9df&_gl=1*1th3ile*_ga*MTQ4ODAyMTk0Mi4xNzYzNzYxNDU0*_ga_P8Q94LDNQD*czE3NjYwMDUzODQkbzE3JGcwJHQxNzY2MDA1Mzg0JGo2MCRsMCRoMA..',
                cta: 'Leggi sul Journal',
              }}
              gallery={[
                {
                  type: 'image',
                  url: '/media/gs1/01-tendenze.png',
                  width: 800,
                  height: 1000,
                },
                {
                  type: 'video',
                  url: '/media/gs1/02-tendenze-comp.mp4',
                  width: 900,
                  height: 720,
                },
                {
                  type: 'image',
                  url: '/media/gs1/03-tendenze.png',
                  width: 1000,
                  height: 800,
                },
              ]}
              numbers={[
                {
                  value: 50,
                  prefix: '+',
                  suffix: null,
                  label: 'Responsive template per un ecosistema in dialogo con GS1 Italy',
                },
              ]}
            />
            <Project
              isContinue
              color="#012C6D"
              textColor="#fff"
              title="GS1 Italy - Un Anno di Tendenze 2025"
              services={[
                'Editorial design',
                'Information architecture',
                'Information design',
                'Data visualization',
                'Illustration',
              ]}
              text={
                <>
                  <p>
                    Un Anno di Tendenze è la pubblicazione annuale con cui GS1 Italy racconta come
                    sta cambiando il panorama economico italiano.
                  </p>
                  <p>
                    Dopo il redesign del magazine online, la carta si rinnova con{' '}
                    <strong>
                      un progetto editoriale che ne condivide architettura e linguaggio
                    </strong>
                    . Il volume riprende le aree tematiche del sito, trasforma dati in infografiche
                    leggibili e collega ogni capitolo agli approfondimenti digitali.
                  </p>
                  <p>
                    Lavorando a stretto contatto con la redazione abbiamo progettato struttura,
                    gerarchie e linguaggio visivo per restituire un{' '}
                    <strong>sistema integrato tra carta e digitale</strong>.
                  </p>
                </>
              }
              cta={{
                url: 'https://journal.5adesign.it/un-anno-di-tendenze-2025-la-carta-incontra-il-digitale-c5f1c6314452?source=friends_link&sk=bbc481bf6b3b14a8027e55e7aa5b7139&_gl=1*1th3ile*_ga*MTQ4ODAyMTk0Mi4xNzYzNzYxNDU0*_ga_P8Q94LDNQD*czE3NjYwMDUzODQkbzE3JGcwJHQxNzY2MDA1Mzg0JGo2MCRsMCRoMA..',
                cta: 'Leggi sul Journal',
              }}
              cta2={{
                url: 'https://www.youtube.com/watch?v=WTDHNmcPYjc',
                cta: 'Guarda il trailer',
              }}
              gallery={[
                {
                  type: 'image',
                  url: '/media/gs1/04-tendenze.png',
                  width: 1000,
                  height: 800,
                },
                {
                  type: 'video',
                  url: '/media/gs1/05-tendenze-comp.mp4',
                  width: 576,
                  height: 720,
                },
                {
                  type: 'image',
                  url: '/media/gs1/06-tendenze.png',
                  width: 800,
                  height: 1000,
                },
                {
                  type: 'video',
                  url: '/media/gs1/07-tendenze-comp.mp4',
                  width: 900,
                  height: 720,
                },
              ]}
              galleryCaption={
                <>
                  Illustrazioni di{' '}
                  <a href="https://francescofidani.com" rel="noopener noreferrer" target="_blank">
                    Francesco Fidani
                  </a>
                </>
              }
              numbers={[
                {
                  value: 5,
                  prefix: null,
                  suffix: null,
                  label: 'Infografiche a doppia pagina per rendere leggibili dati complessi',
                },
                {
                  value: 500,
                  prefix: '+',
                  suffix: null,
                  label: 'Copie distribuite',
                },
              ]}
              quote={{
                text: 'Con l’entusiasta squadra di 5A Design abbiamo lavorato per rendere più fluida e gradevole la lettura dei nostri contenuti, mettendo al primo posto la fruibilità.',
                author: {
                  name: 'Chiara Sironi',
                  role: 'Communication specialist, GS1 Italy',
                },
              }}
              spoiler={{
                image: '/media/gs1/08-tendenze-comp.mp4',
                type: 'video',
                width: 898,
                height: 720,
                text: (
                  <>
                    <p>
                      Estendere il modello carta+digitale alla nuova pubblicazione 2026 ed evolvere
                      il magazine online seguendo le esigenze della redazione.
                    </p>
                  </>
                ),
              }}
            />
            <Project
              isLight
              color="#E9F5D9"
              textColor="#202123"
              title="Federazione Lazio Umbria Sardegna delle Banche del Credito Cooperativo"
              services={[
                'User and market analysis',
                'Information architecture',
                'UX/UI design',
                'Visual design',
                'Full responsive experience',
                'Frontend and backend development (WordPress)',
                'Training e content governance',
              ]}
              serviceColor={'#36791B'}
              text={
                <>
                  <p>FederLUS rappresenta e supporta le BCC di Lazio, Umbria e Sardegna.</p>
                  <p>
                    Abbiamo progettato il loro nuovo sito per rendere visibile il lavoro della
                    Federazione con le <strong>banche aderenti e con i partner</strong>.
                  </p>
                  <p>
                    Grazie al nuovo <strong>sistema di classificazione e correlazione</strong> ogni
                    progetto aggrega in automatico notizie, eventi e comunicati per una narrazione
                    che evolve nel tempo.
                  </p>
                  <p>
                    Blocchi personalizzati e{' '}
                    <strong>automatismi del sistema migliorano la produttività</strong> e aumentano
                    la coerenza del racconto.
                  </p>
                </>
              }
              cta={{
                url: 'https://tr.ee/XFWEd2muJI',
                cta: 'Leggi sul Journal',
                buttonColor: '#99D212',
              }}
              cta2={{
                url: 'https://www.federlus.it',
                cta: 'Visita il nuovo federlus.it',
              }}
              gallery={[
                {
                  type: 'image',
                  url: '/media/federlus/01-federlus.png',
                  width: 800,
                  height: 1000,
                },
                {
                  type: 'video',
                  url: '/media/federlus/02-federlus-comp.mp4',
                  width: 900,
                  height: 720,
                },
                {
                  type: 'image',
                  url: '/media/federlus/03-federlus.png',
                  width: 800,
                  height: 1000,
                },
              ]}
              spoiler={{
                image: '/media/federlus/04-federlus.png',
                text: (
                  <>
                    <p>
                      Abbiamo in programma lo sviluppo dell’area riservata per scambiare dati
                      sensibili tra Federazione e BCC con procedure tracciate e governance chiare.
                    </p>
                  </>
                ),
              }}
            />
            <Project
              color="#2B4A9B"
              textColor="#fff"
              title="Federazione Lombarda delle Banche del Credito Cooperativo"
              services={[
                'User and market analysis',
                'Information architecture',
                'UX/UI design',
                'Visual design',
                'Full responsive experience',
                'Frontend and backend development (WordPress)',
                'Training e content governance',
              ]}
              text={
                <>
                  <p>FedLo rappresenta e supporta le BCC della Lombardia.</p>
                  <p>
                    Il nuovo fedlo.it rende evidente la sua <strong>identità</strong> e collega{' '}
                    <strong>
                      banche, progettualità, partner e temi strategici in un’unica architettura
                    </strong>
                    .
                  </p>
                  Abbiamo collaborato con la Federazione per sviluppare tassonomie, modelli di
                  pagina e componenti WordPress.
                  <p>
                    In questo modo,{' '}
                    <strong>il racconto può evolversi nel tempo in maniera sostenibile</strong>.
                  </p>
                </>
              }
              cta={{
                url: 'https://journal.5adesign.it/la-nuova-presenza-digitale-per-la-federazione-lombarda-delle-banche-di-credito-cooperativo-cf81960a9713?source=friends_link&sk=5b71ad4641fb12c60cf5ab418fb24e7c&_gl=1*3e9yxc*_ga*MTQ4ODAyMTk0Mi4xNzYzNzYxNDU0*_ga_P8Q94LDNQD*czE3NjYwMDUzODQkbzE3JGcwJHQxNzY2MDA1Mzg0JGo2MCRsMCRoMA..',
                cta: 'Leggi sul Journal',
              }}
              cta2={{
                url: 'https://www.fedlo.it',
                cta: 'Visita il nuovo fedlo.it',
              }}
              gallery={[
                {
                  type: 'video',
                  url: '/media/fedlo/01-fedlo-comp.mp4',
                  width: 720,
                  height: 900,
                },
                {
                  type: 'image',
                  url: '/media/fedlo/02-fedlo.png',
                  width: 1000,
                  height: 800,
                },
                {
                  type: 'video',
                  url: '/media/fedlo/03-fedlo-comp.mp4',
                  width: 720,
                  height: 900,
                },
              ]}
            />
            <Project
              isLight
              color="#FDC542"
              textColor="#202123"
              title="Credito Cooperativo"
              services={[
                'User and market analysis',
                'Information architecture',
                'UX e Visual design',
                'Full responsive experience',
                'Newsletter',
                'SEO e content governance',
                'Data analysis & reporting',
                'Technical optimization',
              ]}
              serviceColor={'#8B6B1F'}
              text={
                <>
                  <p>
                    <strong>Dal 2019 accompagniamo la trasformazione digitale</strong> di Federcasse
                    con un portale pubblico e un’area personale che offre strumenti, circolari e
                    documenti riservati.
                  </p>
                  <p>
                    Analisi semestrali su utenti e contenuti guidano l’evoluzione. Nel 2025 abbiamo
                    lanciato <strong>podcast</strong>, <strong>video</strong> e i{' '}
                    <strong>percorsi formativi della Scuola Cooperativa</strong> per il personale e
                    i dirigenti delle BCC.
                  </p>
                </>
              }
              cta={{
                url: 'https://journal.5adesign.it/levoluzione-digitale-di-federcasse-per-il-knowledge-sharing-del-credito-cooperativo-5d75fdf4a5fe?_gl=1*1cgbj8b*_ga*MTQ4ODAyMTk0Mi4xNzYzNzYxNDU0*_ga_P8Q94LDNQD*czE3NjYwMDUzODQkbzE3JGcwJHQxNzY2MDA1Mzg0JGo2MCRsMCRoMA..',
                cta: 'Leggi sul Journal',
              }}
              cta2={{
                url: 'https://creditocooperativo.it',
                cta: 'Visita il sito del Credito Cooperativo',
              }}
              gallery={[
                {
                  type: 'video',
                  url: '/media/creditocooperativo/01-cc-comp.mp4',
                  width: 576,
                  height: 720,
                },
                {
                  type: 'image',
                  url: '/media/creditocooperativo/02-cc.png',
                  width: 1000,
                  height: 800,
                },
                {
                  type: 'image',
                  url: '/media/creditocooperativo/03-cc.png',
                  width: 800,
                  height: 1000,
                },
                {
                  type: 'image',
                  url: '/media/creditocooperativo/04-cc.png',
                  width: 1000,
                  height: 800,
                },
              ]}
              numbers={[
                {
                  value: 74,
                  prefix: '+',
                  suffix: '%',
                  label: 'visualizzazioni rispetto al 2024',
                },
                {
                  value: 20,
                  prefix: '+',
                  suffix: '%',
                  label: 'nuove persone registrate nel corso del 2025',
                },
              ]}
              spoiler={{
                image: '/media/creditocooperativo/05-cc.png',
                text: (
                  <>
                    <p>
                      Indagine quantitativa e interviste con dipendenti e dirigenti delle BCC per
                      supportare l’evoluzione della Scuola Cooperativa e ottimizzare l’intero
                      sistema.
                    </p>
                  </>
                ),
              }}
            />{' '}
            <Project
              isLight
              color="#80E7E3"
              textColor="#202123"
              title="Fondazione l’Albero della Vita"
              services={[
                'User and market analysis',
                'Information architecture',
                'Visual & interaction design',
                'Full responsive experience',
                'Frontend and backend development',
                'E-commerce',
              ]}
              serviceColor={'#0E7974'}
              text={
                <>
                  <p>
                    Nel 2024 abbiamo riprogettato il sito istituzionale della fondazione impegnata
                    nella tutela e nella promozione dei diritti dei bambini, chiarendo missione e
                    progetti.
                  </p>
                  <p>
                    <strong>Quest’anno abbiamo progettato il Bazar Solidale</strong>: il sito dove
                    regali, bomboniere e buone azioni sostengono progetti concreti in modo
                    trasparente parlando a persone e aziende.
                  </p>
                  <p>
                    Il <strong>nuovo e-commerce</strong> è organizzato per esigenze e occasioni, il
                    backend supporta catalogo, campagne e metodi di pagamento in modo coerente con
                    il sito istituzionale.
                  </p>
                </>
              }
              cta={{
                url: 'https://journal.5adesign.it/fondazione-lalbero-della-vita-il-nuovo-sito-e43b025d4f41?source=friends_link&sk=c64185c370671630cdfebe28e82fa2cf&_gl=1*wtcqud*_ga*MTQ4ODAyMTk0Mi4xNzYzNzYxNDU0*_ga_P8Q94LDNQD*czE3NjYwMDUzODQkbzE3JGcwJHQxNzY2MDA1Mzg0JGo2MCRsMCRoMA..',
                cta: 'Leggi sul Journal',
              }}
              cta2={{
                url: 'https://www.bazarsolidale.org',
                cta: 'Visita il Bazar solidale',
              }}
              gallery={[
                {
                  type: 'video',
                  url: '/media/adv/01-checkout-comp.mp4',
                  width: 576,
                  height: 720,
                },
                {
                  type: 'image',
                  url: '/media/adv/01-ladv.png',
                  width: 1000,
                  height: 800,
                },
                {
                  type: 'image',
                  url: '/media/adv/02-ladv.png',
                  width: 1000,
                  height: 800,
                },
                {
                  type: 'video',
                  url: '/media/adv/03-ladv-comp.mp4',
                  width: 900,
                  height: 720,
                },
                {
                  type: 'image',
                  url: '/media/adv/04-ladv.png',
                  width: 800,
                  height: 1000,
                },
              ]}
            />
            <Project
              isLight
              color="#DFD3C4"
              textColor="#202123"
              title="Orto da coltivare"
              services={[
                'User and market analysis',
                'Information architecture',
                'Information design',
                'Visual design',
                'Interaction design',
                'Full responsive experience',
                'Frontend and backend development',
              ]}
              serviceColor={'#756A5B'}
              text={
                <>
                  <p>
                    In dieci anni Orto da Coltivare ha costruito un archivio che lo rende il punto
                    di riferimento per chi si dedica all’orticoltura biologica e sostenibile.
                  </p>
                  <p>
                    Abbiamo ascoltato oltre duemila lettori e
                    <strong> progettato un sistema che segue le stagioni</strong> così che le guide,
                    le colture e i trattamenti siano proposti automaticamente nel momento in cui
                    servono.{' '}
                  </p>
                  <p>
                    Blocchi personalizzati,{' '}
                    <strong>
                      correlazioni e automatismi del backend facilitano il lavoro della redazione
                    </strong>
                    .
                  </p>
                </>
              }
              cta={{
                url: 'https://journal.5adesign.it/il-redesign-di-orto-da-coltivare-lecosistema-digitale-che-segue-le-stagioni-4360bbbf1979?_gl=1*ewakds*_ga*MTQ4ODAyMTk0Mi4xNzYzNzYxNDU0*_ga_P8Q94LDNQD*czE3NjYwMDUzODQkbzE3JGcwJHQxNzY2MDA1Mzg0JGo2MCRsMCRoMA..',
                cta: 'Leggi sul Journal',
              }}
              cta2={{
                url: 'https://www.ortodacoltivare.it',
                cta: 'Visita Orto da coltivare',
              }}
              gallery={[
                {
                  type: 'image',
                  url: '/media/orto/01-orto.png',
                  width: 576,
                  height: 720,
                },
                {
                  type: 'video',
                  url: '/media/orto/02-orto-comp.mp4',
                  width: 576,
                  height: 720,
                },
                {
                  type: 'image',
                  url: '/media/orto/03-orto.png',
                  width: 1000,
                  height: 800,
                },
                {
                  type: 'video',
                  url: '/media/orto/04-color-comp.mp4',
                  width: 576,
                  height: 720,
                },
              ]}
              quote={{
                text: 'Mi ha colpito particolarmente come il team di 5A Design si è immerso nell’argomento del sito, arrivare a comprendere a pieno quello che Orto da Coltivare vuole comunicare ai suoi lettori.',
                author: {
                  name: 'Matteo Cereda',
                  role: 'Fondatore di Orto da Coltivare',
                },
                color: '#936D3D',
              }}
              numbers={[
                {
                  value: 12,
                  prefix: '+',
                  suffix: '%',
                  label: 'durata media del coinvolgimento',
                },
                {
                  value: 16,
                  prefix: '+',
                  suffix: '%',
                  label: 'visualizzazioni per utente',
                },
              ]}
            />
            <Project
              color="#1C791B"
              textColor="#fff"
              title="ANSA"
              services={[
                'Information architecture',
                'UX/UI design',
                'Visual design',
                'Full responsive experience',
                'Template e component design',
              ]}
              text={
                <>
                  <p>Dal 2023 affianchiamo ANSA nel valorizzare la sua immagine digitale.</p>
                  <p>
                    Nel 2025 abbiamo consolidato il <strong>sistema dei progetti speciali </strong>
                    trasformando iniziative editoriali e commerciali in un{' '}
                    <strong>asset stabile e coerente con l’identità dell’agenzia</strong>.
                  </p>
                  <p>
                    Template modulari che il team di sviluppo può facilmente adattare allo
                    storytelling e alle esigenze del marketing.
                  </p>
                </>
              }
              cta={{
                url: 'https://www.ansa.it/sito/notizie/sport/speciali/milano_cortina_2026/',
                cta: 'Vai allo speciale',
              }}
              gallery={[
                {
                  type: 'video',
                  url: '/media/ansa/01-ansa-comp.mp4',
                  width: 576,
                  height: 720,
                },
                {
                  type: 'video',
                  url: '/media/ansa/02-ansa-comp.mp4',
                  width: 900,
                  height: 720,
                },
              ]}
            />
            <Project
              color="#FF7901"
              textColor="#fff"
              is2026
              title="Zètema + ISIA Roma Design"
              text={
                <>
                  <p>
                    Stiamo sviluppando{' '}
                    <strong>
                      il sito per la consultazione, la gestione e l’aggiornamento della rete delle
                      aule studio
                    </strong>{' '}
                    distribuite nel territorio di Roma Capitale, nato dalla collaborazione tra ISIA
                    Roma Design e Zètema.
                  </p>
                  <p>
                    Il sito, <strong>accessibile WCAG 2.2 e conforme alle linee guida AgID</strong>,
                    si configura come un hub informativo centralizzato che facilita l’accesso dei
                    cittadini alle risorse di studio, promuovendo al contempo la rete dei partner
                    attraverso una strategia di comunicazione integrata, geolocalizzata e
                    multilingue.
                  </p>
                </>
              }
              gallery={[
                {
                  type: 'image',
                  url: '/media/zetema/01-aulestudio.mp4',
                  width: 1000,
                  height: 800,
                },
                {
                  type: 'video',
                  url: '/media/zetema/02-aulestudio-comp.mp4',
                  width: 576,
                  height: 720,
                },
                {
                  type: 'image',
                  url: '/media/zetema/03-aulestudio.png',
                  width: 1000,
                  height: 800,
                },
              ]}
            />
          </div>
        </main>
        <Outro />
        {/* </PasswordProtection> */}
      </>
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = 'home' } = await paramsPromise
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const page = await queryPageBySlug({
    slug: decodedSlug,
  })

  return generateMeta({ doc: page })
}

const queryPageBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'pages',
    draft,
    limit: 1,
    pagination: false,
    overrideAccess: draft,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})
