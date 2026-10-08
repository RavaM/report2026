import { seoPlugin } from '@payloadcms/plugin-seo'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { Plugin } from 'payload'
import { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'

import { Page } from '@/payload-types'
import { getServerSideURL } from '@/utilities/getURL'

const generateTitle: GenerateTitle<Page> = ({ doc }) => {
  return doc?.title ?? ''
}

const generateURL: GenerateURL<Page> = ({ doc }) => {
  const url = getServerSideURL()

  return doc?.slug ? `${url}/${doc.slug}` : url
}

export const plugins: Plugin[] = [
  vercelBlobStorage({
    enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
    alwaysInsertFields: true,
    collections: {
      media: {
        // Media is publicly readable; serve images and videos directly from Blob.
        disablePayloadAccessControl: true,
      },
    },
    token: process.env.BLOB_READ_WRITE_TOKEN,
    clientUploads: true,
  }),
  seoPlugin({
    generateTitle,
    generateURL,
  }),
]
