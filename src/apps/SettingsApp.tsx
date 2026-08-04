import { AnimatePresence, motion } from 'framer-motion';
import { AppWindow, ChevronRight, Gauge, LockKeyhole, Palette, Radio, Search, Shield, Smartphone, Type, Volume2, Wifi } from 'lucide-react';
import { useState } from 'react';
import { AppShell } from '../components/AppShell';
import { Switch } from '../components/Switch';
import { usePhoneStore } from '../state/usePhoneStore';

type Section = 'main' | 'connections' | 'device' | 'apps' | 'general' | 'privacy' | 'display' | 'lock';

export function SettingsApp() {
  const [section, setSection] = useState<Section>('main');
  const [query, setQuery] = useState('');
  const settings = usePhoneStore((s) => s.settings);
  const update = usePhoneStore((s) => s.updateSetting);
  const toggle = usePhoneStore((s) => s.toggleSetting);
  const notifications = usePhoneStore((s) => s.notifications);
  const showToast = usePhoneStore((s) => s.showToast);
  const sections = [
    { id: 'connections' as const, label: 'Подключения', sub: 'Wi‑Fi, Bluetooth, мобильные данные', icon: Wifi },
    { id: 'device' as const, label: 'Устройство', sub: 'Звук, батарея и хранилище', icon: Smartphone },
    { id: 'apps' as const, label: 'Приложения', sub: 'Разрешения и приложения по умолчанию', icon: AppWindow },
    { id: 'general' as const, label: 'Общие настройки', sub: 'Язык, дата и сброс', icon: Gauge },
    { id: 'privacy' as const, label: 'Конфиденциальность', sub: 'Разрешения и защита данных', icon: Shield },
    { id: 'display' as const, label: 'Дисплей', sub: 'Тема, яркость и размер шрифта', icon: Palette },
    { id: 'lock' as const, label: 'Экран блокировки', sub: 'PIN-код и уведомления', icon: LockKeyhole },
  ];
  const title = section === 'main' ? 'Настройки' : sections.find((s) => s.id === section)?.label ?? 'Настройки';
  return <AppShell title={title} actions={section !== 'main' ? <button onClick={() => setSection('main')} className="rounded-full px-3 py-2 text-sm text-[var(--accent)]">Все разделы</button> : undefined}>
    <AnimatePresence mode="wait"><motion.div key={section} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="px-4">
      {section === 'main' && <>
        <div className="mb-5 flex items-center gap-3 rounded-full bg-[var(--surface)] px-4"><Search size={18}/><input aria-label="Поиск настроек" value={query} onChange={(e) => setQuery(e.target.value)} className="h-12 flex-1 bg-transparent outline-none" placeholder="Поиск в настройках"/></div>
        <div className="mb-4 rounded-[30px] bg-[var(--surface)] p-5"><p className="text-lg font-semibold">Galaxy S25 Ultra</p><p className="mt-1 text-sm opacity-60">One UI 8.5 · защита включена</p></div>
        <div className="overflow-hidden rounded-[30px] bg-[var(--surface)]">{sections.filter((item) => `${item.label} ${item.sub}`.toLowerCase().includes(query.toLowerCase())).map(({ id, label, sub, icon: Icon }) => <button key={id} onClick={() => setSection(id)} className="flex w-full items-center gap-4 border-b border-white/5 p-4 text-left last:border-0"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-[var(--accent)]/20 text-[var(--accent)]"><Icon/></span><span className="min-w-0 flex-1"><strong className="block">{label}</strong><small className="block truncate opacity-55">{sub}</small></span><ChevronRight className="opacity-35"/></button>)}</div>
      </>}
      {section === 'connections' && <SettingsCard>
        <ToggleRow label="Wi‑Fi" value={settings.wifi} onChange={() => toggle('wifi')} />
        <ToggleRow label="Bluetooth" value={settings.bluetooth} onChange={() => toggle('bluetooth')} />
        <ToggleRow label="Мобильные данные" value={settings.mobileData} onChange={() => toggle('mobileData')} />
        <ToggleRow label="Режим полёта" value={settings.airplane} onChange={() => toggle('airplane')} />
        <button onClick={() => showToast('Подключено к Galaxy_WiFi_5G')} className="w-full p-4 text-left"><span className="block">Текущая сеть</span><small className="opacity-55">Galaxy_WiFi_5G · защищено WPA3</small></button>
      </SettingsCard>}
      {section === 'device' && <><SettingsCard><RangeRow icon={Volume2} label="Громкость" value={settings.sound} onChange={(v) => update('sound', v)}/><RangeRow icon={Gauge} label="Заряд батареи" value={settings.battery} onChange={(v) => update('battery', v)}/><ToggleRow label="Анимация зарядки" value={settings.charging} onChange={() => toggle('charging')} /></SettingsCard><SettingsCard><p className="p-4">Хранилище: {Math.round(JSON.stringify(localStorage).length / 1024)} КБ используется</p></SettingsCard></>}
      {section === 'apps' && <SettingsCard><p className="p-4 text-sm opacity-65">Установлено 12 системных приложений. Все данные хранятся локально в этом браузере.</p>{['Камера', 'Микрофон', 'Файлы', 'Уведомления'].map((item) => <ToggleRow key={item} label={`Разрешение: ${item}`} value onChange={() => showToast('Системное разрешение активно')} />)}</SettingsCard>}
      {section === 'general' && <SettingsCard><button onClick={() => showToast('Язык системы: Русский')} className="w-full p-4 text-left">Язык <small className="block opacity-55">Русский</small></button><button onClick={() => showToast(new Date().toLocaleString('ru-RU'))} className="w-full p-4 text-left">Дата и время <small className="block opacity-55">Автоматически</small></button><button onClick={() => { localStorage.removeItem('galaxy-oneui-85-state'); location.reload(); }} className="w-full p-4 text-left text-red-400">Сбросить данные симулятора</button></SettingsCard>}
      {section === 'privacy' && <SettingsCard><ToggleRow label="Показывать уведомления" value={notifications.length > 0} onChange={() => showToast('Уведомления управляются отдельно')} /><ToggleRow label="Диагностика устройства" value={false} onChange={() => showToast('Диагностические данные не отправляются')} /><p className="p-4 text-sm opacity-60">Симулятор не передаёт персональные данные на сервер.</p></SettingsCard>}
      {section === 'display' && <><SettingsCard><RangeRow icon={Gauge} label="Яркость" value={settings.brightness} onChange={(v) => update('brightness', v)}/><RangeRow icon={Type} label="Размер шрифта" value={Math.round(settings.fontScale * 100)} min={80} max={130} onChange={(v) => update('fontScale', v / 100)}/><ToggleRow label="Тёмная тема" value={settings.theme === 'dark'} onChange={() => update('theme', settings.theme === 'dark' ? 'light' : 'dark')} /></SettingsCard><SettingsCard><p className="px-4 pt-4 text-sm opacity-55">Обои</p><div className="grid grid-cols-4 gap-3 p-4">{['aurora','ocean','sunset','graphite'].map((wallpaper) => <button key={wallpaper} aria-label={`Обои ${wallpaper}`} onClick={() => update('wallpaper', wallpaper)} className={`wallpaper-${wallpaper} aspect-[3/5] rounded-2xl ring-2 ${settings.wallpaper === wallpaper ? 'ring-[var(--accent)]' : 'ring-transparent'}`}/>)}</div><label className="mx-4 mb-4 block cursor-pointer rounded-full bg-white/10 px-4 py-3 text-center text-sm">Загрузить свои обои<input type="file" accept="image/*" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (!file) return; if (file.size > 2_000_000) { showToast('Изображение должно быть меньше 2 МБ'); return; } const reader = new FileReader(); reader.onload = () => update('wallpaper', String(reader.result)); reader.onerror = () => showToast('Не удалось прочитать изображение'); reader.readAsDataURL(file); }}/></label><p className="px-4 pb-2 text-sm opacity-55">Динамический цвет</p><div className="flex gap-3 px-4 pb-4">{['#8ab4ff','#b5a7ff','#ffadcb','#8be0c1','#ffd18b'].map((color) => <button key={color} aria-label={`Акцент ${color}`} onClick={() => update('accent', color)} className={`h-9 w-9 rounded-full ring-2 ring-offset-2 ring-offset-transparent ${settings.accent === color ? 'ring-white' : 'ring-transparent'}`} style={{ backgroundColor: color }}/>)}</div><p className="px-4 pb-2 text-sm opacity-55">Сетка</p><div className="flex gap-3 p-4 pt-0">{(['4x6','5x6'] as const).map((grid) => <button key={grid} onClick={() => update('grid', grid)} className={`rounded-full px-4 py-2 ${settings.grid === grid ? 'bg-[var(--accent)] text-zinc-950' : 'bg-white/10'}`}>{grid}</button>)}</div></SettingsCard></>}
      {section === 'lock' && <SettingsCard><label className="block p-4">PIN-код<input aria-label="Новый PIN-код" inputMode="numeric" maxLength={4} value={settings.pin} onChange={(e) => { const v = e.target.value.replace(/\D/g,'').slice(0,4); update('pin', v); }} className="mt-2 w-full rounded-2xl bg-black/15 p-3 tracking-[.5em] outline-none"/></label><p className="px-4 pb-4 text-sm opacity-55">Используйте ровно 4 цифры. Изменение применяется сразу.</p></SettingsCard>}
    </motion.div></AnimatePresence>
  </AppShell>;
}

function SettingsCard({ children }: { children: React.ReactNode }) { return <div className="mb-4 overflow-hidden rounded-[30px] bg-[var(--surface)] divide-y divide-white/5">{children}</div>; }
function ToggleRow({ label, value, onChange }: { label: string; value: boolean; onChange: () => void }) { return <div className="flex items-center justify-between p-4"><span>{label}</span><Switch checked={value} onChange={onChange} label={label}/></div>; }
function RangeRow({ icon: Icon, label, value, onChange, min = 0, max = 100 }: { icon: typeof Radio; label: string; value: number; onChange: (v: number) => void; min?: number; max?: number }) { return <label className="block p-4"><span className="mb-3 flex items-center gap-2"><Icon size={18}/>{label}<strong className="ml-auto">{value}</strong></span><input aria-label={label} className="range w-full" type="range" min={min} max={max} value={value} onChange={(e) => onChange(Number(e.target.value))}/></label>; }
