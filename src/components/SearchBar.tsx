"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  initialQuery?: string;
  className?: string;
  inputClassName?: string;
  placeholder?: string;
  autoFocus?: boolean;
  id?: string;
};

export function SearchBar({
  initialQuery = "",
  className,
  inputClassName,
  placeholder = "Search tiles, size, colour…",
  autoFocus = false,
  id = "site-search",
}: Props) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) {
      router.push("/tiles");
      return;
    }
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  return (
    <form
      onSubmit={onSubmit}
      className={cn(
        "flex h-12 items-center gap-3 border border-stone-line bg-white px-4 transition",
        "focus-within:border-moss focus-within:shadow-[0_0_0_3px_rgba(61,90,76,0.12)]",
        className,
      )}
      role="search"
    >
      <label htmlFor={id} className="sr-only">
        Search tiles
      </label>
      <Search size={18} strokeWidth={1.8} className="shrink-0 text-ink-muted" aria-hidden />
      <input
        id={id}
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className={cn(
          "h-full min-w-0 flex-1 border-0 bg-transparent p-0 text-sm leading-normal text-ink outline-none",
          "placeholder:text-ink-muted/80",
          "[appearance:textfield] [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden",
          inputClassName,
        )}
      />
    </form>
  );
}
