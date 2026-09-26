import { ActiveCall, VictimProfile, ScamType } from '../types/game';

export interface DialogueResult {
  reply: string;
  trustDelta: number;
  suspicionDelta: number;
  revealsCard: boolean;
  cardNumber?: string;
  cardCvv?: string;
  cardExpiry?: string;
  revealsGiftCard?: boolean;
  giftCardCode?: string;
  hangsUp: boolean;
  reverseHackInitiated: boolean;
  mood: 'confused' | 'terrified' | 'angry' | 'gullible' | 'trolling' | 'cooperative';
}

export const PRESET_TARGETS: VictimProfile[] = [
  {
    id: 'grandma_ethel',
    name: 'Grandma Ethel Higgins',
    age: 82,
    archetype: 'Grandma',
    location: 'Boca Raton, Florida',
    personality: 'Extremely confused, hard of hearing, overly polite, gets terrified by legal threats or computer error beeps.',
    avatarSeed: 'ethel',
    baseTrust: 45,
    baseSuspicion: 10,
    bankBalance: 42350,
    targetScamPreference: 'REFUND_DEPT',
    hiddenCardNumber: '4112 9021 3499 8120',
    hiddenCvv: '719',
    hiddenExpiry: '11/27',
    hiddenGiftCard: 'TARGET-8921-4401-9923',
    cryptoBalance: 0,
    ttsVoice: 'Kore',
    speechStyle: 'Trembling sweet elderly grandmother, slow pace',
    speechPitch: 1.02,
    speechRate: 0.94,
    secretNotes: 'Keeps cash under the mattress, thinks Google is a telephone operator.',
  },
  {
    id: 'chad_bro',
    name: 'Chad "CryptoKing" Henderson',
    age: 24,
    archetype: 'Chad',
    location: 'Austin, Texas',
    personality: 'Hyper-impatient, swears every sentence, thinks he is a 200 IQ crypto genius, vape constantly in mouth.',
    avatarSeed: 'chad',
    baseTrust: 20,
    baseSuspicion: 35,
    bankBalance: 12400,
    targetScamPreference: 'CRYPTO_SECURITY',
    hiddenCardNumber: '5424 1800 9331 4412',
    hiddenCvv: '394',
    hiddenExpiry: '04/29',
    hiddenGiftCard: 'APPLE-X92M-4491-CC21',
    cryptoBalance: 1.45,
    ttsVoice: 'Fenrir',
    speechStyle: 'Fast, aggressive, raspy young frat bro hitting a vape',
    speechPitch: 0.98,
    speechRate: 1.05,
    secretNotes: 'Lost 80% on Dogecoin derivatives; panics at any mention of wallet freeze.',
  },
  {
    id: 'scambaiter_jim',
    name: 'Jim "Harmless Old Man" Browning',
    age: 69,
    archetype: 'Scambaiter',
    location: 'Virtual Machine #4 (Encrypted)',
    personality: 'Pretends to be a naive pensioner who cannot read numbers, but is secretly running Wireshark, MEMZ trojan, and reverse RAT payload.',
    avatarSeed: 'jim',
    baseTrust: 60,
    baseSuspicion: 40,
    bankBalance: 154000,
    targetScamPreference: 'TECH_SUPPORT',
    hiddenCardNumber: '0000 0000 0000 0000',
    hiddenCvv: '666',
    hiddenExpiry: '13/99',
    hiddenGiftCard: 'TROLLED-U-IDIOT-LMAO',
    cryptoBalance: 0,
    isSpecialTrap: true,
    ttsVoice: 'Charon',
    speechStyle: 'Calm, cheerful, playful old British scambaiter',
    speechPitch: 1.0,
    speechRate: 0.96,
    secretNotes: 'DANGER: If Suspicion reaches 100%, he triggers reverse intrusion and formats player virtual drive!',
  },
  {
    id: 'karen_miller',
    name: 'Karen Miller-Smith',
    age: 48,
    archetype: 'Karen',
    location: 'Naperville, Illinois',
    personality: 'Demands supervisor instantly, complains about the accent, threatens to call her brother-in-law who is a sheriff.',
    avatarSeed: 'karen',
    baseTrust: 15,
    baseSuspicion: 50,
    bankBalance: 28900,
    targetScamPreference: 'IRS_GOVERNMENT',
    hiddenCardNumber: '3782 8221 0019 4432',
    hiddenCvv: '902',
    hiddenExpiry: '09/28',
    hiddenGiftCard: 'WALMART-KRN8-2201-9988',
    cryptoBalance: 0.1,
    ttsVoice: 'Kore',
    speechStyle: 'Sharp, loud, indignant suburban mom demanding a manager',
    speechPitch: 1.04,
    speechRate: 1.02,
    secretNotes: 'Terrified of IRS tax audits because of undeclared Etsy boutique sales.',
  },
  {
    id: 'uncle_bob',
    name: 'Uncle Bob Jenkins',
    age: 61,
    archetype: 'Grandpa',
    location: 'Des Moines, Iowa',
    personality: 'Friendly, slow-talking handyman. Uses his computer once a month to check the tractor auction listings.',
    avatarSeed: 'bob',
    baseTrust: 50,
    baseSuspicion: 15,
    bankBalance: 19800,
    targetScamPreference: 'TECH_SUPPORT',
    hiddenCardNumber: '4912 3381 2291 0044',
    hiddenCvv: '441',
    hiddenExpiry: '06/27',
    hiddenGiftCard: 'TARGET-BB91-8821-3312',
    cryptoBalance: 0,
    ttsVoice: 'Fenrir',
    speechStyle: 'Slow, gruff, friendly midwestern blue-collar worker',
    speechPitch: 0.96,
    speechRate: 0.95,
    secretNotes: 'Grandson set up AnyDesk for him last Christmas to fix his Solitaire game.',
  },
  {
    id: 'techbro_sanjay',
    name: 'Sanjay "Startup Founder" Patel',
    age: 31,
    archetype: 'TechBro',
    location: 'San Francisco, California',
    personality: 'Talks a mile a minute, uses corporate buzzwords, thinks he is too smart to get scammed, terrified of identity theft.',
    avatarSeed: 'sanjay',
    baseTrust: 30,
    baseSuspicion: 40,
    bankBalance: 88500,
    targetScamPreference: 'CRYPTO_SECURITY',
    hiddenCardNumber: '4001 7729 1184 9920',
    hiddenCvv: '831',
    hiddenExpiry: '12/30',
    hiddenGiftCard: 'APPLE-SNJY-4411-9901',
    cryptoBalance: 2.1,
    ttsVoice: 'Puck',
    speechStyle: 'Fast talking, caffeinated tech worker talking about sprint deliverables',
    speechPitch: 1.0,
    speechRate: 1.08,
    secretNotes: 'Thinks the Zeus Trojan is an unassigned ticket in his DevOps backlog.',
  },
  {
    id: 'conspiracy_dan',
    name: 'Dan "The Truth" Kowalski',
    age: 53,
    archetype: 'Conspiracy',
    location: 'Roswell, New Mexico',
    personality: 'Extremely paranoid, wraps his router in tinfoil, suspects the deep state is hacking his webcam.',
    avatarSeed: 'dan',
    baseTrust: 10,
    baseSuspicion: 60,
    bankBalance: 31200,
    targetScamPreference: 'IRS_GOVERNMENT',
    hiddenCardNumber: '5105 1092 3341 8829',
    hiddenCvv: '552',
    hiddenExpiry: '03/28',
    hiddenGiftCard: 'WALMART-TRUTH-9912-33',
    cryptoBalance: 0.5,
    ttsVoice: 'Charon',
    speechStyle: 'Paranoid, whispering, suspicious conspiracy theorist',
    speechPitch: 0.98,
    speechRate: 1.02,
    secretNotes: 'Buried silver coins in his backyard; panics if you mention federal satellite scans.',
  },
  {
    id: 'pastor_ezekiel',
    name: 'Pastor Ezekiel Green',
    age: 58,
    archetype: 'Pastor',
    location: 'Macon, Georgia',
    personality: 'Gullible, forgives everyone, quotes scripture, terrified that someone will find adult popups on the church laptop.',
    avatarSeed: 'ezekiel',
    baseTrust: 55,
    baseSuspicion: 10,
    bankBalance: 64000,
    targetScamPreference: 'REFUND_DEPT',
    hiddenCardNumber: '4226 7712 9001 4452',
    hiddenCvv: '192',
    hiddenExpiry: '05/29',
    hiddenGiftCard: 'TARGET-CHURCH-8812-44',
    cryptoBalance: 0,
    ttsVoice: 'Fenrir',
    speechStyle: 'Warm, booming, melodious southern church pastor',
    speechPitch: 0.95,
    speechRate: 0.94,
    secretNotes: 'Controls the church fellowship fund; feels guilty about computer sins.',
  },
  {
    id: 'frat_tyler',
    name: 'Tyler "KegStand" Brooks',
    age: 21,
    archetype: 'FratBoy',
    location: 'Gainesville, Florida',
    personality: 'Hungover college bro, confused, thought he was answering a door dash call, easily frightened by talk of expulsion.',
    avatarSeed: 'tyler',
    baseTrust: 35,
    baseSuspicion: 20,
    bankBalance: 4800,
    targetScamPreference: 'REFUND_DEPT',
    hiddenCardNumber: '4532 9918 2210 3341',
    hiddenCvv: '284',
    hiddenExpiry: '10/26',
    hiddenGiftCard: 'STEAM-TYLER-8812-9901',
    cryptoBalance: 0.2,
    ttsVoice: 'Puck',
    speechStyle: 'Slurring, hungover, confused college bro',
    speechPitch: 0.98,
    speechRate: 1.04,
    secretNotes: 'Using his father Amex card; barely knows what day of the week it is.',
  },
  {
    id: 'grandpa_harold',
    name: 'Harold "Hard-of-Hearing" Vance',
    age: 87,
    archetype: 'Grandpa',
    location: 'Omaha, Nebraska',
    personality: 'Practically deaf, yells everything into the phone receiver, thinks you are calling from the Sears department store.',
    avatarSeed: 'harold',
    baseTrust: 40,
    baseSuspicion: 15,
    bankBalance: 78900,
    targetScamPreference: 'TECH_SUPPORT',
    hiddenCardNumber: '4112 0019 8832 1190',
    hiddenCvv: '109',
    hiddenExpiry: '01/26',
    hiddenGiftCard: 'TARGET-HRO8-9921-7712',
    cryptoBalance: 0,
    ttsVoice: 'Charon',
    speechStyle: 'Very elderly, quavering, shouting loudly into the telephone',
    speechPitch: 0.96,
    speechRate: 0.92,
    secretNotes: 'Veteran pension fund accumulated over 50 years; lost his glasses in 2018.',
  },
];

