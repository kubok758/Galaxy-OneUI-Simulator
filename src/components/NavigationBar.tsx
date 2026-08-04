import { ChevronLeft, Circle, Menu } from 'lucide-react';
import { usePhoneStore } from '../state/usePhoneStore';
import { capturePhoneSnapshot } from '../utils/captureSnapshot';

export function NavigationBar() {
  const goBack = usePhoneStore((s) => s.goBack);
  const goHome = usePhoneStore((s) => s.goHome);
  const setRecents = usePhoneStore((s) => s.setRecents);
  const recentsOpen = usePhoneStore((s) => s.recentsOpen);
  const currentApp = usePhoneStore((s) => s.currentApp);
  return (
    <nav aria-label="Системная навигация" className="absolute inset-x-0 bottom-0 z-50 flex h-12 items-center justify-around bg-black/20 px-12 text-white backdrop-blur-xl">
      <button aria-label="Недавние приложения" className="oneui-button grid h-10 w-16 place-items-center rounded-full" onClick={() => { capturePhoneSnapshot(currentApp); setRecents(!recentsOpen); }}><Menu size={19} /></button>
      <button aria-label="Домой" className="oneui-button grid h-10 w-16 place-items-center rounded-full" onClick={goHome}><Circle size={19} /></button>
      <button aria-label="Назад" className="oneui-button grid h-10 w-16 place-items-center rounded-full" onClick={goBack}><ChevronLeft size={22} /></button>
    </nav>
  );
}
