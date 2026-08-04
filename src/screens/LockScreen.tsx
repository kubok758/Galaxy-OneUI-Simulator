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

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const unlock = (value: string) => {
    if (value.length !== 4) return;
    if (verifyPin(value)) setPin('');
    else {
      setError(true);
      setTimeout(() => {
        setError(false);
        setPin('');
      }, 650);
    }
  };

  const onPanEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.y < -70) setPinOpen(true);
    if (info.offset.x < -90) {
      usePhoneStore.getState().setLocked(false);
      openApp('camera');
    }
  };

  return (
    <motion.section
      aria-label="Экран блокировки"
      onPanEnd={onPanEnd}
      className="absolute inset-0 z-[80] flex flex-col overflow-hidden text-white"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/20 to-black/70" />
      <div className="absolute inset-0 backdrop-blur-[2px]" />

      <div className="relative z-10 flex h-full flex-col px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(4.75rem,env(safe-area-inset-top))]">
        <div className="text-center drop-shadow-[0_2px_12px_rgba(0,0,0,.75)]">
          <LockKeyhole className="mx-auto mb-3 text-white/85" size={18} />
          <p className="text-[clamp(4.5rem,18vw,6.5rem)] font-extralight leading-none tracking-[-0.07em] tabular-nums">
            {now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
          </p>
          <p className="mt-3 text-base font-medium text-white/80">
            {now.toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>

        <div className="mt-8 space-y-2.5">
          {notifications.map((item) => (
            <div
              key={item.id}
              className="rounded-[26px] border border-white/10 bg-black/35 px-4 py-3.5 shadow-lg backdrop-blur-2xl"
            >
              <div className="flex items-center justify-between gap-4 text-xs">
                <strong className="truncate text-sm">{item.title}</strong>
                <span className="shrink-0 text-white/65">{item.time}</span>
              </div>
              <p className="mt-1.5 truncate text-sm leading-5 text-white/70">
                {settings.dnd ? 'Содержимое скрыто режимом «Не беспокоить»' : item.body}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-auto grid grid-cols-[48px_1fr_48px] items-end gap-4 pt-6">
          <button
            aria-label="Фонарик"
            onClick={() => usePhoneStore.getState().toggleSetting('flashlight')}
            className="grid h-12 w-12 place-items-center rounded-full border border-white/10 bg-black/35 shadow-lg backdrop-blur-2xl"
          >
            <Flashlight size={22} />
          </button>
          <button
            aria-label="Разблокировать"
            onClick={() => setPinOpen(true)}
            className="pb-2 text-center text-xs font-medium text-white/75 drop-shadow"
          >
            Проведите вверх для разблокировки
          </button>
          <button
            aria-label="Камера"
            onClick={() => {
              usePhoneStore.getState().setLocked(false);
              openApp('camera');
            }}
            className="grid h-12 w-12 place-items-center rounded-full border border-white/10 bg-black/35 shadow-lg backdrop-blur-2xl"
          >
            <Camera size={22} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {pinOpen && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 260, damping: 28 }}
            className="absolute inset-0 z-20 flex flex-col bg-zinc-950/95 px-8 pb-[max(2rem,env(safe-area-inset-bottom))] pt-[max(5rem,env(safe-area-inset-top))] backdrop-blur-3xl"
          >
            <p className="text-center text-lg font-semibold">Введите PIN-код</p>
            <p className="mt-2 text-center text-xs text-white/45">PIN по умолчанию: 2580</p>

            <motion.div
              animate={error ? { x: [-12, 12, -8, 8, 0] } : {}}
              className="my-8 flex justify-center gap-4"
            >
              {[0, 1, 2, 3].map((i) => (
                <span
                  key={i}
                  className={`h-3 w-3 rounded-full border border-white/70 ${pin.length > i ? 'bg-white' : ''}`}
                />
              ))}
            </motion.div>

            <div className="mx-auto grid w-full max-w-[320px] grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                <button
                  key={n}
                  aria-label={`Цифра ${n}`}
                  onClick={() => {
                    const next = `${pin}${n}`.slice(0, 4);
                    setPin(next);
                    unlock(next);
                  }}
                  className="oneui-button aspect-square rounded-full border border-white/10 bg-white/10 text-2xl backdrop-blur-xl"
                >
                  {n}
                </button>
              ))}
              <button
                aria-label="Отмена"
                onClick={() => {
                  setPinOpen(false);
                  setPin('');
                }}
                className="text-sm text-white/70"
              >
                Отмена
              </button>
              <button
                aria-label="Цифра 0"
                onClick={() => {
                  const next = `${pin}0`.slice(0, 4);
                  setPin(next);
                  unlock(next);
                }}
                className="oneui-button aspect-square rounded-full border border-white/10 bg-white/10 text-2xl backdrop-blur-xl"
              >
                0
              </button>
              <button
                aria-label="Удалить цифру"
                onClick={() => setPin((p) => p.slice(0, -1))}
                className="grid place-items-center text-white/80"
              >
                <Delete />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
