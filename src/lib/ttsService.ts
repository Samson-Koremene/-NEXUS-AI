export async function generateTTS(text: string, apiKey: string): Promise<string> {
  const res = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'tts-1',
      voice: 'alloy',
      input: text
    })
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `TTS API error: ${res.status}`);
  }

  const blob = await res.blob();
  return URL.createObjectURL(blob);
}
