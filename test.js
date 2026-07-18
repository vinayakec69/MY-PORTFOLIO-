const url = 'https://zyxlmslzhsvwfrxnkohb.supabase.co/functions/v1/chat-agent';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5eGxtc2x6aHN2d2ZyeG5rb2hiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQzODExMTgsImV4cCI6MjA5OTk1NzExOH0.bkVI_4U27Cf5g6AVdv8N-sv5mj0_0FI-bWWp6DehhGA';

fetch(url, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${key}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ prompt: 'Hello' })
})
.then(res => res.json())
.then(data => console.log('RESPONSE:', data))
.catch(err => console.error('ERROR:', err));
