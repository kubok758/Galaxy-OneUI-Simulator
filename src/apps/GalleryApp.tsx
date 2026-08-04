import { AnimatePresence, motion, PanInfo } from 'framer-motion';
import { Camera, Trash2, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { AppShell } from '../components/AppShell';
import { usePhoneStore } from '../state/usePhoneStore';

export function GalleryApp() {
  const photos = usePhoneStore((s) => s.photos);
  const deletePhoto = usePhoneStore((s) => s.deletePhoto);
  const openApp = usePhoneStore((s) => s.openApp);
  const [selected, setSelected] = useState<string | null>(null);
  const [confirm, setConfirm] = useState(false);
  const [scale, setScale] = useState(1);
  const pinchRef = useRef<{ distance: number; scale: number } | null>(null);
  const photo = photos.find((p) => p.id === selected);
  const closeGesture = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => { if (Math.abs(info.offset.y) > 100) setSelected(null); };
  return <AppShell title="Галерея" actions={<button aria-label="Открыть камеру" onClick={() => openApp('camera')}><Camera/></button>}>
    <div className="grid grid-cols-3 gap-1 px-1">{photos.map((p) => <button key={p.id} aria-label={`Открыть ${p.name}`} onClick={() => { setScale(1); setSelected(p.id); }} className="aspect-square overflow-hidden bg-[var(--surface)]">{p.kind === 'video' ? <video src={p.dataUrl} muted preload="metadata" className="h-full w-full object-cover"/> : <img src={p.dataUrl} alt={p.name} className="h-full w-full object-cover"/>}</button>)}</div>{!photos.length && <div className="grid h-96 place-items-center text-center opacity-55"><div><Camera className="mx-auto mb-4" size={50}/><p>Здесь появятся снимки из камеры</p><button onClick={() => openApp('camera')} className="mt-4 rounded-full bg-[var(--accent)] px-4 py-2 text-zinc-950">Открыть камеру</button></div></div>}
    <AnimatePresence>{photo && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onPanEnd={closeGesture} className="absolute inset-0 z-30 flex items-center justify-center bg-black">{photo.kind === 'video' ? <motion.video drag dragConstraints={{ left: -80, right: 80, top: -80, bottom: 80 }} src={photo.dataUrl} controls autoPlay className="max-h-full max-w-full object-contain"/> : <motion.img drag dragConstraints={{ left: -180, right: 180, top: -180, bottom: 180 }} animate={{ scale }} onDoubleClick={() => setScale((value) => value > 1 ? 1 : 2)} onWheel={(event) => setScale((value) => Math.max(1, Math.min(4, value + (event.deltaY < 0 ? .2 : -.2))))} onTouchStart={(event) => { if (event.touches.length === 2) { const [a,b] = [event.touches[0], event.touches[1]]; pinchRef.current = { distance: Math.hypot(a.clientX-b.clientX, a.clientY-b.clientY), scale }; } }} onTouchMove={(event) => { if (event.touches.length === 2 && pinchRef.current) { const [a,b] = [event.touches[0], event.touches[1]]; const distance = Math.hypot(a.clientX-b.clientX, a.clientY-b.clientY); setScale(Math.max(1, Math.min(4, pinchRef.current.scale * distance / pinchRef.current.distance))); } }} onTouchEnd={() => { pinchRef.current = null; }} src={photo.dataUrl} alt={photo.name} className="max-h-full max-w-full touch-none object-contain"/>}<button aria-label="Закрыть просмотр" onClick={() => setSelected(null)} className="absolute left-4 top-12 grid h-10 w-10 place-items-center rounded-full bg-black/45"><X/></button><button aria-label="Удалить фото" onClick={() => setConfirm(true)} className="absolute bottom-16 right-5 grid h-12 w-12 place-items-center rounded-full bg-black/45"><Trash2/></button>{confirm && <div className="absolute bottom-28 left-5 right-5 rounded-[28px] bg-zinc-900 p-5"><p>Удалить фотографию без возможности восстановления?</p><div className="mt-4 flex justify-end gap-3"><button onClick={() => setConfirm(false)} className="px-4 py-2">Отмена</button><button onClick={() => { deletePhoto(photo.id); setConfirm(false); setSelected(null); }} className="rounded-full bg-red-500 px-4 py-2">Удалить</button></div></div>}</motion.div>}</AnimatePresence>
  </AppShell>;
}
