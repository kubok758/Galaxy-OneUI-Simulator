import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { usePhoneStore } from '../state/usePhoneStore';
import { appMeta } from '../utils/apps';

export function RecentsScreen() {
  const open = usePhoneStore((s) => s.recentsOpen);
  const apps = usePhoneStore((s) => s.runningApps);
  const openApp = usePhoneStore((s) => s.openApp);
  const closeRecent = usePhoneStore((s) => s.closeRecent);
  const clear = usePhoneStore((s) => s.clearRecents);
  const setRecents = usePhoneStore((s) => s.setRecents);
  const snapshots = usePhoneStore((s) => s.snapshots);
  return <AnimatePresence>{open && <motion.section initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: .96 }} className="absolute inset-0 z-[65] flex flex-col bg-black/65 px-5 pb-16 pt-14 text-white backdrop-blur-2xl" aria-label="Недавние приложения">
    <div className="mb-4 flex justify-between"><h2 className="text-lg font-semibold">Недавние</h2><button aria-label="Закрыть недавние приложения" onClick={() => setRecents(false)}><X/></button></div>
    <div className="no-scrollbar flex flex-1 snap-x gap-4 overflow-x-auto py-8">{apps.length ? apps.map((id) => { const meta = appMeta[id]; const Icon = meta.icon; return <motion.article key={id} drag="y" dragConstraints={{ top: -140, bottom: 0 }} onDragEnd={(_, info) => { if (info.offset.y < -80) closeRecent(id); }} className="h-[72%] min-w-[82%] snap-center overflow-hidden rounded-[34px] bg-zinc-900 shadow-2xl">
      <button aria-label={`Открыть ${meta.name}`} onClick={() => openApp(id)} className="h-full w-full text-left"><div className="flex items-center gap-3 p-4"><span className={`grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br ${meta.gradient}`}><Icon size={18}/></span><span>{meta.name}</span></div><div className={`mx-3 h-[calc(100%-76px)] overflow-hidden rounded-[26px] bg-gradient-to-br ${meta.gradient} opacity-90`}>{snapshots[id] ? <img src={snapshots[id]} alt={`Снимок состояния ${meta.name}`} className="h-full w-full object-cover object-top" /> : <div className="m-6 rounded-3xl bg-black/25 p-5 backdrop-blur-xl"><p className="text-xs uppercase tracking-wider text-white/60">Текущее состояние</p><p className="mt-2 text-2xl font-light">{meta.name}</p><p className="mt-3 text-sm text-white/70">Приложение сохранено в памяти и продолжит работу с того же места.</p></div>}</div></button>
    </motion.article>; }) : <div className="m-auto text-center text-white/55"><p className="text-lg">Нет запущенных приложений</p><p className="text-sm">Откройте приложение с домашнего экрана</p></div>}</div>
    {apps.length > 0 && <button aria-label="Очистить все недавние приложения" onClick={clear} className="mx-auto rounded-full bg-white/12 px-6 py-3 text-sm">Очистить все</button>}
  </motion.section>}</AnimatePresence>;
}
