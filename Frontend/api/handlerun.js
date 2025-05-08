"use client";

export const handlerun = async (ques_id) => {
  console.log("▶️ Run button clicked");

  const code = sessionStorage.getItem('editor-code');
  const lang = sessionStorage.getItem('editor-lang');

  console.log("Retrieved from sessionStorage:", { code, lang });

  if (!code || !lang) {
    console.log("❌ Error: Code or language is missing in sessionStorage");
    return { description: "Missing code or language" };
  }

  let language_id;
  if (lang === 'python') {
    language_id = 71;
  } else if (lang === 'javascript') {
    language_id = 63;
  } else {
    console.log("❌ Error: Unsupported language");
    return { description: "Unsupported language" };
  }

  const requestData = {
    code,
    language_id,
    questionid: parseInt(ques_id),
  };

  console.log("📦 Request data prepared:", requestData);

  try {
    const res = await fetch('http://localhost:3001/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestData),
    });

    if (!res.ok) throw new Error("Failed to connect to backend");

    const data = await res.json();
    console.log("✅ Backend response received:", data);

    // Return just the status object with the description
    return data.judgeResult?.status || { description: "Unknown error" };
  } catch (error) {
    console.log("❌ Error in handlerun function:", error);
    return { description: "Execution failed" };
  }
};