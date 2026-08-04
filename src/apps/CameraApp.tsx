import { Camera as CameraIcon, FlipHorizontal, Settings2, Video, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { AppShell } from '../components/AppShell';
import { usePhoneStore } from '../state/usePhoneStore';

export function CameraApp() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [facing, setFacing] = useState<'user' | 'environment'>('environment');
  const [mode, setMode] = useState<'photo' | 'video'>('photo');
  const [recording, setRecording] = useState(false);
  const [error, setError] = useState('');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [iso, setIso] = useState(200);
  const [exposure, setExposure] = useState(0);
  const addPhoto = usePhoneStore((s) => s.addPhoto);
  const photos = usePhoneStore((s) => s.photos);
  const openApp = usePhoneStore((s) => s.openApp);
  const start = async () => {
    try { streamRef.current?.getTracks().forEach((t) => t.stop()); const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: facing }, audio: mode === 'video' }); streamRef.current = stream; if (videoRef.current) videoRef.current.srcObject = stream; setError(''); }
    catch { setError('Браузер не предоставил доступ к камере. Разрешите камеру в адресной строке.'); }
  };
  useEffect(() => { void start(); return () => { if (recorderRef.current?.state === 'recording') recorderRef.current.stop(); streamRef.current?.getTracks().forEach((t) => t.stop()); }; }, [facing, mode]);
  const capture = () => {
    const video = videoRef.current; const canvas = canvasRef.current; if (!video || !canvas || !video.videoWidth) return;
    canvas.width = video.videoWidth; canvas.height = video.videoHeight; const ctx = canvas.getContext('2d'); if (!ctx) return;
    ctx.filter = `brightness(${1 + exposure / 4}) contrast(${1 + iso / 1600})`; ctx.drawImage(video, 0, 0); addPhoto({ name: `IMG_${Date.now()}.jpg`, dataUrl: canvas.toDataURL('image/jpeg', .86), kind: 'image' });
  };
  const shutter = () => {
    if (mode === 'photo') { capture(); return; }
    if (!recording) {
      const stream = streamRef.current;
      if (!stream || typeof MediaRecorder === 'undefined') { usePhoneStore.getState().showToast('Запись видео недоступна в этом браузере'); return; }
      try {
        chunksRef.current = [];
        const recorder = new MediaRecorder(stream, { mimeType: MediaRecorder.isTypeSupported('video/webm;codecs=vp9') ? 'video/webm;codecs=vp9' : 'video/webm' });
        recorderRef.current = recorder;
        recorder.ondataavailable = (event) => { if (event.data.size) chunksRef.current.push(event.data); };
        recorder.onstop = () => {
          const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'video/webm' });
          const reader = new FileReader();
          reader.onload = () => {
            const saved = addPhoto({ name: `VID_${Date.now()}.webm`, dataUrl: String(reader.result), kind: 'video' });
            usePhoneStore.getState().showToast(saved ? 'Видео сохранено в Галерею' : 'Недостаточно места для видео');
          };
          reader.readAsDataURL(blob);
        };
        recorder.start(250);
        setRecording(true);
        usePhoneStore.getState().showToast('Запись видео начата');
      } catch { usePhoneStore.getState().showToast('Не удалось начать запись видео'); }
    } else {
      recorderRef.current?.stop();
      setRecording(false);
    }
  };
  return <AppShell title="Камера" actions={<button aria-label="Настройки камеры" onClick={() => setSettingsOpen(!settingsOpen)}><Settings2/></button>} className="bg-black text-white">
    <div className="relative h-full overflow-hidden bg-black"><video ref={videoRef} autoPlay playsInline muted className={`h-full w-full object-cover ${facing === 'user' ? '-scale-x-100' : ''}`}/><canvas ref={canvasRef} className="hidden"/>{error && <div className="absolute inset-0 grid place-items-center p-8 text-center text-sm text-white/70"><div><CameraIcon className="mx-auto mb-4" size={50}/><p>{error}</p><button onClick={() => void start()} className="mt-4 rounded-full bg-white/15 px-4 py-2">Повторить</button></div></div>}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/65 to-transparent px-5 pb-16 pt-16"><div className="mb-5 flex justify-center gap-5 text-sm"><button onClick={() => setMode('photo')} className={mode === 'photo' ? 'text-yellow-300' : 'text-white/65'}>ФОТО</button><button onClick={() => setMode('video')} className={mode === 'video' ? 'text-yellow-300' : 'text-white/65'}>ВИДЕО</button></div><div className="flex items-center justify-between"><button aria-label="Открыть галерею" onClick={() => openApp('gallery')} className="h-12 w-12 overflow-hidden rounded-2xl bg-white/15">{photos[0] ? (photos[0].kind === 'video' ? <video src={photos[0].dataUrl} muted className="h-full w-full object-cover"/> : <img src={photos[0].dataUrl} alt="Последний снимок" className="h-full w-full object-cover"/>) : <CameraIcon className="m-auto"/>}</button><button aria-label={mode === 'photo' ? 'Сделать снимок' : recording ? 'Остановить запись' : 'Начать запись'} onClick={shutter} className={`grid h-20 w-20 place-items-center rounded-full border-4 border-white ${recording ? 'bg-red-500' : 'bg-white/20'}`}>{mode === 'video' ? <Video/> : <span className="h-16 w-16 rounded-full bg-white"/>}</button><button aria-label="Переключить камеру" onClick={() => setFacing((f) => f === 'user' ? 'environment' : 'user')} className="grid h-12 w-12 place-items-center rounded-full bg-white/15"><FlipHorizontal/></button></div></div>
      {settingsOpen && <div className="absolute left-4 right-4 top-4 rounded-[28px] bg-black/75 p-4 backdrop-blur-xl"><div className="flex justify-between"><strong>Ручные настройки</strong><button onClick={() => setSettingsOpen(false)}><X/></button></div><label className="mt-4 block text-sm">ISO: {iso}<input className="range mt-2 w-full" type="range" min="50" max="1600" step="50" value={iso} onChange={(e) => setIso(Number(e.target.value))}/></label><label className="mt-4 block text-sm">Экспозиция: {exposure}<input className="range mt-2 w-full" type="range" min="-2" max="2" step=".1" value={exposure} onChange={(e) => setExposure(Number(e.target.value))}/></label></div>}
    </div>
  </AppShell>;
}
