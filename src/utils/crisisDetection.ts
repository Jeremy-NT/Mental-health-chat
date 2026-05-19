const CRISIS_KEYWORDS = [
  'kill myself', 'end my life', 'suicide', 'suicidal',
  'want to die', 'don\'t want to live', 'hurt myself',
  'self harm', 'self-harm', 'cut myself', 'no reason to live',
  'can\'t go on', 'better off dead', 'give up on life',
]

export function detectCrisis(text: string): boolean {
  const lower = text.toLowerCase()
  return CRISIS_KEYWORDS.some(kw => lower.includes(kw))
}

export const CRISIS_MESSAGE = {
  title: 'You\'re not alone 💚',
  body: 'It sounds like you might be going through something really difficult. Please consider reaching out to a professional who can truly help.',
  resources: [
    { label: 'International Association for Suicide Prevention', url: 'https://www.iasp.info/resources/Crisis_Centres/' },
    { label: 'Crisis Text Line (text HOME to 741741)', url: 'https://www.crisistextline.org/' },
  ],
}