// Cache of available browser synthesis voices
let cachedVoices: SpeechSynthesisVoice[] = [];

// Preload voices immediately on load
export function initVoicePreloader() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

  const load = () => {
    const v = window.speechSynthesis.getVoices();
    if (v && v.length > 0) {
      cachedVoices = v;
    }
  };

  load();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = load;
  }
}

// Automatically invoke preloader
initVoicePreloader();

export function getAvailableVoices(): Promise<SpeechSynthesisVoice[]> {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return Promise.resolve([]);
  }

  if (cachedVoices.length > 0) {
    return Promise.resolve(cachedVoices);
  }

  const existing = window.speechSynthesis.getVoices();
  if (existing && existing.length > 0) {
    cachedVoices = existing;
    return Promise.resolve(existing);
  }

  return new Promise((resolve) => {
    let resolved = false;
    const onVoicesChanged = () => {
      if (resolved) return;
      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length > 0) {
        resolved = true;
        cachedVoices = voices;
        window.speechSynthesis.removeEventListener('voiceschanged', onVoicesChanged);
        resolve(voices);
      }
    };

    window.speechSynthesis.addEventListener('voiceschanged', onVoicesChanged);
    setTimeout(() => {
      if (!resolved) {
        resolved = true;
        const current = window.speechSynthesis.getVoices() || [];
        cachedVoices = current;
        resolve(current);
      }
    }, 500);
  });
}

