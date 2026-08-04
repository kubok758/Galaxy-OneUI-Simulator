import { AnimatePresence, motion, PanInfo } from 'framer-motion';
import { Camera, Delete, Flashlight, LockKeyhole } from 'lucide-react';
import { useEffect, useState } from 'react';
import { usePhoneStore } from '../state/usePhoneStore';

export function LockScreen() {
  const [now, setNow] = useState(new Date());
  const [pinOpen, setPinOpen] = useState(false);
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const verifyPin = usePhoneStore((s) => s.verifyPin);
  const openApp = usePhoneStore((s) => s.openApp);
  const notifications = usePhoneStore((s) => s.notifications.slice(0, 3));
  const settings = usePhoneStore((s) => s.settings);
  useEffect(() => { const timer = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(timer); }, []);
  const unlock = (value: string) => {
    if (value.length !== 4) return;
    if (verifyPin(value)) setPin('');
    else { setError(true); setTimeout(() => { setError(false); setPin(''); }, 650); }
  };
  const onPanEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.y < -70) setPinOpen(true);
    if (info.offset.x < -90) { usePhoneStore.getState().setLocked(false); openApp('camera'); }
  };
  return <motion.section aria-label="Экран блокировки" onPanEnd={onPanEnd} className="absolute inset-0 z-[80] flex flex-col px-5 pb-8 pt-16 text-white backdrop-blur-[1px]">
    <div className="text-center"><LockKeyhole className="mx-auto mb-3" size={17}/><p className="text-6xl font-extralight tracking-tight tabular-nums">{now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</p><p className="mt-2 text-base text-white/75">{now.toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })}</p></div>
    <div className="mt-10 space-y-2">{notifications.map((item) => <div key={item.id} className="rounded-3xl bg-black/25 px-4 py-3 backdrop-blur-xl"><div className="flex justify-between text-xs"><strong>{item.title}</strong><span>{item.time}</span></div><p className="mt-1 truncate text-sm text-white/60">{settings.dnd ? 'Содержимое скрыто режимом «Не беспокоить»' : item.body}</p></div>)}</div>
    <div className="mt-auto flex items-end justify-between"><button aria-label="Фонарик" onClick={() => usePhoneStore.getState().toggleSetting('flashlight')} className="grid h-12 w-12 place-items-center rounded-full bg-black/30 backdrop-blur-xl"><Flashlight /></button><button aria-label="Разблокировать" onClick={() => setPinOpen(true)} className="text-xs text-white/70">Проведите вверх для разблокировки</button><button aria-label="Камера" onClick={() => { usePhoneStore.getState().setLocked(false); openApp('camera'); }} className="grid h-12 w-12 place-items-center rounded-full bg-black/30 backdrop-blur-xl"><Camera /></button></div>
    <AnimatePresence>{pinOpen && <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} className="absolute inset-0 z-10 flex flex-col bg-zinc-950/96 px-12 pb-10 pt-20 backdrop-blur-3xl">
      <p className="text-center text-lg">Введите PIN-код</p><p className="mt-2 text-center text-xs text-white/45">PIN по умолчанию: 2580</p>
      <motion.div animate={error ? { x: [-12, 12, -8, 8, 0] } : {}} className="my-8 flex justify-center gap-4">{[0,1,2,3].map((i) => <span key={i} className={`h-3 w-3 rounded-full border border-white/70 ${pin.length > i ? 'bg-white' : ''}`}/>)}</motion.div>
      <div className="grid grid-cols-3 gap-4">{[1,2,3,4,5,6,7,8,9].map((n) => <button key={n} aria-label={`Цифра ${n}`} onClick={() => { const next = `${pin}${n}`.slice(0,4); setPin(next); unlock(next); }} className="oneui-button aspect-square rounded-full bg-white/8 text-2xl">{n}</button>)}<button aria-label="Отмена" onClick={() => { setPinOpen(false); setPin(''); }} className="text-sm">Отмена</button><button aria-label="Цифра 0" onClick={() => { const next = `${pin}0`.slice(0,4); setPin(next); unlock(next); }} className="oneui-button aspect-square rounded-full bg-white/8 text-2xl">0</button><button aria-label="Удалить цифру" onClick={() => setPin((p) => p.slice(0,-1))} className="grid place-items-center"><Delete/></button></div>
    </motion.div>}</AnimatePresence>
  </motion.section>;
}
