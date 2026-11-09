import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// One Markdown file per report section, in src/content/report/.
const report = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/report' }),
  schema: z.object({
    number: z.number(),
    title: z.string(),
    summary: z.string(),
    lead: z.string().optional(),        // team member id from src/data/team.ts
    status: z.enum(['placeholder', 'draft', 'final']).default('placeholder'),
  }),
});

export const collections = { report };
