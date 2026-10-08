import { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { FixedToolbarFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { revalidateProject, revalidateProjectDelete } from './hooks/revalidateProject'

export const Projects: CollectionConfig = {
  slug: 'projects',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [...rootFeatures, FixedToolbarFeature()]
        },
      }),
    },
    {
      name: 'services',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
      admin: {
        components: {
          Field: '@/components/admin/ServicesCheckboxes',
        },
      },
    },
    {
      name: 'gallery',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      admin: {
        description: 'Images and videos displayed in this project, in the selected order.',
      },
    },
    {
      name: 'color',
      label: 'Background color',
      type: 'text',
      required: true,
      defaultValue: '#B6050F',
      validate: (value: any) =>
        /^#[0-9a-f]{6}$/i.test(value ?? '') ? true : 'Enter a color like #B6050F',
      admin: {
        components: {
          Field: '@/components/admin/ColorPicker',
        },
      },
    },
    {
      name: 'textColor',
      label: 'Text color',
      type: 'text',
      required: true,
      defaultValue: '#FFFFFF',
      validate: (value: any) =>
        /^#[0-9a-f]{6}$/i.test(value ?? '') ? true : 'Enter a color like #FFFFFF',
      admin: {
        components: {
          Field: '@/components/admin/ColorPicker',
        },
      },
    },
    {
      name: 'ctas',
      label: 'Buttons',
      type: 'array',
      minRows: 1,
      maxRows: 2,
      required: true,
      labels: {
        singular: 'Button',
        plural: 'Buttons',
      },
      admin: {
        description: 'The first button is primary. Add a second button if needed.',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'url',
          label: 'URL',
          type: 'text',
          required: true,
          admin: {
            placeholder: 'https://…',
            description: 'Supports website URLs, internal paths and mailto: links.',
          },
        },
      ],
    },
    {
      name: 'quote',
      label: 'Quote',
      type: 'group',
      admin: {
        description: 'Leave the quote text empty to hide this section.',
      },
      fields: [
        {
          name: 'text',
          label: 'Quote text',
          type: 'textarea',
          admin: {
            description: 'Enter the text without quotation marks.',
          },
        },
        {
          name: 'author',
          type: 'group',
          fields: [
            {
              name: 'name',
              label: 'Author name',
              type: 'text',
            },
            {
              name: 'role',
              label: 'Author role',
              type: 'text',
            },
          ],
        },
        {
          name: 'color',
          label: 'Author role color',
          type: 'text',
          validate: (value: any) =>
            !value || /^#[0-9a-f]{6}$/i.test(value) ? true : 'Enter a color like #936D3D',
          admin: {
            description: 'Leave empty to use the project background color.',
            components: {
              Field: '@/components/admin/ColorPicker',
            },
          },
        },
      ],
    },
    {
      name: 'statistics',
      label: 'Numbers',
      type: 'array',
      labels: {
        singular: 'Statistic',
        plural: 'Statistics',
      },
      fields: [
        {
          name: 'value',
          type: 'number',
          required: true,
        },
        {
          name: 'prefix',
          type: 'text',
          admin: {
            placeholder: '+',
          },
        },
        {
          name: 'suffix',
          type: 'text',
          admin: {
            placeholder: '%',
          },
        },
        {
          name: 'label',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'spoiler',
      label: 'Nel 2026',
      type: 'group',
      admin: {
        description: 'Select media and add text to display this section.',
      },
      fields: [
        {
          name: 'image',
          label: 'Image or video',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'text',
          type: 'richText',
          editor: lexicalEditor({
            features: ({ rootFeatures }) => [...rootFeatures, FixedToolbarFeature()],
          }),
        },
        {
          name: 'width',
          label: 'Fallback media width',
          type: 'number',
          defaultValue: 500,
          min: 1,
        },
        {
          name: 'height',
          label: 'Fallback media height',
          type: 'number',
          defaultValue: 400,
          min: 1,
          admin: {
            description: 'Used when uploaded media has no dimensions, particularly videos.',
          },
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateProject],
    afterDelete: [revalidateProjectDelete],
  },
  versions: {
    drafts: true,
  },
}
