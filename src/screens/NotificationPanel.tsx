import { AnimatePresence, motion, PanInfo } from 'framer-motion';
import { Airplay, BellOff, Bluetooth, Camera, Flashlight, Gamepad2, Plane, Signal, Sun, Wifi, X } from 'lucide-react';
import { usePhoneStore } from '../state/usePhoneStore';
import { QuickToggle } from '../components/QuickToggle';
import { appMeta } from '../utils/apps';

export function NotificationPanel() {
  const level = usePhoneStore((s) => s.shadeLevel);
  const setShade = usePhoneStore((s) => s.setShade);
  const settings = usePhoneStore((s) => s.settings);
  const toggle = usePhoneStore((s) => s.toggleSetting);
  const updateSetting = usePhoneStore((s) => s.updateSetting);
  const notifications = usePhoneStore((s) => s.notifications);
  const openApp = usePhoneStore((s) => s.openApp);
  const markRead = usePhoneStore((s) => s.markNotificationRead);
  const dismiss = usePhoneStore((s) => s.dismissNotification);
  const showToast = usePhoneStore((s) => s.showToast);

  const onPanEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.y < -70) setShade(level === 2 ? 1 : 0);
    if (info.offset.y > 70) setShade(2);
  };
  return <AnimatePresence>{level > 0 && (
    <motion.section
      aria-label="Панель уведомлений"
      initial={{ y: '-100%' }} animate={{ y: 0 }} exit={{ y: '-100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 34 }}
      onPanEnd={onPanEnd}
      className="absolute inset-x-0 top-0 z-[70] max-h-[calc(100%-48px)] overflow-hidden rounded-b-[38px] bg-zinc-950/96 px-4 pb-5 pt-10 text-white shadow-2xl backdrop-blur-3xl"
    >
      <div className="mb-4 flex items-center justify-between"><div><p className="text-3xl font-light">{new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</p><p className="text-xs text-white/55">{new Date().toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })}</p></div><button aria-label="Закрыть панель" onClick={() => setShade(0)}><X /></button></div>
      <div className={`grid gap-3 ${level === 2 ? 'grid-cols-4' : 'grid-cols-6'}`}>
        <QuickToggle icon={Wifi} label="Wi‑Fi" active={settings.wifi} onClick={() => toggle('wifi')} />
        <QuickToggle icon={Bluetooth} label="Bluetooth" active={settings.bluetooth} onClick={() => toggle('bluetooth')} />
        <QuickToggle icon={Signal} label="Моб. данные" active={settings.mobileData} onClick={() => toggle('mobileData')} />
        <QuickToggle icon={Plane} label="В самолёте" active={settings.airplane} onClick={() => toggle('airplane')} />
        <QuickToggle icon={BellOff} label="Не беспокоить" active={settings.dnd} onClick={() => toggle('dnd')} />
        <QuickToggle icon={Flashlight} label="Фонарик" active={settings.flashlight} onClick={() => toggle('flashlight')} />
        {level === 2 && <>
          <QuickToggle icon={Camera} label="Камера" active={false} onClick={() => openApp('camera')} />
          <QuickToggle icon={Gamepad2} label="Викторина" active={settings.quiz} onClick={() => { toggle('quiz'); showToast(settings.quiz ? 'Викторина выключена' : 'Викторина включена: ответ — One UI 8.5'); }} />
        </>}
      </div>
      <div className="my-5 flex items-center gap-3 rounded-full bg-white/8 px-4 py-2"><Sun size={18}/><input aria-label="Яркость экрана" className="range w-full" type="range" min="10" max="100" value={settings.brightness} onChange={(e) => updateSetting('brightness', Number(e.target.value))}/><span className="w-8 text-xs">{settings.brightness}</span></div>
      <div className={`no-scrollbar space-y-2 overflow-y-auto ${level === 2 ? 'max-h-[430px]' : 'max-h-[310px]'}`}>
        {notifications.map((item) => {
          const meta = appMeta[item.app]; const Icon = meta.icon;
          return <motion.article layout key={item.id} className={`oneui-card relative rounded-[26px] p-4 ${item.read ? 'opacity-70' : ''}`}>
            <button aria-label={`Открыть уведомление ${item.title}`} className="flex w-full items-start gap-3 text-left" onClick={() => { markRead(item.id); openApp(item.app); }}>
              <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${meta.gradient}`}><Icon size={20}/></span>
              <span className="min-w-0 flex-1"><span className="flex justify-between gap-2"><strong className="truncate text-sm">{item.title}</strong><small className="shrink-0 text-white/45">{item.time}</small></span><span className="mt-1 block text-sm text-white/68">{item.body}</span></span>
            </button>
            <button aria-label={`Удалить уведомление ${item.title}`} onClick={() => dismiss(item.id)} className="absolute bottom-3 right-3 rounded-full p-1 text-white/45 hover:bg-white/10"><X size={14}/></button>
          </motion.article>;
        })}
      </div>
      <button aria-label={level === 1 ? 'Развернуть быстрые настройки' : 'Свернуть быстрые настройки'} onClick={() => setShade(level === 1 ? 2 : 1)} className="mt-3 w-full rounded-full py-2 text-xs text-white/55">{level === 1 ? 'Потяните вниз ещё раз для полной панели' : 'Свернуть быстрые настройки'}</button>
    </motion.section>
  )}</AnimatePresence>;
}
