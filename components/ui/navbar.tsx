"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

const navItems = [
  { label: "Library", href: "/" },
  { label: "Add Book", href: "/books/new" },
];

const Navbar = () => {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-500",
        
      )}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Brand — original image + title preserved */}
        <div className="flex gap-2 items-center">
          <Image
            src="/logo.png"
            alt=""
            width={40}
            height={10}
          />
          <h1 className="font-podkova text-3xl">Bookworm</h1>
        </div>

        {/* Nav Links */}
        <ul className="flex items-center gap-1">
          {navItems.map((item, i) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));

            const isAddBook = item.href === "/books/new";

            return (
              <li key={i}>
                {isAddBook ? (
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-full text-xs font-light uppercase tracking-widest border transition-all duration-300",
                      isActive
                        ? " border-amber-400/70 text-amber-300 "
                        : "border-amber-500/40 text-amber-500 hover:bg-amber-400/10 hover:border-amber-400/70 hover:text-amber-300 hover:shadow-[0_0_16px_rgba(212,175,85,0.15)]"
                    )}
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    {item.label}
                  </Link>
                ) : (
                  <Link
                    href={item.href}
                    className={cn(
                      "relative px-4 py-2 rounded-lg text-xs font-light uppercase tracking-widest transition-all duration-300",
                      isActive
                        ? "text-amber-400 bg-amber-400/10 after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-4 after:h-px after:bg-amber-400 after:shadow-[0_0_6px_rgba(212,175,85,0.8)]"
                        : "text-stone-400 hover:text-stone-100 hover:bg-stone-800/50"
                    )}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
        <div>
          <Show when="signed-out">
              <SignInButton mode="modal"/>
            </Show>
            <Show when="signed-in">
              <UserButton />
            </Show>
            </div>
      </div>
          
    </header>
  );
};

export default Navbar;