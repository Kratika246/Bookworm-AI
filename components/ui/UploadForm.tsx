"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod/v3"
import { Loader2, Upload, ImageIcon, X } from "lucide-react"
import { UploadSchema } from "@/lib/zod"

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useAuth } from "@clerk/nextjs"
import { checkBookExists, createBook, saveBookSegments } from "@/lib/actions/book.actions"
import { useRouter } from "next/navigation"
import { parsePDFFile } from "@/lib/utils"
import {upload} from '@vercel/blob/client'

const maleVoices = [
  { id: "dave", name: "Dave", desc: "Young male, British-Essex, casual & conversational" },
  { id: "daniel", name: "Daniel", desc: "Middle-aged male, British, authoritative but warm" },
  { id: "chris", name: "Chris", desc: "Male, casual & easy-going" },
]
const femaleVoices = [
  { id: "rachel", name: "Rachel", desc: "Young female, American, calm & clear" },
  { id: "sarah", name: "Sarah", desc: "Young female, American, soft & approachable" },
]

function LoadingOverlay() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#f5f0e8]/80 backdrop-blur-sm">
      <Loader2 className="w-10 h-10 text-[#663820] animate-spin mb-4" />
      <p className="text-stone-700 font-semibold" style={{ fontFamily: "'Georgia', serif" }}>
        Processing your book…
      </p>
    </div>
  )
}

