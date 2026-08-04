import {
  Settings, Phone, MessageSquare, Camera, Images, Clock3, Calculator,
  Folder, Globe2, Music2, ContactRound, NotebookPen,
} from 'lucide-react';
import type { AppId } from '../types';

export const appMeta: Record<AppId, { name: string; icon: typeof Settings; gradient: string }> = {
  settings: { name: 'Настройки', icon: Settings, gradient: 'from-slate-500 to-slate-700' },
  phone: { name: 'Телефон', icon: Phone, gradient: 'from-emerald-400 to-green-600' },
  messages: { name: 'Сообщения', icon: MessageSquare, gradient: 'from-sky-400 to-blue-600' },
  camera: { name: 'Камера', icon: Camera, gradient: 'from-zinc-200 to-zinc-500' },
  gallery: { name: 'Галерея', icon: Images, gradient: 'from-pink-400 to-fuchsia-600' },
  clock: { name: 'Часы', icon: Clock3, gradient: 'from-indigo-400 to-violet-700' },
  calculator: { name: 'Калькулятор', icon: Calculator, gradient: 'from-orange-400 to-red-500' },
  files: { name: 'Мои файлы', icon: Folder, gradient: 'from-amber-300 to-yellow-600' },
  internet: { name: 'Internet', icon: Globe2, gradient: 'from-purple-400 to-indigo-600' },
  music: { name: 'Музыка', icon: Music2, gradient: 'from-rose-400 to-red-600' },
  contacts: { name: 'Контакты', icon: ContactRound, gradient: 'from-cyan-400 to-teal-600' },
  notes: { name: 'Samsung Notes', icon: NotebookPen, gradient: 'from-orange-300 to-amber-500' },
};

export const appOrder: AppId[] = ['phone', 'messages', 'camera', 'gallery', 'settings', 'clock', 'calculator', 'files', 'internet', 'music', 'contacts', 'notes'];
