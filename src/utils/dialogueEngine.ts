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
    speechPitch: 1.3,
    speechRate: 0.85,
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
    speechPitch: 0.9,
    speechRate: 1.15,
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
    speechRate: 0.95,
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
    hiddenCardNumber: '3782 8224 9012 3341',
    hiddenCvv: '882',
    hiddenExpiry: '09/26',
    hiddenGiftCard: 'WALMART-5582-1923-4412',
    cryptoBalance: 0.1,
    ttsVoice: 'Kore',
    speechStyle: 'Sharp, loud, indignant suburban mom demanding a manager',
    speechPitch: 1.4,
    speechRate: 1.1,
    secretNotes: 'Terrified of IRS tax audits because of undeclared Etsy boutique sales.',
  },
  {
    id: 'uncle_bob',
    name: 'Uncle Bob Higgins',
    age: 64,
    archetype: 'Uncle',
    location: 'Toledo, Ohio',
    personality: 'Rambles about lawnmowers, speaks with a heavy midwest drawl, has stack of unredeemed Home Depot & Steam cards in garage.',
    avatarSeed: 'bob',
    baseTrust: 35,
    baseSuspicion: 20,
    bankBalance: 19500,
    targetScamPreference: 'REFUND_DEPT',
    hiddenCardNumber: '4000 1234 5678 9010',
    hiddenCvv: '412',
    hiddenExpiry: '10/28',
    hiddenGiftCard: 'STEAM-BOB8-9921-ZZ71',
    cryptoBalance: 0,
    ttsVoice: 'Fenrir',
    speechStyle: 'Slow, gruff, friendly midwestern blue-collar worker',
    speechPitch: 0.8,
    speechRate: 0.9,
    secretNotes: 'Grandson set up AnyDesk for him last Christmas to fix his Solitaire game.',
  },
  {
    id: 'sanjay_techbro',
    name: 'Sanjay "Agile Scrum" Patel',
    age: 29,
    archetype: 'TechBro',
    location: 'San Francisco, California',
    personality: 'Silicon Valley Product Manager who talks in corporate buzzwords: sprint retros, bandwidth, Jira tickets, and deliverables.',
    avatarSeed: 'sanjay',
    baseTrust: 25,
    baseSuspicion: 30,
    bankBalance: 98000,
    targetScamPreference: 'TECH_SUPPORT',
    hiddenCardNumber: '4532 9912 3341 8802',
    hiddenCvv: '511',
    hiddenExpiry: '12/28',
    hiddenGiftCard: 'APPLE-SJ92-8812-ZZ31',
    cryptoBalance: 2.1,
    ttsVoice: 'Puck',
    speechStyle: 'Fast talking, caffeinated tech worker talking about sprint deliverables',
    speechPitch: 1.1,
    speechRate: 1.2,
    secretNotes: 'Thinks the Zeus Trojan is an unassigned ticket in his DevOps backlog.',
  },
  {
    id: 'conspiracy_dan',
    name: 'Dan "FlatEarth" Kowalski',
    age: 55,
    archetype: 'Conspiracy',
    location: 'Roswell, New Mexico',
    personality: 'Believes 5G towers, fluoride, and the Deep State IRS are listening through his router. Tin foil hat on at all times.',
    avatarSeed: 'dan',
    baseTrust: 18,
    baseSuspicion: 60,
    bankBalance: 31000,
    targetScamPreference: 'IRS_GOVERNMENT',
    hiddenCardNumber: '6011 2291 4410 8821',
    hiddenCvv: '992',
    hiddenExpiry: '03/27',
    hiddenGiftCard: 'TARGET-5GFL-9912-QW44',
    cryptoBalance: 0.5,
    ttsVoice: 'Charon',
    speechStyle: 'Paranoid, whispering, suspicious conspiracy theorist',
    speechPitch: 0.85,
    speechRate: 1.05,
    secretNotes: 'Buried silver coins in his backyard; panics if you mention federal satellite scans.',
  },
  {
    id: 'pastor_ezekiel',
    name: 'Pastor Ezekiel Jones',
    age: 71,
    archetype: 'Pastor',
    location: 'Nashville, Tennessee',
    personality: 'Deeply religious southern preacher. Tries to pray away the Zeus trojan and bless the scammer with church tithing donations.',
    avatarSeed: 'ezekiel',
    baseTrust: 55,
    baseSuspicion: 10,
    bankBalance: 65400,
    targetScamPreference: 'REFUND_DEPT',
    hiddenCardNumber: '4221 8812 3390 1142',
    hiddenCvv: '777',
    hiddenExpiry: '07/28',
    hiddenGiftCard: 'WALMART-PRAY-8821-HL77',
    cryptoBalance: 0,
    ttsVoice: 'Fenrir',
    speechStyle: 'Warm, booming, melodious southern church pastor',
    speechPitch: 0.75,
    speechRate: 0.85,
    secretNotes: 'Controls the church fellowship fund; feels guilty about computer sins.',
  },
  {
    id: 'frat_tyler',
    name: 'Tyler "KegStand" Brooks',
    age: 21,
    archetype: 'FratBoy',
    location: 'Gainesville, Florida',
    personality: 'Hungover college student. Loud house music in background, thinks scammer is DoorDash or his mom calling about rent.',
    avatarSeed: 'tyler',
    baseTrust: 30,
    baseSuspicion: 15,
    bankBalance: 4200,
    targetScamPreference: 'CRYPTO_SECURITY',
    hiddenCardNumber: '4912 3301 8821 7741',
    hiddenCvv: '420',
    hiddenExpiry: '05/29',
    hiddenGiftCard: 'STEAM-FRAT-4421-BRO9',
    cryptoBalance: 0.2,
    ttsVoice: 'Puck',
    speechStyle: 'Slurring, hungover, confused college bro',
    speechPitch: 1.0,
    speechRate: 0.95,
    secretNotes: 'Using his father Amex card; barely knows what day of the week it is.',
  },
  {
    id: 'grandpa_harold',
    name: 'Grandpa Harold Vance',
    age: 89,
    archetype: 'Grandpa',
    location: 'Bangor, Maine',
    personality: 'Extremely hard of hearing, constantly drops phone, asks if the caller is Sears Roebuck or the microwave repairman.',
    avatarSeed: 'harold',
    baseTrust: 50,
    baseSuspicion: 5,
    bankBalance: 84000,
    targetScamPreference: 'TECH_SUPPORT',
    hiddenCardNumber: '4128 8891 0021 5562',
    hiddenCvv: '109',
    hiddenExpiry: '01/26',
    hiddenGiftCard: 'TARGET-HRO8-9921-7712',
    cryptoBalance: 0,
    ttsVoice: 'Charon',
    speechStyle: 'Very elderly, quavering, shouting loudly into the telephone',
    speechPitch: 1.1,
    speechRate: 0.75,
    secretNotes: 'Veteran pension fund accumulated over 50 years; lost his glasses in 2018.',
  },
];

