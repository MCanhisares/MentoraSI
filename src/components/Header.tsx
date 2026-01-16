import Link from "next/link";
import Image from "next/image";
import { getCurrentAlumni } from "@/lib/auth";
import { LogoutButton } from "@/components/LogoutButton";

interface HeaderProps {
  showAuthSection?: boolean;
}

export async function Header({ showAuthSection = true }: HeaderProps) {
  const alumni = showAuthSection ? await getCurrentAlumni() : null;

  return (
    <nav className="relative px-6 py-4 border-b border-[var(--card-border)]/50">
      <div className="max-w-5xl mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3 group">
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
        {showAuthSection && (
          <div className="flex items-center gap-4">
            {alumni ? (
              <>
                <Link
                  href="/alumni/dashboard"
                  className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                >
                  {alumni.name || alumni.email}
                </Link>
                <LogoutButton />
              </>
            ) : (
              <Link
                href="/alumni/login"
                className="text-sm text-[var(--muted)] hover:text-[var(--primary-500)] transition-colors"
              >
                Entrar como Mentor
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
