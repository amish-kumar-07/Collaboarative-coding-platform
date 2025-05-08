'use client';

import { useEffect, useState } from "react";
import { AceEditor } from "./components/aceeditor";
import { QuestionDisplay } from "./components/quesdisplay";
import { OutputConsole } from "./components/console";
import { selectRandomQuestion } from "../app/utils/selectquestion";
import { handlerun } from "../../api/handlerun";

export default function Home() {
  const [question, setQuestion] = useState(null);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    setQuestion(selectRandomQuestion());
  }, []);

  const handleRunClick = async () => {
    try {
      // Set processing state first
      setStatus({ description: "Processing" });
      
      const result = await handlerun(question.id);
      console.log("Run result:", result);
      
      // Then update with the actual result
      setStatus(result);
    } catch (error) {
      console.error("Error running code:", error);
      setStatus({ description: "Execution failed" });
    }
  };

  if (!question) return null;

  return (
    <div className="bg-gray-950 min-h-screen flex flex-col">
      <div className="flex justify-between items-center p-2 bg-gray-950 border-b border-gray-800">
        <div className="text-white">Room: coding-session-123</div>
        <div className="text-green-400">3 Users Online</div>
      </div>

      <div className="flex flex-1 gap-4">
        <div className="w-3/4 flex flex-col gap-4 p-4">
          <QuestionDisplay id={question.id} />

          <AceEditor 
            defaultValue="Start coding here..." 
            onCodeChange={(newCode) => console.log("Code changed:", newCode)}
          />

          <div className="flex gap-2">
            <button
              className="bg-green-500 hover:bg-green-600 text-white py-1 px-4 rounded text-sm"
              onClick={handleRunClick}
            >
              Run
            </button>
            <button className="bg-gray-600 hover:bg-gray-700 text-white py-1 px-4 rounded text-sm">
              Pass Control
            </button>
          </div>

          <div className="p-2 bg-gray-900 rounded">
      <div className="text-gray-300 text-xs">Output Console</div>
      <OutputConsole status={status} />
    </div>
        </div>

        <div className="w-1/4 bg-gray-900">{/* Video placeholder */}</div>
      </div>
    </div>
  );
}
