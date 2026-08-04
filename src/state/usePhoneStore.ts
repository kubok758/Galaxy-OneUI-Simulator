import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Alarm, AppId, BrowserTab, CallLog, Chat, Contact, Note, NotificationItem,
  Photo, SystemSettings, Track, VirtualFile, Weather,
} from '../types';

const nowTime = () => new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
const uid = () => crypto.randomUUID();

const initialContacts: Contact[] = [
  { id: 'c1', name: 'Алексей Орлов', phone: '+7 921 555-01-02', email: 'alexey@example.com', favorite: true },
  { id: 'c2', name: 'Мария Соколова', phone: '+7 911 440-22-19', email: 'maria@example.com' },
  { id: 'c3', name: 'Дмитрий Волков', phone: '+7 999 100-88-12' },
  { id: 'c4', name: 'Служба Samsung', phone: '8 800 555-55-55' },
];

const initialNotifications: NotificationItem[] = [
  { id: 'n1', app: 'messages', title: 'Мария Соколова', body: 'Фотографии получились отлично!', time: '10:42', read: false },
  { id: 'n2', app: 'phone', title: 'Пропущенный вызов', body: 'Алексей Орлов, 2 минуты назад', time: '10:39', read: false },
  { id: 'n3', app: 'gallery', title: 'Галерея', body: 'Создана подборка «На этой неделе»', time: '09:58', read: false },
  { id: 'n4', app: 'settings', title: 'Защита устройства', body: 'Проверка завершена: угроз не найдено', time: '09:35', read: false },
  { id: 'n5', app: 'clock', title: 'Будильник', body: 'Следующий сигнал завтра в 08:00', time: '09:20', read: false },
  { id: 'n6', app: 'music', title: 'Samsung Music', body: 'Продолжить воспроизведение?', time: 'Вчера', read: true },
  { id: 'n7', app: 'files', title: 'Мои файлы', body: 'Загрузка документа завершена', time: 'Вчера', read: true },
  { id: 'n8', app: 'internet', title: 'Samsung Internet', body: '3 вкладки открыты', time: 'Вчера', read: true },
  { id: 'n9', app: 'notes', title: 'Samsung Notes', body: 'Не забудьте завершить список покупок', time: 'Пн', read: true },
  { id: 'n10', app: 'contacts', title: 'Контакты', body: 'Резервное копирование выполнено', time: 'Пн', read: true },
];

const initialChats: Chat[] = [
  { id: 'chat1', contactId: 'c2', unread: 1, messages: [
    { id: 'm1', sender: 'them', text: 'Привет! Как тебе новый One UI?', time: '10:37' },
    { id: 'm2', sender: 'me', text: 'Очень плавный, особенно анимации.', time: '10:39' },
    { id: 'm3', sender: 'them', text: 'Фотографии получились отлично!', time: '10:42' },
  ]},
  { id: 'chat2', contactId: 'c1', unread: 0, messages: [
    { id: 'm4', sender: 'them', text: 'Созвонимся вечером?', time: 'Вчера' },
  ]},
];

const initialFiles: VirtualFile[] = [
  { id: 'root-docs', parentId: null, name: 'Документы', kind: 'folder' },
  { id: 'root-downloads', parentId: null, name: 'Загрузки', kind: 'folder' },
  { id: 'root-images', parentId: null, name: 'Изображения', kind: 'folder' },
  { id: 'f1', parentId: 'root-docs', name: 'Планы.txt', kind: 'file', size: 1840, content: 'Проверить новый симулятор One UI\nНастроить виджеты\nДобавить контакты' },
  { id: 'f2', parentId: 'root-downloads', name: 'README.txt', kind: 'file', size: 720, content: 'Файловая система симулятора хранится локально в браузере.' },
];

const tracks: Track[] = [
  { id: 't1', title: 'Neon Boulevard', artist: 'Galaxy Studio', duration: 192, frequency: 220 },
  { id: 't2', title: 'Midnight Interface', artist: 'One Sound', duration: 238, frequency: 261.63 },
  { id: 't3', title: 'Blue Horizon', artist: 'Dynamic Color', duration: 205, frequency: 329.63 },
  { id: 't4', title: 'Aurora Glass', artist: 'Samsung Sessions', duration: 176, frequency: 392 },
];

