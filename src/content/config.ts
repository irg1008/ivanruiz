import { defineCollection, reference, z } from 'astro:content'

const img = z.object({
  src: z.string(),
  alt: z.string(),
})

export const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    url: z.string().optional(),
    cover: img.optional(),
    relatedJob: reference('jobs').optional(),
  }),
})

export const jobs = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    location: z.string(),
    company: z.string(),
    position: z.string(),
    startDate: z.date(),
    endDate: z.date().optional(),
    companyLogo: img.optional(),
    relatedProjects: z.array(reference('projects')),
  }),
})

export const collections = { projects, jobs }
