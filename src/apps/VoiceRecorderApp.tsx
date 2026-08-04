import { Mic, Pause, Play, Square, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { AppShell } from '../components/AppShell';
import { makeId, usePersistentState } from '../utils/usePersistentState';

type Recording = { id: string; name: string; dataUrl: string; duration: number; createdAt: string };
const formatDuration = (seconds: number) => `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;

export function VoiceRecorderApp() {
  const [recordings, setRecordings] = usePersistentState<Recording[]>('oneui-voice-recordings', []);
  const [recording, setRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState('');
  const [paused, setPaused] = useState(false);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const elapsedRef = useRef(0);

  useEffect(() => {
    if (!recording || paused) return;
    const timer = window.setInterval(() => { elapsedRef.current += 1; setElapsed(elapsedRef.current); }, 1000);
    return () => window.clearInterval(timer);
  }, [paused, recording]);

  useEffect(() => () => {
    if (recorderRef.current && recorderRef.current.state !== 'inactive') recorderRef.current.stop();
    streamRef.current?.getTracks().forEach((track) => track.stop());
  }, []);

  const start = async () => {
    setError('');
    try {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error('Запись звука не поддерживается этим браузером');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const recorder = new MediaRecorder(stream);
      recorderRef.current = recorder;
      chunksRef.current = [];
      elapsedRef.current = 0;
      setElapsed(0); setPaused(false);
      recorder.ondataavailable = (event) => event.data.size > 0 && chunksRef.current.push(event.data);
      recorder.onstop = () => {
        const duration = Math.max(1, elapsedRef.current);
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        const reader = new FileReader();
        reader.onloadend = () => {
          const dataUrl = String(reader.result ?? '');
          if (dataUrl) setRecordings((current) => [{ id: makeId('recording'), name: `Запись ${current.length + 1}`, dataUrl, duration, createdAt: new Date().toLocaleString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) }, ...current].slice(0, 10));
        };
        reader.readAsDataURL(blob);
        stream.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      };
      recorder.start(250); setRecording(true);
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Не удалось получить доступ к микрофону'); }
  };
  const stop = () => { if (recorderRef.current && recorderRef.current.state !== 'inactive') recorderRef.current.stop(); setRecording(false); setPaused(false); };
  const togglePause = () => {
    const recorder = recorderRef.current;
    if (!recorder) return;
    if (recorder.state === 'recording') { recorder.pause(); setPaused(true); }
    else if (recorder.state === 'paused') { recorder.resume(); setPaused(false); }
  };

  return <AppShell title="Диктофон"><div className="px-4 pb-8">
    <section className="flex min-h-72 flex-col items-center justify-center rounded-[36px] bg-gradient-to-b from-red-500/18 to-white/4 p-6 text-center"><div className={`grid h-24 w-24 place-items-center rounded-full ${recording ? 'animate-pulse bg-red-500 text-white shadow-[0_0_45px_rgba(239,68,68,.45)]' : 'bg-white/8 text-red-300'}`}><Mic size={42} /></div><p className="mt-6 text-5xl font-light tabular-nums">{formatDuration(elapsed)}</p><p className="mt-2 text-sm text-white/45">{recording ? paused ? 'Запись приостановлена' : 'Идёт запись с микрофона' : 'Готов к записи'}</p>{error && <p className="mt-3 rounded-2xl bg-red-500/10 px-4 py-2 text-sm text-red-300">{error}</p>}<div className="mt-6 flex items-center gap-4">{!recording ? <button onClick={start} className="flex h-14 items-center gap-2 rounded-full bg-red-500 px-7 font-semibold text-white"><Mic size={20} />Записать</button> : <><button aria-label={paused ? 'Продолжить запись' : 'Пауза'} onClick={togglePause} className="grid h-14 w-14 place-items-center rounded-full bg-white/10">{paused ? <Play fill="currentColor" /> : <Pause fill="currentColor" />}</button><button aria-label="Завершить запись" onClick={stop} className="grid h-16 w-16 place-items-center rounded-full bg-red-500 text-white"><Square size={23} fill="currentColor" /></button></>}</div></section>
    <div className="mb-3 mt-5 flex items-center justify-between"><h2 className="text-lg font-semibold">Записи</h2><span className="text-xs text-white/40">{recordings.length}/10</span></div><div className="space-y-3">{recordings.length === 0 && <div className="rounded-[28px] border border-dashed border-white/15 p-7 text-center text-sm text-white/45">После записи здесь появится аудиофайл с полноценным проигрывателем.</div>}{recordings.map((item) => <div key={item.id} className="rounded-[25px] bg-white/6 p-4"><div className="flex items-center gap-3"><div className="grid h-11 w-11 place-items-center rounded-full bg-red-500/15 text-red-300"><Mic size={20} /></div><div className="min-w-0 flex-1"><input aria-label="Название записи" value={item.name} onChange={(event) => setRecordings((current) => current.map((entry) => entry.id === item.id ? { ...entry, name: event.target.value } : entry))} className="w-full bg-transparent font-semibold outline-none" /><p className="text-xs text-white/40">{item.createdAt} · {formatDuration(item.duration)}</p></div><button aria-label={`Удалить ${item.name}`} onClick={() => setRecordings((current) => current.filter((entry) => entry.id !== item.id))} className="grid h-9 w-9 place-items-center rounded-full text-red-300"><Trash2 size={17} /></button></div><audio controls preload="metadata" src={item.dataUrl} className="mt-3 h-10 w-full" /></div>)}</div>
  </div></AppShell>;
}
