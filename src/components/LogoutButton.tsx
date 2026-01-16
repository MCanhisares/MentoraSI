"use client";

export function LogoutButton() {
  return (
    <form action="/api/auth/logout" method="POST">
      <button
        type="submit"
        className="text-gray-600 hover:text-gray-800 text-sm"
      >
        Sign Out
      </button>
    </form>
  );
}
