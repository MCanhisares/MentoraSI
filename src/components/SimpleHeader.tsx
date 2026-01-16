"use client";

import Link from "next/link";
import Image from "next/image";

export function SimpleHeader() {
  return (
    <nav className="px-6 py-4 border-b border-[var(--card-border)]/50">
      <div className="max-w-5xl mx-auto">
        <Link href="/" className="flex items-center gap-3 w-fit group">
          <Image
            src="/logo.png"
            alt="MentoraSI"
            width={36}
            height={36}
            className="rounded-lg"
          />
          <span className="text-xl font-semibold text-[var(--foreground)] group-hover:text-[var(--primary-500)] transition-colors">
            MentoraSI
          </span>
        </Link>
      </div>
    </nav>
  );
}
