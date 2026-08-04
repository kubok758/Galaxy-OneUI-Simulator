import { Activity, Droplets, Footprints, HeartPulse, Minus, Plus, RotateCcw, Scale } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { AppShell } from '../components/AppShell';
import { makeId, usePersistentState } from '../utils/usePersistentState';

type HealthData = { steps: number; water: number; activeMinutes: number; weights: { id: string; value: number; date: string }[] };
const initialHealth: HealthData = { steps: 4382, water: 4, activeMinutes: 28, weights: [{ id: 'weight-1', value: 84.2, date: 'Сегодня' }, { id: 'weight-2', value: 84.6, date: 'Вчера' }, { id: 'weight-3', value: 85, date: '29 июл.' }] };

export function HealthApp() {
  const [data, setData] = usePersistentState<HealthData>('oneui-health-data', initialHealth);
  const [walking, setWalking] = useState(false);
  const [weight, setWeight] = useState('');
  useEffect(() => {
    if (!walking) return;
    const timer = window.setInterval(() => setData((current) => ({ ...current, steps: current.steps + 12, activeMinutes: current.activeMinutes + (current.steps % 720 === 0 ? 1 : 0) })), 1000);
    return () => window.clearInterval(timer);
  }, [setData, walking]);
  const calories = Math.round(data.steps * .042 + data.activeMinutes * 3.2);
  const distance = (data.steps * .00076).toFixed(2);
  const weightTrend = useMemo(() => data.weights.length > 1 ? (data.weights[0].value - data.weights[data.weights.length - 1].value).toFixed(1) : '0.0', [data.weights]);
  const addWeight = () => {
    const value = Number(weight.replace(',', '.'));
    if (!Number.isFinite(value) || value < 25 || value > 300) return;
    setData((current) => ({ ...current, weights: [{ id: makeId('weight'), value, date: 'Сегодня' }, ...current.weights].slice(0, 8) })); setWeight('');
  };
  return <AppShell title="Samsung Health"><div className="px-4 pb-8">
    <section className="rounded-[34px] bg-gradient-to-br from-emerald-500/28 to-cyan-500/18 p-5"><div className="flex items-center justify-between"><div><p className="text-sm text-white/55">Шаги сегодня</p><p className="mt-2 text-5xl font-light">{data.steps.toLocaleString('ru-RU')}</p><p className="mt-1 text-sm text-white/50">Цель: 10 000</p></div><div className="grid h-20 w-20 place-items-center rounded-full bg-black/15"><Footprints size={40} className="text-emerald-300" /></div></div><div className="mt-5 h-3 overflow-hidden rounded-full bg-black/20"><div className="h-full rounded-full bg-emerald-300" style={{ width: `${Math.min(100, data.steps / 100)}%` }} /></div><div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm"><div className="rounded-2xl bg-black/12 p-3"><p className="text-white/45">Км</p><p className="mt-1 font-semibold">{distance}</p></div><div className="rounded-2xl bg-black/12 p-3"><p className="text-white/45">Ккал</p><p className="mt-1 font-semibold">{calories}</p></div><div className="rounded-2xl bg-black/12 p-3"><p className="text-white/45">Минуты</p><p className="mt-1 font-semibold">{data.activeMinutes}</p></div></div><div className="mt-4 flex gap-2"><button onClick={() => setData((current) => ({ ...current, steps: current.steps + 100 }))} className="flex-1 rounded-full bg-white/12 py-3 text-sm">+100 шагов</button><button onClick={() => setWalking((value) => !value)} className={`flex flex-1 items-center justify-center gap-2 rounded-full py-3 text-sm ${walking ? 'bg-red-500 text-white' : 'bg-emerald-300 text-black'}`}><Activity size={17} />{walking ? 'Завершить' : 'Начать ходьбу'}</button></div></section>
    <section className="mt-4 rounded-[30px] bg-white/6 p-5"><div className="flex items-center justify-between"><div className="flex items-center gap-3"><div className="grid h-11 w-11 place-items-center rounded-full bg-sky-500/15 text-sky-300"><Droplets /></div><div><p className="font-semibold">Вода</p><p className="text-xs text-white/45">{data.water} из 8 стаканов</p></div></div><div className="flex gap-2"><button aria-label="Уменьшить воду" onClick={() => setData((current) => ({ ...current, water: Math.max(0, current.water - 1) }))} className="grid h-9 w-9 place-items-center rounded-full bg-white/8"><Minus size={16} /></button><button aria-label="Добавить воду" onClick={() => setData((current) => ({ ...current, water: Math.min(12, current.water + 1) }))} className="grid h-9 w-9 place-items-center rounded-full bg-sky-500 text-white"><Plus size={16} /></button></div></div><div className="mt-4 h-2 overflow-hidden rounded-full bg-white/8"><div className="h-full rounded-full bg-sky-400" style={{ width: `${Math.min(100, data.water / 8 * 100)}%` }} /></div></section>
    <section className="mt-4 rounded-[30px] bg-white/6 p-5"><div className="flex items-center justify-between"><div className="flex items-center gap-3"><Scale className="text-violet-300" /><div><p className="font-semibold">Вес</p><p className="text-xs text-white/45">Тренд: {Number(weightTrend) > 0 ? '+' : ''}{weightTrend} кг</p></div></div><HeartPulse className="text-rose-300" /></div><div className="mt-4 flex gap-2"><input inputMode="decimal" value={weight} onChange={(event) => setWeight(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && addWeight()} placeholder="84.0" className="h-11 min-w-0 flex-1 rounded-2xl bg-white/8 px-4 outline-none" /><button onClick={addWeight} className="rounded-full bg-[var(--accent)] px-5 text-sm font-semibold text-black">Записать</button></div><div className="mt-4 space-y-2">{data.weights.slice(0, 5).map((entry, index) => <div key={entry.id} className="flex items-center rounded-2xl bg-white/4 px-3 py-3"><span className="text-sm text-white/45">{entry.date}</span><span className="ml-auto text-lg font-semibold">{entry.value.toFixed(1)} кг</span>{index === 0 && <span className="ml-2 rounded-full bg-emerald-500/15 px-2 py-1 text-[10px] text-emerald-300">Последнее</span>}</div>)}</div></section>
    <button onClick={() => setData(initialHealth)} className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-white/6 py-3 text-sm text-white/50"><RotateCcw size={17} />Сбросить дневную статистику</button>
  </div></AppShell>;
}
