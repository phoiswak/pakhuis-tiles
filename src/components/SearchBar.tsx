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
    <form onSubmit={onSubmit} className={cn("relative", className)} role="search">
      <label htmlFor={id} className="sr-only">
        Search tiles
      </label>
      <Search
        size={16}
        className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-ink-muted"
        aria-hidden
      />
      <input
        id={id}
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className={cn(
          "field h-10 w-full border-stone-line bg-white py-2 pr-3 pl-9 text-sm leading-none",
          inputClassName,
        )}
      />
    </form>
  );
}
