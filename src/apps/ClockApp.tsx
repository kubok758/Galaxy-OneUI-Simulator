import { Pause, Play, Plus, RotateCcw, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { AppShell } from '../components/AppShell';
import { Switch } from '../components/Switch';
import { usePhoneStore } from '../state/usePhoneStore';

type Tab = 'alarm' | 'world' | 'stopwatch' | 'timer';

export function ClockApp() {
  const [tab, setTab] = useState<Tab>('alarm');
  return <AppShell title="Часы" actions={<div className="flex gap-1">{(['alarm','world','stopwatch','timer'] as Tab[]).map((id) => <button key={id} onClick={() => setTab(id)} className={`rounded-full px-2.5 py-2 text-[11px] ${tab === id ? 'bg-[var(--accent)] text-zinc-950' : 'bg-white/8'}`}>{({alarm:'Будильник',world:'Мир',stopwatch:'Секундомер',timer:'Таймер'} as Record<Tab,string>)[id]}</button>)}</div>}>
    {tab === 'alarm' && <AlarmPanel/>}{tab === 'world' && <WorldPanel/>}{tab === 'stopwatch' && <StopwatchPanel/>}{tab === 'timer' && <TimerPanel/>}
  </AppShell>;
}

function AlarmPanel() {
  const alarms = usePhoneStore((s) => s.alarms);
  const addAlarm = usePhoneStore((s) => s.addAlarm);
  const toggle = usePhoneStore((s) => s.toggleAlarm);
  const remove = usePhoneStore((s) => s.deleteAlarm);
  const [time, setTime] = useState('08:30');
  const [label, setLabel] = useState('Будильник');
  return <div className="px-4"><div className="mb-5 flex gap-2 rounded-[28px] bg-[var(--surface)] p-3"><input aria-label="Время будильника" type="time" value={time} onChange={(e) => setTime(e.target.value)} className="rounded-2xl bg-black/10 p-3"/><input aria-label="Название будильника" value={label} onChange={(e) => setLabel(e.target.value)} className="min-w-0 flex-1 rounded-2xl bg-black/10 p-3 outline-none"/><button aria-label="Добавить будильник" onClick={() => addAlarm(time, label.trim() || 'Будильник')} className="grid h-12 w-12 place-items-center rounded-full bg-[var(--accent)] text-zinc-950"><Plus/></button></div>{alarms.map((alarm) => <div key={alarm.id} className="mb-3 flex items-center gap-3 rounded-[28px] bg-[var(--surface)] p-4"><div className="flex-1"><p className="text-4xl font-light tabular-nums">{alarm.time}</p><p className="text-sm opacity-55">{alarm.label}</p></div><Switch checked={alarm.enabled} onChange={() => toggle(alarm.id)} label={`${alarm.label} ${alarm.time}`}/><button aria-label="Удалить будильник" onClick={() => remove(alarm.id)} className="text-red-400"><Trash2 size={19}/></button></div>)}</div>;
}
function WorldPanel() {
  const [now, setNow] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);
  const zones = [{city:'Санкт-Петербург', zone:'Europe/Moscow'}, {city:'Берлин', zone:'Europe/Berlin'}, {city:'Нью-Йорк', zone:'America/New_York'}, {city:'Токио', zone:'Asia/Tokyo'}];
  return <div className="space-y-3 px-4">{zones.map((item) => <div key={item.zone} className="flex items-center justify-between rounded-[28px] bg-[var(--surface)] p-5"><div><strong>{item.city}</strong><p className="text-sm opacity-50">{now.toLocaleDateString('ru-RU', { timeZone: item.zone, weekday:'short', day:'numeric', month:'short' })}</p></div><p className="text-3xl font-light tabular-nums">{now.toLocaleTimeString('ru-RU', { timeZone: item.zone, hour:'2-digit', minute:'2-digit' })}</p></div>)}</div>;
}
function StopwatchPanel() {
  const [elapsed, setElapsed] = useState(0); const [running, setRunning] = useState(false); const [laps, setLaps] = useState<number[]>([]);
  useEffect(() => { if (!running) return; const started = performance.now() - elapsed; const t = setInterval(() => setElapsed(performance.now() - started), 30); return () => clearInterval(t); }, [running]);
  const format = (ms:number) => `${String(Math.floor(ms/60000)).padStart(2,'0')}:${String(Math.floor(ms/1000)%60).padStart(2,'0')}.${String(Math.floor(ms/10)%100).padStart(2,'0')}`;
  return <div className="px-5 text-center"><p className="mt-20 text-6xl font-extralight tabular-nums">{format(elapsed)}</p><div className="mt-14 flex justify-center gap-5"><button aria-label="Сбросить секундомер" onClick={() => { setRunning(false); setElapsed(0); setLaps([]); }} className="grid h-14 w-14 place-items-center rounded-full bg-[var(--surface)]"><RotateCcw/></button><button aria-label={running ? 'Пауза' : 'Старт'} onClick={() => setRunning(!running)} className="grid h-16 w-16 place-items-center rounded-full bg-[var(--accent)] text-zinc-950">{running ? <Pause/> : <Play/>}</button><button aria-label="Круг" onClick={() => elapsed > 0 && setLaps((x) => [elapsed, ...x])} className="h-14 w-14 rounded-full bg-[var(--surface)] text-sm">Круг</button></div><div className="mt-8 max-h-56 overflow-auto text-left">{laps.map((lap,i) => <div key={`${lap}-${i}`} className="flex justify-between border-b border-white/5 py-3"><span>Круг {laps.length-i}</span><span className="tabular-nums">{format(lap)}</span></div>)}</div></div>;
}
function TimerPanel() {
  const [input, setInput] = useState(300); const [left, setLeft] = useState(300); const [running, setRunning] = useState(false);
  useEffect(() => { if (!running) return; const t = setInterval(() => setLeft((v) => { if (v <= 1) { setRunning(false); usePhoneStore.getState().showToast('Таймер завершён'); return 0; } return v-1; }), 1000); return () => clearInterval(t); }, [running]);
  const min = Math.floor(left/60); const sec = left%60;
  return <div className="px-5 text-center"><div className="mx-auto mt-14 grid h-64 w-64 place-items-center rounded-full border-[10px] border-[var(--accent)]/25"><p className="text-6xl font-extralight tabular-nums">{String(min).padStart(2,'0')}:{String(sec).padStart(2,'0')}</p></div><label className="mx-auto mt-8 block max-w-xs text-sm opacity-70">Длительность: {Math.floor(input/60)} мин<input aria-label="Длительность таймера" className="range mt-2 w-full" type="range" min="10" max="3600" step="10" value={input} onChange={(e) => { const v=Number(e.target.value); setInput(v); if(!running) setLeft(v); }}/></label><div className="mt-8 flex justify-center gap-5"><button aria-label="Сбросить таймер" onClick={() => {setRunning(false); setLeft(input);}} className="grid h-14 w-14 place-items-center rounded-full bg-[var(--surface)]"><RotateCcw/></button><button aria-label={running?'Пауза':'Старт'} onClick={() => setRunning(!running)} className="grid h-16 w-16 place-items-center rounded-full bg-[var(--accent)] text-zinc-950">{running?<Pause/>:<Play/>}</button></div></div>;
}
