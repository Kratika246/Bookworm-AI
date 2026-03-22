import * as z from "zod/v3"

const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB
const ACCEPTED_PDF_TYPES = ["application/pdf"]
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]

export const UploadSchema = z.object({
  bookFile: z
    .custom<File>((val) => val instanceof File, "Book PDF is required")
    .refine((file) => file.size <= MAX_FILE_SIZE, `File size must be less than 50MB.`)
    .refine(
      (file) => ACCEPTED_PDF_TYPES.includes(file.type),
      "Only .pdf format is supported."
    ),

  coverImage: z
    .custom<File | undefined>(
      (val) => val === undefined || val instanceof File,
      "Cover image must be a file"
    )
    .optional()
    .refine((file) => {
      if (!file) return true
      return file.size <= 10 * 1024 * 1024
    }, `Image size must be less than 10MB.`)
    .refine((file) => {
      if (!file) return true
      return ACCEPTED_IMAGE_TYPES.includes(file.type)
    }, "Only .jpg, .jpeg, .png and .webp formats are supported."),

  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title is too long"),

  author: z
    .string()
    .min(1, "Author name is required")
    .max(100, "Author name is too long"),

  persona: z.string().min(1, "Please select a voice"),
})

export type UploadSchemaType = z.infer<typeof UploadSchema>