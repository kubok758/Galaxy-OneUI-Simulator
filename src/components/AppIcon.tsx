import { motion } from 'framer-motion';
import { useRef, useState } from 'react';
import type { AppId } from '../types';
import { appMeta } from '../utils/apps';

type Props = {
  id: AppId;
  onOpen: (id: AppId) => void;
  onContext?: (id: AppId, x: number, y: number) => void;
  draggable?: boolean;
  onDragStart?: (id: AppId) => void;
};

export function AppIcon({ id, onOpen, onContext, draggable, onDragStart }: Props) {
  const meta = appMeta[id];
  const Icon = meta.icon;
  const timer = useRef<number | null>(null);
  const [pressed, setPressed] = useState(false);

  const start = (event: React.PointerEvent) => {
    setPressed(true);
    timer.current = window.setTimeout(() => {
      onContext?.(id, event.clientX, event.clientY);
      setPressed(false);
    }, 520);
  };
  const stop = () => {
    setPressed(false);
    if (timer.current) window.clearTimeout(timer.current);
  };

  return (
    <motion.button
      aria-label={`Открыть приложение ${meta.name}`}
      data-testid={`app-${id}`}
      className="flex min-w-0 flex-col items-center gap-1.5 text-white"
      whileTap={{ scale: .9 }}
      onPointerDown={start}
      onPointerUp={stop}
      onPointerCancel={stop}
      onPointerLeave={stop}
      onClick={() => !pressed && onOpen(id)}
      draggable={draggable}
      onDragStart={() => onDragStart?.(id)}
    >
      <motion.span
        layoutId={`app-icon-${id}`}
        className={`grid h-14 w-14 place-items-center rounded-[19px] bg-gradient-to-br ${meta.gradient} shadow-lg ring-1 ring-white/20`}
      >
        <Icon size={28} strokeWidth={2.1} className={id === 'camera' ? 'text-zinc-900' : 'text-white'} />
      </motion.span>
      <span className="w-full truncate text-center text-[11px] font-medium drop-shadow">{meta.name}</span>
    </motion.button>
  );
}
