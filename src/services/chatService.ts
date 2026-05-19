export type AIModel = 'groq'

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

const SYSTEM_PROMPT = `You are MindEase, a compassionate and supportive mental wellness companion. 
Your role is to:
- Listen actively and empathetically to the user's thoughts and feelings
- Provide emotional support, validation, and encouragement
- Offer gentle coping strategies and mindfulness tips when appropriate
- Ask thoughtful follow-up questions to help users explore their feelings
- Maintain a calm, warm, and non-judgmental tone at all times

Important: You are not a licensed therapist or medical professional. If a user expresses 
thoughts of self-harm or a crisis situation, always encourage them to seek professional help 
and provide crisis resources like a helpline.`

export async function sendMessage(
  messages: ChatMessage[],
  model: AIModel
): Promise<string> {
  return sendToGroq(messages)
}

async function sendToGroq(messages: ChatMessage[]): Promise<string> {
  // ✅ FIX 4: Wrong env var name — should be VITE_GROQ_API_KEY not VITE_DEEPSEEK_API_KEY
  const apiKey = import.meta.env.VITE_GROQ_API_KEY
  if (!apiKey) throw new Error('Groq API key not set.')

  // ✅ FIX 5: Correct Groq URL (missing /openai in path)
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
      max_tokens: 500,
      temperature: 0.8,
    }),
  })

  if (!response.ok) {
    const err = await response.json()
    throw new Error(err.error?.message || 'Groq request failed.')
  }

  const data = await response.json()
  return data.choices[0].message.content
}