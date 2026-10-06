import config from '@payload-config'
import { getPayload } from 'payload'

import Project from '@/components/Project'
import type { ProjectsListBlock } from '@/payload-types'
import { projectToProps } from './projectToProps'

export const ProjectsList = async (_props: ProjectsListBlock) => {
  const payload = await getPayload({ config })
  const projects = []
  let page = 1

  // Fetch every page so the block never silently truncates the project list.
  while (true) {
    const result = await payload.find({
      collection: 'projects',
      depth: 1,
      limit: 100,
      page,
      sort: 'createdAt',
      draft: false,
      overrideAccess: false,
      where: { _status: { equals: 'published' } },
    })
    projects.push(...result.docs)
    if (!result.hasNextPage) break
    page += 1
  }

  return projects.map((project) => <Project key={project.id} {...projectToProps(project)} />)
}