// Select natural human voices (prioritizing Google Natural, Edge Neural, Apple Enhanced)
export function pickNaturalVoice(
  victim: VictimProfile,
  voices: SpeechSynthesisVoice[]
): SpeechSynthesisVoice | null {
  if (!voices || voices.length === 0) return null;

  const enVoices = voices.filter((v) => v.lang.toLowerCase().startsWith('en'));
  const candidatePool = enVoices.length > 0 ? enVoices : voices;

  const isFemale = victim.archetype === 'Grandma' || victim.archetype === 'Karen';

  const scoreVoice = (voice: SpeechSynthesisVoice) => {
    const name = voice.name.toLowerCase();
    const lang = voice.lang.toLowerCase();

    let score = 0;

    // High quality modern web voices
    if (name.includes('natural')) score += 150;
    if (name.includes('neural')) score += 140;
    if (name.includes('google')) score += 130;
    if (name.includes('online')) score += 120;
    if (name.includes('enhanced') || name.includes('premium')) score += 100;
    if (name.includes('siri')) score += 80;

    // Heavily penalize old robotic desktop synthesizers
    if (
      name.includes('desktop') ||
      name.includes('david') ||
      name.includes('zira') ||
      name.includes('hazel') ||
      name.includes('mark')
    ) {
      score -= 80;
    }

    // Archetype targeting
    if (victim.archetype === 'Scambaiter') {
      if (lang.includes('gb') || name.includes('uk') || name.includes('british') || name.includes('ryan') || name.includes('oliver') || name.includes('george')) {
        score += 90;
      }
    } else if (isFemale) {
      if (
        name.includes('female') ||
        name.includes('jenny') ||
        name.includes('aria') ||
        name.includes('samantha') ||
        name.includes('victoria') ||
        name.includes('karen') ||
        name.includes('michelle')
      ) {
        score += 60;
      }
    } else {
      if (
        name.includes('male') ||
        name.includes('guy') ||
        name.includes('christopher') ||
        name.includes('eric') ||
        name.includes('daniel') ||
        name.includes('alex')
      ) {
        score += 60;
      }
    }

    return score;
  };

  const sorted = [...candidatePool].sort((a, b) => scoreVoice(b) - scoreVoice(a));
  return sorted[0] || candidatePool[0];
}

