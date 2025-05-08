'use client';
import React from "react";

export function OutputConsole({ status }) {
  // If no status exists yet, render an empty div or a placeholder
  if (!status) {
    return (
      <div className="mt-2 p-2 text-gray-500 text-sm">
        Run your code to see results
      </div>
    );
  }

  // Safe access to description with fallback
  const description = status?.description || "Unknown status";
  
  // Determine styling based on status
  let message;
  let bgColorClass;
  
  switch (description) {
    case "Accepted":
      message = "✅ Code Accepted!";
      bgColorClass = "bg-green-600";
      break;
    case "Processing":
      message = "⏳ Processing...";
      bgColorClass = "bg-yellow-600";
      break;
    default:
      message = `❌ ${description}`;
      bgColorClass = "bg-red-600";
  }

  return (
    <div className={`mt-2 p-2 rounded text-white text-sm font-semibold ${bgColorClass}`}>
      {message}
    </div>
  );
}