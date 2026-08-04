import { Compass, Crosshair, LocateFixed, Navigation, RotateCcw } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { AppShell } from '../components/AppShell';

type OrientationPermissionEvent = typeof DeviceOrientationEvent & { requestPermission?: () => Promise<'granted' | 'denied'> };
const cardinal = (heading: number) => ['С', 'СВ', 'В', 'ЮВ', 'Ю', 'ЮЗ', 'З', 'СЗ'][Math.round(((heading % 360) + 360) % 360 / 45) % 8];

export function CompassApp() {
  const [heading, setHeading] = useState(0);
  const [sensorEnabled, setSensorEnabled] = useState(false);
  const [sensorError, setSensorError] = useState('');
  const [coords, setCoords] = useState<{ latitude: number; longitude: number; accuracy: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const [calibration, setCalibration] = useState(82);

  useEffect(() => {
    if (!sensorEnabled) return;
    const listener = (event: DeviceOrientationEvent) => {
      const webkitHeading = (event as DeviceOrientationEvent & { webkitCompassHeading?: number }).webkitCompassHeading;
      const next = typeof webkitHeading === 'number' ? webkitHeading : typeof event.alpha === 'number' ? 360 - event.alpha : null;
      if (next !== null) { setHeading((next + 360) % 360); setCalibration((current) => Math.min(100, current + 1)); }
    };
    window.addEventListener('deviceorientation', listener, true);
    return () => window.removeEventListener('deviceorientation', listener, true);
  }, [sensorEnabled]);

  const enableSensor = async () => {
    setSensorError('');
    try {
      if (typeof DeviceOrientationEvent === 'undefined') throw new Error('Датчик ориентации недоступен');
      const orientation = DeviceOrientationEvent as OrientationPermissionEvent;
      if (orientation.requestPermission && await orientation.requestPermission() !== 'granted') throw new Error('Доступ к датчику ориентации отклонён');
      setSensorEnabled(true);
    } catch (reason) { setSensorError(reason instanceof Error ? reason.message : 'Не удалось включить компас'); }
  };

  const locate = () => {
    if (!navigator.geolocation) { setSensorError('Геолокация не поддерживается'); return; }
    setLocating(true);
    navigator.geolocation.getCurrentPosition((position) => { setCoords({ latitude: position.coords.latitude, longitude: position.coords.longitude, accuracy: position.coords.accuracy }); setLocating(false); }, () => { setSensorError('Не удалось определить местоположение'); setLocating(false); }, { enableHighAccuracy: true, timeout: 10000 });
  };

  const marks = useMemo(() => Array.from({ length: 72 }, (_, index) => index * 5), []);
  const normalized = Math.round(heading) % 360;
  return <AppShell title="Компас"><div className="px-4 pb-8">
    <section className="relative mx-auto mt-2 aspect-square max-w-[340px] rounded-full bg-gradient-to-br from-white/10 to-white/3 p-5 shadow-[inset_0_0_50px_rgba(255,255,255,.04)] ring-1 ring-white/10"><div className="relative h-full w-full rounded-full border border-white/15">{marks.map((mark) => <span key={mark} className="absolute left-1/2 top-1/2 h-full w-px -translate-x-1/2 -translate-y-1/2" style={{ transform: `translate(-50%, -50%) rotate(${mark}deg)` }}><span className={`absolute left-1/2 top-1 -translate-x-1/2 bg-white/55 ${mark % 45 === 0 ? 'h-5 w-0.5' : mark % 15 === 0 ? 'h-3 w-px' : 'h-2 w-px opacity-50'}`} /></span>)}{['С','В','Ю','З'].map((label, index) => <span key={label} className={`absolute text-lg font-semibold ${label === 'С' ? 'text-red-400' : 'text-white/75'}`} style={{ left: index === 1 ? 'calc(100% - 24px)' : index === 3 ? '10px' : '50%', top: index === 0 ? '16px' : index === 2 ? 'calc(100% - 42px)' : '50%', transform: 'translate(-50%, -50%)' }}>{label}</span>)}<div className="absolute inset-12 rounded-full bg-black/20 shadow-inner" /><div className="absolute left-1/2 top-1/2 h-[43%] w-3 origin-bottom -translate-x-1/2 -translate-y-full transition-transform duration-200" style={{ transform: `translate(-50%, -100%) rotate(${-heading}deg)` }}><span className="absolute inset-x-0 top-0 h-1/2 rounded-t-full bg-red-500" /><span className="absolute inset-x-0 bottom-0 h-1/2 rounded-b-full bg-white/75" /></div><div className="absolute left-1/2 top-1/2 grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-zinc-200 text-black shadow-lg"><Crosshair size={18} /></div></div></section>
    <div className="mt-5 text-center"><p className="text-6xl font-extralight tabular-nums">{normalized}°</p><p className="mt-1 text-xl font-semibold text-[var(--accent)]">{cardinal(normalized)}</p></div>
    {!sensorEnabled && <div className="mt-5 rounded-[28px] bg-white/6 p-4"><p className="text-sm text-white/60">Разрешите доступ к датчику ориентации, чтобы стрелка следовала за реальным направлением телефона.</p><button onClick={enableSensor} className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[var(--accent)] py-3 font-semibold text-black"><Compass size={18} />Включить датчик</button></div>}
    {!sensorEnabled && <label className="mt-4 block rounded-[24px] bg-white/5 p-4 text-sm text-white/50"><span className="flex justify-between"><span>Ручная проверка</span><strong className="text-white">{normalized}°</strong></span><input type="range" min="0" max="359" value={heading} onChange={(event) => setHeading(Number(event.target.value))} className="range mt-3 w-full" /></label>}
    {sensorError && <p className="mt-3 rounded-2xl bg-red-500/10 p-3 text-sm text-red-300">{sensorError}</p>}
    <section className="mt-4 rounded-[28px] bg-white/6 p-4"><div className="flex items-center justify-between"><div><p className="text-sm text-white/45">Калибровка</p><p className="mt-1 font-semibold">{calibration >= 90 ? 'Высокая точность' : calibration >= 60 ? 'Средняя точность' : 'Нужна калибровка'}</p></div><RotateCcw className={calibration < 90 ? 'animate-spin text-[var(--accent)]' : 'text-emerald-300'} /></div><div className="mt-3 h-2 overflow-hidden rounded-full bg-white/8"><div className="h-full rounded-full bg-[var(--accent)]" style={{ width: `${calibration}%` }} /></div><button onClick={() => setCalibration(100)} className="mt-3 text-xs text-[var(--accent)]">Завершить калибровку вручную</button></section>
    <section className="mt-4 rounded-[28px] bg-white/6 p-4"><div className="flex items-center gap-3"><div className="grid h-11 w-11 place-items-center rounded-full bg-blue-500/15 text-blue-300"><LocateFixed /></div><div className="min-w-0 flex-1"><p className="font-semibold">Координаты</p>{coords ? <p className="text-xs text-white/45">{coords.latitude.toFixed(5)}, {coords.longitude.toFixed(5)} · ±{Math.round(coords.accuracy)} м</p> : <p className="text-xs text-white/45">Местоположение ещё не определено</p>}</div></div><button onClick={locate} disabled={locating} className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-white/8 py-3 text-sm"><Navigation size={17} />{locating ? 'Определяю…' : 'Определить местоположение'}</button></section>
  </div></AppShell>;
}