// Speak victim response using highest quality voice available
export async function speakVictimResponse(
  text: string,
  victim: VictimProfile,
  onStart?: () => void,
  onEnd?: () => void
): Promise<void> {
  if (!text) {
    onEnd?.();
    return;
  }

  onStart?.();

  // Strip stage directions like *SLAM*, *CLICK*, [VOIP]
  const cleanSpokenText = text
    .replace(/\*([^*]+)\*/g, '')
    .replace(/\[([^\]]+)\]/g, '')
    .replace(/[^\w\s.,!?'"$-]/gi, '')
    .trim();

  if (!cleanSpokenText) {
    onEnd?.();
    return;
  }

  // 1. Try serverless /api/tts endpoint first if server is reachable
  try {
    const res = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: cleanSpokenText,
        voiceName: victim.ttsVoice || 'Kore',
        style: victim.speechStyle || 'Conversational phone caller',
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.audio) {
        const AudioContextClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioContextClass();
        const binary = atob(data.audio);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i);
        }
        const buffer = await ctx.decodeAudioData(bytes.buffer);
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);
        source.onended = () => {
          onEnd?.();
        };
        source.start();
        return;
      }
    }
  } catch {
    // Proceed to enhanced client-side voice synthesis
  }

  // 2. High-quality Web Speech API with Natural Voice Selection
  if ('speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();

      const voices = await getAvailableVoices();
      const chosenVoice = pickNaturalVoice(victim, voices);

      const utterance = new SpeechSynthesisUtterance(cleanSpokenText);

      // Conversational natural human bounds: strictly close to 1.0
      const naturalPitch = Math.max(0.96, Math.min(1.02, victim.speechPitch ?? 1.0));
      const naturalRate = Math.max(0.94, Math.min(1.04, victim.speechRate ?? 1.0));

      utterance.pitch = naturalPitch;
      utterance.rate = naturalRate;

      if (chosenVoice) {
        utterance.voice = chosenVoice;
        utterance.lang = chosenVoice.lang;
      }

      utterance.onend = () => {
        onEnd?.();
      };
      utterance.onerror = () => {
        onEnd?.();
      };

      window.speechSynthesis.speak(utterance);
    } catch {
      onEnd?.();
    }
  } else {
    onEnd?.();
  }
}

// Main Dialogue Processor
export async function processDialogue(
  call: ActiveCall,
  playerMessage: string
): Promise<DialogueResult> {
  // 1. Try serverless backend API (if available)
  try {
    const res = await fetch('/api/dialogue', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        victimProfile: call.victim,
        scamType: call.scamType,
        trust: call.trust,
        suspicion: call.suspicion,
        history: call.history,
        playerMessage,
        anydeskConnected: call.anydeskConnected,
        isScambaiterRevealed: call.isScambaiterRevealed,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (!data.useFallback && data.data && data.data.reply) {
        return {
          reply: data.data.reply,
          trustDelta: Number(data.data.trustDelta) || 0,
          suspicionDelta: Number(data.data.suspicionDelta) || 0,
          revealsCard: Boolean(data.data.revealsCard),
          cardNumber: data.data.cardNumber || undefined,
          cardCvv: data.data.cardCvv || undefined,
          cardExpiry: data.data.cardExpiry || undefined,
          revealsGiftCard: Boolean(data.data.revealsGiftCard),
          giftCardCode: data.data.giftCardCode || undefined,
          hangsUp: Boolean(data.data.hangsUp),
          reverseHackInitiated: Boolean(data.data.reverseHackInitiated),
          mood: data.data.mood || 'confused',
        };
      }
    }
  } catch {
    // Proceed to robust procedural engine
  }

  // 2. Multi-turn Dynamic Procedural Brain
  return generateProceduralResponse(call, playerMessage);
}

