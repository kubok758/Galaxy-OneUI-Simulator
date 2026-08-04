import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { appOrder, appMeta } from '../utils/apps';
import { AppIcon } from '../components/AppIcon';
import { usePhoneStore } from '../state/usePhoneStore';

export function AppDrawer({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState('');
  const openApp = usePhoneStore((s) => s.openApp);
  const apps = useMemo(() => appOrder.filter((id) => appMeta[id].name.toLowerCase().includes(query.toLowerCase())), [query]);
  return (
    <motion.section initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', stiffness: 300, damping: 32 }} className="absolute inset-0 z-50 bg-zinc-950/92 px-5 pb-14 pt-12 backdrop-blur-2xl" aria-label="Меню приложений">
      <div className="mb-8 flex items-center gap-3"><div className="flex h-12 flex-1 items-center gap-3 rounded-full bg-white/10 px-4"><Search size={18}/><input aria-label="Поиск приложений" value={query} onChange={(e) => setQuery(e.target.value)} className="min-w-0 flex-1 bg-transparent outline-none" placeholder="Поиск" /></div><button aria-label="Закрыть меню приложений" onClick={onClose}><X /></button></div>
      <div className="grid grid-cols-4 gap-x-4 gap-y-7">{apps.map((id) => <AppIcon key={id} id={id} onOpen={(app) => { openApp(app); onClose(); }} />)}</div>
    </motion.section>
  );
}
