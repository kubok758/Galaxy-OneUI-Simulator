import { Bot, Fan, Home, Lightbulb, Plus, Power, Sparkles, Trash2, Tv, X, Zap } from 'lucide-react';
import { useMemo, useState } from 'react';
import { AppShell } from '../components/AppShell';
import { makeId, usePersistentState } from '../utils/usePersistentState';

type DeviceType = 'light' | 'tv' | 'vacuum' | 'thermostat' | 'plug';
type Device = { id: string; name: string; room: string; type: DeviceType; on: boolean; level: number };
const initialDevices: Device[] = [
  { id: 'dev-1', name: 'Основной свет', room: 'Гостиная', type: 'light', on: true, level: 72 },
  { id: 'dev-2', name: 'Samsung TV', room: 'Гостиная', type: 'tv', on: false, level: 35 },
  { id: 'dev-3', name: 'Робот-пылесос', room: 'Прихожая', type: 'vacuum', on: false, level: 84 },
  { id: 'dev-4', name: 'Кондиционер', room: 'Спальня', type: 'thermostat', on: true, level: 22 },
  { id: 'dev-5', name: 'Умная розетка', room: 'Кухня', type: 'plug', on: true, level: 41 },
];
const deviceIcons = { light: Lightbulb, tv: Tv, vacuum: Bot, thermostat: Fan, plug: Zap };
const typeNames: Record<DeviceType, string> = { light: 'Лампа', tv: 'Телевизор', vacuum: 'Пылесос', thermostat: 'Климат', plug: 'Розетка' };

