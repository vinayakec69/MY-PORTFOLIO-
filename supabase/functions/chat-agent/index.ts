// Follow this setup guide to integrate the Google Gemini API:
// https://supabase.com/docs/guides/functions/examples/gemini

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

// Initialize CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { prompt } = await req.json()
    
    // Get the Gemini API Key from Supabase Secrets
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')
    
    if (!GEMINI_API_KEY) {
      throw new Error("Missing GEMINI_API_KEY in environment variables")
    }

    // System instruction to guide the AI
    const systemPrompt = `You are an AI assistant representing Vinayak Chandavar, an Edge-AI Engineer and Researcher. 
    Be professional, concise, and helpful. 
    Key facts about Vinayak:
    - Studies B.E. at Sahyadri College (ECE, 2027)
    - Works at Emphasis Lab as an AI Researcher
    - Projects: SmartSeg (Jetson Orin CV sorting at 30fps), KRUX (React/Firebase Smart Bin), CareLens (PyTorch wearable)
    Answer the user's prompt based on this information.`

    // Call the Gemini API REST endpoint
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          { role: "user", parts: [{ text: systemPrompt + "\n\nUser Question: " + prompt }] }
        ]
      })
    })

    const data = await response.json()
    
    // Check if Gemini API returned an error
    if (data.error) {
      throw new Error(`Gemini API Error: ${data.error.message}`)
    }

    if (!data.candidates || data.candidates.length === 0) {
      throw new Error(`Unexpected Gemini response: ${JSON.stringify(data)}`)
    }

    const aiResponse = data.candidates[0].content.parts[0].text

    // Return the response to the frontend
    return new Response(
      JSON.stringify({ response: aiResponse }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
