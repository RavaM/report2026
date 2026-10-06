import type { Block } from 'payload'
import { FixedToolbarFeature, lexicalEditor } from '@payloadcms/richtext-lexical'

export const Outro: Block = {
  slug: 'outro',
  interfaceName: 'OutroBlock',
  labels: { singular: 'Outro', plural: 'Outros' },
  fields: [
    {
      name: 'greeting',
      type: 'text',
      required: true,
    },
    {
      name: 'signature',
      type: 'textarea',
      required: true,
      admin: { description: 'Line breaks are preserved on the page.' },
    },
    {
      name: 'gallery',
      label: 'Team photos and videos',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      admin: {
        description:
          'Choose uploaded images, GIFs, or videos. Use the Media alt field for their descriptions.',
      },
    },
    {
      name: 'shuffleGallery',
      label: 'Shuffle the gallery',
      type: 'checkbox',
      defaultValue: true,
      admin: { description: 'Disable to display media in the selected order.' },
    },
    {
      name: 'contactButton',
      type: 'group',
      fields: [
        { name: 'label', type: 'text' },
        {
          name: 'url',
          type: 'text',
          admin: {
            description:
              'A website URL, internal path, or mailto: link. Leave empty to hide the button.',
          },
        },
        {
          name: 'ariaLabel',
          label: 'Accessible label',
          type: 'text',
        },
        { name: 'color', label: 'Background color', type: 'text', defaultValue: '#00FF92' },
        { name: 'textColor', type: 'text', defaultValue: '#0A4C50' },
      ],
    },
    {
      name: 'footerText',
      type: 'richText',
      admin: {
        description:
          'Add links to previous reports, the Journal, and the website using the rich-text link tool.',
      },
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [...rootFeatures, FixedToolbarFeature()],
      }),
    },
    {
      name: 'copyright',
      type: 'group',
      fields: [
        {
          name: 'startYear',
          type: 'number',
          admin: {
            description:
              'The current year is appended automatically when it is later than this year.',
          },
        },
        { name: 'company', type: 'text' },
        { name: 'url', type: 'text' },
        { name: 'note', type: 'text' },
      ],
    },
  ],
}
