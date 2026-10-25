import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Blog posts live in src/content/blog/. Each Markdown file is one post.
// Posts with `href` are only listed: the post itself is a Quarto/R Markdown
// page in public/blog/<name>/, or lives on another site.
const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/[^_]*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string(),
    href: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
