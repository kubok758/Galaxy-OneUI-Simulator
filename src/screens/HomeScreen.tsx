import { AnimatePresence, motion, PanInfo } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { AppWindow, FolderOpen, Grid3X3, Mic, RefreshCw, Search, Sparkles, X } from 'lucide-react';
import type { AppId } from '../types';
import { appOrder, appMeta } from '../utils/apps';
import { usePhoneStore } from '../state/usePhoneStore';
import { AppIcon } from '../components/AppIcon';
import { AppDrawer } from './AppDrawer';

export function HomeScreen() {
  const openApp = usePhoneStore((s) => s.openApp);
  const homePage = usePhoneStore((s) => s.homePage);
  const setHomePage = usePhoneStore((s) => s.setHomePage);
  const weather = usePhoneStore((s) => s.weather);
  const refreshWeather = usePhoneStore((s) => s.refreshWeather);
  const settings = usePhoneStore((s) => s.settings);
  const pages = usePhoneStore((s) => s.homePages);
  const moveAppToPage = usePhoneStore((s) => s.moveAppToPage);
  const showToast = usePhoneStore((s) => s.showToast);
  const [drawer, setDrawer] = useState(false);
  const [search, setSearch] = useState(false);
  const [query, setQuery] = useState('');
  const [clockMode, setClockMode] = useState<'digital' | 'analog'>('digital');
  const [context, setContext] = useState<{ id: AppId; x: number; y: number } | null>(null);
  const [folderOpen, setFolderOpen] = useState(false);
  const [dragged, setDragged] = useState<AppId | null>(null);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const results = useMemo(() => appOrder.filter((id) => appMeta[id].name.toLowerCase().includes(query.toLowerCase())), [query]);
  const swipe = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 60) setHomePage(info.offset.x < 0 ? 1 : 0);
    if (info.offset.y < -80) setDrawer(true);
    if (info.offset.y > 90) usePhoneStore.getState().setShade(1);
  };

  return (
    <motion.main
      aria-label="Главный экран"
      className="absolute inset-0 overflow-hidden px-4 pb-14 pt-10 text-white"
      onPanEnd={swipe}
    >
      <motion.div className="flex h-full w-[200%]" animate={{ x: `${homePage * -50}%` }} transition={{ type: 'spring', stiffness: 280, damping: 30 }}>
        <section className="relative h-full w-1/2 shrink-0 px-1">
          <div className="grid grid-cols-2 gap-3">
            <button aria-label="Обновить погоду" onClick={refreshWeather} className="oneui-card oneui-button col-span-2 flex min-h-28 items-center justify-between rounded-[30px] p-5 text-left backdrop-blur-xl">
              <span>
                <span className="block text-sm text-white/70">{weather.city}</span>
                <span className="mt-1 block text-4xl font-light">{weather.temperature}°</span>
                <span className="text-sm text-white/80">{weather.condition}</span>
              </span>
              <span className="flex flex-col items-end gap-2 text-white/75"><span className="text-5xl">☁️</span><RefreshCw size={15} /><span className="text-[10px]">{weather.updatedAt}</span></span>
            </button>
            <button aria-label="Переключить вид часов" onClick={() => setClockMode((m) => m === 'digital' ? 'analog' : 'digital')} className="oneui-card oneui-button col-span-2 h-28 rounded-[30px] px-5 text-left backdrop-blur-xl">
              {clockMode === 'digital' ? (
                <span><span className="block text-4xl font-light tabular-nums">{now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</span><span className="text-sm text-white/70">{now.toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })}</span></span>
              ) : <AnalogClock date={now} />}
            </button>
          </div>
          <div className={`mt-5 grid ${settings.grid === '5x6' ? 'grid-cols-5' : 'grid-cols-4'} gap-x-2 gap-y-4`} onDragOver={(e) => e.preventDefault()} onDrop={() => { if (dragged) { moveAppToPage(dragged, 0); showToast(`${appMeta[dragged].name}: перемещено на первый экран`); setDragged(null); } }}>
            {pages[0].slice(0, settings.grid === '5x6' ? 10 : 8).map((id) => <AppIcon key={id} id={id} onOpen={openApp} onContext={(app, x, y) => setContext({ id: app, x, y })} draggable onDragStart={setDragged} />)}
            <button aria-label="Открыть папку Samsung" onClick={() => setFolderOpen(true)} className="flex flex-col items-center gap-1.5">
              <span className="grid h-14 w-14 grid-cols-2 gap-1 rounded-[19px] bg-white/15 p-2 shadow-lg backdrop-blur-xl">{['settings','files','notes','internet'].map((id) => { const Icon = appMeta[id as AppId].icon; return <span key={id} className={`grid place-items-center rounded-lg bg-gradient-to-br ${appMeta[id as AppId].gradient}`}><Icon size={12} /></span>; })}</span>
              <span className="text-[11px]">Samsung</span>
            </button>
          </div>
        </section>
        <section className="h-full w-1/2 shrink-0 px-1">
          <div className="oneui-card mb-5 rounded-[30px] p-5 backdrop-blur-xl">
            <div className="flex items-center gap-3"><Sparkles className="text-[var(--accent)]" /><div><p className="font-semibold">Now Brief</p><p className="text-sm text-white/65">Батарея {settings.battery}% · {weather.temperature}° · 1 непрочитанный чат</p></div></div>
          </div>
          <div className={`grid ${settings.grid === '5x6' ? 'grid-cols-5' : 'grid-cols-4'} gap-x-2 gap-y-5`} onDragOver={(e) => e.preventDefault()} onDrop={() => { if (dragged) { moveAppToPage(dragged, 1); showToast(`${appMeta[dragged].name}: перемещено на второй экран`); setDragged(null); } }}>
            {pages[1].map((id) => <AppIcon key={id} id={id} onOpen={openApp} onContext={(app, x, y) => setContext({ id: app, x, y })} draggable onDragStart={setDragged} />)}
          </div>
        </section>
      </motion.div>

      <div className="absolute bottom-[70px] left-1/2 flex -translate-x-1/2 items-center gap-2">
        {[0,1].map((page) => <button key={page} aria-label={`Домашний экран ${page + 1}`} onClick={() => setHomePage(page)} className={`h-2 rounded-full transition-all ${homePage === page ? 'w-5 bg-white' : 'w-2 bg-white/40'}`} />)}
      </div>
      <div className="absolute bottom-[92px] left-4 right-4 flex items-center gap-2">
        <button aria-label="Открыть поиск Google" onClick={() => setSearch(true)} className="oneui-card flex h-12 flex-1 items-center gap-3 rounded-full px-4 text-white/75 backdrop-blur-xl"><Search size={20} /><span className="flex-1 text-left text-sm">Поиск Google</span><Mic size={18} /></button>
        <button aria-label="Открыть меню приложений" onClick={() => setDrawer(true)} className="oneui-card grid h-12 w-12 place-items-center rounded-full backdrop-blur-xl"><Grid3X3 size={20} /></button>
      </div>
      <button aria-label="Bixby" onClick={() => showToast('Bixby: слушаю вас')} className="absolute right-0 top-1/3 h-24 w-2 rounded-l-full bg-[var(--accent)]/55" />
      <button aria-label="Google Assistant" onClick={() => setSearch(true)} className="absolute bottom-12 left-1/2 h-2 w-24 -translate-x-1/2 rounded-full bg-white/40" />

      <AnimatePresence>{drawer && <AppDrawer onClose={() => setDrawer(false)} />}</AnimatePresence>
      <AnimatePresence>{search && (
        <motion.div initial={{ opacity: 0, y: 80 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 80 }} className="absolute inset-0 z-50 bg-zinc-950/95 p-4 pt-12 backdrop-blur-2xl">
          <div className="flex items-center gap-2"><div className="flex flex-1 items-center gap-2 rounded-full bg-white/10 px-4"><Search size={18}/><input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && query.trim()) { usePhoneStore.getState().openApp('internet'); setSearch(false); } if (e.key === 'Escape') setSearch(false); }} className="h-12 flex-1 bg-transparent outline-none" placeholder="Поиск приложений и в интернете" aria-label="Поисковый запрос" /></div><button aria-label="Закрыть поиск" onClick={() => setSearch(false)}><X /></button></div>
          <p className="mb-3 mt-6 text-xs uppercase tracking-wider text-white/50">Приложения</p>
          <div className="grid grid-cols-4 gap-5">{results.map((id) => <AppIcon key={id} id={id} onOpen={(app) => { openApp(app); setSearch(false); }} />)}</div>
          <p className="mb-2 mt-7 text-xs uppercase tracking-wider text-white/50">Недавние запросы</p>
          {['погода завтра', 'настройки батареи', 'Samsung One UI'].map((item) => <button key={item} onClick={() => setQuery(item)} className="block w-full rounded-2xl px-3 py-3 text-left hover:bg-white/5"><Search className="mr-3 inline" size={16}/>{item}</button>)}
        </motion.div>
      )}</AnimatePresence>
      <AnimatePresence>{folderOpen && (
        <motion.div initial={{ opacity: 0, scale: .8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: .85 }} className="absolute left-6 right-6 top-1/4 z-50 rounded-[36px] bg-zinc-900/95 p-6 shadow-2xl backdrop-blur-2xl">
          <div className="mb-5 flex items-center justify-between"><h2 className="text-xl font-semibold">Samsung</h2><button aria-label="Закрыть папку" onClick={() => setFolderOpen(false)}><X /></button></div>
          <div className="grid grid-cols-4 gap-5">{(['settings','files','notes','internet'] as AppId[]).map((id) => <AppIcon key={id} id={id} onOpen={(app) => { openApp(app); setFolderOpen(false); }} />)}</div>
        </motion.div>
      )}</AnimatePresence>
      <AnimatePresence>{context && (
        <motion.div initial={{ opacity: 0, scale: .9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: .9 }} className="absolute z-[60] w-48 rounded-3xl bg-zinc-800 p-2 shadow-2xl" style={{ left: Math.min(180, Math.max(10, context.x - 20)), top: Math.min(590, Math.max(80, context.y - 100)) }}>
          <p className="px-3 py-2 text-sm font-semibold">{appMeta[context.id].name}</p>
          <button onClick={() => { showToast('Перетащите иконку на нужный экран'); setContext(null); }} className="w-full rounded-2xl px-3 py-2 text-left hover:bg-white/10">Переместить</button>
          <button onClick={() => { openApp('settings'); setContext(null); }} className="w-full rounded-2xl px-3 py-2 text-left hover:bg-white/10">Информация</button>
          <button onClick={() => { showToast('Системные приложения нельзя удалить'); setContext(null); }} className="w-full rounded-2xl px-3 py-2 text-left text-red-300 hover:bg-white/10">Удалить</button>
        </motion.div>
      )}</AnimatePresence>
    </motion.main>
  );
}

function AnalogClock({ date }: { date: Date }) {
  const seconds = date.getSeconds() * 6;
  const minutes = date.getMinutes() * 6;
  const hours = (date.getHours() % 12) * 30 + date.getMinutes() / 2;
  return <span className="relative mx-auto block h-20 w-20 rounded-full border-2 border-white/60">
    <span className="absolute left-1/2 top-1/2 h-6 w-0.5 origin-bottom -translate-x-1/2 -translate-y-full bg-white" style={{ transform: `translate(-50%, -100%) rotate(${hours}deg)` }} />
    <span className="absolute left-1/2 top-1/2 h-8 w-0.5 origin-bottom -translate-x-1/2 -translate-y-full bg-white" style={{ transform: `translate(-50%, -100%) rotate(${minutes}deg)` }} />
    <span className="absolute left-1/2 top-1/2 h-8 w-px origin-bottom -translate-x-1/2 -translate-y-full bg-red-400" style={{ transform: `translate(-50%, -100%) rotate(${seconds}deg)` }} />
    <span className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
  </span>;
}
