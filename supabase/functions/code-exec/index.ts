// Supabase Edge Function for Judge0 code execution
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const LANGUAGE_IDS: Record<string, number> = {
  javascript: 63,
  python: 71,
  java: 62,
  cpp: 54,
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { code, language } = await req.json()
    const apiKey = Deno.env.get('JUDGE0_API_KEY')

    if (!apiKey) throw new Error('Judge0 API key not configured')

    const languageId = LANGUAGE_IDS[language.toLowerCase()] || 63

    // Submit code
    const submitRes = await fetch('https://judge0-ce.p.rapidapi.com/submissions?wait=true', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
      },
      body: JSON.stringify({
        source_code: code,
        language_id: languageId,
      }),
    })

    if (!submitRes.ok) {
      const error = await submitRes.text()
      throw new Error(`Judge0 error: ${submitRes.status} - ${error}`)
    }

    const result = await submitRes.json()
    
    let output = ''
    if (result.stdout) output = result.stdout
    else if (result.stderr) output = `Error: ${result.stderr}`
    else if (result.compile_output) output = `Compilation Error: ${result.compile_output}`
    else output = 'No output'

    return new Response(JSON.stringify({ output }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
