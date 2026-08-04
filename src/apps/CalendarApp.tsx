import { CalendarDays, ChevronLeft, ChevronRight, Plus, Trash2, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { AppShell } from '../components/AppShell';
import { makeId, usePersistentState } from '../utils/usePersistentState';

type CalendarEvent = {
  id: string;
  title: string;
  date: string;
  time: string;
  color: string;
};

const initialEvents: CalendarEvent[] = [
  { id: 'event-1', title: 'Встреча с Алексеем', date: new Date().toISOString().slice(0, 10), time: '18:30', color: '#7aa7ff' },
  { id: 'event-2', title: 'Оплатить интернет', date: new Date(Date.now() + 86400000).toISOString().slice(0, 10), time: '12:00', color: '#ffb55f' },
];

const toKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export function CalendarApp() {
  const [events, setEvents] = usePersistentState<CalendarEvent[]>('oneui-calendar-events', initialEvents);
  const [month, setMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState(() => toKey(new Date()));
  const [editorOpen, setEditorOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('12:00');

  const days = useMemo(() => {
    const start = new Date(month.getFullYear(), month.getMonth(), 1);
    const offset = (start.getDay() + 6) % 7;
    const result: Date[] = [];
    for (let index = -offset; index < 42 - offset; index += 1) {
      result.push(new Date(month.getFullYear(), month.getMonth(), index + 1));
    }
    return result;
  }, [month]);

  const selectedEvents = events
    .filter((event) => event.date === selectedDate)
    .sort((a, b) => a.time.localeCompare(b.time));

  const addEvent = () => {
    const clean = title.trim();
    if (!clean) return;
    setEvents((current) => [
      ...current,
      { id: makeId('event'), title: clean, date: selectedDate, time, color: ['#7aa7ff', '#ff7d9c', '#63d6b1', '#d69cff'][current.length % 4] },
    ]);
    setTitle('');
    setEditorOpen(false);
  };

  return (
    <AppShell
      title="Календарь"
      actions={<button aria-label="Добавить событие" onClick={() => setEditorOpen(true)} className="grid h-10 w-10 place-items-center rounded-full bg-[var(--accent)] text-black"><Plus size={20} /></button>}
    >
      <div className="px-4 pb-8">
        <div className="mb-4 flex items-center justify-between rounded-[28px] bg-white/5 px-3 py-2">
          <button aria-label="Предыдущий месяц" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))} className="grid h-10 w-10 place-items-center rounded-full hover:bg-white/10"><ChevronLeft /></button>
          <div className="text-center">
            <p className="text-lg font-semibold capitalize">{month.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })}</p>
            <button onClick={() => { const today = new Date(); setMonth(new Date(today.getFullYear(), today.getMonth(), 1)); setSelectedDate(toKey(today)); }} className="text-xs text-[var(--accent)]">Сегодня</button>
          </div>
          <button aria-label="Следующий месяц" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))} className="grid h-10 w-10 place-items-center rounded-full hover:bg-white/10"><ChevronRight /></button>
        </div>

        <div className="grid grid-cols-7 text-center text-[11px] text-white/45">{['Пн','Вт','Ср','Чт','Пт','Сб','Вс'].map((day) => <span key={day} className="py-2">{day}</span>)}</div>
        <div className="grid grid-cols-7 gap-1">
          {days.map((date) => {
            const key = toKey(date);
            const currentMonth = date.getMonth() === month.getMonth();
            const active = key === selectedDate;
            const hasEvents = events.some((event) => event.date === key);
            return (
              <button key={key} aria-label={date.toLocaleDateString('ru-RU')} onClick={() => setSelectedDate(key)} className={`relative aspect-square rounded-2xl text-sm transition ${active ? 'bg-[var(--accent)] font-semibold text-black' : currentMonth ? 'bg-white/5' : 'text-white/25'}`}>
                {date.getDate()}
                {hasEvents && <span className={`absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full ${active ? 'bg-black' : 'bg-[var(--accent)]'}`} />}
              </button>
            );
          })}
        </div>

        <div className="mt-5 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-white/45">Выбранная дата</p>
            <h2 className="mt-1 text-lg font-semibold">{new Date(`${selectedDate}T12:00:00`).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', weekday: 'long' })}</h2>
          </div>
          <CalendarDays className="text-[var(--accent)]" />
        </div>

        <div className="mt-3 space-y-2">
          {selectedEvents.length === 0 && <button onClick={() => setEditorOpen(true)} className="w-full rounded-[24px] border border-dashed border-white/15 p-5 text-sm text-white/50">На этот день событий нет — нажмите, чтобы добавить</button>}
          {selectedEvents.map((event) => (
            <div key={event.id} className="flex items-center gap-3 rounded-[24px] bg-white/6 p-4">
              <span className="h-10 w-1 rounded-full" style={{ background: event.color }} />
              <div className="min-w-0 flex-1"><p className="truncate font-semibold">{event.title}</p><p className="text-sm text-white/50">{event.time}</p></div>
              <button aria-label={`Удалить ${event.title}`} onClick={() => setEvents((current) => current.filter((item) => item.id !== event.id))} className="grid h-9 w-9 place-items-center rounded-full text-red-300 hover:bg-red-500/10"><Trash2 size={17} /></button>
            </div>
          ))}
        </div>
      </div>

      {editorOpen && (
        <div className="absolute inset-0 z-20 flex items-end bg-black/55 p-3 backdrop-blur-sm">
          <div className="w-full rounded-[32px] bg-zinc-900 p-5 shadow-2xl">
            <div className="mb-5 flex items-center justify-between"><h2 className="text-xl font-semibold">Новое событие</h2><button aria-label="Закрыть" onClick={() => setEditorOpen(false)}><X /></button></div>
            <label className="block text-xs text-white/50">Название<input autoFocus value={title} onChange={(event) => setTitle(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && addEvent()} className="mt-2 h-12 w-full rounded-2xl bg-white/10 px-4 outline-none" /></label>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <label className="text-xs text-white/50">Дата<input type="date" value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)} className="mt-2 h-12 w-full rounded-2xl bg-white/10 px-3" /></label>
              <label className="text-xs text-white/50">Время<input type="time" value={time} onChange={(event) => setTime(event.target.value)} className="mt-2 h-12 w-full rounded-2xl bg-white/10 px-3" /></label>
            </div>
            <button onClick={addEvent} disabled={!title.trim()} className="mt-5 h-12 w-full rounded-full bg-[var(--accent)] font-semibold text-black disabled:opacity-40">Сохранить</button>
          </div>
        </div>
      )}
    </AppShell>
  );
}
