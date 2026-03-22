"use client";
import {UploadForm} from '@/components/ui/UploadForm'
import React from 'react'

const page = () => {
  return (
    <div
      className="min-h-screen px-8 py-12"
      style={{ backgroundColor: "#f5f0e8", fontFamily: "'Georgia', serif" }}
    >
      <div className="max-w-2xl mx-auto text-center">
        {/* Header */}
        <h1 className="text-4xl font-bold text-stone-900 mb-2">
          Add a New Book
        </h1>
        <p className="text-stone-500 text-sm mb-2">
          Upload a PDF to generate your interactive interview
        </p>
        <p className="text-stone-400 text-xs mb-8">
          5 of 10 books used{" "}
          <span className="text-amber-700 cursor-pointer hover:underline">
            (Upgrade)
          </span>
        </p>
        <UploadForm/>
    </div>
    </div>
  )
}

export default page