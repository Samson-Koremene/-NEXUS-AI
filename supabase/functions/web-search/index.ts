// Supabase Edge Function for Serper web search
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { query } = await req.json()
    const apiKey = Deno.env.get('SERPER_API_KEY')

    if (!apiKey) throw new Error('Serper API key not configured')

    const res = await fetch('https://google.serper.dev/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': apiKey,
      },
      body: JSON.stringify({ q: query }),
    })

    if (!res.ok) {
      const error = await res.text()
      throw new Error(`Serper error: ${res.status} - ${error}`)
    }

    const data = await res.json()
    const results = data.organic?.slice(0, 5).map((item: any) => ({
      title: item.title,
      link: item.link,
      snippet: item.snippet,
    })) || []

    return new Response(JSON.stringify({ results }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
