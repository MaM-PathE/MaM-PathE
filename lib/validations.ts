import { z } from 'zod'

// =====================================
// Auth Schemas
// =====================================

// Le login ne doit PAS imposer les règles de complexité (elles s'appliquent à la
// création de compte). On exige uniquement des champs non vides et des bornes
// raisonnables anti-abus, sans divulguer la politique de mot de passe.
export const loginSchema = z.object({
  username: z.string().min(1, 'Username is required').max(50, 'Username is too long'),
  password: z.string().min(1, 'Password is required').max(128, 'Password is too long'),
})

export type LoginInput = z.infer<typeof loginSchema>

// =====================================
// Contact Schemas
// =====================================

export const contactSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be at most 100 characters')
    .trim(),
  email: z
    .string()
    .email('Invalid email address')
    .max(255, 'Email must be at most 255 characters')
    .toLowerCase()
    .trim(),
  subject: z
    .string()
    .min(5, 'Subject must be at least 5 characters')
    .max(200, 'Subject must be at most 200 characters')
    .trim(),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message must be at most 2000 characters')
    .trim(),
})

export type ContactInput = z.infer<typeof contactSchema>

// =====================================
// Blog Schemas
// =====================================

export const blogPostSchema = z.object({
  title: z
    .string()
    .min(5, 'Title must be at least 5 characters')
    .max(255, 'Title must be at most 255 characters')
    .trim(),
  content: z
    .string()
    .min(50, 'Content must be at least 50 characters')
    .max(50000, 'Content must be at most 50000 characters')
    .trim(),
  excerpt: z
    .string()
    .max(500, 'Excerpt must be at most 500 characters')
    .trim()
    .optional(),
  category: z
    .string()
    .max(50, 'Category must be at most 50 characters')
    .trim()
    .optional(),
  image_url: z
    .string()
    .url('Invalid image URL')
    .max(1000, 'Image URL must be at most 1000 characters')
    .optional()
    .nullable(),
  published: z.boolean().default(false),
})

export type BlogPostInput = z.infer<typeof blogPostSchema>

// =====================================
// Intervention Schemas
// =====================================

export const interventionSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(255, 'Title must be at most 255 characters')
    .trim(),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  location: z
    .string()
    .min(2, 'Location must be at least 2 characters')
    .max(255, 'Location must be at most 255 characters')
    .trim(),
  description: z
    .string()
    .max(2000, 'Description must be at most 2000 characters')
    .trim()
    .optional()
    .nullable(),
  type: z
    .enum(['surgery', 'consultation', 'conference', 'teaching', 'other'], {
      errorMap: () => ({ message: 'Invalid intervention type' }),
    }),
})

export type InterventionInput = z.infer<typeof interventionSchema>

// =====================================
// Supervision Schemas
// =====================================

export const supervisionSchema = z.object({
  student_name: z
    .string()
    .min(2, 'Student name must be at least 2 characters')
    .max(255, 'Student name must be at most 255 characters')
    .trim(),
  project_title: z
    .string()
    .min(5, 'Project title must be at least 5 characters')
    .max(500, 'Project title must be at most 500 characters')
    .trim(),
  institution: z
    .string()
    .min(2, 'Institution must be at least 2 characters')
    .max(255, 'Institution must be at most 255 characters')
    .trim(),
  period: z
    .string()
    .min(4, 'Period must be at least 4 characters')
    .max(100, 'Period must be at most 100 characters')
    .trim(),
  description: z
    .string()
    .max(2000, 'Description must be at most 2000 characters')
    .trim()
    .optional()
    .nullable(),
})

export type SupervisionInput = z.infer<typeof supervisionSchema>

// =====================================
// Video Schemas
// =====================================

export const videoSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(255, 'Title must be at most 255 characters')
    .trim(),
  embed_url: z
    .string()
    .url('Invalid embed URL')
    .max(1000, 'Embed URL must be at most 1000 characters')
    .refine(
      (url) => {
        // Allow YouTube and Vimeo embeds
        return (
          url.includes('youtube.com') ||
          url.includes('youtu.be') ||
          url.includes('vimeo.com') ||
          url.includes('dailymotion.com')
        )
      },
      { message: 'Only YouTube, Vimeo, and Dailymotion URLs are allowed' }
    ),
  thumbnail_url: z
    .string()
    .url('Invalid thumbnail URL')
    .max(1000, 'Thumbnail URL must be at most 1000 characters')
    .optional()
    .nullable(),
  category: z
    .string()
    .max(100, 'Category must be at most 100 characters')
    .trim()
    .optional()
    .nullable(),
})

export type VideoInput = z.infer<typeof videoSchema>

// =====================================
// Gallery Schemas
// =====================================

export const galleryImageSchema = z.object({
  title: z
    .string()
    .min(2, 'Title must be at least 2 characters')
    .max(255, 'Title must be at most 255 characters')
    .trim(),
  type: z
    .enum(['image', 'photo', 'illustration'], {
      errorMap: () => ({ message: 'Invalid image type' }),
    })
    .default('image'),
  category: z
    .string()
    .max(100, 'Category must be at most 100 characters')
    .trim()
    .optional()
    .nullable(),
})

export type GalleryImageInput = z.infer<typeof galleryImageSchema>

// =====================================
// Podcast Schemas
// =====================================

export const podcastSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(255, 'Title must be at most 255 characters')
    .trim(),
  description: z
    .string()
    .max(2000, 'Description must be at most 2000 characters')
    .trim()
    .optional()
    .nullable(),
  audio_url: z
    .string()
    .url('Invalid audio URL')
    .max(1000, 'Audio URL must be at most 1000 characters'),
  duration: z
    .string()
    .max(20, 'Duration must be at most 20 characters')
    .optional()
    .nullable(),
  published_at: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .optional()
    .nullable(),
})

export type PodcastInput = z.infer<typeof podcastSchema>

// =====================================
// ID Schema (for delete operations)
// =====================================

export const idSchema = z.object({
  id: z.number().int().positive('ID must be a positive integer'),
})

export type IdInput = z.infer<typeof idSchema>

// =====================================
// Validation Helper
// =====================================

export function validateInput<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: string } {
  const result = schema.safeParse(data)
  
  if (result.success) {
    return { success: true, data: result.data }
  }
  
  // Get the first error message
  const firstError = result.error.errors[0]
  return {
    success: false,
    error: firstError?.message || 'Validation failed',
  }
}
