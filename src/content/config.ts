import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.date(),
    author: z.string(),
    coordinates: z.object({
      lat: z.number(),
      lng: z.number(),
      location: z.string().optional(),
    }).optional(),
  }),
});

export const collections = { blog };
