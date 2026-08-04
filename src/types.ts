export type AppId =
  | 'settings' | 'phone' | 'messages' | 'camera' | 'gallery' | 'clock'
  | 'calculator' | 'files' | 'internet' | 'music' | 'contacts' | 'notes'
  | 'calendar' | 'weather' | 'email' | 'reminder' | 'recorder' | 'health' | 'smartthings' | 'compass';

export type SystemSettings = {
  theme: 'dark' | 'light';
  accent: string;
  brightness: number;
  fontScale: number;
  sound: number;
  wifi: boolean;
  bluetooth: boolean;
  mobileData: boolean;
  airplane: boolean;
  dnd: boolean;
  flashlight: boolean;
  quiz: boolean;
  battery: number;
  charging: boolean;
  grid: '4x6' | '5x6';
  wallpaper: string;
  pin: string;
};

export type NotificationItem = {
  id: string;
  app: AppId;
  title: string;
  body: string;
  time: string;
  read: boolean;
};

export type Contact = { id: string; name: string; phone: string; email?: string; favorite?: boolean };
export type Message = { id: string; sender: 'me' | 'them'; text?: string; image?: string; time: string };
export type Chat = { id: string; contactId: string; unread: number; messages: Message[] };
export type Note = { id: string; title: string; body: string; updatedAt: string };
export type Photo = { id: string; name: string; dataUrl: string; createdAt: string; kind?: 'image' | 'video' };
export type VirtualFile = { id: string; parentId: string | null; name: string; kind: 'folder' | 'file'; size?: number; content?: string };
export type CallLog = { id: string; contactName: string; phone: string; type: 'incoming' | 'outgoing' | 'missed'; time: string };
export type Alarm = { id: string; time: string; label: string; enabled: boolean };
export type BrowserTab = { id: string; title: string; url: string; history: string[]; historyIndex: number };
export type Track = { id: string; title: string; artist: string; duration: number; frequency: number };
export type Weather = { city: string; temperature: number; condition: string; updatedAt: string };
