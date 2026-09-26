export type ScamType = 
  | 'TECH_SUPPORT' 
  | 'CRYPTO_SECURITY' 
  | 'REFUND_DEPT' 
  | 'IRS_GOVERNMENT';

export interface ScamInfo {
  id: ScamType;
  title: string;
  department: string;
  defaultScript: string;
  targetLoot: 'CARD' | 'GIFTCARD' | 'CRYPTO';
  icon: string;
  description: string;
}

export interface VictimProfile {
  id: string;
  name: string;
  age: number;
  archetype: 'Grandma' | 'Chad' | 'Scambaiter' | 'Karen' | 'Uncle' | 'TechBro' | 'Conspiracy' | 'Pastor' | 'FratBoy' | 'Grandpa';
  location: string;
  personality: string;
  avatarSeed: string;
  secretNotes?: string;
  baseTrust: number;
  baseSuspicion: number;
  bankBalance: number;
  targetScamPreference?: ScamType;
  hiddenCardNumber?: string;
  hiddenCvv?: string;
  hiddenExpiry?: string;
  hiddenGiftCard?: string;
  cryptoBalance?: number;
  isSpecialTrap?: boolean;
  ttsVoice?: 'Puck' | 'Charon' | 'Kore' | 'Fenrir' | 'Zephyr';
  speechStyle?: string;
  speechPitch?: number;
  speechRate?: number;
}

export interface ChatMessage {
  id: string;
  sender: 'player' | 'victim' | 'system';
  text: string;
  timestamp: string;
  impact?: {
    trustDelta?: number;
    suspicionDelta?: number;
  };
}

export interface ActiveCall {
  victim: VictimProfile;
  scamType: ScamType;
  trust: number;
  suspicion: number;
  history: ChatMessage[];
  status: 'dialing' | 'connected' | 'ended' | 'success' | 'hacked';
  anydeskConnected: boolean;
  anydeskCode: string;
  trojanInfected?: boolean;
  linkSent?: boolean;
  lootRevealed: {
    card?: { number: string; cvv: string; expiry: string };
    giftCard?: string;
    cryptoWire?: number;
  };
  durationSeconds: number;
  isScambaiterRevealed: boolean;
}

export interface Upgrade {
  id: string;
  name: string;
  description: string;
  cost: number;
  icon: string;
  purchased: boolean;
  bonus: string;
}

export interface StolenLoot {
  id: string;
  type: 'CREDIT_CARD' | 'GIFT_CARD' | 'CRYPTO' | 'TROJAN_BACKDOOR';
  victimName: string;
  details: string;
  value: number;
  timestamp: string;
  cashedOut: boolean;
}

export interface PlayerStats {
  balance: number;
  darkWebCryptoBtc: number;
  day: number;
  timeHour: number;
  timeMinute: number;
  successfulScams: number;
  failedCalls: number;
  reverseHacksSuffered: number;
  trojansInstalled: number;
  reputationRank: string;
  activeScamType: ScamType;
  inventory: string[];
}

export type WindowId = 
  | 'DIALER' 
  | 'ANYDESK' 
  | 'BANK_TERMINAL' 
  | 'BLACK_MARKET' 
  | 'DARK_WEB';

export interface WindowState {
  id: WindowId;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  zIndex: number;
}
