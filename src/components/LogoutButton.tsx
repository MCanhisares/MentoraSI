"use client";

export function LogoutButton() {
  return (
    <form action="/api/auth/logout" method="POST">
      <button
        type="submit"
        className="text-[var(--muted)] hover:text-[var(--foreground)] text-sm"
      >
        Sign Out
      </button>
    </form>
  );
}
