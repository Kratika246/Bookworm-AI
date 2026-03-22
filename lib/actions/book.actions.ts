'use server';

import { connectToDatabase } from "@/database/mongoose";
import { CreateBook, CreateBookResponse, TextSegment } from "@/types";
import { generateSlug, serializeData } from "../utils";
import Book from "@/database/models/book.model";
import BookSegment from "@/database/models/bookSegment.model";

export const checkBookExists = async (title: string) => {
    try {
        await connectToDatabase();
        const slug = generateSlug(title);
        const existingBook = await Book.findOne({ slug }).lean();
        if (existingBook) {
            return {
                exists: true,
                data: serializeData(existingBook),
            }
        }
        return { exists: false, data: null }
    } catch (e) {
        console.error("Error checking book exists:", e);
        return {
            exists: false,
            data: null,
            error: e instanceof Error ? e.message : "Unknown error", // ✅ string
        }
    }
}

export const createBook = async (data: CreateBook): Promise<CreateBookResponse> => {
    try {
        await connectToDatabase();
        const slug = generateSlug(data.title);
        const existingBook = await Book.findOne({ slug }).lean();
        if (existingBook) {
            return {
                success: true,
                exists: true,
                data: serializeData(existingBook),
            }
        }
        const book = await Book.create({ ...data, slug, totalSegments: 0 });
        return {
            success: true,
            data: serializeData(book),
        }
    } catch (error) {
        console.error("Error creating a Book:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to create book", // ✅ string
        }
    }
}

export const saveBookSegments = async (bookId: string, clerkId: string, segments: TextSegment[]) => {
    try {
        await connectToDatabase();
        console.log('Saving book segments...');
        const segmentsToInsert = segments.map(({ text, segmentIndex, pageNumber, wordCount }) => ({
            clerkId,
            bookId,
            content: text,
            segmentIndex,
            pageNumber,
            wordCount,
        }));
        await BookSegment.insertMany(segmentsToInsert);
        await Book.findByIdAndUpdate(bookId, { totalSegments: segments.length });
        console.log('Segments saved successfully!');
        return {
            success: true,
            data: { segmentsCreated: segments.length },
        }
    } catch (e) {
        console.error('Error saving book segments:', e);
        await BookSegment.deleteMany({ bookId });
        await Book.findByIdAndDelete(bookId);
        console.log('Deleted book and segments due to failure.');
        return {
            success: false,
            error: e instanceof Error ? e.message : "Failed to save segments", // ✅ string
        }
    }
}

export const getAllBooks = async () =>{
    try {
        await connectToDatabase();
        const books = await Book.find().sort({createdAt: -1}).lean();
        return {
            success: true,
            data: serializeData(books),
        }
    } catch (e) {
        console.log('Error connecting to database', e);
        return {
            success: false, error: e
        }      
    }
}