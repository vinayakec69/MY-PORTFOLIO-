# Personal AI-Powered Portfolio Project
**Directory:** `D:\My_Resume`

## Overview
This project involved transforming a basic HTML template into a highly customized, "Electric Blue" cyber-engineering portfolio to showcase Edge-AI and Computer Vision projects (SmartSeg, KRUX, CareLens). The core feature of this portfolio is a fully functional, serverless AI Agent integrated directly into the frontend, allowing recruiters to chat with an AI trained on the candidate's resume.

## Architecture
- **Frontend:** HTML, Vanilla CSS (Custom styling, glass-morphism, grain overlays).
- **Backend:** Supabase Edge Functions (Deno/TypeScript) for secure serverless execution.
- **AI Integration:** Google Gemini API (`gemini-flash-latest`) for fast, context-aware responses.
- **Hosting/Deployment:** GitHub (Version Control) & Vercel (CI/CD Hosting).

---

## Technical Challenges & Solutions

### 1. Javascript Scope & Global Variable Shadowing
**Difficulty:** When attempting to initialize the Supabase client in `index.html`, the chat widget button became unresponsive. The browser console indicated a `ReferenceError`.
**Solution:** The error occurred because the initialization variable was declared as `const supabase = supabase.createClient(...)`. Since the Supabase SDK was imported globally via CDN as `supabase`, declaring a constant with the identical name caused a Temporal Dead Zone variable shadowing collision. This was resolved by renaming the local instance to `const supabaseClient`.

### 2. Google Gemini API Model Deprecation
**Difficulty:** The Supabase Edge function began throwing `400 Bad Request` errors reading `"Unexpected end of JSON input"` on the frontend. When bypassing the frontend to debug the raw API response via Node.js, the Google API threw a `ModelNotFound` error.
**Solution:** The older `gemini-pro` and `gemini-1.5-flash` models had been deprecated on the `v1beta` endpoint in 2026. To resolve this and ensure future-proofing, the Edge Function's REST API call was updated to dynamically target `gemini-flash-latest`.

### 3. Vercel Deployment Protection Locks
**Difficulty:** After successfully deploying the codebase via GitHub to Vercel, the live `.vercel.app` URL was locked behind a "Vercel Authentication" login wall, preventing recruiters from accessing the site.
**Solution:** Vercel automatically enables "Deployment Protection" for certain hobby projects. We resolved this by navigating to the hidden Deployment Protection settings within the Vercel Dashboard (under Settings/Firewall) and explicitly disabling Vercel Authentication.

### 4. Git Identity Configuration Failures
**Difficulty:** Attempting to automate the deployment process via terminal commands resulted in a Git rejection (`Author identity unknown`), preventing the initial commit and push.
**Solution:** The local Windows environment lacked a configured Git profile. We resolved this by configuring `git config user.email` and `user.name` before executing the `git push -u origin main` deployment pipeline.

### 5. Access Restricted on External Assets
**Difficulty:** The portfolio and resume included links to a Google Drive folder containing Hackathon certificates. However, clicking the link prompted a "Request Access" email loop.
**Solution:** Google Drive's default security is set to 'Restricted'. We resolved this by manually updating the Drive folder's General Access permissions to "Anyone with the link can view".
