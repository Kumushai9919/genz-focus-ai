// frontend/src/utils/geminiProxy.ts
export const generateInsight = async (prompt: string): Promise<string> => {
  try { 
    const res = await fetch(`${import.meta.env.VITE_GEMINI_PROXY_URL}/api/gemini`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });

    const data = await res.json();
    return data.text || "No response from Gemini.";
  } catch (error) {
    console.error("Gemini Proxy Error:", error);
    return "😪 AI is sleeping. Try again later!";
  }
};
