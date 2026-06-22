import { isSupabaseConfigured } from './supabase'
import { callEdgeFunction } from './edgeFunctions'

const LANGUAGE_IDS: Record<string, number> = {
  python: 71,
  javascript: 63,
  java: 62,
  cpp: 54,
};

export async function executeCode(code: string, language: string, apiKey: string): Promise<string> {
  // Use Supabase Edge Function if configured
  if (isSupabaseConfigured()) {
    const data = await callEdgeFunction('code-exec', { code, language })

    if (data?.error) throw new Error(data.error)

    return data.output
  }

  // Fallback to direct API call
  const language_id = LANGUAGE_IDS[language.toLowerCase()] || 63; // Default to JS if unknown

  const submitRes = await fetch('https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&fields=*', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'X-RapidAPI-Key': apiKey,
      'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
    },
    body: JSON.stringify({
      language_id,
      source_code: code,
    })
  });

  if (!submitRes.ok) {
    throw new Error(`Judge0 API submission error: ${submitRes.status}`);
  }

  const { token } = await submitRes.json();
  
  // Poll for result
  let statusId = 1;
  let resultData: any = null;
  let retries = 10;
  
  while (statusId <= 2 && retries > 0) {
    await new Promise(r => setTimeout(r, 1000));
    const resultRes = await fetch(`https://judge0-ce.p.rapidapi.com/submissions/${token}?base64_encoded=false&fields=*`, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
      }
    });

    if (!resultRes.ok) {
      throw new Error(`Judge0 API polling error: ${resultRes.status}`);
    }

    resultData = await resultRes.json();
    statusId = resultData.status.id;
    retries--;
  }

  if (statusId <= 2) {
    throw new Error('Code execution timed out');
  }

  return resultData.stdout || resultData.stderr || resultData.compile_output || 'No output';
}
