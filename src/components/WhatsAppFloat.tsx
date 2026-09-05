"use client";

import { usePathname } from "next/navigation";
import { WhatsAppIcon, WhatsAppLink } from "@/components/WhatsAppLink";

export function WhatsAppFloat() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin") || pathname.startsWith("/staff") || pathname.startsWith("/login")) {
    return null;
  }

  return (
    <WhatsAppLink
      className="fixed right-4 bottom-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:scale-105 hover:bg-[#1ebe5d] md:right-6 md:bottom-6"
    >
      <span className="sr-only">Chat on WhatsApp</span>
      <WhatsAppIcon className="h-7 w-7" />
    </WhatsAppLink>
  );
}