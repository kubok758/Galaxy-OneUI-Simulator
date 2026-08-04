import { AnimatePresence, motion } from 'framer-motion';
import { Mic, Minimize2, Phone, PhoneOff, Search, Speaker, Volume2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { AppShell } from '../components/AppShell';
import { usePhoneStore } from '../state/usePhoneStore';

export function PhoneApp() {
  const [tab, setTab] = useState<'keypad' | 'recent'>('keypad');
  const [number, setNumber] = useState('');
  const [active, setActive] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [muted, setMuted] = useState(false);
  const [speaker, setSpeaker] = useState(false);
  const calls = usePhoneStore((s) => s.calls);
  const contacts = usePhoneStore((s) => s.contacts);
  const addCall = usePhoneStore((s) => s.addCall);
  const contactName = useMemo(() => contacts.find((c) => c.phone.replace(/\D/g,'').endsWith(number.replace(/\D/g,'').slice(-10)))?.name ?? number, [contacts, number]);
  useEffect(() => { if (!active) return; const t = window.setInterval(() => setSeconds((s) => s + 1), 1000); return () => clearInterval(t); }, [active]);
  const call = () => { if (number.replace(/\D/g,'').length < 3) return; setSeconds(0); setMinimized(false); setActive(true); addCall({ contactName: contactName || number, phone: number, type: 'outgoing' }); };
  const end = () => { setActive(false); setMinimized(false); setSeconds(0); };
  return <AppShell title="Телефон" actions={<div className="flex gap-2"><button onClick={() => setTab('recent')} className={`rounded-full px-3 py-2 text-sm ${tab === 'recent' ? 'bg-[var(--accent)] text-zinc-950' : 'bg-white/8'}`}>Недавние</button><button onClick={() => setTab('keypad')} className={`rounded-full px-3 py-2 text-sm ${tab === 'keypad' ? 'bg-[var(--accent)] text-zinc-950' : 'bg-white/8'}`}>Клавиатура</button></div>}>
    <AnimatePresence mode="wait">
      {tab === 'keypad' ? <motion.div key="keypad" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-6 pt-4">
        <div className="mb-6 min-h-20 text-center"><motion.p key={number} initial={{ scale: .92 }} animate={{ scale: 1 }} className="break-all text-3xl font-light tracking-wider">{number || 'Введите номер'}</motion.p>{number && <p className="mt-2 text-sm opacity-55">{contactName}</p>}</div>
        <div className="mx-auto grid max-w-[280px] grid-cols-3 gap-4">{['1','2','3','4','5','6','7','8','9','*','0','#'].map((n) => <motion.button whileTap={{ scale: .85 }} aria-label={`Клавиша ${n}`} key={n} onClick={() => setNumber((v) => `${v}${n}`)} className="aspect-square rounded-full bg-[var(--surface)] text-2xl">{n}<small className="block text-[9px] opacity-40">{({2:'ABC',3:'DEF',4:'GHI',5:'JKL',6:'MNO',7:'PQRS',8:'TUV',9:'WXYZ'} as Record<string,string>)[n]}</small></motion.button>)}</div>
        <div className="mt-5 flex justify-center gap-5"><button aria-label="Удалить цифру" onClick={() => setNumber((v) => v.slice(0,-1))} className="rounded-full px-5 py-4">⌫</button><button data-testid="call-button" aria-label="Позвонить" onClick={call} className="oneui-button grid h-16 w-16 place-items-center rounded-full bg-emerald-500 text-white shadow-lg"><Phone/></button><button aria-label="Очистить номер" onClick={() => setNumber('')} className="rounded-full px-5 py-4">C</button></div>
      </motion.div> : <motion.div key="recent" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="px-4"><div className="mb-4 flex items-center gap-2 rounded-full bg-[var(--surface)] px-4"><Search size={17}/><input aria-label="Поиск вызовов" className="h-11 flex-1 bg-transparent outline-none" placeholder="Поиск"/></div>{calls.map((item) => <button key={item.id} onClick={() => { setNumber(item.phone); setTab('keypad'); }} className="flex w-full items-center gap-3 border-b border-white/5 p-3 text-left"><span className={`grid h-11 w-11 place-items-center rounded-full ${item.type === 'missed' ? 'bg-red-500/20 text-red-400' : 'bg-[var(--accent)]/20 text-[var(--accent)]'}`}><Phone size={19}/></span><span className="flex-1"><strong className="block">{item.contactName}</strong><small className="opacity-55">{item.type === 'incoming' ? 'Входящий' : item.type === 'outgoing' ? 'Исходящий' : 'Пропущенный'} · {item.time}</small></span></button>)}</motion.div>}
    </AnimatePresence>
    {active && minimized && <button aria-label="Развернуть активный звонок" onClick={() => setMinimized(false)} className="absolute inset-x-4 top-24 z-10 flex items-center gap-3 rounded-full bg-emerald-600 px-4 py-3 text-left text-white shadow-xl"><Phone size={18}/><span className="min-w-0 flex-1 truncate">{contactName}</span><span className="tabular-nums text-sm">{String(Math.floor(seconds/60)).padStart(2,'0')}:{String(seconds%60).padStart(2,'0')}</span></button>}
    <AnimatePresence>{active && !minimized && <motion.div data-testid="active-call" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} className="absolute inset-0 z-20 flex flex-col bg-gradient-to-b from-emerald-950 to-zinc-950 p-8 pt-20 text-center text-white"><div className="mx-auto grid h-28 w-28 place-items-center rounded-full bg-white/10 text-4xl">{contactName.slice(0,1).toUpperCase()}</div><h2 className="mt-6 text-3xl">{contactName}</h2><p className="mt-2 tabular-nums text-white/60">{String(Math.floor(seconds/60)).padStart(2,'0')}:{String(seconds%60).padStart(2,'0')}</p><button aria-label="Свернуть звонок" onClick={() => setMinimized(true)} className="mx-auto mt-8 flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm"><Minimize2 size={17}/>Свернуть</button><div className="mt-auto grid grid-cols-3 gap-5"><CallControl label="Микрофон" active={muted} onClick={() => setMuted(!muted)} icon={Mic}/><CallControl label="Динамик" active={speaker} onClick={() => setSpeaker(!speaker)} icon={Speaker}/><CallControl label="Громкость" active={false} onClick={() => usePhoneStore.getState().showToast('Громкость звонка изменена')} icon={Volume2}/></div><button data-testid="end-call" aria-label="Завершить вызов" onClick={end} className="mx-auto mb-8 mt-10 grid h-16 w-16 place-items-center rounded-full bg-red-500"><PhoneOff/></button></motion.div>}</AnimatePresence>
  </AppShell>;
}
function CallControl({ label, active, onClick, icon: Icon }: { label: string; active: boolean; onClick: () => void; icon: typeof Mic }) { return <button aria-label={label} onClick={onClick} className="flex flex-col items-center gap-2 text-sm"><span className={`grid h-14 w-14 place-items-center rounded-full ${active ? 'bg-white text-black' : 'bg-white/10'}`}><Icon/></span>{label}</button>; }
