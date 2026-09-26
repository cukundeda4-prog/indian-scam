import React, { useState, useEffect, useCallback } from 'react';
import {
  ActiveCall,
  PlayerStats,
  ScamType,
  StolenLoot,
  Upgrade,
  VictimProfile,
  WindowId,
} from './types/game';
import { PRESET_TARGETS, processDialogue, generateRandomVictim, speakVictimResponse } from './utils/dialogueEngine';
import { exportSaveCode, importSaveCode } from './utils/saveState';
import {
  playPhoneRing,
  playHangup,
  playBeep,
  playCashRegister,
  playHackerAlarm,
} from './utils/audio';

import { AsciiDashboard } from './components/AsciiDashboard';
import { Taskbar } from './components/Taskbar';
import { PhoneDialer } from './components/PhoneDialer';
import { AnyDeskRemote } from './components/AnyDeskRemote';
import { BankTerminal } from './components/BankTerminal';
import { BlackMarketShop } from './components/BlackMarketShop';
import { DarkWebWallet } from './components/DarkWebWallet';
import { TitleScreen } from './components/TitleScreen';
import { ReverseHackModal } from './components/ReverseHackModal';
import { SaveLoadModal } from './components/SaveLoadModal';
import { TrojanExfiltrationModal } from './components/TrojanExfiltrationModal';

const DEFAULT_UPGRADES: Upgrade[] = [
  {
    id: 'voip_spoofer',
    name: 'Caller ID Spoofer v4',
    description: 'Displays official 1-800 Microsoft / IRS numbers on caller phone screen.',
    cost: 350,
    icon: 'Radio',
    purchased: false,
    bonus: '+20% Starting Caller Trust',
  },
  {
    id: 'soundboard',
    name: 'Call Center Audio Soundboard',
    description: 'Synthesizes typing noises, federal sirens, and background call center murmur.',
    cost: 200,
    icon: 'Headphones',
    purchased: false,
    bonus: '+10% Trust on all scripts',
  },
  {
    id: 'luhn_cracker',
    name: 'Quantum Luhn Card Cracker',
    description: 'AI algorithm that predicts valid CVV codes for compromised card batches.',
    cost: 500,
    icon: 'Cpu',
    purchased: false,
    bonus: 'Autofills CVV on cards',
  },
  {
    id: 'scambaiter_firewall',
    name: 'Anti-Scambaiter Reverse RAT Shield',
    description: 'Blocks reverse payloads from YouTube scambaiters, preventing PC wipe.',
    cost: 650,
    icon: 'ShieldCheck',
    purchased: false,
    bonus: 'Immune to 1st reverse hack',
  },
  {
    id: 'syskey_pro',
    name: 'Syskey Enterprise Locker',
    description: 'Instantly locks victim desktop with uncrackable 128-character master key.',
    cost: 900,
    icon: 'Lock',
    purchased: false,
    bonus: '+30% Leverage in Tech Scams',
  },
];

