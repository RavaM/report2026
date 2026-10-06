import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidatePath } from 'next/cache'
import type { Project } from '@/payload-types'

export const revalidateProject: CollectionAfterChangeHook<Project> = ({
  doc,
  previousDoc,
  req: { context },
}) => {
  if (
    !context.disableRevalidate &&
    (doc._status === 'published' || previousDoc?._status === 'published')
  ) {
    // ProjectsList can be used on any page.
    revalidatePath('/', 'layout')
  }
  return doc
}

export const revalidateProjectDelete: CollectionAfterDeleteHook<Project> = ({
  doc,
  req: { context },
}) => {
  if (!context.disableRevalidate) revalidatePath('/', 'layout')
  return doc
}
