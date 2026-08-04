import { CalendarClock, Check, Circle, Flag, Plus, Trash2, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { AppShell } from '../components/AppShell';
import { makeId, usePersistentState } from '../utils/usePersistentState';

type Reminder = { id: string; title: string; due: string; priority: 'low' | 'normal' | 'high'; done: boolean; category: string };
type Filter = 'all' | 'today' | 'done';
const todayKey = () => new Date().toISOString().slice(0, 10);
const initialReminders: Reminder[] = [
  { id: 'rem-1', title: 'Позвонить Алексею', due: todayKey(), priority: 'high', done: false, category: 'Личное' },
  { id: 'rem-2', title: 'Купить кабель USB-C', due: new Date(Date.now() + 86400000).toISOString().slice(0, 10), priority: 'normal', done: false, category: 'Покупки' },
  { id: 'rem-3', title: 'Проверить резервную копию', due: todayKey(), priority: 'low', done: true, category: 'Телефон' },
];

export function ReminderApp() {
  const [items, setItems] = usePersistentState<Reminder[]>('oneui-reminders', initialReminders);
  const [filter, setFilter] = useState<Filter>('all');
  const [editorOpen, setEditorOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [due, setDue] = useState(todayKey());
  const [priority, setPriority] = useState<Reminder['priority']>('normal');
  const [category, setCategory] = useState('Личное');
  const visible = useMemo(() => items.filter((item) => filter === 'today' ? item.due === todayKey() && !item.done : filter === 'done' ? item.done : true).sort((a, b) => Number(a.done) - Number(b.done) || a.due.localeCompare(b.due)), [filter, items]);
  const add = () => {
    const clean = title.trim();
    if (!clean) return;
    setItems((current) => [{ id: makeId('reminder'), title: clean, due, priority, done: false, category: category.trim() || 'Личное' }, ...current]);
    setTitle(''); setDue(todayKey()); setPriority('normal'); setEditorOpen(false);
  };
  const remaining = items.filter((item) => !item.done).length;
  return <AppShell title="Напоминания" actions={<button aria-label="Добавить напоминание" onClick={() => setEditorOpen(true)} className="grid h-10 w-10 place-items-center rounded-full bg-[var(--accent)] text-black"><Plus /></button>}>
    <div className="px-4 pb-8">
      <section className="rounded-[32px] bg-gradient-to-br from-blue-500/30 to-violet-500/25 p-5"><p className="text-sm text-white/55">Осталось выполнить</p><div className="mt-2 flex items-end justify-between"><p className="text-5xl font-light">{remaining}</p><CalendarClock size={42} className="text-[var(--accent)]" /></div><div className="mt-4 h-2 overflow-hidden rounded-full bg-black/20"><div className="h-full rounded-full bg-[var(--accent)]" style={{ width: `${items.length ? items.filter((item) => item.done).length / items.length * 100 : 0}%` }} /></div></section>
      <div className="my-4 flex gap-2">{([['all','Все'],['today','Сегодня'],['done','Готово']] as const).map(([id, label]) => <button key={id} onClick={() => setFilter(id)} className={`flex-1 rounded-full py-2.5 text-sm ${filter === id ? 'bg-[var(--accent)] text-black' : 'bg-white/7'}`}>{label}</button>)}</div>
      <div className="space-y-2">{visible.length === 0 && <button onClick={() => setEditorOpen(true)} className="w-full rounded-[28px] border border-dashed border-white/15 p-8 text-white/45">Здесь пока пусто. Добавить напоминание</button>}{visible.map((item) => <div key={item.id} className={`flex items-center gap-3 rounded-[25px] p-4 ${item.done ? 'bg-white/3 opacity-60' : 'bg-white/6'}`}><button aria-label={item.done ? 'Вернуть напоминание' : 'Выполнить напоминание'} onClick={() => setItems((current) => current.map((entry) => entry.id === item.id ? { ...entry, done: !entry.done } : entry))} className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border ${item.done ? 'border-[var(--accent)] bg-[var(--accent)] text-black' : 'border-white/30'}`}>{item.done ? <Check size={18} /> : <Circle size={17} />}</button><div className="min-w-0 flex-1"><p className={`truncate font-medium ${item.done ? 'line-through' : ''}`}>{item.title}</p><p className="mt-1 text-xs text-white/45">{item.category} · {item.due === todayKey() ? 'Сегодня' : new Date(`${item.due}T12:00:00`).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}</p></div>{item.priority !== 'normal' && <Flag size={16} className={item.priority === 'high' ? 'text-red-400' : 'text-sky-400'} fill="currentColor" />}<button aria-label={`Удалить ${item.title}`} onClick={() => setItems((current) => current.filter((entry) => entry.id !== item.id))} className="grid h-9 w-9 place-items-center rounded-full text-red-300"><Trash2 size={16} /></button></div>)}</div>
    </div>
    {editorOpen && <div className="absolute inset-0 z-20 flex items-end bg-black/55 p-3 backdrop-blur-sm"><div className="w-full rounded-[32px] bg-zinc-900 p-5"><div className="mb-5 flex items-center justify-between"><h2 className="text-xl font-semibold">Новое напоминание</h2><button aria-label="Закрыть" onClick={() => setEditorOpen(false)}><X /></button></div><input autoFocus value={title} onChange={(event) => setTitle(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && add()} placeholder="Что нужно сделать?" className="h-12 w-full rounded-2xl bg-white/10 px-4 outline-none" /><div className="mt-3 grid grid-cols-2 gap-3"><label className="text-xs text-white/45">Дата<input type="date" value={due} onChange={(event) => setDue(event.target.value)} className="mt-2 h-12 w-full rounded-2xl bg-white/10 px-3" /></label><label className="text-xs text-white/45">Категория<input value={category} onChange={(event) => setCategory(event.target.value)} className="mt-2 h-12 w-full rounded-2xl bg-white/10 px-3 outline-none" /></label></div><p className="mb-2 mt-4 text-xs text-white/45">Приоритет</p><div className="grid grid-cols-3 gap-2">{([['low','Низкий'],['normal','Обычный'],['high','Высокий']] as const).map(([id, label]) => <button key={id} onClick={() => setPriority(id)} className={`rounded-2xl py-3 text-sm ${priority === id ? 'bg-[var(--accent)] text-black' : 'bg-white/8'}`}>{label}</button>)}</div><button onClick={add} disabled={!title.trim()} className="mt-5 h-12 w-full rounded-full bg-[var(--accent)] font-semibold text-black disabled:opacity-35">Добавить</button></div></div>}
  </AppShell>;
}