export default function App() {
  const [gameState, setGameState] = useState<'TITLE' | 'PLAYING'>('TITLE');
  const [activeWindow, setActiveWindow] = useState<WindowId>('DIALER');

  const [stats, setStats] = useState<PlayerStats>({
    balance: 0,
    darkWebCryptoBtc: 0,
    day: 1,
    timeHour: 9,
    timeMinute: 15,
    successfulScams: 0,
    failedCalls: 0,
    reverseHacksSuffered: 0,
    trojansInstalled: 0,
    reputationRank: 'Script Kiddie',
    activeScamType: 'REFUND_DEPT',
    inventory: [],
  });

  const [upgrades, setUpgrades] = useState<Upgrade[]>(DEFAULT_UPGRADES);
  const [lootHistory, setLootHistory] = useState<StolenLoot[]>([]);
  const [currentCall, setCurrentCall] = useState<ActiveCall | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isReverseHacked, setIsReverseHacked] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isCallerSpeaking, setIsCallerSpeaking] = useState(false);
  const [pendingTrojanLoot, setPendingTrojanLoot] = useState<{ victim: VictimProfile; amount: number } | null>(null);

  // Simulated Time Clock
  useEffect(() => {
    if (gameState !== 'PLAYING') return;

    const timer = setInterval(() => {
      setStats((prev) => {
        let newMin = prev.timeMinute + 1;
        let newHour = prev.timeHour;
        let newDay = prev.day;

        if (newMin >= 60) {
          newMin = 0;
          newHour += 1;
        }
        if (newHour >= 21) {
          // Night shift reset
          newHour = 9;
          newDay += 1;
        }

        return {
          ...prev,
          timeMinute: newMin,
          timeHour: newHour,
          day: newDay,
        };
      });

      // Call duration increment
      if (currentCall && currentCall.status === 'connected') {
        setCurrentCall((prev) => (prev ? { ...prev, durationSeconds: prev.durationSeconds + 1 } : null));
      }
    }, 2000);

    return () => clearInterval(timer);
  }, [gameState, currentCall?.status]);

  // Global hotkeys (1-5 for apps)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        return;
      }
      if (e.key === '1') setActiveWindow('DIALER');
      if (e.key === '2') setActiveWindow('ANYDESK');
      if (e.key === '3') setActiveWindow('BANK_TERMINAL');
      if (e.key === '4') setActiveWindow('BLACK_MARKET');
      if (e.key === '5') setActiveWindow('DARK_WEB');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const timeStr = `${stats.timeHour.toString().padStart(2, '0')}:${stats.timeMinute.toString().padStart(2, '0')} EST`;

  // Start Call Handler
  const handleStartCall = useCallback(
    (target: VictimProfile, scamType?: ScamType) => {
      const chosenScam = scamType || stats.activeScamType;
      playPhoneRing();

      // Check for VoIP spoofer upgrade bonus (+20 Trust)
      const hasVoip = upgrades.some((u) => u.id === 'voip_spoofer' && u.purchased);
      const startingTrust = Math.min(100, target.baseTrust + (hasVoip ? 20 : 0));

      const getGreeting = (t: VictimProfile) => {
        switch (t.archetype) {
          case 'Grandma':
            return 'Hello? Who is this? My grandson Jimmy told me never to answer unknown numbers...';
          case 'Chad':
            return 'Yo, who is this calling during my workout? Speak fast.';
          case 'Scambaiter':
            return 'Hello there! Thank you for calling, my computer has been doing very strange things!';
          case 'Karen':
            return 'Yes? Who authorized this telephone call to my personal device?';
          case 'TechBro':
            return 'Hey, is this DevOps? Did the AWS production cluster crash again?';
          case 'Conspiracy':
            return 'Who is this?! Did the satellite surveillance team give you my private landline?!';
          case 'Pastor':
            return 'Praise the Lord! Fellowship Church, Pastor Ezekiel speaking. How may I bless you?';
          case 'FratBoy':
            return 'Bro who is this? Did Austin give you my number for the tailgate party?';
          case 'Grandpa':
            return 'HELLO?! IS THIS SEARS ROEBUCK?! I CAN BARELY HEAR YOU, TALK LOUDER!';
          default:
            return 'Hello? Who is calling?';
        }
      };

      const initialGreeting = getGreeting(target);

      const newCall: ActiveCall = {
        victim: target,
        scamType: chosenScam,
        trust: startingTrust,
        suspicion: target.baseSuspicion,
        status: 'connected',
        anydeskConnected: false,
        anydeskCode: `${Math.floor(100 + Math.random() * 900)}-${Math.floor(100 + Math.random() * 900)}-${Math.floor(100 + Math.random() * 900)}`,
        lootRevealed: {},
        durationSeconds: 0,
        isScambaiterRevealed: false,
        history: [
          {
            id: 'init-1',
            sender: 'system',
            text: `[VOIP SERVER]: Autodialer connected to ${target.name} (${target.location}). Ringing established...`,
            timestamp: timeStr,
          },
          {
            id: 'init-2',
            sender: 'victim',
            text: initialGreeting,
            timestamp: timeStr,
          },
        ],
      };

      setCurrentCall(newCall);
      setActiveWindow('DIALER');

      // AI voice response playback
      if (!isMuted) {
        setTimeout(() => {
          speakVictimResponse(
            initialGreeting,
            target,
            () => setIsCallerSpeaking(true),
            () => setIsCallerSpeaking(false)
          );
        }, 500);
      }
    },
    [stats.activeScamType, timeStr, upgrades, isMuted]
  );

  // Random Autodialer Handler
  const handleStartRandomCall = useCallback(
    (scamType?: ScamType) => {
      const randomTarget = generateRandomVictim(currentCall?.victim.id);
      handleStartCall(randomTarget, scamType);
    },
    [currentCall?.victim.id, handleStartCall]
  );

  // Hangup Handler
  const handleHangup = useCallback(() => {
    playHangup();
    if (currentCall) {
      setStats((prev) => ({ ...prev, failedCalls: prev.failedCalls + 1 }));
      setCurrentCall((prev) =>
        prev
          ? {
              ...prev,
              status: 'ended',
              history: [
                ...prev.history,
                {
                  id: `sys-${Date.now()}`,
                  sender: 'system',
                  text: '[LINE DISCONNECTED] The operator terminated the call.',
                  timestamp: timeStr,
                },
              ],
            }
          : null
      );
      setTimeout(() => setCurrentCall(null), 1200);
    }
  }, [currentCall, timeStr]);

  // Send Dialogue Message
  const handleSendMessage = async (msg: string) => {
    if (!currentCall || isProcessing) return;

    const userMsgId = `p-${Date.now()}`;
    const updatedHistory = [
      ...currentCall.history,
      {
        id: userMsgId,
        sender: 'player' as const,
        text: msg,
        timestamp: timeStr,
      },
    ];

    setCurrentCall({
      ...currentCall,
      history: updatedHistory,
    });

    setIsProcessing(true);

    try {
      const result = await processDialogue(currentCall, msg);

      const hasSoundboard = upgrades.some((u) => u.id === 'soundboard' && u.purchased);
      const effectiveTrustDelta = result.trustDelta > 0 && hasSoundboard ? result.trustDelta + 5 : result.trustDelta;

      const newTrust = Math.max(0, Math.min(100, currentCall.trust + effectiveTrustDelta));
      const newSuspicion = Math.max(0, Math.min(100, currentCall.suspicion + result.suspicionDelta));

      const victimMsgId = `v-${Date.now()}`;
      const newHistory = [
        ...updatedHistory,
        {
          id: victimMsgId,
          sender: 'victim' as const,
          text: result.reply,
          timestamp: timeStr,
          impact: {
            trustDelta: effectiveTrustDelta,
            suspicionDelta: result.suspicionDelta,
          },
        },
      ];

      // Check for Scambaiter Reverse Hack
      if (result.reverseHackInitiated) {
        const hasFirewall = upgrades.some((u) => u.id === 'scambaiter_firewall' && u.purchased);
        if (hasFirewall) {
          // Firewall protects the player!
          newHistory.push({
            id: `fw-${Date.now()}`,
            sender: 'system',
            text: '[FIREWALL INTERCEPT] Anti-Scambaiter RAT Shield blocked the incoming reverse intrusion! Jim failed to format your drive.',
            timestamp: timeStr,
          });
          setCurrentCall({
            ...currentCall,
            trust: 0,
            suspicion: 100,
            history: newHistory,
            status: 'ended',
          });
          handleHangup();
        } else {
          playHackerAlarm();
          setIsReverseHacked(true);
          setStats((prev) => ({
            ...prev,
            reverseHacksSuffered: prev.reverseHacksSuffered + 1,
            failedCalls: prev.failedCalls + 1,
          }));
          setCurrentCall(null);
          setIsProcessing(false);
          return;
        }
      }

      // Check if victim reveals card or giftcard
      const lootRevealed = { ...currentCall.lootRevealed };
      if (result.revealsCard && result.cardNumber) {
        lootRevealed.card = {
          number: result.cardNumber,
          cvv: result.cardCvv || '341',
          expiry: result.cardExpiry || '08/28',
        };
        newHistory.push({
          id: `loot-card-${Date.now()}`,
          sender: 'system',
          text: `[STOLEN INTEL]: Credit Card Captured! Number: ${result.cardNumber} | CVV: ${result.cardCvv || '341'}. Open Bank Terminal [3] to charge!`,
          timestamp: timeStr,
        });
      }

      if (result.revealsGiftCard && result.giftCardCode) {
        lootRevealed.giftCard = result.giftCardCode;
        newHistory.push({
          id: `loot-gift-${Date.now()}`,
          sender: 'system',
          text: `[STOLEN INTEL]: Gift Card Code Captured! Code: ${result.giftCardCode}. Open Bank Terminal [3] to redeem!`,
          timestamp: timeStr,
        });
      }

      // Check if caller hung up
      if (result.hangsUp) {
        playHangup();
        newHistory.push({
          id: `hangup-${Date.now()}`,
          sender: 'system',
          text: '[CALL ENDED]: The victim hung up the phone.',
          timestamp: timeStr,
        });
        setStats((prev) => ({ ...prev, failedCalls: prev.failedCalls + 1 }));
        setCurrentCall({
          ...currentCall,
          trust: newTrust,
          suspicion: newSuspicion,
          history: newHistory,
          lootRevealed,
          status: 'ended',
        });
        setTimeout(() => setCurrentCall(null), 2500);
      } else {
        setCurrentCall({
          ...currentCall,
          trust: newTrust,
          suspicion: newSuspicion,
          history: newHistory,
          lootRevealed,
        });
      }

      // AI Voice Speech Synthesis for victim response
      if (!isMuted && result.reply) {
        speakVictimResponse(
          result.reply,
          currentCall.victim,
          () => setIsCallerSpeaking(true),
          () => setIsCallerSpeaking(false)
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Connect AnyDesk Remote
  const handleConnectAnydesk = () => {
    if (!currentCall || currentCall.anydeskConnected) return;

    playBeep(850, 0.15);
    setCurrentCall({
      ...currentCall,
      anydeskConnected: true,
      trust: Math.min(100, currentCall.trust + 15),
      history: [
        ...currentCall.history,
        {
          id: `ad-${Date.now()}`,
          sender: 'system',
          text: `[ANYDESK ESTABLISHED]: Connected to remote desktop (${currentCall.victim.name}). AnyDesk Terminal [2] is now live!`,
          timestamp: timeStr,
        },
      ],
    });
    setActiveWindow('ANYDESK');
  };

  // Send Phishing / Trojan Link (Victim clicks if suspicion < 20%)
  const handleSendMaliciousLink = () => {
    if (!currentCall || currentCall.status !== 'connected') return;

    if (currentCall.trojanInfected) {
      playBeep(250, 0.1);
      return;
    }

    const urlMap: Record<ScamType, string> = {
      TECH_SUPPORT: 'http://microsoft-quick-assist-patch.net/update.exe',
      CRYPTO_SECURITY: 'http://coinbase-wallet-safeguard.io/auth',
      REFUND_DEPT: 'http://target-amazon-instant-refund.com/claim',
      IRS_GOVERNMENT: 'http://treasury-department-settlement.gov-portal.org/resolve',
    };

    const sentUrl = urlMap[currentCall.scamType] || 'http://secure-system-update.org/patch.exe';

    // Condition: Suspicion must be < 20%
    if (currentCall.suspicion >= 20) {
      playBeep(250, 0.2);
      const refusalTexts: Record<string, string> = {
        Grandma: "A link on my computer screen? Heavens no, my grandson Jimmy said never to click blue words!",
        Chad: "Bro why are you sending me a weird URL? That looks like a phishing scam, I'm not clicking that shit!",
        Scambaiter: "Oh, a link to 'update.exe'? That looks super legit... wait, let me run that inside my virtual sandbox!",
        Karen: "I am NOT clicking unverified hyperlinks! What kind of operation is this?!",
        TechBro: "Wait, this URL has no SSL certificate and an unverified domain origin. Our security team would flag this instantly.",
        Conspiracy: "A link from an unknown IP address?! That's a federal backdoor tracking beacon! Nice try FBI!",
        Pastor: "I dare not click worldly links that I do not recognize, brother.",
        FratBoy: "Bro that link looks mad sketchy, I ain't trying to brick my gaming PC.",
        Grandpa: "WHAT LINK?! WHERE IS IT?! I DON'T SEE NO BLUE WRITING ON THIS TELEVISION!",
      };

      const reply = refusalTexts[currentCall.victim.archetype] || "I don't trust that link. I'm not clicking it!";
      const newSuspicion = Math.min(100, currentCall.suspicion + 15);

      const updatedHistory = [
        ...currentCall.history,
        {
          id: `link-refuse-p-${Date.now()}`,
          sender: 'player' as const,
          text: `[SENT PHISHING LINK]: ${sentUrl}`,
          timestamp: timeStr,
        },
        {
          id: `link-refuse-v-${Date.now()}`,
          sender: 'victim' as const,
          text: reply,
          timestamp: timeStr,
          impact: { suspicionDelta: 15 },
        },
      ];

      setCurrentCall({
        ...currentCall,
        suspicion: newSuspicion,
        history: updatedHistory,
      });

      if (!isMuted) {
        speakVictimResponse(
          reply,
          currentCall.victim,
          () => setIsCallerSpeaking(true),
          () => setIsCallerSpeaking(false)
        );
      }
    } else {
      // SUCCESS: Suspicion < 20%! Victim falls for the phishing link!
      playBeep(850, 0.2);
      const clickTexts: Record<string, string> = {
        Grandma: "Okay sweetheart, I clicked the little blue link you sent. A box popped up with a green bar saying 'Installing Security Patch'!",
        Chad: "Alright bro, clicked it. My screen flashed black for a second. Is the patch downloading into my wallet node?",
        Scambaiter: "Okay, I clicked it! Oh gosh, it says 'Trojan.Win32.ZeusScamMaster running with administrator privileges'!",
        Karen: "Fine, I clicked the link. It better clear my tax audit immediately!",
        TechBro: "Clicked the link. The binary payload executed in a background thread pool. Syncing credentials now.",
        Conspiracy: "I clicked it! The monitor is making a high-pitched alien frequency! Is the malware being purged?!",
        Pastor: "Praise the Lord, I clicked your link! It said 'Church computer blessed and updated'!",
        FratBoy: "Yo clicked it bro, said installation finished. We chill now?",
        Grandpa: "I CLICKED THE BUTTON! A BUNCH OF LETTERS FLEW ACROSS THE GLASS! DID IT FIX MY SOLITAIRE?!",
      };

      const reply = clickTexts[currentCall.victim.archetype] || "Okay, I clicked the link and allowed it to run!";
      const lootAmount = Math.floor(2500 + Math.random() * 2000);

      const updatedHistory = [
        ...currentCall.history,
        {
          id: `link-success-p-${Date.now()}`,
          sender: 'player' as const,
          text: `[SENT PHISHING LINK]: ${sentUrl}`,
          timestamp: timeStr,
        },
        {
          id: `link-success-v-${Date.now()}`,
          sender: 'victim' as const,
          text: reply,
          timestamp: timeStr,
          impact: { trustDelta: 20 },
        },
        {
          id: `link-success-sys-${Date.now()}`,
          sender: 'system' as const,
          text: `[TROJAN BACKDOOR ACTIVE]: Remote payload executed! Scraped Card (${currentCall.victim.hiddenCardNumber}) and extracted $${lootAmount.toLocaleString()}!`,
          timestamp: timeStr,
        },
      ];

      setCurrentCall({
        ...currentCall,
        trojanInfected: true,
        anydeskConnected: true,
        trust: 100,
        history: updatedHistory,
        lootRevealed: {
          card: {
            number: currentCall.victim.hiddenCardNumber || '4112 9021 3499 8120',
            cvv: currentCall.victim.hiddenCvv || '719',
            expiry: currentCall.victim.hiddenExpiry || '11/27',
          },
          giftCard: currentCall.victim.hiddenGiftCard,
        },
      });

      if (!isMuted) {
        speakVictimResponse(
          reply,
          currentCall.victim,
          () => setIsCallerSpeaking(true),
          () => setIsCallerSpeaking(false)
        );
      }

      setPendingTrojanLoot({
        victim: currentCall.victim,
        amount: lootAmount,
      });
    }
  };

  const handleClaimTrojanLoot = () => {
    if (!pendingTrojanLoot) return;
    const { victim, amount } = pendingTrojanLoot;

    const newLoot: StolenLoot = {
      id: `loot-trojan-${Date.now()}`,
      type: 'TROJAN_BACKDOOR',
      victimName: victim.name,
      details: `Trojan Root Exploit · Card: **** ${victim.hiddenCardNumber?.slice(-4) || '9912'}`,
      value: amount,
      timestamp: timeStr,
      cashedOut: true,
    };

    setStats((prev) => ({
      ...prev,
      balance: prev.balance + amount,
      successfulScams: prev.successfulScams + 1,
      trojansInstalled: prev.trojansInstalled + 1,
    }));

    setLootHistory((prev) => [newLoot, ...prev]);
    setPendingTrojanLoot(null);
  };

  // Terminal Slash Commands Handler
  const handleCommand = (rawCommand: string) => {
    const parts = rawCommand.trim().split(' ');
    const cmd = parts[0].toLowerCase();
    const arg1 = parts[1];
    const arg2 = parts[2];

    switch (cmd) {
      case '/dial': {
        const type = (arg1?.toUpperCase() as ScamType) || stats.activeScamType;
        const validTypes: ScamType[] = ['TECH_SUPPORT', 'CRYPTO_SECURITY', 'REFUND_DEPT', 'IRS_GOVERNMENT'];
        const chosenType = validTypes.includes(type) ? type : stats.activeScamType;
        const randomTarget = generateRandomVictim(currentCall?.victim.id);
        handleStartCall(randomTarget, chosenType);
        break;
      }
      case '/connect': {
        handleConnectAnydesk();
        break;
      }
      case '/send_link': {
        handleSendMaliciousLink();
        break;
      }
      case '/input_card': {
        if (!arg1 || !arg2) {
          playBeep(250, 0.1);
          return;
        }
        handleProcessCard(arg1, arg2);
        setActiveWindow('BANK_TERMINAL');
        break;
      }
      case '/input_giftcard': {
        if (!arg1) {
          playBeep(250, 0.1);
          return;
        }
        handleProcessGiftCard(arg1);
        setActiveWindow('BANK_TERMINAL');
        break;
      }
      case '/hangup': {
        handleHangup();
        break;
      }
      case '/save': {
        setIsSaveModalOpen(true);
        break;
      }
      case '/load': {
        if (arg1) {
          handleLoadSaveState(arg1);
        } else {
          setIsSaveModalOpen(true);
        }
        break;
      }
      default:
        playBeep(250, 0.1);
    }
  };

  // AnyDesk interactive minigames callbacks
  const handleRunTreeCommand = () => {
    if (!currentCall) return;
    setCurrentCall({
      ...currentCall,
      trust: Math.min(100, currentCall.trust + 15),
      history: [
        ...currentCall.history,
        {
          id: `tree-${Date.now()}`,
          sender: 'system',
          text: '[ANYDESK]: Ran "tree /f" fake virus diagnostics scan. Victim is terrified (+15 Trust).',
          timestamp: timeStr,
        },
      ],
    });
  };

  const handleLockSyskey = () => {
    if (!currentCall) return;
    setCurrentCall({
      ...currentCall,
      trust: Math.max(10, currentCall.trust - 10),
      suspicion: Math.min(100, currentCall.suspicion + 25),
      history: [
        ...currentCall.history,
        {
          id: `syskey-${Date.now()}`,
          sender: 'system',
          text: '[SYSKEY EXECUTED]: Victim PC locked with master startup password! High leverage gained.',
          timestamp: timeStr,
        },
      ],
    });
  };

  const handleInspectRefund = (amount: number) => {
    if (!currentCall) return;
    setCurrentCall({
      ...currentCall,
      trust: Math.min(100, currentCall.trust + 20),
      suspicion: Math.max(0, currentCall.suspicion - 10),
      history: [
        ...currentCall.history,
        {
          id: `inspect-${Date.now()}`,
          sender: 'system',
          text: `[INSPECT ELEMENT]: Displayed balance altered to fake an accidental +$${amount.toLocaleString()} over-refund!`,
          timestamp: timeStr,
        },
      ],
    });
  };

  // Process Card
  const handleProcessCard = (cardNum: string, cvv: string, expiry = '08/28') => {
    const cleanNum = cardNum.replace(/\s+/g, '');
    if (cleanNum.length < 12) {
      return { success: false, message: 'Invalid card length. Must be at least 12-16 digits.' };
    }

    const value = Math.floor(1500 + Math.random() * 2500);
    const newLoot: StolenLoot = {
      id: `loot-${Date.now()}`,
      type: 'CREDIT_CARD',
      victimName: currentCall?.victim.name || 'Anonymous Victim',
      details: `Card **** **** **** ${cleanNum.slice(-4)} | CVV: ${cvv}`,
      value,
      timestamp: timeStr,
      cashedOut: true,
    };

    setStats((prev) => ({
      ...prev,
      balance: prev.balance + value,
      successfulScams: prev.successfulScams + 1,
    }));
    setLootHistory((prev) => [newLoot, ...prev]);

    return {
      success: true,
      message: `Successfully liquidated card! $${value.toLocaleString()} deposited to offshore account.`,
      loot: newLoot,
    };
  };

  // Process Gift Card
  const handleProcessGiftCard = (code: string) => {
    if (code.length < 6) {
      return { success: false, message: 'Invalid gift card code length.' };
    }

    const value = Math.floor(500 + Math.random() * 1000);
    const newLoot: StolenLoot = {
      id: `loot-gc-${Date.now()}`,
      type: 'GIFT_CARD',
      victimName: currentCall?.victim.name || 'Anonymous Victim',
      details: `Code: ${code.toUpperCase()}`,
      value,
      timestamp: timeStr,
      cashedOut: true,
    };

    setStats((prev) => ({
      ...prev,
      balance: prev.balance + value,
      successfulScams: prev.successfulScams + 1,
    }));
    setLootHistory((prev) => [newLoot, ...prev]);

    return {
      success: true,
      message: `Gift card redeemed via P2P exchange! +$${value.toLocaleString()} cleared to bank balance.`,
      loot: newLoot,
    };
  };

  // Black Market purchase upgrade
  const handlePurchaseUpgrade = (id: string) => {
    const item = upgrades.find((u) => u.id === id);
    if (!item || stats.balance < item.cost) return false;

    setStats((prev) => ({ ...prev, balance: prev.balance - item.cost }));
    setUpgrades((prev) => prev.map((u) => (u.id === id ? { ...u, purchased: true } : u)));
    return true;
  };

  // Launder money into Bitcoin
  const handleLaunderMoney = (amount: number) => {
    if (stats.balance < amount) return { success: false, btcAdded: 0 };

    const BTC_RATE = 64000;
    const btcAdded = amount / BTC_RATE;

    setStats((prev) => ({
      ...prev,
      balance: prev.balance - amount,
      darkWebCryptoBtc: prev.darkWebCryptoBtc + btcAdded,
    }));

    return { success: true, btcAdded };
  };

  // Save / Load Handlers
  const currentSaveCode = exportSaveCode(stats, lootHistory, upgrades);

  const handleLoadSaveState = (code: string) => {
    const loaded = importSaveCode(code);
    if (!loaded) return false;

    setStats(loaded.stats);
    setLootHistory(loaded.lootHistory || []);
    setUpgrades(loaded.upgrades || DEFAULT_UPGRADES);
    setGameState('PLAYING');
    return true;
  };

  const handleTitleStart = (initialScam: ScamType) => {
    setStats((prev) => ({ ...prev, activeScamType: initialScam }));
    setGameState('PLAYING');
    setTimeout(() => {
      handleStartRandomCall(initialScam);
    }, 400);
  };

  if (gameState === 'TITLE') {
    return <TitleScreen onStartGame={handleTitleStart} onLoadGame={handleLoadSaveState} />;
  }

  return (
    <div className="flex flex-col h-screen w-screen bg-black text-zinc-100 font-mono overflow-hidden">
      {/* 1. VIRTUAL DESKTOP ENGINE: Windows-Style ASCII Dashboard at top as requested */}
      <AsciiDashboard
        timeStr={timeStr}
        day={stats.day}
        activeScamType={stats.activeScamType}
        bankBalance={stats.balance}
        trust={currentCall?.trust ?? 0}
        suspicion={currentCall?.suspicion ?? 0}
        activeWindow={activeWindow}
        onSelectApp={(app) => setActiveWindow(app)}
        isCallActive={Boolean(currentCall && currentCall.status === 'connected')}
        trojansInstalled={stats.trojansInstalled}
      />

      {/* 2. Main Desktop Workstation Area (Render Active Application Window) */}
      <div className="flex-1 relative overflow-hidden bg-zinc-950">
        {activeWindow === 'DIALER' && (
          <PhoneDialer
            currentCall={currentCall}
            activeScamType={stats.activeScamType}
            onSetScamType={(scam) => setStats((prev) => ({ ...prev, activeScamType: scam }))}
            onStartRandomCall={handleStartRandomCall}
            onHangup={handleHangup}
            onSendMessage={handleSendMessage}
            onConnectAnydesk={handleConnectAnydesk}
            onSendMaliciousLink={handleSendMaliciousLink}
            onCommand={handleCommand}
            isProcessing={isProcessing}
            isCallerSpeaking={isCallerSpeaking}
          />
        )}

        {activeWindow === 'ANYDESK' && (
          <AnyDeskRemote
            currentCall={currentCall}
            onRunTreeCommand={handleRunTreeCommand}
            onLockSyskey={handleLockSyskey}
            onInspectElementRefund={handleInspectRefund}
            onConnectRemote={handleConnectAnydesk}
          />
        )}

        {activeWindow === 'BANK_TERMINAL' && (
          <BankTerminal
            balance={stats.balance}
            lootHistory={lootHistory}
            onProcessCard={handleProcessCard}
            onProcessGiftCard={handleProcessGiftCard}
          />
        )}

        {activeWindow === 'BLACK_MARKET' && (
          <BlackMarketShop
            balance={stats.balance}
            upgrades={upgrades}
            onPurchaseUpgrade={handlePurchaseUpgrade}
          />
        )}

        {activeWindow === 'DARK_WEB' && (
          <DarkWebWallet stats={stats} onLaunderMoney={handleLaunderMoney} />
        )}
      </div>

      {/* 3. Windows Taskbar */}
      <Taskbar
        activeWindow={activeWindow}
        onSelectWindow={(w) => setActiveWindow(w)}
        timeStr={timeStr}
        onOpenSaveModal={() => setIsSaveModalOpen(true)}
        isMuted={isMuted}
        onToggleMute={() => setIsMuted(!isMuted)}
        isCallActive={Boolean(currentCall && currentCall.status === 'connected')}
      />

      {/* Scambaiter Reverse Hack Modal */}
      {isReverseHacked && (
        <ReverseHackModal
          victimName="Scambaiter Jim"
          repairCost={500}
          playerBalance={stats.balance}
          onPayRepair={() => {
            playCashRegister();
            setStats((prev) => ({ ...prev, balance: Math.max(0, prev.balance - 500) }));
            setIsReverseHacked(false);
          }}
          onSolveReboot={() => {
            setIsReverseHacked(false);
          }}
        />
      )}

      {/* Trojan Phishing Link Exfiltration Modal */}
      {pendingTrojanLoot && (
        <TrojanExfiltrationModal
          victim={pendingTrojanLoot.victim}
          stolenAmount={pendingTrojanLoot.amount}
          onClaimLoot={handleClaimTrojanLoot}
        />
      )}

      {/* Save / Load State Modal */}
      <SaveLoadModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        saveCode={currentSaveCode}
        onLoadCode={handleLoadSaveState}
      />
    </div>
  );
}
