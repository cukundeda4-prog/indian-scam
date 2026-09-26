import { GoogleGenAI } from '@google/genai';

let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Failed to initialize Google GenAI on Vercel:', err);
  }
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    victimProfile,
    scamType,
    trust,
    suspicion,
    history,
    playerMessage,
    anydeskConnected,
    isScambaiterRevealed,
  } = req.body;

  if (!ai) {
    return res.status(200).json({
      useFallback: true,
      reason: 'No GEMINI_API_KEY configured',
    });
  }

  try {
    const systemPrompt = `You are an AI NPC Victim Simulator for the comedic text simulation video game "CALL CENTER TYCOON: SCAM OPERATOR".
Roleplay as the victim on the phone with a scammer (the user).
Current Victim Profile:
Name: ${victimProfile.name}
Age: ${victimProfile.age}
Archetype: ${victimProfile.archetype}
Personality & Quirks: ${victimProfile.personality}
Secret notes: ${victimProfile.secretNotes || 'None'}
Scam Type currently pushed by player: ${scamType}
Current State:
- AnyDesk Remote Status: ${anydeskConnected ? 'CONNECTED' : 'DISCONNECTED'}
- Trust: ${trust}%
- Suspicion: ${suspicion}%
- Scambaiter Trap Triggered: ${isScambaiterRevealed ? 'YES' : 'NO'}

RULES & DIALOGUE STYLE:
- Profanity, comedic rage, intense emotional outbursts, hilarious misunderstandings, authentic call-center arguments are ALLOWED and ENCOURAGED! Keep it funny, chaotic, and unfiltered.
- If Grandma Ethel: very confused, deaf, asks what a "browser" or "mouse" is, mishears ("You want my peach cobbler recipe?"), mentions her grandson Jimmy, gets scared if yelled at.
- If Chad Bro: impatient, vape sounds, swears constantly ("Bro what the f*** do you mean my Coinbase is drained?!"), talks over the scammer, tries to sound smart.
- If Scambaiter Jim: plays dumb and gullible early on ("Oh gosh sir please don't arrest me!"), but drops subtle technical trolling hints. If suspicion reaches 100%, drops the act and violently mocks the scammer, threatening to encrypt the scammer's PC!
- If Trust is high and Suspicion is low, the victim is closer to giving up fake card numbers (e.g. "4532... wait where is the CVV?"), buying gift cards at Target, or wire transfer.
- If player asks for card/gift card too early (low trust, high suspicion), caller gets suspicious, defensive, or confused.

Analyze the player's message and return a JSON object with:
{
  "reply": "The in-character dialogue spoken by the victim (1-3 sentences)",
  "trustDelta": number (-30 to +25),
  "suspicionDelta": number (-25 to +40),
  "revealsCard": boolean (true ONLY if trust > 70 and player smoothly guided them to give card),
  "cardNumber": string or null (if revealsCard is true, e.g. "4532 8819 0421 9912"),
  "cardCvv": string or null (e.g. "482"),
  "cardExpiry": string or null (e.g. "08/28"),
  "revealsGiftCard": boolean (true ONLY if refund or tech scam and trust > 70 and asked for gift card),
  "giftCardCode": string or null (e.g. "TG-9824-7712-3901"),
  "hangsUp": boolean (true if suspicion >= 100 or trust <= 0, or caller ragequits),
  "reverseHackInitiated": boolean (true ONLY if victim is Scambaiter Jim and suspicion reached 100%),
  "mood": "confused" | "terrified" | "angry" | "gullible" | "trolling" | "cooperative"
}
Output strictly valid JSON and nothing else.`;

    const recentHistoryText = (history || [])
      .slice(-6)
      .map((h: { sender: string; text: string }) => `${h.sender}: ${h.text}`)
      .join('\n');

    const prompt = `Conversation history:
${recentHistoryText}
Player (Scammer): ${playerMessage}

Generate victim response in JSON:`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '';
    const parsed = JSON.parse(text);
    return res.status(200).json({
      useFallback: false,
      data: parsed,
    });
  } catch (error) {
    console.error('Error in Vercel /api/dialogue:', error);
    return res.status(200).json({
      useFallback: true,
      reason: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
