import { Download, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
  prompt(): Promise<void>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

function isStandaloneMode() {
  const navigatorWithStandalone = navigator as Navigator & { standalone?: boolean };
  return window.matchMedia('(display-mode: standalone)').matches || navigatorWithStandalone.standalone === true;
}

export function PwaInstallPrompt() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [hidden, setHidden] = useState(() => sessionStorage.getItem('pwa-install-hidden') === '1');
  const [standalone, setStandalone] = useState(isStandaloneMode);

  useEffect(() => {
    const onInstallPrompt = (event: BeforeInstallPromptEvent) => {
      event.preventDefault();
      setInstallEvent(event);
    };
    const onInstalled = () => {
      setStandalone(true);
      setInstallEvent(null);
    };
    const media = window.matchMedia('(display-mode: standalone)');
    const onDisplayModeChange = () => setStandalone(isStandaloneMode());

    window.addEventListener('beforeinstallprompt', onInstallPrompt);
    window.addEventListener('appinstalled', onInstalled);
    media.addEventListener?.('change', onDisplayModeChange);

    return () => {
      window.removeEventListener('beforeinstallprompt', onInstallPrompt);
      window.removeEventListener('appinstalled', onInstalled);
      media.removeEventListener?.('change', onDisplayModeChange);
    };
  }, []);

  if (standalone || hidden || !installEvent) return null;

  const install = async () => {
    await installEvent.prompt();
    const choice = await installEvent.userChoice;
    if (choice.outcome === 'accepted') {
      setStandalone(true);
    }
    setInstallEvent(null);
  };

  const dismiss = () => {
    sessionStorage.setItem('pwa-install-hidden', '1');
    setHidden(true);
  };

  return (
    <div className="fixed inset-x-3 top-[calc(env(safe-area-inset-top)+12px)] z-[250] mx-auto flex max-w-sm items-center gap-3 rounded-[24px] border border-white/10 bg-zinc-950/90 p-3 shadow-2xl backdrop-blur-2xl lg:hidden">
      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-[16px] bg-blue-500 text-white">
        <Download size={21} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-white">Установить Galaxy One UI</p>
        <p className="truncate text-xs text-white/55">Запуск без адресной строки браузера</p>
      </div>
      <button aria-label="Установить приложение" onClick={install} className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-black">
        Установить
      </button>
      <button aria-label="Закрыть предложение установки" onClick={dismiss} className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-white/55">
        <X size={17} />
      </button>
    </div>
  );
}
