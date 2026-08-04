import { useEffect, useState } from 'react';
import { BatteryCharging, BatteryMedium, Signal, Wifi, Bell } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePhoneStore } from '../state/usePhoneStore';

export function StatusBar({ onOpenShade }: { onOpenShade: () => void }) {
  const [time, setTime] = useState(() => new Date());
  const settings = usePhoneStore((s) => s.settings);
  const unread = usePhoneStore((s) => s.notifications.filter((n) => !n.read).length);
  useEffect(() => {
    const timer = window.setInterval(() => setTime(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);
  const BatteryIcon = settings.charging ? BatteryCharging : BatteryMedium;
  return (
    <button
      aria-label="Открыть панель уведомлений"
      className="absolute inset-x-0 top-0 z-40 flex h-9 items-center justify-between px-5 text-[12px] font-semibold text-white drop-shadow"
      onClick={onOpenShade}
    >
      <span>{time.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</span>
      <span className="flex items-center gap-1.5">
        {unread > 0 && <span className="flex items-center gap-0.5"><Bell size={12} />{unread}</span>}
        {!settings.airplane && <Signal size={14} />}
        {settings.wifi && <Wifi size={14} />}
        <motion.span animate={settings.charging ? { opacity: [1, .45, 1] } : {}} transition={{ repeat: Infinity, duration: 1.4 }} className="flex items-center gap-0.5">
          <BatteryIcon size={16} />{settings.battery}
        </motion.span>
      </span>
    </button>
  );
}
