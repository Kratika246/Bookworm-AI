
import { Search, Plus, Upload, Cpu, Mic } from "lucide-react";
import BookCard from "@/components/ui/BookCard";
import { getAllBooks } from "@/lib/actions/book.actions";

export const sampleBooks = [
  {
    _id: '1',
    title: 'Clean Code',
    author: 'Robert Cecil Martin',
    slug: 'clean-code',
    coverURL: 'https://covers.openlibrary.org/b/isbn/9780132350884-L.jpg',
    coverColor: '#f8f4e9',
  },
  {
    _id: '2',
    title: 'JavaScript: The Definitive Guide',
    author: 'David Flanagan',
    slug: 'javascript-the-definitive-guide',
    coverURL: 'https://covers.openlibrary.org/b/isbn/9780596805524-L.jpg',
    coverColor: '#f8f4e9',
  },
  {
    _id: '3',
    title: 'Brave New World',
    author: 'Aldous Huxley',
    slug: 'brave-new-world',
    coverURL: 'https://covers.openlibrary.org/b/isbn/9780060850524-L.jpg',
    coverColor: '#f0f4e4',
  },
  {
    _id: '4',
    title: 'Rich Dad Poor Dad',
    author: 'Robert T. Kiyosaki',
    slug: 'rich-dad-poor-dad',
    coverURL: 'https://covers.openlibrary.org/b/isbn/9781612680194-L.jpg',
    coverColor: '#f9f0fb',
  },
  {
    _id: '5',
    title: 'Deep Work',
    author: 'Cal Newport',
    slug: 'deep-work',
    coverURL: 'https://covers.openlibrary.org/b/isbn/9781455586691-L.jpg',
    coverColor: '#f2f2f2',
  },
];

const steps = [
  { number: 1, icon: Upload, title: "Upload PDF", desc: "Add your book file" },
  { number: 2, icon: Cpu, title: "AI Processing", desc: "We analyze the content" },
  { number: 3, icon: Mic, title: "Voice Chat", desc: "Discuss with AI" },
];

export default async function HomePage() {
  const bookResults = await getAllBooks();
  const bookss = bookResults.success? bookResults.data?? []: [];
  return (
    <div
      className="min-h-screen font-sans"
      style={{ backgroundColor: "#f5f0e8", fontFamily: "'Georgia', serif" }}
    >
      {/* Hero Banner */}
      <section className="mx-8 mt-4 rounded-2xl overflow-hidden relative"
        style={{ backgroundColor: "#e8dcc8", minHeight: "240px" }}
      >
        <div className="flex items-center h-full px-12 py-10 gap-8">
          {/* Text */}
          <div className="flex-1 z-10">
            <h1
              className="text-4xl font-bold text-stone-900 mb-3 leading-tight"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              Your Library
            </h1>
            <p className="text-stone-600 text-sm leading-relaxed max-w-xs mb-7">
              Convert your books into interactive AI conversations.
              <br />
              Listen, learn, and discuss your favorite reads.
              x
            </p>
            <button className="flex items-center gap-2 bg-white text-stone-800 text-sm font-semibold px-5 py-2.5 rounded-full shadow-sm hover:shadow-md transition-all hover:bg-stone-50 border border-stone-200">
              <Plus className="w-4 h-4" />
              Add new book
            </button>
          </div>

          {/* Steps card */}
          <div className="bg-white rounded-2xl shadow-md px-6 py-5 w-56 flex-shrink-0 z-10">
            {steps.map((step, i) => (
              <div key={i} className={`flex items-start gap-3 ${i < steps.length - 1 ? "mb-4" : ""}`}>
                <div className="w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center text-xs font-bold text-stone-700 flex-shrink-0 mt-0.5">
                  {step.number}
                </div>
                <div>
                  <p className="text-sm font-semibold text-stone-800">{step.title}</p>
                  <p className="text-xs text-stone-400">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Books */}
      <section className="mx-8 mt-10">
        <div className="flex items-center justify-between mb-6">
          <h2
            className="text-2xl font-bold text-stone-800"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            Recent Books
          </h2>
          {/* Search */}
          <div className="flex items-center gap-2 bg-white border border-stone-200 rounded-full px-4 py-2 shadow-sm w-52">
            <input
              type="text"
              placeholder="Search books..."
              className="bg-transparent text-sm text-stone-600 placeholder-stone-400 outline-none flex-1"
            />
            <Search className="w-4 h-4 text-stone-400" />
          </div>
        </div>

        {/* Book Grid */}
        <div className="grid grid-cols-5 gap-5 pb-12">
          {bookss.map((book) => (
            <BookCard
              key={book._id}
              title={book.title}
              author={book.author}
              coverURL={book.coverURL}
              coverColor={book.coverColor}
              slug={book.slug}
            />
          ))}
        </div>
      </section>
    </div>
  );
}