export type PhoneState = {
  locked: boolean;
  currentApp: AppId | null;
  appHistory: AppId[];
  runningApps: AppId[];
  recentsOpen: boolean;
  shadeLevel: 0 | 1 | 2;
  homePage: number;
  homePages: AppId[][];
  snapshots: Partial<Record<AppId, string>>;
  toast: string | null;
  settings: SystemSettings;
  notifications: NotificationItem[];
  contacts: Contact[];
  chats: Chat[];
  notes: Note[];
  photos: Photo[];
  files: VirtualFile[];
  calls: CallLog[];
  alarms: Alarm[];
  tabs: BrowserTab[];
  activeTabId: string;
  tracks: Track[];
  currentTrackId: string;
  weather: Weather;
  openApp: (id: AppId) => void;
  closeApp: () => void;
  goBack: () => void;
  goHome: () => void;
  setLocked: (value: boolean) => void;
  verifyPin: (pin: string) => boolean;
  setShade: (value: 0 | 1 | 2) => void;
  setRecents: (value: boolean) => void;
  closeRecent: (id: AppId) => void;
  clearRecents: () => void;
  setHomePage: (page: number) => void;
  moveAppToPage: (id: AppId, page: number) => void;
  setSnapshot: (id: AppId, dataUrl: string) => void;
  updateSetting: <K extends keyof SystemSettings>(key: K, value: SystemSettings[K]) => void;
  toggleSetting: (key: 'wifi' | 'bluetooth' | 'mobileData' | 'airplane' | 'dnd' | 'flashlight' | 'quiz' | 'charging') => void;
  showToast: (message: string) => void;
  clearToast: () => void;
  markNotificationRead: (id: string) => void;
  dismissNotification: (id: string) => void;
  sendMessage: (chatId: string, payload: { text?: string; image?: string }) => void;
  addContact: (contact: Omit<Contact, 'id'>) => void;
  updateContact: (id: string, patch: Partial<Contact>) => void;
  deleteContact: (id: string) => void;
  addNote: (title: string, body: string) => void;
  updateNote: (id: string, title: string, body: string) => void;
  deleteNote: (id: string) => void;
  addPhoto: (photo: Omit<Photo, 'id' | 'createdAt'>) => boolean;
  deletePhoto: (id: string) => void;
  addFile: (file: Omit<VirtualFile, 'id'>) => void;
  renameFile: (id: string, name: string) => void;
  deleteFile: (id: string) => void;
  addCall: (entry: Omit<CallLog, 'id' | 'time'>) => void;
  addAlarm: (time: string, label: string) => void;
  toggleAlarm: (id: string) => void;
  deleteAlarm: (id: string) => void;
  addTab: (url?: string) => void;
  closeTab: (id: string) => void;
  setActiveTab: (id: string) => void;
  navigateTab: (url: string) => void;
  browserBack: () => void;
  browserForward: () => void;
  setCurrentTrack: (id: string) => void;
  refreshWeather: () => void;
};

