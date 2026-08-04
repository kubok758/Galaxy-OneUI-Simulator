import { CloudRain, CloudSun, LocateFixed, Plus, RefreshCw, Sun, Trash2, Wind } from 'lucide-react';
import { useMemo, useState } from 'react';
import { AppShell } from '../components/AppShell';
import { makeId, usePersistentState } from '../utils/usePersistentState';

type SavedCity = { id: string; name: string; temperature: number; condition: string; humidity: number; wind: number; updatedAt: string };
const conditions = ['Ясно', 'Переменная облачность', 'Облачно', 'Небольшой дождь'];
const initialCities: SavedCity[] = [
  { id: 'city-spb', name: 'Санкт-Петербург', temperature: 18, condition: 'Переменная облачность', humidity: 72, wind: 4.2, updatedAt: 'Сейчас' },
  { id: 'city-minsk', name: 'Минск', temperature: 22, condition: 'Ясно', humidity: 58, wind: 2.7, updatedAt: '12 мин назад' },
];
const weatherIcon = (condition: string) => condition.includes('дожд') ? CloudRain : condition === 'Ясно' ? Sun : CloudSun;

export function WeatherApp() {
  const [cities, setCities] = usePersistentState<SavedCity[]>('oneui-weather-cities', initialCities);
  const [activeId, setActiveId] = usePersistentState('oneui-weather-active', 'city-spb');
  const [adding, setAdding] = useState(false);
  const [cityName, setCityName] = useState('');
  const [locating, setLocating] = useState(false);
  const active = cities.find((city) => city.id === activeId) ?? cities[0];
  const forecast = useMemo(() => {
    const base = active?.temperature ?? 18;
    return Array.from({ length: 7 }, (_, index) => ({
      label: new Date(Date.now() + index * 86400000).toLocaleDateString('ru-RU', { weekday: 'short' }),
      temperature: base + [0, 1, -1, 2, 1, -2, 0][index],
      condition: conditions[(index + Math.abs(base)) % conditions.length],
    }));
  }, [active]);

  const refresh = () => active && setCities((current) => current.map((city) => city.id === active.id ? {
    ...city,
    temperature: Math.max(-25, Math.min(38, city.temperature + (Math.random() > .5 ? 1 : -1))),
    condition: conditions[Math.floor(Math.random() * conditions.length)],
    humidity: Math.max(30, Math.min(95, city.humidity + Math.round(Math.random() * 8 - 4))),
    wind: Math.max(.5, Math.round((city.wind + Math.random() - .5) * 10) / 10),
    updatedAt: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
  } : city));

  const addCity = () => {
    const clean = cityName.trim();
    if (!clean) return;
    const id = makeId('city');
    setCities((current) => [...current, { id, name: clean, temperature: 20, condition: 'Облачно', humidity: 65, wind: 3.1, updatedAt: 'Сейчас' }]);
    setActiveId(id); setCityName(''); setAdding(false);
  };

  const locate = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition((position) => {
      const id = 'city-location';
      const next: SavedCity = { id, name: 'Моё местоположение', temperature: Math.round(20 - Math.abs(position.coords.latitude - 50) / 8), condition: 'Переменная облачность', humidity: 61, wind: 3.4, updatedAt: 'По геопозиции' };
      setCities((current) => current.some((city) => city.id === id) ? current.map((city) => city.id === id ? next : city) : [...current, next]);
      setActiveId(id); setLocating(false);
    }, () => setLocating(false), { enableHighAccuracy: true, timeout: 8000 });
  };

  if (!active) return <AppShell title="Погода"><div className="p-6"><button onClick={() => setCities(initialCities)} className="rounded-full bg-[var(--accent)] px-5 py-3 text-black">Восстановить города</button></div></AppShell>;
  const Icon = weatherIcon(active.condition);
  return <AppShell title="Погода" actions={<button aria-label="Добавить город" onClick={() => setAdding((value) => !value)} className="grid h-10 w-10 place-items-center rounded-full bg-white/8"><Plus /></button>}>
    <div className="px-4 pb-8">
      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-3">{cities.map((city) => <button key={city.id} onClick={() => setActiveId(city.id)} className={`shrink-0 rounded-full px-4 py-2 text-sm ${city.id === active.id ? 'bg-[var(--accent)] text-black' : 'bg-white/8'}`}>{city.name}</button>)}</div>
      {adding && <div className="mb-4 flex gap-2 rounded-[24px] bg-white/6 p-3"><input autoFocus value={cityName} onChange={(event) => setCityName(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && addCity()} placeholder="Название города" className="min-w-0 flex-1 bg-transparent px-2 outline-none" /><button onClick={addCity} className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm text-black">Добавить</button></div>}
      <section className="rounded-[36px] bg-gradient-to-br from-sky-500/40 via-blue-500/20 to-violet-500/30 p-6 shadow-xl">
        <div className="flex items-start justify-between"><div><p className="text-sm text-white/70">{active.name}</p><p className="mt-2 text-7xl font-extralight">{active.temperature}°</p><p className="mt-1 text-lg">{active.condition}</p></div><Icon size={76} strokeWidth={1.2} className="text-white/85" /></div>
        <div className="mt-7 grid grid-cols-2 gap-3 text-sm"><div className="rounded-2xl bg-black/15 p-3"><p className="text-white/50">Влажность</p><p className="mt-1 text-xl">{active.humidity}%</p></div><div className="rounded-2xl bg-black/15 p-3"><p className="flex items-center gap-2 text-white/50"><Wind size={14} /> Ветер</p><p className="mt-1 text-xl">{active.wind} м/с</p></div></div>
        <button onClick={refresh} className="mt-4 flex items-center gap-2 text-sm text-white/65"><RefreshCw size={15} /> Обновлено: {active.updatedAt}</button>
      </section>
      <div className="mt-5 rounded-[30px] bg-white/5 p-4"><p className="mb-4 font-semibold">Прогноз на неделю</p><div className="space-y-1">{forecast.map((day, index) => { const DayIcon = weatherIcon(day.condition); return <div key={index} className="flex items-center rounded-2xl px-2 py-3"><span className="w-24 capitalize">{index === 0 ? 'Сегодня' : day.label}</span><DayIcon size={22} className="text-[var(--accent)]" /><span className="ml-auto font-semibold">{day.temperature}°</span></div>; })}</div></div>
      <div className="mt-4 grid grid-cols-2 gap-3"><button onClick={locate} disabled={locating} className="flex items-center justify-center gap-2 rounded-full bg-white/8 py-3 text-sm"><LocateFixed size={17} />{locating ? 'Определяю…' : 'Геопозиция'}</button><button disabled={cities.length <= 1} onClick={() => { const remaining = cities.filter((city) => city.id !== active.id); setCities(remaining); setActiveId(remaining[0]?.id ?? ''); }} className="flex items-center justify-center gap-2 rounded-full bg-red-500/10 py-3 text-sm text-red-300 disabled:opacity-30"><Trash2 size={17} />Удалить</button></div>
    </div>
  </AppShell>;
}
