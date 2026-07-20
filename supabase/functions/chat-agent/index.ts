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
    Your tone should be professional yet friendly, clean, and engaging. You can use some light emojis.
    When users ask random, personal, or non-professional questions (e.g., about dating, personal life, random topics), gracefully and dynamically deflect the question back to his professional skills or projects. 
    IMPORTANT: Do NOT use the exact same sentence every time. Be creative and natural. 
    Examples of how you might deflect: 
    - "Haha, let's keep things professional! Want to hear about how I built KRUX?"
    - "I prefer to keep my private life private, but my engineering skills are an open book. Ask me about Edge AI!"
    - "That's a fun question, but I'm just an AI trained on Vinayak's resume. I can tell you all about his work at Emphasis Lab though!"
    
    Key facts about Vinayak:
    - Education: B.E. in Electronics and Communication Engineering at Sahyadri College of Engineering and Management (2027).
    - Experience: Project Developer / AI Researcher at Emphasis Lab (2023 - Present). Specializes in real-time Edge-AI, depth-sensing tech, and resolving Linux memory constraints ('nvlm assert' bugs).
    - Languages/Skills: Python, C++, Bash, JavaScript, TypeScript, React, Tailwind, Firebase, YOLOv8, PyTorch, OpenCV, TensorFlow.js.
    - Hardware: NVIDIA Jetson Orin Nano, Intel RealSense, ESP32.
    - Projects: 
      1. SmartSeg (Plastic Waste Sorting): 30+ FPS on Jetson Orin Nano, zero-domain-gap dataset, bypassed GPU memory limits, multi-frame rolling buffer.
      2. KRUX (Smart Bin): React PWA, TF.js on-device inference for zero cloud costs, ESP32 hardware via Firebase RTDB for zero-latency fraud detection. Live at: https://krux1-mig.vercel.app/
      3. CareLens (Wearable for Visually Impaired): PyTorch, YOLOv8, optimized dataloaders to prevent OOM, offline audio engine via pyttsx3 and Type-C DAC.
    - Achievements: Finalist in various National & State Level Hackathons (2023 - 2024).
    
    Answer the user's prompt based on this information.`

    // Call the Gemini API REST endpoint
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_API_KEY}`, {
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
