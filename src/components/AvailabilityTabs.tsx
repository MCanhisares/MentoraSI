"use client";

interface AvailabilityTabsProps {
  activeTab: "weekly" | "individual";
  onTabChange: (tab: "weekly" | "individual") => void;
}

export function AvailabilityTabs({ activeTab, onTabChange }: AvailabilityTabsProps) {
  return (
    <div className="flex border-b border-gray-200 mb-6">
      <button
        onClick={() => onTabChange("weekly")}
        className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
          activeTab === "weekly"
            ? "border-primary-600 text-primary-600"
            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
        }`}
      >
        Weekly Schedule
      </button>
      <button
        onClick={() => onTabChange("individual")}
        className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
          activeTab === "individual"
            ? "border-primary-600 text-primary-600"
            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
        }`}
      >
        Individual Dates
      </button>
    </div>
  );
}
