// functions/gemini.js
export async function onRequest(context) {
  try {
    // Get the prompt from the request
    const { prompt } = await context.request.json();

    // Securely get the API key from Cloudflare's environment variables
    const apiKey = context.env.GEMINI_API_KEY;

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
    const payload = { contents: [{ parts: [{ text: prompt }] }] };

    const apiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!apiResponse.ok) {
      throw new Error("API call failed");
    }

    const result = await apiResponse.json();
    const text = result.candidates[0].content.parts[0].text;

    // Send the response back to the frontend
    return new Response(JSON.stringify({ text }), {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}