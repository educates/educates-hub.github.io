import { defineCollection, z } from "astro:content";

// 2. Import loader(s)
import { glob, file } from 'astro/loaders';

export const workshops = defineCollection({
  loader: glob({ pattern: "*.yaml", base: "./src/content/workshops" }),
  schema: z.object({
    title: z.string(),
    slug: z.string().optional(),
    description: z.string(),
    prerequisites: z.string().optional(),
    runs_on_docker: z.boolean().optional(),
    author: z.string(),
    image: z.string(),
    date_created: z.coerce.string().optional(),
    version: z.coerce.string().optional(),
    release_notes: z.string().optional(),
    labels: z.array(z.string()).optional(),
    install_url: z.string().optional(),
    repository: z
      .object({
        org: z.string(),
        name: z.string(),
        ref: z.string().optional(),
        path: z.string().optional(),
      })
      .optional(),
  }),
});

export const extensionPackages = defineCollection({
  loader: glob({ pattern: "*.yaml", base: "./src/content/extension-packages" }),
  schema: z.object({
    title: z.string(),
    slug: z.string().optional(),
    description: z.string(),
    author: z.string(),
    image: z.string(),
    date_created: z.coerce.string().optional(),
    version: z.coerce.string().optional(),
    release_notes: z.string().optional(),
    labels: z.array(z.string()).optional(),
    repo_url: z.string().optional(),
    oci_image: z.string().optional(),
  }),
});

export const kyvernoPolicies = defineCollection({
  loader: glob({ pattern: "*.yaml", base: "./src/content/kyverno-policies" }),
  schema: z.object({
    title: z.string(),
    slug: z.string().optional(),
    description: z.string(),
    author: z.string(),
    image: z.string(),
    date_created: z.coerce.string().optional(),
    version: z.coerce.string().optional(),
    release_notes: z.string().optional(),
    labels: z.array(z.string()).optional(),
    repo_url: z.string().optional(),
  }),
});

export const themes = defineCollection({
  loader: glob({ pattern: "*.yaml", base: "./src/content/themes" }),
  schema: z.object({
    title: z.string(),
    slug: z.string().optional(),
    description: z.string(),
    author: z.string(),
    image: z.string(),
    date_created: z.coerce.string().optional(),
    version: z.coerce.string().optional(),
    release_notes: z.string().optional(),
    labels: z.array(z.string()).optional(),
    repo_url: z.string().optional(),
  }),
});

export const collections = {
  "workshops": workshops,
  "extension-packages": extensionPackages,
  "kyverno-policies": kyvernoPolicies,
  "themes": themes,
}; 