// Dynamic Multi-turn Procedural Conversation Engine (Never repeats lines, adapts to player intent)
function generateProceduralResponse(
  call: ActiveCall,
  playerMessage: string
): DialogueResult {
  const text = playerMessage.toLowerCase().trim();
  const { victim, trust, suspicion, history, anydeskConnected } = call;

  // Filter previous victim replies so we NEVER repeat the same reply in one call
  const previousReplies = new Set(
    history
      .filter((h) => h.sender === 'victim')
      .map((h) => h.text.trim())
  );

  // Turn count
  const playerTurns = history.filter((h) => h.sender === 'player').length;

  let trustDelta = 0;
  let suspicionDelta = 0;
  let reply = '';
  let mood: DialogueResult['mood'] = 'confused';
  let revealsCard = false;
  let revealsGiftCard = false;
  let hangsUp = false;
  let reverseHackInitiated = false;

  // Intents
  const isIntro =
    text.includes('amazon') ||
    text.includes('target') ||
    text.includes('walmart') ||
    text.includes('microsoft') ||
    text.includes('windows') ||
    text.includes('apple') ||
    text.includes('coinbase') ||
    text.includes('bank') ||
    text.includes('police') ||
    text.includes('irs') ||
    text.includes('officer') ||
    text.includes('support') ||
    text.includes('department') ||
    text.includes('refund');

  const isRemoteCmd =
    text.includes('anydesk') ||
    text.includes('teamviewer') ||
    text.includes('connect') ||
    text.includes('remote') ||
    text.includes('code') ||
    text.includes('link') ||
    text.includes('download') ||
    text.includes('access');

  const isSecurityScare =
    text.includes('virus') ||
    text.includes('trojan') ||
    text.includes('zeus') ||
    text.includes('hacked') ||
    text.includes('infected') ||
    text.includes('security') ||
    text.includes('compromised') ||
    text.includes('breach');

  const isRefundMention =
    text.includes('refund') ||
    text.includes('5000') ||
    text.includes('5,000') ||
    text.includes('overpaid') ||
    text.includes('mistake') ||
    text.includes('cancel') ||
    text.includes('money back');

  const isArrestThreat =
    text.includes('police') ||
    text.includes('arrest') ||
    text.includes('fbi') ||
    text.includes('jail') ||
    text.includes('sheriff') ||
    text.includes('warrant') ||
    text.includes('lawsuit');

  const isCryptoMention =
    text.includes('bitcoin') ||
    text.includes('crypto') ||
    text.includes('btc') ||
    text.includes('wallet') ||
    text.includes('seed phrase');

  const isCardRequest =
    text.includes('card') ||
    text.includes('cvv') ||
    text.includes('16 digit') ||
    text.includes('expiration') ||
    text.includes('visa') ||
    text.includes('mastercard') ||
    text.includes('debit');

  const isGiftCardRequest =
    text.includes('gift card') ||
    text.includes('target card') ||
    text.includes('apple card') ||
    text.includes('steam') ||
    text.includes('scratch') ||
    text.includes('barcode') ||
    text.includes('walmart card');

  const isDoNotTouch =
    text.includes('do not touch') ||
    text.includes('leave mouse') ||
    text.includes('leave the mouse') ||
    text.includes('terminal') ||
    text.includes('cmd') ||
    text.includes('black screen');

  const isReassurance =
    text.includes('help') ||
    text.includes('worry') ||
    text.includes('calm') ||
    text.includes('fix') ||
    text.includes('safe') ||
    text.includes('okay') ||
    text.includes('legit');

  const isSwearing =
    text.includes('fuck') ||
    text.includes('bitch') ||
    text.includes('shut up') ||
    text.includes('idiot') ||
    text.includes('bastard') ||
    text.includes('asshole') ||
    text.includes('stupid');

  // Helper to pick candidate reply that hasn't been said yet
  const chooseUnique = (options: string[]): string => {
    const unsaid = options.filter((opt) => !previousReplies.has(opt.trim()));
    if (unsaid.length > 0) {
      return unsaid[Math.floor(Math.random() * unsaid.length)];
    }
    return options[Math.floor(Math.random() * options.length)];
  };

  // --- SPECIAL CHARACTER: Scambaiter Jim ---
  if (victim.archetype === 'Scambaiter') {
    if (suspicion >= 75 || isDoNotTouch || text.includes('bastard')) {
      suspicionDelta += 25;
      if (suspicion + suspicionDelta >= 100) {
        reply = "WAIT A SECOND, YOU FOOL! Look at your task manager right now. I just traced your IP to Kolkata, encrypted your virtual C: drive, and your webcam is streaming live to YouTube! Bye bye scammer!";
        reverseHackInitiated = true;
        hangsUp = true;
        mood = 'trolling';
      }
    } else if (isRemoteCmd) {
      trustDelta += 15;
      suspicionDelta += 10;
      reply = chooseUnique([
        "Oh heavens! Yes, I opened AnyDesk on my virtual desktop... code is 492-108-331. Please be careful, my computer has been running so slowly lately!",
        "Yes young man, AnyDesk says 'Waiting for incoming connection'. Are you connecting now?",
      ]);
      mood = 'gullible';
    } else if (isCardRequest || isGiftCardRequest) {
      if (trust < 60) {
        suspicionDelta += 30;
        reply = "Why on earth would Microsoft support need an Apple gift card or my debit card security digits? That sounds very strange young man...";
        mood = 'trolling';
      } else {
        revealsCard = true;
        reply = "Okay okay! Don't shout! My card number is 4412 8819 0041 3321... and the code on the back says... wait, why is my screen flickering? Are you running syskey?";
        mood = 'trolling';
      }
    } else {
      trustDelta += 10;
      suspicionDelta += 5;
      reply = chooseUnique([
        "Oh my goodness, really? Zeus Trojan virus from Russian hackers? Sir please help me, I have all my family holiday photos on this computer!",
        "I'm looking at my screen right now. Should I put my mouse in the microwave to stop the virus?",
        "Wait, are you from the technical team or the refund team? The line sounds like a busy train station in Delhi!",
      ]);
      mood = 'gullible';
    }
  }

  // --- Tyler "KegStand" Brooks (FratBoy) ---
  else if (victim.archetype === 'FratBoy') {
    if (isSwearing) {
      trustDelta += 12;
      reply = chooseUnique([
        "Broooo no cap that's hilarious! Wait did you say my account is cooked? Am I going to jail for the tailgate party?",
        "Bro chill! Why are you screaming at me? I literally woke up ten minutes ago!",
      ]);
      mood = 'confused';
    } else if (isCardRequest) {
      if (trust > 60) {
        revealsCard = true;
        reply = `Bro just take my dad's Amex before he checks his statements: ${victim.hiddenCardNumber}, CVV ${victim.hiddenCvv}, exp ${victim.hiddenExpiry}. Just fix it so I can play Warzone!`;
        mood = 'cooperative';
      } else {
        suspicionDelta += 25;
        reply = "Wait why do you need my 16 digits right now? Bro my dad will kill me if there is a weird charge on his card!";
        mood = 'confused';
      }
    } else if (isGiftCardRequest) {
      if (trust > 60) {
        revealsGiftCard = true;
        reply = `Yo I got this Steam gift card from my roommate for my birthday: ${victim.hiddenGiftCard}. Can you take that and wipe the fee?`;
        mood = 'cooperative';
      } else {
        suspicionDelta += 30;
        reply = "Why would Amazon want a Target or Steam gift card? Bro that sounds mad sketchy!";
        mood = 'angry';
      }
    } else if (isIntro) {
      trustDelta += 10;
      reply = chooseUnique([
        "Wait, Amazon?! Bro I didn't order anything except a 30-rack of Natty Light and a ping pong table... did someone hack my account?!",
        "Wait is this really official support? Bro who gave you my personal cell number?!",
        "Yo hold up... my account has an unauthorized charge?! How much was it?!",
      ]);
      mood = 'confused';
    } else if (isRemoteCmd) {
      trustDelta += 15;
      reply = chooseUnique([
        "Aight wait, what app do I download? AnyDesk? Let me search the app store... aight code says 782-119-440, are you in?",
        "Yeah my laptop is open. Where do I click to let you connect?",
      ]);
      mood = 'cooperative';
    } else if (isSecurityScare || isRefundMention) {
      trustDelta += 12;
      reply = chooseUnique([
        "Bro what the f***?! A $5,000 accidental transfer?! I swear on my fraternity I didn't touch anything!",
        "Yo fix it please! If my bank balance goes negative my dad is cutting off my rent money!",
      ]);
      mood = 'terrified';
    } else if (isArrestThreat) {
      trustDelta += 15;
      suspicionDelta += 10;
      reply = chooseUnique([
        "POLICE?! Bro what did I do?! Was it the fireworks on the roof last weekend?! Don't send cops bro!",
        "Yo I cannot have an arrest warrant! I'm applying for internships this semester!",
      ]);
      mood = 'terrified';
    } else if (isReassurance) {
      trustDelta += 10;
      reply = chooseUnique([
        "Okay okay, thanks bro. Tell me what I gotta do, I'm listening.",
        "Aight man, as long as my bank account isn't drained, I'm good. What's next?",
      ]);
      mood = 'cooperative';
    } else {
      // Dynamic conversational fallback based on turn count
      trustDelta += 6;
      if (playerTurns <= 1) {
        reply = chooseUnique([
          "Bro who is this? Did Austin give you my number for the tailgate party?",
          "Hello? Who is calling my phone right now?",
        ]);
      } else if (playerTurns === 2) {
        reply = chooseUnique([
          "Wait bro, talk slower, I got a massive hangover. What is this call actually about?",
          "Wait... you can see my screen or my phone? What are you talking about?",
        ]);
      } else {
        reply = chooseUnique([
          "Okay bro, look, just tell me straight up: am I in trouble or what?",
          "Aight, so what do I need to click on to clear this up?",
          "Bro I gotta jump in the shower in five minutes, can we wrap this up fast?",
        ]);
      }
      mood = 'confused';
    }
  }

  // --- Grandma Ethel Higgins ---
  else if (victim.archetype === 'Grandma') {
    if (isSwearing) {
      trustDelta -= 20;
      suspicionDelta += 15;
      reply = "Oh gracious me! Young man, wash your mouth out with soap! My late husband Harold never spoke like that!";
      mood = 'angry';
    } else if (isCardRequest) {
      if (trust > 65) {
        revealsCard = true;
        reply = `Alright dear, my reading glasses are on... the numbers are ${victim.hiddenCardNumber}, and the little security digits on the back say ${victim.hiddenCvv}. Did that fix the computer?`;
        mood = 'cooperative';
      } else {
        suspicionDelta += 25;
        reply = "My grandson Jimmy told me never to read my bank plastic card to folks over the telephone line...";
        mood = 'confused';
      }
    } else if (isGiftCardRequest) {
      if (trust > 65) {
        revealsGiftCard = true;
        reply = `Oh honey, I had Jimmy drive me to Target yesterday for my yarn and I got this card: ${victim.hiddenGiftCard}. Do I read you the numbers on the back?`;
        mood = 'cooperative';
      } else {
        suspicionDelta += 20;
        reply = "A gift card? For the computer virus? Why would the government want Target gift cards dear?";
        mood = 'confused';
      }
    } else if (isDoNotTouch) {
      trustDelta += 15;
      reply = "I'm not touching it! My hands are up in the air! Please don't let the Russian hackers see my photo albums!";
      mood = 'terrified';
    } else if (isRemoteCmd) {
      trustDelta += 15;
      reply = chooseUnique([
        "AnyDesk? Is that that little red diamond thing on my screen? It says '912 401 883'. Did you get that honey?",
        "Okay dear, I clicked the little icon. A box popped up asking if I want to allow you in. Should I click the green button?",
      ]);
      mood = 'cooperative';
    } else if (isSecurityScare || isRefundMention) {
      trustDelta += 15;
      reply = chooseUnique([
        "Oh heavens above! Five thousand dollars?! Sir, I only get seven hundred on my social security pension! Please don't take my medicine money!",
        "A virus from Russia?! On my machine?! Oh Lord, Harold told me not to open that recipe email from church!",
      ]);
      mood = 'terrified';
    } else if (isArrestThreat) {
      trustDelta += 20;
      reply = "Arrest warrant?! For Ethel Higgins?! Sir, I haven't even had a speeding ticket since 1974! Please don't send the federal marshals to Boca Raton!";
      mood = 'terrified';
    } else {
      trustDelta += 8;
      reply = chooseUnique([
        "Hello dear? You're speaking so fast... is this regarding my Sears catalog order?",
        "Who is calling please? Is this the nice boy from the telephone exchange?",
        "Hold on dear, let me turn down my television... Jeopardy is on. What did you say happened?",
        "My grandson Jimmy usually takes care of the computer. Can you explain it very simply?",
      ]);
      mood = 'confused';
    }
  }

  // --- Chad "CryptoKing" Henderson ---
  else if (victim.archetype === 'Chad') {
    if (isSwearing) {
      trustDelta += 10;
      suspicionDelta -= 5;
      reply = chooseUnique([
        "Bro finally, someone who talks real! These corporate support nerds usually speak like robots. What the hell happened to my wallet?!",
        "Bro don't yell at me, I'm down 60% on Ethereum this week already!",
      ]);
      mood = 'angry';
    } else if (isCryptoMention || isSecurityScare) {
      trustDelta += 18;
      reply = chooseUnique([
        "BRO WHAT?! An unauthorized API withdrawal from an IP in Moscow?! Freeze that transaction right now! What do I need to approve on my end?!",
        "Bro is my seed phrase compromised?! I have 1.4 Bitcoin on that ledger, bro if that gets drained I'm ruined!",
      ]);
      mood = 'terrified';
    } else if (isCardRequest) {
      if (trust > 65) {
        revealsCard = true;
        reply = `Fine, take the card for the gas fee override: ${victim.hiddenCardNumber}, CVV ${victim.hiddenCvv}, exp ${victim.hiddenExpiry}. Just make sure my ledger wallet is safe!`;
        mood = 'cooperative';
      } else {
        suspicionDelta += 35;
        reply = "Hold on bro... why does Coinbase Security need my debit card CVV to cancel an on-chain transaction? You sound suspect as hell right now.";
        mood = 'angry';
      }
    } else if (isRemoteCmd) {
      trustDelta += 12;
      reply = "Yeah yeah whatever, AnyDesk ID is 712-409-110. Connect fast bro, I'm watching the 15-minute candle chart collapse right now!";
      mood = 'angry';
    } else {
      trustDelta += 5;
      reply = chooseUnique([
        "Yo make it quick bro, I'm in the middle of a gym set and my pre-workout is kicking in. What's the issue?",
        "Bro who is this? If you're selling solar panels or auto insurance I'm hanging up right now.",
        "Coinbase? Wait, which exchange did you say? Did my stop-loss trigger?",
      ]);
      mood = 'confused';
    }
  }

  // --- Karen Miller-Smith ---
  else if (victim.archetype === 'Karen') {
    if (isArrestThreat) {
      trustDelta += 20;
      suspicionDelta -= 5;
      reply = chooseUnique([
        "Arrest warrant?! From the Department of Treasury?! Excuse me, this is an outrage, I paid my TurboTax fee! How much do I owe to dismiss this right now?!",
        "Do you know who my brother-in-law is?! He is a county judge! You cannot put a warrant on Karen Miller!",
      ]);
      mood = 'terrified';
    } else if (isCardRequest) {
      if (trust > 65) {
        revealsCard = true;
        reply = `Take the card details and process the penalty fee: ${victim.hiddenCardNumber}, ${victim.hiddenCvv}, exp ${victim.hiddenExpiry}. I will be calling my attorney to contest this later!`;
        mood = 'cooperative';
      } else {
        suspicionDelta += 30;
        reply = "I am NOT reading my card over an unverified line! What is your badge identification number?!";
        mood = 'angry';
      }
    } else if (isGiftCardRequest) {
      if (trust > 70) {
        revealsGiftCard = true;
        reply = `I am at the Walmart customer service desk right now and the manager was extremely rude! Here is the code on the back: ${victim.hiddenGiftCard}. You better send me an official government tax receipt!`;
        mood = 'angry';
      } else {
        suspicionDelta += 35;
        reply = "The IRS accepts Target gift cards for back taxes?! Do you think I was born yesterday?! Let me speak to your supervisor THIS INSTANT!";
        mood = 'angry';
      }
    } else {
      suspicionDelta += 10;
      reply = chooseUnique([
        "Who authorized this call? I am on the National Do Not Call Registry! What company is this?!",
        "Excuse me, I demand to speak to your manager right now! What is your employee ID number?!",
        "I am recording this call for legal purposes. Identify yourself and your department!",
      ]);
      mood = 'angry';
    }
  }

  // --- Sanjay (TechBro), Pastor, Harold, Bob (Universal dynamic procedural fallback) ---
  else {
    if (isCardRequest && trust > 60) {
      revealsCard = true;
      reply = `Alright, here are the numbers: ${victim.hiddenCardNumber}, CVV ${victim.hiddenCvv}, expiry ${victim.hiddenExpiry}. Please get this resolved quickly!`;
      mood = 'cooperative';
    } else if (isGiftCardRequest && trust > 60) {
      revealsGiftCard = true;
      reply = `I've got the card code right here: ${victim.hiddenGiftCard}. Can you verify this clears the balance?`;
      mood = 'cooperative';
    } else if (isRemoteCmd) {
      trustDelta += 15;
      reply = chooseUnique([
        "Okay, I have AnyDesk open on my screen. Code is 551-820-339. Can you see my desktop now?",
        "I clicked the link. It's asking for permission to share my screen... I clicked Allow.",
      ]);
      mood = 'cooperative';
    } else if (isSecurityScare || isRefundMention) {
      trustDelta += 15;
      reply = chooseUnique([
        "Wait, what?! An unauthorized charge on my account?! How did that happen?!",
        "A Zeus Trojan?! Is that why my computer fans have been spinning so loud today?!",
      ]);
      mood = 'terrified';
    } else {
      trustDelta += 8;
      reply = chooseUnique([
        "Hello? Who is calling please? Can you explain what this is about?",
        "Yes, I'm here. Talk a little louder, the line is a bit crackly.",
        "What did you say your name was? Which department are you with?",
      ]);
      mood = 'confused';
    }
  }

  // Check end game / hang up conditions
  const finalSuspicion = suspicion + suspicionDelta;
  const finalTrust = trust + trustDelta;

  if (finalSuspicion >= 100) {
    hangsUp = true;
    if (!reverseHackInitiated) {
      reply = chooseUnique([
        "You know what? You're a fake scammer calling from a call center! GET A REAL JOB! *SLAM*",
        "I know you're trying to swindle me! I'm calling the police right now! *CLICK*",
      ]);
      mood = 'angry';
    }
  } else if (finalTrust <= 0) {
    hangsUp = true;
    reply = "I don't trust a single word you are saying. Don't ever call this number again! *CLICK*";
    mood = 'angry';
  }

  return {
    reply,
    trustDelta,
    suspicionDelta,
    revealsCard,
    cardNumber: revealsCard ? victim.hiddenCardNumber : undefined,
    cardCvv: revealsCard ? victim.hiddenCvv : undefined,
    cardExpiry: revealsCard ? victim.hiddenExpiry : undefined,
    revealsGiftCard,
    giftCardCode: revealsGiftCard ? victim.hiddenGiftCard : undefined,
    hangsUp,
    reverseHackInitiated,
    mood,
  };
}

export function generateRandomVictim(excludeId?: string): VictimProfile {
  const pool = PRESET_TARGETS.filter((t) => t.id !== excludeId);
  const picked = pool[Math.floor(Math.random() * pool.length)];
  return {
    ...picked,
    bankBalance: Math.floor(picked.bankBalance * (0.8 + Math.random() * 0.4)),
    baseTrust: Math.max(10, Math.min(60, picked.baseTrust + Math.floor((Math.random() - 0.5) * 10))),
    baseSuspicion: Math.max(5, Math.min(50, picked.baseSuspicion + Math.floor((Math.random() - 0.5) * 10))),
  };
}
