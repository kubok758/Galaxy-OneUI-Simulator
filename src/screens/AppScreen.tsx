import { AnimatePresence, motion } from 'framer-motion';
import { usePhoneStore } from '../state/usePhoneStore';
import { SettingsApp } from '../apps/SettingsApp';
import { PhoneApp } from '../apps/PhoneApp';
import { MessagesApp } from '../apps/MessagesApp';
import { CameraApp } from '../apps/CameraApp';
import { GalleryApp } from '../apps/GalleryApp';
import { ClockApp } from '../apps/ClockApp';
import { CalculatorApp } from '../apps/CalculatorApp';
import { FilesApp } from '../apps/FilesApp';
import { InternetApp } from '../apps/InternetApp';
import { MusicApp } from '../apps/MusicApp';
import { ContactsApp } from '../apps/ContactsApp';
import { NotesApp } from '../apps/NotesApp';
import { CalendarApp } from '../apps/CalendarApp';
import { WeatherApp } from '../apps/WeatherApp';
import { EmailApp } from '../apps/EmailApp';
import { ReminderApp } from '../apps/ReminderApp';
import { VoiceRecorderApp } from '../apps/VoiceRecorderApp';
import { HealthApp } from '../apps/HealthApp';
import { SmartThingsApp } from '../apps/SmartThingsApp';
import { CompassApp } from '../apps/CompassApp';
import type { AppId } from '../types';

const apps: Record<AppId, React.ComponentType> = {
  settings: SettingsApp,
  phone: PhoneApp,
  messages: MessagesApp,
  camera: CameraApp,
  gallery: GalleryApp,
  clock: ClockApp,
  calculator: CalculatorApp,
  files: FilesApp,
  internet: InternetApp,
  music: MusicApp,
  contacts: ContactsApp,
  notes: NotesApp,
  calendar: CalendarApp,
  weather: WeatherApp,
  email: EmailApp,
  reminder: ReminderApp,
  recorder: VoiceRecorderApp,
  health: HealthApp,
  smartthings: SmartThingsApp,
  compass: CompassApp,
};

export function AppScreen() {
  const current = usePhoneStore((s) => s.currentApp);
  const showToast = usePhoneStore((s) => s.showToast);
  const Component = current ? apps[current] : null;
  if (current && !Component) {
    queueMicrotask(() => showToast('Приложение не установлено'));
    return null;
  }
  return <AnimatePresence mode="wait">{current && Component && (
    <motion.div key={current} layoutId={`app-icon-${current}`} initial={{ opacity: 0, scale: .82, borderRadius: 28 }} animate={{ opacity: 1, scale: 1, borderRadius: 0 }} exit={{ opacity: 0, scale: .86, borderRadius: 28 }} transition={{ type: 'spring', stiffness: 320, damping: 30 }} className="absolute inset-0 z-20 overflow-hidden">
      <Component />
    </motion.div>
  )}</AnimatePresence>;
}