export const usePhoneStore = create<PhoneState>()(persist((set, get) => ({
  locked: true,
  currentApp: null,
  appHistory: [],
  runningApps: [],
  recentsOpen: false,
  shadeLevel: 0,
  homePage: 0,
  homePages: [
    ['phone', 'messages', 'camera', 'gallery', 'settings', 'clock', 'calculator', 'files'],
    ['internet', 'music', 'contacts', 'notes'],
  ],
  snapshots: {},
  toast: null,
  settings: {
    theme: 'dark', accent: '#8ab4ff', brightness: 82, fontScale: 1, sound: 70,
    wifi: true, bluetooth: true, mobileData: true, airplane: false, dnd: false,
    flashlight: false, quiz: false, battery: 74, charging: true, grid: '4x6',
    wallpaper: 'aurora', pin: '2580',
  },
  notifications: initialNotifications,
  contacts: initialContacts,
  chats: initialChats,
  notes: [
    { id: 'note1', title: 'Список покупок', body: 'Кофе\nКабель USB-C\nЧехол для телефона', updatedAt: 'Сегодня, 09:12' },
    { id: 'note2', title: 'Идеи', body: 'Настроить домашний экран и попробовать новые виджеты.', updatedAt: 'Вчера, 20:48' },
  ],
  photos: [],
  files: initialFiles,
  calls: [
    { id: 'call1', contactName: 'Алексей Орлов', phone: '+7 921 555-01-02', type: 'missed', time: 'Сегодня, 10:39' },
    { id: 'call2', contactName: 'Мария Соколова', phone: '+7 911 440-22-19', type: 'outgoing', time: 'Вчера, 18:21' },
    { id: 'call3', contactName: 'Дмитрий Волков', phone: '+7 999 100-88-12', type: 'incoming', time: 'Пн, 12:04' },
  ],
  alarms: [{ id: 'a1', time: '08:00', label: 'Подъём', enabled: true }],
  tabs: [
    { id: 'tab1', title: 'Samsung', url: 'https://www.samsung.com', history: ['https://www.samsung.com'], historyIndex: 0 },
    { id: 'tab2', title: 'Wikipedia', url: 'https://ru.wikipedia.org', history: ['https://ru.wikipedia.org'], historyIndex: 0 },
    { id: 'tab3', title: 'Поиск', url: 'https://www.google.com', history: ['https://www.google.com'], historyIndex: 0 },
  ],
  activeTabId: 'tab1',
  tracks,
  currentTrackId: 't1',
  weather: { city: 'Санкт-Петербург', temperature: 18, condition: 'Переменная облачность', updatedAt: nowTime() },
  openApp: (id) => set((state) => ({
    currentApp: id,
    appHistory: state.currentApp ? [...state.appHistory, state.currentApp] : state.appHistory,
    runningApps: state.runningApps.includes(id) ? state.runningApps : [...state.runningApps, id],
    recentsOpen: false,
    shadeLevel: 0,
  })),
  closeApp: () => set({ currentApp: null, appHistory: [] }),
  goBack: () => set((state) => {
    const history = [...state.appHistory];
    const previous = history.pop() ?? null;
    return { currentApp: previous, appHistory: history, shadeLevel: 0, recentsOpen: false };
  }),
  goHome: () => set({ currentApp: null, appHistory: [], recentsOpen: false, shadeLevel: 0 }),
  setLocked: (locked) => set({ locked, currentApp: null, recentsOpen: false, shadeLevel: 0 }),
  verifyPin: (pin) => {
    const valid = pin === get().settings.pin;
    if (valid) set({ locked: false });
    return valid;
  },
  setShade: (shadeLevel) => set({ shadeLevel, recentsOpen: false }),
  setRecents: (recentsOpen) => set({ recentsOpen, shadeLevel: 0 }),
  closeRecent: (id) => set((state) => ({
    runningApps: state.runningApps.filter((item) => item !== id),
    currentApp: state.currentApp === id ? null : state.currentApp,
  })),
  clearRecents: () => set({ runningApps: [], currentApp: null, recentsOpen: false }),
  setHomePage: (homePage) => set({ homePage: Math.max(0, Math.min(1, homePage)) }),
  moveAppToPage: (id, page) => set((state) => {
    const homePages = state.homePages.map((items) => items.filter((item) => item !== id));
    homePages[Math.max(0, Math.min(homePages.length - 1, page))].push(id);
    return { homePages };
  }),
  setSnapshot: (id, dataUrl) => set((state) => ({ snapshots: { ...state.snapshots, [id]: dataUrl } })),
  updateSetting: (key, value) => set((state) => ({ settings: { ...state.settings, [key]: value } })),
  toggleSetting: (key) => set((state) => {
    const next = !state.settings[key];
    const settings = { ...state.settings, [key]: next };
    if (key === 'airplane' && next) {
      settings.wifi = false; settings.bluetooth = false; settings.mobileData = false;
    }
    return { settings };
  }),
  showToast: (toast) => set({ toast }),
  clearToast: () => set({ toast: null }),
  markNotificationRead: (id) => set((state) => ({ notifications: state.notifications.map((n) => n.id === id ? { ...n, read: true } : n) })),
  dismissNotification: (id) => set((state) => ({ notifications: state.notifications.filter((n) => n.id !== id) })),
  sendMessage: (chatId, payload) => set((state) => ({
    chats: state.chats.map((chat) => chat.id === chatId ? {
      ...chat, unread: 0, messages: [...chat.messages, { id: uid(), sender: 'me', ...payload, time: nowTime() }],
    } : chat),
  })),
  addContact: (contact) => set((state) => ({ contacts: [...state.contacts, { id: uid(), ...contact }] })),
  updateContact: (id, patch) => set((state) => ({ contacts: state.contacts.map((c) => c.id === id ? { ...c, ...patch } : c) })),
  deleteContact: (id) => set((state) => ({ contacts: state.contacts.filter((c) => c.id !== id) })),
  addNote: (title, body) => set((state) => ({ notes: [{ id: uid(), title, body, updatedAt: `Сегодня, ${nowTime()}` }, ...state.notes] })),
  updateNote: (id, title, body) => set((state) => ({ notes: state.notes.map((n) => n.id === id ? { ...n, title, body, updatedAt: `Сегодня, ${nowTime()}` } : n) })),
  deleteNote: (id) => set((state) => ({ notes: state.notes.filter((n) => n.id !== id) })),
  addPhoto: (photo) => {
    const estimated = JSON.stringify(get().photos).length + photo.dataUrl.length;
    if (estimated > 4_500_000) { set({ toast: 'Хранилище фотографий заполнено' }); return false; }
    set((state) => ({ photos: [{ id: uid(), createdAt: new Date().toISOString(), ...photo }, ...state.photos] }));
    return true;
  },
  deletePhoto: (id) => set((state) => ({ photos: state.photos.filter((p) => p.id !== id) })),
  addFile: (file) => {
    const estimated = JSON.stringify(get().files).length + (file.content?.length ?? 0);
    if (estimated > 4_500_000) { set({ toast: 'Хранилище файлов заполнено' }); return; }
    set((state) => ({ files: [...state.files, { id: uid(), ...file }] }));
  },
  renameFile: (id, name) => set((state) => ({ files: state.files.map((f) => f.id === id ? { ...f, name } : f) })),
  deleteFile: (id) => set((state) => ({ files: state.files.filter((f) => f.id !== id && f.parentId !== id) })),
  addCall: (entry) => set((state) => ({ calls: [{ id: uid(), time: `Сегодня, ${nowTime()}`, ...entry }, ...state.calls] })),
  addAlarm: (time, label) => set((state) => ({ alarms: [...state.alarms, { id: uid(), time, label, enabled: true }] })),
  toggleAlarm: (id) => set((state) => ({ alarms: state.alarms.map((a) => a.id === id ? { ...a, enabled: !a.enabled } : a) })),
  deleteAlarm: (id) => set((state) => ({ alarms: state.alarms.filter((a) => a.id !== id) })),
  addTab: (url = 'https://www.google.com') => set((state) => {
    const id = uid();
    return { tabs: [...state.tabs, { id, title: 'Новая вкладка', url, history: [url], historyIndex: 0 }], activeTabId: id };
  }),
  closeTab: (id) => set((state) => {
    const tabs = state.tabs.filter((tab) => tab.id !== id);
    if (!tabs.length) {
      const fresh = { id: uid(), title: 'Новая вкладка', url: 'https://www.google.com', history: ['https://www.google.com'], historyIndex: 0 };
      return { tabs: [fresh], activeTabId: fresh.id };
    }
    return { tabs, activeTabId: state.activeTabId === id ? tabs[0].id : state.activeTabId };
  }),
  setActiveTab: (activeTabId) => set({ activeTabId }),
  navigateTab: (url) => set((state) => ({ tabs: state.tabs.map((tab) => {
    if (tab.id !== state.activeTabId) return tab;
    const history = tab.history.slice(0, tab.historyIndex + 1).concat(url);
    return { ...tab, url, title: new URL(url).hostname, history, historyIndex: history.length - 1 };
  }) })),
  browserBack: () => set((state) => ({ tabs: state.tabs.map((tab) => tab.id === state.activeTabId && tab.historyIndex > 0
    ? { ...tab, historyIndex: tab.historyIndex - 1, url: tab.history[tab.historyIndex - 1] } : tab) })),
  browserForward: () => set((state) => ({ tabs: state.tabs.map((tab) => tab.id === state.activeTabId && tab.historyIndex < tab.history.length - 1
    ? { ...tab, historyIndex: tab.historyIndex + 1, url: tab.history[tab.historyIndex + 1] } : tab) })),
  setCurrentTrack: (currentTrackId) => set({ currentTrackId }),
  refreshWeather: () => set((state) => ({ weather: {
    ...state.weather,
    temperature: Math.max(-20, Math.min(35, state.weather.temperature + (Math.random() > .5 ? 1 : -1))),
    condition: ['Ясно', 'Переменная облачность', 'Небольшой дождь', 'Облачно'][Math.floor(Math.random() * 4)],
    updatedAt: nowTime(),
  } })),
}), {
  name: 'galaxy-oneui-85-state',
  partialize: (state) => ({
    locked: state.locked, settings: state.settings, notifications: state.notifications,
    contacts: state.contacts, chats: state.chats, notes: state.notes, photos: state.photos,
    files: state.files, calls: state.calls, alarms: state.alarms, tabs: state.tabs,
    activeTabId: state.activeTabId, currentTrackId: state.currentTrackId, weather: state.weather, homePages: state.homePages,
  }),
}));
