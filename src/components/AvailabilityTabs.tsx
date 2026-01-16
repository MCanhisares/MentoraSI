"use client";

interface AvailabilityTabsProps {
  activeTab: "weekly" | "individual";
  onTabChange: (tab: "weekly" | "individual") => void;
}

export function AvailabilityTabs({ activeTab, onTabChange }: AvailabilityTabsProps) {
  return (
    <div className="flex border-b border-[var(--card-border)] mb-6">
      <button
        onClick={() => onTabChange("weekly")}
        className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
          activeTab === "weekly"
            ? "border-primary-500 text-primary-500"
            : "border-transparent text-[var(--muted)] hover:text-[var(--foreground)] hover:border-[var(--muted-foreground)]"
        }`}
      >
        Cronograma Semanal
      </button>
      <button
        onClick={() => onTabChange("individual")}
        className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
          activeTab === "individual"
            ? "border-primary-500 text-primary-500"
            : "border-transparent text-[var(--muted)] hover:text-[var(--foreground)] hover:border-[var(--muted-foreground)]"
        }`}
      >
        Datas Individuais
      </button>
    </div>
  );
}
