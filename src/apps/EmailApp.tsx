import { Archive, ChevronLeft, Mail, Menu, Paperclip, Plus, Search, Send, Star, Trash2, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { AppShell } from '../components/AppShell';
import { makeId, usePersistentState } from '../utils/usePersistentState';

type MailFolder = 'inbox' | 'sent' | 'drafts' | 'archive';
type MailItem = { id: string; folder: MailFolder; from: string; to: string; subject: string; body: string; time: string; read: boolean; starred: boolean };
const initialMail: MailItem[] = [
  { id: 'mail-1', folder: 'inbox', from: 'Samsung Account', to: 'artem@example.com', subject: 'Вход выполнен на новом устройстве', body: 'Мы заметили вход в Samsung Account на Galaxy. Если это были вы, никаких действий не требуется.', time: '11:42', read: false, starred: true },
  { id: 'mail-2', folder: 'inbox', from: 'Мария Соколова', to: 'artem@example.com', subject: 'Фотографии с поездки', body: 'Привет! Я отправила подборку фотографий. Посмотри, какие лучше оставить в альбоме.', time: '10:18', read: false, starred: false },
  { id: 'mail-3', folder: 'inbox', from: 'Google Calendar', to: 'artem@example.com', subject: 'Напоминание о встрече', body: 'Сегодня в 18:30 запланирована встреча с Алексеем.', time: 'Вчера', read: true, starred: false },
  { id: 'mail-4', folder: 'sent', from: 'artem@example.com', to: 'support@example.com', subject: 'Вопрос по заказу', body: 'Здравствуйте! Подскажите, пожалуйста, текущий статус заказа.', time: 'Пн', read: true, starred: false },
];
const folderNames: Record<MailFolder, string> = { inbox: 'Входящие', sent: 'Отправленные', drafts: 'Черновики', archive: 'Архив' };

export function EmailApp() {
  const [mails, setMails] = usePersistentState<MailItem[]>('oneui-email-messages', initialMail);
  const [folder, setFolder] = useState<MailFolder>('inbox');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [composeOpen, setComposeOpen] = useState(false);
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const selected = mails.find((mail) => mail.id === selectedId) ?? null;
  const visible = useMemo(() => mails.filter((mail) => mail.folder === folder && `${mail.from} ${mail.to} ${mail.subject} ${mail.body}`.toLowerCase().includes(query.toLowerCase())), [folder, mails, query]);

  const openMail = (id: string) => { setSelectedId(id); setMails((current) => current.map((mail) => mail.id === id ? { ...mail, read: true } : mail)); };
  const saveDraft = () => {
    if (!to.trim() && !subject.trim() && !body.trim()) return;
    setMails((current) => [{ id: makeId('mail'), folder: 'drafts', from: 'artem@example.com', to: to.trim(), subject: subject.trim() || 'Без темы', body: body.trim(), time: 'Сейчас', read: true, starred: false }, ...current]);
  };
  const closeCompose = () => { saveDraft(); setComposeOpen(false); setTo(''); setSubject(''); setBody(''); };
  const sendMail = () => {
    if (!to.trim() || !body.trim()) return;
    setMails((current) => [{ id: makeId('mail'), folder: 'sent', from: 'artem@example.com', to: to.trim(), subject: subject.trim() || 'Без темы', body: body.trim(), time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }), read: true, starred: false }, ...current]);
    setComposeOpen(false); setTo(''); setSubject(''); setBody(''); setFolder('sent');
  };

  return <AppShell title="Email" actions={<button aria-label="Написать письмо" onClick={() => setComposeOpen(true)} className="grid h-10 w-10 place-items-center rounded-full bg-[var(--accent)] text-black"><Plus /></button>}>
    <div className="px-4 pb-8">
      <div className="mb-4 flex items-center gap-2"><button aria-label="Папки" onClick={() => setMenuOpen((value) => !value)} className="grid h-11 w-11 place-items-center rounded-full bg-white/8"><Menu size={20} /></button><div className="flex h-11 flex-1 items-center gap-2 rounded-full bg-white/8 px-4"><Search size={17} className="text-white/45" /><input aria-label="Поиск писем" value={query} onChange={(event) => setQuery(event.target.value)} className="min-w-0 flex-1 bg-transparent outline-none" placeholder="Поиск в почте" /></div></div>
      {menuOpen && <div className="mb-4 grid grid-cols-2 gap-2 rounded-[28px] bg-white/6 p-3">{(Object.keys(folderNames) as MailFolder[]).map((item) => <button key={item} onClick={() => { setFolder(item); setMenuOpen(false); setSelectedId(null); }} className={`rounded-2xl px-3 py-3 text-left text-sm ${folder === item ? 'bg-[var(--accent)] text-black' : 'bg-white/5'}`}>{folderNames[item]} <span className="float-right opacity-60">{mails.filter((mail) => mail.folder === item).length}</span></button>)}</div>}
      {!selected && <><div className="mb-3 flex items-center justify-between"><h2 className="text-lg font-semibold">{folderNames[folder]}</h2><span className="text-xs text-white/40">{visible.length} писем</span></div><div className="space-y-2">{visible.length === 0 && <div className="rounded-[28px] bg-white/5 p-8 text-center text-white/45"><Mail className="mx-auto mb-3" /><p>В этой папке пока пусто</p></div>}{visible.map((mail) => <button key={mail.id} onClick={() => openMail(mail.id)} className={`block w-full rounded-[24px] p-4 text-left ${mail.read ? 'bg-white/5' : 'bg-[var(--accent)]/12 ring-1 ring-[var(--accent)]/20'}`}><div className="flex items-center gap-2"><span className={`min-w-0 flex-1 truncate ${mail.read ? '' : 'font-bold'}`}>{folder === 'sent' ? mail.to : mail.from}</span>{mail.starred && <Star size={15} fill="currentColor" className="text-amber-300" />}<span className="text-xs text-white/40">{mail.time}</span></div><p className={`mt-1 truncate text-sm ${mail.read ? 'text-white/70' : 'font-semibold'}`}>{mail.subject}</p><p className="mt-1 truncate text-xs text-white/40">{mail.body}</p></button>)}</div></>}
      {selected && <div><button onClick={() => setSelectedId(null)} className="mb-4 flex items-center gap-2 text-sm text-[var(--accent)]"><ChevronLeft size={18} />Назад к письмам</button><div className="rounded-[30px] bg-white/6 p-5"><div className="flex items-start gap-3"><div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[var(--accent)]/20 text-[var(--accent)]"><Mail /></div><div className="min-w-0 flex-1"><h2 className="text-xl font-semibold">{selected.subject}</h2><p className="mt-1 truncate text-sm text-white/55">От: {selected.from}</p><p className="truncate text-xs text-white/35">Кому: {selected.to}</p></div></div><p className="mt-6 whitespace-pre-wrap leading-7 text-white/85">{selected.body}</p><div className="mt-6 flex gap-2"><button onClick={() => setMails((current) => current.map((mail) => mail.id === selected.id ? { ...mail, starred: !mail.starred } : mail))} className="flex flex-1 items-center justify-center gap-2 rounded-full bg-white/8 py-3 text-sm"><Star size={17} fill={selected.starred ? 'currentColor' : 'none'} />{selected.starred ? 'В избранном' : 'В избранное'}</button><button onClick={() => { setMails((current) => current.map((mail) => mail.id === selected.id ? { ...mail, folder: 'archive' } : mail)); setSelectedId(null); }} className="grid h-12 w-12 place-items-center rounded-full bg-white/8"><Archive size={18} /></button><button onClick={() => { setMails((current) => current.filter((mail) => mail.id !== selected.id)); setSelectedId(null); }} className="grid h-12 w-12 place-items-center rounded-full bg-red-500/10 text-red-300"><Trash2 size={18} /></button></div></div></div>}
    </div>
    {composeOpen && <div className="absolute inset-0 z-30 flex flex-col bg-zinc-950 pt-10"><header className="flex h-14 items-center gap-3 px-4"><button aria-label="Закрыть письмо" onClick={closeCompose}><X /></button><h2 className="flex-1 text-xl font-semibold">Новое письмо</h2><button aria-label="Отправить" onClick={sendMail} disabled={!to.trim() || !body.trim()} className="grid h-10 w-10 place-items-center rounded-full bg-[var(--accent)] text-black disabled:opacity-35"><Send size={18} /></button></header><div className="flex-1 overflow-y-auto px-4 pb-8"><label className="flex items-center border-b border-white/10 py-3 text-sm text-white/45">Кому<input autoFocus value={to} onChange={(event) => setTo(event.target.value)} type="email" className="ml-3 min-w-0 flex-1 bg-transparent text-white outline-none" placeholder="email@example.com" /></label><label className="flex items-center border-b border-white/10 py-3 text-sm text-white/45">Тема<input value={subject} onChange={(event) => setSubject(event.target.value)} className="ml-3 min-w-0 flex-1 bg-transparent text-white outline-none" placeholder="Без темы" /></label><textarea value={body} onChange={(event) => setBody(event.target.value)} className="mt-4 h-64 w-full resize-none bg-transparent leading-7 outline-none" placeholder="Текст письма" /><button className="mt-3 flex items-center gap-2 rounded-full bg-white/8 px-4 py-3 text-sm text-white/65"><Paperclip size={17} />Прикрепить файл</button><p className="mt-3 text-xs text-white/35">При закрытии незавершённое письмо автоматически сохраняется в черновики.</p></div></div>}
  </AppShell>;
}