export function SmartThingsApp() {
  const [devices, setDevices] = usePersistentState<Device[]>('oneui-smartthings-devices', initialDevices);
  const [room, setRoom] = useState('Все');
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState('');
  const [newRoom, setNewRoom] = useState('Гостиная');
  const [type, setType] = useState<DeviceType>('light');
  const rooms = useMemo(() => ['Все', ...Array.from(new Set(devices.map((device) => device.room)))], [devices]);
  const visible = room === 'Все' ? devices : devices.filter((device) => device.room === room);
  const applyScene = (scene: 'home' | 'away' | 'night') => setDevices((current) => current.map((device) => {
    if (scene === 'away') return { ...device, on: device.type === 'vacuum', level: device.type === 'vacuum' ? 100 : device.level };
    if (scene === 'night') return { ...device, on: device.type === 'light' || device.type === 'thermostat', level: device.type === 'light' ? 18 : device.type === 'thermostat' ? 20 : device.level };
    return { ...device, on: device.type !== 'vacuum', level: device.type === 'thermostat' ? 22 : device.level };
  }));
  const addDevice = () => {
    const clean = name.trim();
    if (!clean) return;
    setDevices((current) => [...current, { id: makeId('device'), name: clean, room: newRoom.trim() || 'Гостиная', type, on: false, level: type === 'thermostat' ? 22 : 50 }]);
    setName(''); setAdding(false);
  };

  return <AppShell title="SmartThings" actions={<button aria-label="Добавить устройство" onClick={() => setAdding(true)} className="grid h-10 w-10 place-items-center rounded-full bg-[var(--accent)] text-black"><Plus /></button>}>
    <div className="px-4 pb-8">
      <section className="rounded-[34px] bg-gradient-to-br from-blue-500/25 to-cyan-500/12 p-5"><div className="flex items-center justify-between"><div><p className="text-sm text-white/50">Мой дом</p><p className="mt-1 text-3xl font-light">{devices.filter((device) => device.on).length} устройств активно</p></div><div className="grid h-16 w-16 place-items-center rounded-full bg-white/10"><Home size={31} className="text-[var(--accent)]" /></div></div><div className="mt-5 grid grid-cols-3 gap-2"><button onClick={() => applyScene('home')} className="rounded-[22px] bg-white/8 p-3 text-sm"><Home className="mx-auto mb-2" size={20} />Дома</button><button onClick={() => applyScene('away')} className="rounded-[22px] bg-white/8 p-3 text-sm"><Bot className="mx-auto mb-2" size={20} />Ушёл</button><button onClick={() => applyScene('night')} className="rounded-[22px] bg-white/8 p-3 text-sm"><Sparkles className="mx-auto mb-2" size={20} />Ночь</button></div></section>
      <div className="no-scrollbar -mx-4 my-4 flex gap-2 overflow-x-auto px-4">{rooms.map((item) => <button key={item} onClick={() => setRoom(item)} className={`shrink-0 rounded-full px-4 py-2 text-sm ${room === item ? 'bg-[var(--accent)] text-black' : 'bg-white/7'}`}>{item}</button>)}</div>
      <div className="grid grid-cols-2 gap-3">{visible.map((device) => { const Icon = deviceIcons[device.type]; return <article key={device.id} className={`rounded-[28px] p-4 ${device.on ? 'bg-[var(--accent)]/16 ring-1 ring-[var(--accent)]/25' : 'bg-white/6'}`}><div className="flex items-start justify-between"><div className={`grid h-11 w-11 place-items-center rounded-full ${device.on ? 'bg-[var(--accent)] text-black' : 'bg-white/8 text-white/55'}`}><Icon size={21} /></div><button aria-label={`${device.on ? 'Выключить' : 'Включить'} ${device.name}`} onClick={() => setDevices((current) => current.map((entry) => entry.id === device.id ? { ...entry, on: !entry.on } : entry))} className={`grid h-9 w-9 place-items-center rounded-full ${device.on ? 'bg-white/15 text-[var(--accent)]' : 'bg-white/7 text-white/35'}`}><Power size={17} /></button></div><p className="mt-4 truncate font-semibold">{device.name}</p><p className="text-xs text-white/40">{device.room}</p><label className="mt-4 block text-xs text-white/45"><span className="flex justify-between"><span>{device.type === 'thermostat' ? 'Температура' : device.type === 'vacuum' ? 'Заряд' : 'Уровень'}</span><strong className="text-white">{device.level}{device.type === 'thermostat' ? '°' : '%'}</strong></span><input type="range" min={device.type === 'thermostat' ? 16 : 0} max={device.type === 'thermostat' ? 30 : 100} value={device.level} disabled={device.type === 'vacuum'} onChange={(event) => setDevices((current) => current.map((entry) => entry.id === device.id ? { ...entry, level: Number(event.target.value), on: Number(event.target.value) > 0 } : entry))} className="range mt-2 w-full disabled:opacity-50" /></label><button aria-label={`Удалить ${device.name}`} onClick={() => setDevices((current) => current.filter((entry) => entry.id !== device.id))} className="mt-3 flex items-center gap-1 text-[11px] text-red-300/70"><Trash2 size={13} />Удалить</button></article>; })}</div>
    </div>
    {adding && <div className="absolute inset-0 z-20 flex items-end bg-black/55 p-3 backdrop-blur-sm"><div className="w-full rounded-[32px] bg-zinc-900 p-5"><div className="mb-5 flex items-center justify-between"><h2 className="text-xl font-semibold">Новое устройство</h2><button aria-label="Закрыть" onClick={() => setAdding(false)}><X /></button></div><input autoFocus value={name} onChange={(event) => setName(event.target.value)} placeholder="Название устройства" className="h-12 w-full rounded-2xl bg-white/10 px-4 outline-none" /><input value={newRoom} onChange={(event) => setNewRoom(event.target.value)} placeholder="Комната" className="mt-3 h-12 w-full rounded-2xl bg-white/10 px-4 outline-none" /><p className="mb-2 mt-4 text-xs text-white/45">Тип</p><div className="grid grid-cols-3 gap-2">{(Object.keys(typeNames) as DeviceType[]).map((item) => { const Icon = deviceIcons[item]; return <button key={item} onClick={() => setType(item)} className={`rounded-2xl p-3 text-xs ${type === item ? 'bg-[var(--accent)] text-black' : 'bg-white/8'}`}><Icon className="mx-auto mb-1" size={18} />{typeNames[item]}</button>; })}</div><button onClick={addDevice} disabled={!name.trim()} className="mt-5 h-12 w-full rounded-full bg-[var(--accent)] font-semibold text-black disabled:opacity-35">Добавить</button></div></div>}
  </AppShell>;
}
