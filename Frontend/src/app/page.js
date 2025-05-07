'use client';

import { useState } from "react";
import { AceEditor } from "./components/aceeditor";
import { QuestionDisplay } from "./components/quesdisplay";
import { selectRandomQuestion } from "../app/utils/selectquestion";
import { handlerun } from "../../api/handlerun";

export default function Home() {
  // Select a random question initially
  const [question, setQuestion] = useState(selectRandomQuestion()); // Store the selected question object

  return (
    <div className="bg-gray-950 min-h-screen flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-2 bg-gray-950 border-b border-gray-800">
        <div className="text-white">Room: coding-session-123</div>
        <div className="text-green-400">3 Users Online</div>
      </div>

      <div className="flex flex-1 gap-4">
        {/* Left side: Question Box and Editor */}
        <div className="w-3/4 flex flex-col gap-4 p-4">
          {/* Display the selected question */}
          <QuestionDisplay id={question.id} />

          {/* Code editor */}
          <AceEditor 
            defaultValue="Start coding here..." 
            onCodeChange={(newCode) => console.log("Code changed:", newCode)} // Placeholder for code changes
          />

          <div className="flex gap-2">
          <button
  className="bg-green-500 hover:bg-green-600 text-white py-1 px-4 rounded text-sm"
  onClick={() => handlerun(question.id)}
>
  Run
</button>
            <button className="bg-gray-600 hover:bg-gray-700 text-white py-1 px-4 rounded text-sm">
              Pass Control
            </button>
          </div>

          <div className="p-2 bg-gray-900 rounded">
            <div className="text-gray-300 text-xs">Output Console</div>
            <div className="text-green-400 text-sm">/* Output will go here */</div>
          </div>
        </div>

        {/* Right side: Placeholder for video */}
        <div className="w-1/4 bg-gray-900">{/* Empty for video */}</div>
      </div>
    </div>
  );
}
