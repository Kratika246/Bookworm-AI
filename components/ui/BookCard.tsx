"use client";
import { BookCardProps } from "@/types";
import { BookOpen } from "lucide-react";
import Link from "next/link";

export default function BookCard({ title, author, coverURL, coverColor, slug}: BookCardProps) {
  return (
    <Link href={`/books/${slug}`}>
        <div className="group cursor-pointer">
        <div className="relative rounded-xl overflow-hidden shadow-md aspect-[3/4] mb-3 transition-transform duration-300 group-hover:-translate-y-1 group-hover:shadow-xl">
            <img
            src={coverURL}
            alt={title}
            className="w-full h-full object-cover"
            onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                target.style.display = "none";
                const parent = target.parentElement;
                if (parent) {
                parent.style.backgroundColor = coverColor;
                parent.style.display = "flex";
                parent.style.alignItems = "center";
                parent.style.justifyContent = "center";
                const span = document.createElement("span");
                span.innerText = title[0];
                span.style.color = "#fff";
                span.style.fontSize = "2rem";
                span.style.fontWeight = "bold";
                parent.appendChild(span);
                }
            }}
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 rounded-full px-3 py-1.5 flex items-center gap-1.5 text-xs font-semibold text-stone-700 shadow">
                <BookOpen className="w-3 h-3" />
                Open
            </div>
            </div>
        </div>
        <p className="text-sm font-semibold text-stone-800 truncate">
            {title.length > 18 ? title.slice(0, 17) + "…" : title}
        </p>
        <p className="text-xs text-stone-400 truncate mt-0.5">{author}</p>
        </div>
    </Link>
  );
}