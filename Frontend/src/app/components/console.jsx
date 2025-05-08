'use client';
import React from "react";
import { CheckCircle, Clock, AlertCircle, Terminal } from "lucide-react";

export function OutputConsole({ status }) {
  // If no status exists yet, render an empty placeholder that looks like a terminal
  if (!status) {
    return (
      <div className="mt-4 border border-gray-200 rounded-md overflow-hidden">
        <div className="bg-gray-100 px-4 py-2 border-b border-gray-200 flex items-center">
          <Terminal size={16} className="text-gray-500 mr-2" />
          <span className="text-sm font-medium text-gray-600">Console Output</span>
        </div>
        <div className="bg-gray-50 p-4 text-gray-400 font-mono text-sm">
          Run your code to see results
        </div>
      </div>
    );
  }

  // Safe access to description with fallback
  const description = status?.description || "Unknown status";
  
  // Determine styling and icon based on status
  let icon;
  let statusText;
  let textColorClass;
  let bgColorClass = "bg-gray-50"; // Default background
  let borderColorClass;
  
  switch (description) {
    case "Accepted":
      icon = <CheckCircle size={16} className="text-green-500 mr-2" />;
      statusText = "Accepted";
      textColorClass = "text-green-600";
      borderColorClass = "border-green-200";
      break;
    case "Processing":
      icon = <Clock size={16} className="text-yellow-500 mr-2" />;
      statusText = "Processing...";
      textColorClass = "text-yellow-600";
      borderColorClass = "border-yellow-200";
      break;
    default:
      icon = <AlertCircle size={16} className="text-red-500 mr-2" />;
      statusText = description;
      textColorClass = "text-red-600";
      borderColorClass = "border-red-200";
  }

  return (
    <div className={`mt-4 border ${borderColorClass} rounded-md overflow-hidden`}>
      <div className={`bg-gray-100 px-4 py-2 border-b ${borderColorClass} flex items-center justify-between`}>
        <div className="flex items-center">
          <Terminal size={16} className="text-gray-500 mr-2" />
          <span className="text-sm font-medium text-gray-600">Console Output</span>
        </div>
        <div className={`flex items-center ${textColorClass} text-sm font-medium`}>
          {icon}
          {statusText}
        </div>
      </div>
      <div className="bg-gray-50 p-4 font-mono text-sm whitespace-pre-wrap">
        {status.stdout && (
          <div className="mb-2">
            <div className="text-xs text-gray-500 mb-1">stdout:</div>
            <div className="text-gray-800">{status.stdout}</div>
          </div>
        )}
        {status.message && (
          <div>
            <div className="text-xs text-gray-500 mb-1">result:</div>
            <div className={textColorClass}>{status.message}</div>
          </div>
        )}
        {!status.stdout && !status.message && (
          <div className={textColorClass}>{description}</div>
        )}
      </div>
    </div>
  );
}

export default OutputConsole;