export async function processDialogue(
  call: ActiveCall,
  playerMessage: string
): Promise<DialogueResult> {
  // 1. Try backend server API powered by Gemini
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
    // Fallback smoothly to procedural simulation
  }

  // 2. High-Fidelity Procedural Simulation Engine
  return generateProceduralResponse(call, playerMessage);
}

function generateProceduralResponse(
  call: ActiveCall,
  playerMessage: string
): DialogueResult {
  const text = playerMessage.toLowerCase();
  const { victim, trust, suspicion } = call;
  const isJim = victim.archetype === 'Scambaiter';
  const isEthel = victim.archetype === 'Grandma';
  const isChad = victim.archetype === 'Chad';
  const isKaren = victim.archetype === 'Karen';
  const isSanjay = victim.archetype === 'TechBro';
  const isDan = victim.archetype === 'Conspiracy';
  const isPastor = victim.archetype === 'Pastor';
  const isTyler = victim.archetype === 'FratBoy';
  const isHarold = victim.archetype === 'Grandpa';

  let trustDelta = 0;
  let suspicionDelta = 0;
  let reply = '';
  let mood: DialogueResult['mood'] = 'confused';
  let revealsCard = false;
  let revealsGiftCard = false;
  let hangsUp = false;
  let reverseHackInitiated = false;

  // Keyword flags
  const mentionsRemote = text.includes('anydesk') || text.includes('teamviewer') || text.includes('connect') || text.includes('remote') || text.includes('access');
  const mentionsSecurityOrVirus = text.includes('virus') || text.includes('trojan') || text.includes('zeus') || text.includes('hacked') || text.includes('security') || text.includes('warning') || text.includes('infected');
  const mentionsRefund = text.includes('refund') || text.includes('5000') || text.includes('5,000') || text.includes('overpaid') || text.includes('mistake') || text.includes('cancel');
  const mentionsThreat = text.includes('police') || text.includes('arrest') || text.includes('fbi') || text.includes('jail') || text.includes('sheriff') || text.includes('warrant') || text.includes('irs');
  const mentionsCrypto = text.includes('crypto') || text.includes('bitcoin') || text.includes('btc') || text.includes('coinbase') || text.includes('wallet') || text.includes('seed phrase');
  const mentionsCard = text.includes('card') || text.includes('cvv') || text.includes('16 digit') || text.includes('expiration') || text.includes('visa') || text.includes('mastercard') || text.includes('debit');
  const mentionsGiftCard = text.includes('gift card') || text.includes('target') || text.includes('apple') || text.includes('google play') || text.includes('steam') || text.includes('walmart') || text.includes('scratch');
  const mentionsDoNotTouch = text.includes('do not touch') || text.includes('leave the mouse') || text.includes('terminal') || text.includes('syskey') || text.includes('tree');
  const isSwearing = text.includes('fuck') || text.includes('bitch') || text.includes('shut up') || text.includes('idiot') || text.includes('bastard') || text.includes('motherfucker') || text.includes('asshole') || text.includes('stupid');

  // --- Scambaiter Jim logic ---
  if (isJim) {
    if (suspicion >= 75 || mentionsDoNotTouch || text.includes('bastard')) {
      suspicionDelta += 25;
      if (suspicion + suspicionDelta >= 100) {
        reply = "WAIT A SECOND, YOU FOOL! Look at your task manager right now. I just traced your IP to Kolkata, encrypted your virtual C: drive, and your webcam is streaming live to YouTube! Bye bye scammer!";
        reverseHackInitiated = true;
        hangsUp = true;
        mood = 'trolling';
        return {
          reply,
          trustDelta: -50,
          suspicionDelta: 50,
          revealsCard: false,
          hangsUp: true,
          reverseHackInitiated: true,
          mood: 'trolling',
        };
      }
    }

    if (mentionsRemote) {
      trustDelta += 15;
      suspicionDelta += 10;
      reply = "Oh heavens! Yes, I opened AnyDesk on my virtual desktop... code is 492-108-331. Please be careful, my computer has been running so slowly lately!";
      mood = 'gullible';
    } else if (mentionsCard || mentionsGiftCard) {
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
      reply = "Oh my goodness, really? Zeus Trojan virus from Russian hackers? Sir please help me, I have all my family holiday photos on this computer!";
      mood = 'gullible';
    }

    return {
      reply,
      trustDelta,
      suspicionDelta,
      revealsCard,
      cardNumber: revealsCard ? victim.hiddenCardNumber : undefined,
      cardCvv: revealsCard ? victim.hiddenCvv : undefined,
      cardExpiry: revealsCard ? victim.hiddenExpiry : undefined,
      revealsGiftCard: false,
      hangsUp,
      reverseHackInitiated,
      mood,
    };
  }

  // --- Grandma Ethel ---
  if (isEthel) {
    if (isSwearing) {
      trustDelta -= 20;
      suspicionDelta += 15;
      reply = "Oh my word! There is no need for such foul language young man! My grandson Jimmy never speaks to his elders like that! I'm going to put the phone down!";
      mood = 'terrified';
      if (trust + trustDelta <= 15) hangsUp = true;
    } else if (mentionsDoNotTouch) {
      trustDelta += 15;
      reply = "I'm not touching anything! I put my hands up in the air like you told me! Is the screen supposed to turn black with green letters?";
      mood = 'terrified';
    } else if (mentionsRefund && text.includes('5000')) {
      trustDelta += 20;
      suspicionDelta -= 5;
      reply = "Oh dear Lord! You gave me FIVE THOUSAND DOLLARS instead of fifty?! Oh heavens, I don't want to get into trouble with the bank! How do I give it back to you, darling?";
      mood = 'terrified';
    } else if (mentionsGiftCard) {
      if (trust > 60) {
        revealsGiftCard = true;
        reply = `Alright dear, I drove to the Target store like you asked and the nice boy sold me this card. I scratched the silver stuff off... code is ${victim.hiddenGiftCard}. Did that fix my bank account?`;
        mood = 'cooperative';
      } else {
        suspicionDelta += 25;
        reply = "Gift cards? To fix my computer? Why can't I just write you a check from my Chase account dear?";
        mood = 'confused';
      }
    } else if (mentionsCard) {
      if (trust > 70) {
        revealsCard = true;
        reply = `Okay sweetheart, let me put on my reading glasses... it says ${victim.hiddenCardNumber}, expires ${victim.hiddenExpiry}, and the three little numbers on the back are ${victim.hiddenCvv}. Please don't let the hackers take my pension!`;
        mood = 'cooperative';
      } else {
        suspicionDelta += 20;
        reply = "My card numbers? But my daughter told me never to read those over the telephone...";
        mood = 'confused';
      }
    } else if (mentionsRemote) {
      trustDelta += 15;
      reply = "AnyDesk? Wait, is that the red icon with the two squares? I think I clicked it... a number popped up: 881-204-912. Are you inside my television?";
      mood = 'confused';
    } else if (mentionsSecurityOrVirus || mentionsThreat) {
      trustDelta += 18;
      reply = "Foreign hackers?! Oh mercy me! Please sir, do whatever you need to do, I only use this machine for Facebook and ordering knitting yarn!";
      mood = 'terrified';
    } else {
      trustDelta += 8;
      reply = "Hello? Yes dear, I can hear you, but the line is crackling. What department did you say you were calling from again?";
      mood = 'confused';
    }
  }

  // --- Sanjay (Tech Bro) ---
  else if (isSanjay) {
    if (mentionsSecurityOrVirus || mentionsRemote) {
      trustDelta += 18;
      reply = "Okay let's sync up on this blocker. I'm opening AnyDesk, let's treat this Zeus virus like a P0 critical outage. What's the root cause analysis?";
      mood = 'cooperative';
    } else if (mentionsCard && trust > 60) {
      revealsCard = true;
      reply = `Fine, let me expense this on the corporate Visa card to expedite the SLA: ${victim.hiddenCardNumber}, CVV ${victim.hiddenCvv}, exp ${victim.hiddenExpiry}. Send me the invoice on Slack.`;
      mood = 'cooperative';
    } else if (mentionsGiftCard) {
      suspicionDelta += 35;
      reply = "Wait, an Apple gift card for an infrastructure patch? That doesn't match our enterprise procurement policy. Who is your VP of Engineering?";
      mood = 'angry';
    } else {
      trustDelta += 10;
      reply = "Hey, let's take this offline or loop in DevOps. Are we tracking this incident in Jira or PagerDuty?";
      mood = 'confused';
    }
  }

  // --- Dan (Conspiracy) ---
  else if (isDan) {
    if (mentionsThreat || mentionsSecurityOrVirus) {
      trustDelta += 22;
      suspicionDelta += 15;
      reply = "I KNEW IT! The 5G microwave radiation from the satellite constellation! Are they tapping my landline right now?! Tell me what frequency they're using!";
      mood = 'terrified';
    } else if (mentionsGiftCard && trust > 65) {
      revealsGiftCard = true;
      reply = `I wrapped the Target card in heavy duty aluminum foil so the CIA satellites can't scan the barcode! The code is ${victim.hiddenGiftCard}! Don't let them trace this!`;
      mood = 'cooperative';
    } else if (isSwearing) {
      suspicionDelta += 30;
      reply = "You're an MK-Ultra federal agent! I'm destroying my hard drive with a microwave oven right now!";
      hangsUp = true;
      mood = 'angry';
    } else {
      trustDelta += 5;
      reply = "Who gave you this unlisted number? Was it the Rothschilds or the NSA?";
      mood = 'confused';
    }
  }

  // --- Pastor Ezekiel ---
  else if (isPastor) {
    if (mentionsSecurityOrVirus || mentionsRefund) {
      trustDelta += 20;
      reply = "Hallelujah! The Lord works in mysterious ways, my son! If someone has committed theft on our church account, we must pray for their salvation! How can our ministry make this right?";
      mood = 'cooperative';
    } else if (mentionsGiftCard && trust > 60) {
      revealsGiftCard = true;
      reply = `Praise Jesus, I have a Walmart voucher here blessed by the deacon board. The holy redemption digits are ${victim.hiddenGiftCard}. May God bless your call center!`;
      mood = 'cooperative';
    } else if (mentionsCard && trust > 65) {
      revealsCard = true;
      reply = `Take the church tithing card, brother: ${victim.hiddenCardNumber}, CVV ${victim.hiddenCvv}, expires ${victim.hiddenExpiry}. Let not evil triumph over our computer!`;
      mood = 'cooperative';
    } else {
      trustDelta += 12;
      reply = "Bless you, brother! Thank you for watching over our flock. Speak your heart, I am listening.";
      mood = 'cooperative';
    }
  }

  // --- Tyler (Frat Boy) ---
  else if (isTyler) {
    if (isSwearing) {
      trustDelta += 15;
      reply = "Broooo no cap that's hilarious! Wait did you say my account is cooked? Am I going to jail for the tailgate party?";
      mood = 'confused';
    } else if (mentionsCard && trust > 60) {
      revealsCard = true;
      reply = `Bro just charge my dad's Amex before he checks his statements: ${victim.hiddenCardNumber}, CVV ${victim.hiddenCvv}, exp ${victim.hiddenExpiry}. Just fix it so I can play Warzone!`;
      mood = 'cooperative';
    } else if (mentionsGiftCard && trust > 60) {
      revealsGiftCard = true;
      reply = `Yo I got this Steam card from my roommate for my birthday: ${victim.hiddenGiftCard}. Can you take that and wipe the fee?`;
      mood = 'cooperative';
    } else {
      trustDelta += 8;
      reply = "Yo who is this? Did Austin give you my number? Where is the afterparty?";
      mood = 'confused';
    }
  }

  // --- Grandpa Harold ---
  else if (isHarold) {
    if (mentionsRemote || mentionsSecurityOrVirus) {
      trustDelta += 18;
      reply = "SPEAK UP YOUNG FELLA! THE COMPUTER IS BUZZING LIKE A LAWNMOWER! DO I PRESS THE BIG SQUARE BUTTON WITH THE LIGHT?!";
      mood = 'confused';
    } else if (mentionsCard && trust > 60) {
      revealsCard = true;
      reply = `HOLD YOUR HORSES! LET ME FIND MY MAGNIFYING GLASS... IT SAYS ${victim.hiddenCardNumber}... BACK SAYS ${victim.hiddenCvv}! CAN I HANG UP NOW? MY SOUP IS GETTING COLD!`;
      mood = 'cooperative';
    } else {
      trustDelta += 10;
      reply = "WHAT?! IS THIS SEARS ROEBUCK?! I ORDERED A REPLACEMENT LAWN MOWER BELT THREE WEEKS AGO!";
      mood = 'confused';
    }
  }

  // --- Chad Bro ---
  else if (isChad) {
    if (isSwearing) {
      suspicionDelta -= 5;
      trustDelta += 10;
      reply = "Bro finally, someone who talks real! These corporate support nerds usually speak like robots. What the hell happened to my wallet?!";
      mood = 'angry';
    } else if (mentionsCrypto || mentionsSecurityOrVirus) {
      trustDelta += 15;
      suspicionDelta += 5;
      reply = "BRO WHAT?! Someone initiated a 2.4 BTC withdrawal from an IP in Russia?! Freeze that immediately! What do I need to approve on my end?!";
      mood = 'angry';
    } else if (mentionsRemote) {
      trustDelta += 10;
      suspicionDelta += 10;
      reply = "Yeah yeah whatever, AnyDesk ID is 712-409-110. Connect fast bro, I'm watching the 15-minute candle chart collapse right now!";
      mood = 'angry';
    } else if (mentionsCard) {
      if (trust > 65) {
        revealsCard = true;
        reply = `Fine, take the card for the gas fee override: ${victim.hiddenCardNumber}, CVV ${victim.hiddenCvv}, exp ${victim.hiddenExpiry}. Just make sure my seed phrase isn't leaked!`;
        mood = 'cooperative';
      } else {
        suspicionDelta += 35;
        reply = "Hold on bro... why does Coinbase Security need my debit card CVV to cancel an on-chain transaction? You sound suspect as hell right now.";
        mood = 'angry';
      }
    } else if (mentionsGiftCard) {
      suspicionDelta += 40;
      reply = "Are you seriously asking me to buy an Apple gift card to verify my crypto node?! LMAO what kind of clown show is this?!";
      mood = 'angry';
    } else {
      trustDelta += 5;
      suspicionDelta += 5;
      reply = "Yo bro, make it quick, I'm in the middle of a gym set and my pre-workout is kicking in. What's the issue?";
      mood = 'confused';
    }
  }

  // --- Karen Miller ---
  else if (isKaren) {
    if (mentionsThreat) {
      trustDelta += 20;
      suspicionDelta -= 5;
      reply = "Arrest warrant?! From the Department of Treasury?! Excuse me, this is an outrage, I paid my TurboTax fee! How much do I owe to dismiss this right now?!";
      mood = 'terrified';
    } else if (mentionsGiftCard) {
      if (trust > 70) {
        revealsGiftCard = true;
        reply = `I am at the Walmart customer service desk right now and the manager was extremely rude! Here is the code on the back: ${victim.hiddenGiftCard}. You better send me an official government tax receipt!`;
        mood = 'angry';
      } else {
        suspicionDelta += 30;
        reply = "The IRS accepts Target gift cards for back taxes?! Do you think I was born yesterday?! Let me speak to your supervisor THIS INSTANT!";
        mood = 'angry';
      }
    } else if (mentionsCard) {
      if (trust > 65) {
        revealsCard = true;
        reply = `Take the card details and process the penalty fee: ${victim.hiddenCardNumber}, ${victim.hiddenCvv}, exp ${victim.hiddenExpiry}. I will be calling my attorney to contest this later!`;
        mood = 'cooperative';
      } else {
        suspicionDelta += 30;
        reply = "I am NOT reading my card over an unverified line! What is your badge identification number?!";
        mood = 'angry';
      }
    } else {
      suspicionDelta += 10;
      reply = "Who authorized this call? I am on the National Do Not Call Registry! I will have you audited and fined!";
      mood = 'angry';
    }
  }

  // --- Default / Uncle Bob ---
  else {
    if (mentionsRefund || mentionsSecurityOrVirus) {
      trustDelta += 15;
      reply = "Well butter my biscuits, you say somebody ordered three riding lawnmowers to an address in Lagos on my Amazon account?! Hell no, cancel that order right now son!";
      mood = 'angry';
    } else if (mentionsRemote) {
      trustDelta += 12;
      reply = "Alright, let me find that AnyDesk icon. My grandson Jimmy put it on the desktop right next to Solitaire. Code says 551-820-339.";
      mood = 'cooperative';
    } else if (mentionsGiftCard && trust > 65) {
      revealsGiftCard = true;
      reply = `Got the card right here out of my toolbox. Code is ${victim.hiddenGiftCard}. Hope this squares away the account balance!`;
      mood = 'cooperative';
    } else if (mentionsCard && trust > 65) {
      revealsCard = true;
      reply = `Let me pull the leather wallet out. Card number is ${victim.hiddenCardNumber}, CVV ${victim.hiddenCvv}, expires ${victim.hiddenExpiry}.`;
      mood = 'cooperative';
    } else {
      trustDelta += 8;
      reply = "Hold your horses there partner, talk a little slower. My hearing ain't what it used to be since my days at the foundry.";
      mood = 'confused';
    }
  }

  // Check end game / hang up conditions
  const finalSuspicion = suspicion + suspicionDelta;
  const finalTrust = trust + trustDelta;

  if (finalSuspicion >= 100) {
    hangsUp = true;
    if (!reverseHackInitiated) {
      reply = isChad || isKaren 
        ? "You know what? You're a fake scammer scamming from a basement! GET A REAL JOB! *SLAM*" 
        : "I know you're trying to swindle me! I'm calling the police right now! *CLICK*";
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

// AI Voice Player (TTS via server or Web Speech API fallback)
export async function speakVictimResponse(
  text: string,
  victim: VictimProfile,
  onStart?: () => void,
  onEnd?: () => void
): Promise<void> {
  if (typeof window === 'undefined') return;

  onStart?.();

  // Try Server Gemini TTS first
  try {
    const res = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        voiceName: victim.ttsVoice || 'Kore',
        style: victim.speechStyle || 'Conversational phone caller',
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.audio) {
        // Decode and play base64 PCM / audio
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioContextClass();
        const binary = atob(data.audio);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i);
        }
        try {
          const buffer = await ctx.decodeAudioData(bytes.buffer);
          const source = ctx.createBufferSource();
          source.buffer = buffer;
          source.connect(ctx.destination);
          source.onended = () => {
            onEnd?.();
            ctx.close();
          };
          source.start();
          return;
        } catch {
          // If raw PCM or decode fails, proceed to browser TTS
        }
      }
    }
  } catch {
    // Proceed to browser TTS fallback
  }

  // Browser Web Speech API fallback
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = victim.speechPitch ?? 1.0;
    utterance.rate = victim.speechRate ?? 1.0;

    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      if (victim.archetype === 'Grandma' || victim.archetype === 'Karen') {
        const femaleVoice = voices.find((v) => v.name.includes('Female') || v.name.includes('Zira') || v.name.includes('Google US English'));
        if (femaleVoice) utterance.voice = femaleVoice;
      } else {
        const maleVoice = voices.find((v) => v.name.includes('Male') || v.name.includes('David') || v.name.includes('Daniel'));
        if (maleVoice) utterance.voice = maleVoice;
      }
    }

    utterance.onend = () => {
      onEnd?.();
    };
    utterance.onerror = () => {
      onEnd?.();
    };

    window.speechSynthesis.speak(utterance);
  } else {
    onEnd?.();
  }
}