export function UploadForm() {
  const router = useRouter();
  const { userId } = useAuth()
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const form = useForm<z.infer<typeof UploadSchema>>({
    resolver: zodResolver(UploadSchema),
    defaultValues: {
      title: "",
      author: "",
      persona: "",
      bookFile: undefined,
      coverImage: undefined,
    },
  })

  // Read file values directly from form state for UI rendering
  const pdfFile = form.watch("bookFile")
  const coverFile = form.watch("coverImage")

  async function onSubmit(data: z.infer<typeof UploadSchema>) {
    console.log(data);
    if (!userId) {
      return toast.error("Please login to upload books!")
    }
    setIsSubmitting(true);
    //posting
    try {
      const existsCheck = await checkBookExists(data.title);
      if (existsCheck?.exists && existsCheck.data) {
        toast.info("Book with same title already exists.");
        form.reset();
        router.push(`/books/${existsCheck.data.slug}`);
        return;
      }
      const fileTitle = data.title.replace(/\s+/g, '-').toLowerCase();
      const pdfFile: File = data.bookFile;
      const parsedPDF = await parsePDFFile(pdfFile);
      console.log(parsedPDF);
      if (parsedPDF.content.length === 0) {
        toast.error("Failed to parse PDF, Please try again with a different file.");
        return;
      }
      const uploadedPdfBlob = await upload(fileTitle, pdfFile, {
        access: 'public',
        handleUploadUrl: '/api/upload',
        contentType: 'application/pdf'
      });
      let coverUrl : string;
      if(data.coverImage) {
        const coverFile = data.coverImage;
        const uploadedCoverBlob = await upload(`${fileTitle}_cover.png`, coverFile, {
          access: 'public',
          handleUploadUrl: '/api/upload',
          contentType: coverFile.type
        });
        coverUrl = uploadedCoverBlob.url;
      } else {
        const reponse = await fetch(parsedPDF.cover);
        const blob = await reponse.blob();
        const uploadedCoverBlob = await upload(`${fileTitle}_cover.png`, blob, {
          access: 'public',
          handleUploadUrl: '/api/upload',
          contentType: 'image/png'
        });
        coverUrl = uploadedCoverBlob.url;
      }
      const book = await createBook({
        clerkId: userId,
        title: data.title,
        author: data.author,
        persona: data.persona,
        fileURL: uploadedPdfBlob.url,
        fileBlobKey: uploadedPdfBlob.pathname,
        coverURL: coverUrl,
        fileSize: pdfFile.size,

      });
      if(!book.success) throw new Error('Failed to create book!');
      if(book?.exists) {
        toast.info("Book with same title already exists.");
        form.reset();
        router.push(`/books/${book.data.slug}`);
        return;
      }
      const segments = await saveBookSegments(book.data._id, userId, parsedPDF.content);
      if(!segments?.success) {
        toast.error('Failed to save book segments');
        throw new Error('Failed to save book segments');
      }
      form.reset();
      router.push('/');
    } catch (e) {
      console.log(e);
      toast.error("Failed to upload book, please try again!");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      {isSubmitting && <LoadingOverlay />}

      <div
        className="min-h-screen px-8"
        style={{ backgroundColor: "#f5f0e8", fontFamily: "'Georgia', serif" }}
      >
        <div className="new-book-wrapper max-w-2xl mx-auto">
          <form
            id="upload-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8"
          >
            <FieldGroup>

              {/* ── PDF Upload ── */}
              <Field>
                <FieldLabel className="form-label text-sm font-semibold text-stone-700">
                  Book PDF File
                </FieldLabel>
                {pdfFile ? (
                  <div className="flex items-center justify-between bg-white border border-stone-200 rounded-xl px-5 py-4">
                    <div className="flex items-center gap-3">
                      <Upload className="w-5 h-5 text-[#663820]/70" strokeWidth={1.5} />
                      <span className="text-sm text-stone-700 font-medium truncate max-w-xs">
                        {pdfFile.name}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => form.setValue("bookFile", undefined as any, { shouldValidate: true })}
                      className="text-stone-400 hover:text-stone-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label
                    htmlFor="pdf-upload"
                    className="upload-dropzone flex flex-col items-center justify-center w-full rounded-xl border border-stone-200 bg-white cursor-pointer hover:bg-stone-50 transition-colors py-10 gap-2"
                  >
                    <Upload className="w-7 h-7 text-[#663820]/60" strokeWidth={1.5} />
                    <span className="text-sm text-stone-600 font-medium">Click to upload PDF</span>
                    <span className="text-xs text-stone-400">PDF file (max 50MB)</span>
                    <input
                      id="pdf-upload"
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) form.setValue("bookFile", file, { shouldValidate: true })
                      }}
                    />
                  </label>
                )}
                {form.formState.errors.bookFile && (
                  <p className="text-xs text-red-400 mt-1">
                    {form.formState.errors.bookFile.message as string}
                  </p>
                )}
              </Field>

              {/* ── Cover Image Upload ── */}
              <Field>
                <FieldLabel className="form-label text-sm font-semibold text-stone-700">
                  Cover Image (Optional)
                </FieldLabel>
                {coverFile ? (
                  <div className="flex items-center justify-between bg-white border border-stone-200 rounded-xl px-5 py-4">
                    <div className="flex items-center gap-3">
                      <ImageIcon className="w-5 h-5 text-[#663820]/70" strokeWidth={1.5} />
                      <span className="text-sm text-stone-700 font-medium truncate max-w-xs">
                        {coverFile.name}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => form.setValue("coverImage", undefined, { shouldValidate: true })}
                      className="text-stone-400 hover:text-stone-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label
                    htmlFor="cover-upload"
                    className="upload-dropzone flex flex-col items-center justify-center w-full rounded-xl border border-stone-200 bg-white cursor-pointer hover:bg-stone-50 transition-colors py-10 gap-2"
                  >
                    <ImageIcon className="w-7 h-7 text-[#663820]/60" strokeWidth={1.5} />
                    <span className="text-sm text-stone-600 font-medium">Click to upload cover image</span>
                    <span className="text-xs text-stone-400">Leave empty to auto-generate from PDF</span>
                    <input
                      id="cover-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) form.setValue("coverImage", file, { shouldValidate: true })
                      }}
                    />
                  </label>
                )}
              </Field>

              {/* ── Title ── */}
              <Controller
                name="title"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="book-title" className="form-label text-sm font-semibold text-stone-700">
                      Title
                    </FieldLabel>
                    <Input
                      {...field}
                      id="book-title"
                      value={field.value || ""}
                      aria-invalid={fieldState.invalid}
                      placeholder="ex: Rich Dad Poor Dad"
                      autoComplete="off"
                      className="form-input rounded-xl border-stone-200 bg-white px-4 py-3 text-sm text-stone-700 placeholder:text-stone-300 focus-visible:ring-[#663820]/20 focus-visible:border-[#663820]/50"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} className="text-xs text-red-400" />
                    )}
                  </Field>
                )}
              />

              {/* ── Author ── */}
              <Controller
                name="author"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="book-author" className="form-label text-sm font-semibold text-stone-700">
                      Author Name
                    </FieldLabel>
                    <Input
                      {...field}
                      id="book-author"
                      value={field.value || ""}
                      aria-invalid={fieldState.invalid}
                      placeholder="ex: Robert Kiyosaki"
                      autoComplete="off"
                      className="form-input rounded-xl border-stone-200 bg-white px-4 py-3 text-sm text-stone-700 placeholder:text-stone-300 focus-visible:ring-[#663820]/20 focus-visible:border-[#663820]/50"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} className="text-xs text-red-400" />
                    )}
                  </Field>
                )}
              />

              {/* ── Voice Selector ── */}
              <Controller
                name="persona"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className="form-label text-sm font-semibold text-stone-700">
                      Choose Assistant Voice
                    </FieldLabel>
                    <div className="space-y-4 mt-1">
                      <div>
                        <p className="text-xs text-stone-400 mb-2 font-medium">Male Voices</p>
                        <div className="grid grid-cols-3 gap-3">
                          {maleVoices.map((v) => (
                            <button
                              key={v.id}
                              type="button"
                              onClick={() => field.onChange(v.id)}
                              className={`voice-selector-option text-left rounded-xl border px-4 py-3 transition-all ${field.value === v.id
                                  ? "voice-selector-option-selected border-[#663820] bg-[#663820]/5 ring-1 ring-[#663820]/30"
                                  : "border-stone-200 bg-white hover:bg-stone-50"
                                }`}
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${field.value === v.id ? "border-[#663820]" : "border-stone-300"}`}>
                                  {field.value === v.id && <div className="w-1.5 h-1.5 rounded-full bg-[#663820]" />}
                                </div>
                                <span className="text-sm font-semibold text-stone-800">{v.name}</span>
                              </div>
                              <p className="text-xs text-stone-400 leading-snug pl-5">{v.desc}</p>
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-stone-400 mb-2 font-medium">Female Voices</p>
                        <div className="grid grid-cols-2 gap-3">
                          {femaleVoices.map((v) => (
                            <button
                              key={v.id}
                              type="button"
                              onClick={() => field.onChange(v.id)}
                              className={`voice-selector-option text-left rounded-xl border px-4 py-3 transition-all ${field.value === v.id
                                  ? "voice-selector-option-selected border-[#663820] bg-[#663820]/5 ring-1 ring-[#663820]/30"
                                  : "border-stone-200 bg-white hover:bg-stone-50"
                                }`}
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${field.value === v.id ? "border-[#663820]" : "border-stone-300"}`}>
                                  {field.value === v.id && <div className="w-1.5 h-1.5 rounded-full bg-[#663820]" />}
                                </div>
                                <span className="text-sm font-semibold text-stone-800">{v.name}</span>
                              </div>
                              <p className="text-xs text-stone-400 leading-snug pl-5">{v.desc}</p>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} className="text-xs text-red-400" />
                    )}
                  </Field>
                )}
              />

            </FieldGroup>

            {/* ── Submit ── */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="form-btn w-full py-3.5 rounded-xl text-white text-sm font-semibold tracking-wide transition-opacity disabled:opacity-60"
              style={{ backgroundColor: "#663820", fontFamily: "'Georgia', serif" }}
            >
              {isSubmitting ? "Processing…" : "Begin Synthesis"}
            </button>

          </form>
        </div>
      </div>
    </>
  )
}