import { RotateCcw, Smartphone } from 'lucide-react';
import { PhoneFrame } from './components/PhoneFrame';
import { PwaInstallPrompt } from './components/PwaInstallPrompt';
import { usePhoneStore } from './state/usePhoneStore';

export default function App() {
  const setLocked = usePhoneStore((s) => s.setLocked);
  const locked = usePhoneStore((s) => s.locked);

  return (
    <main className="h-[100dvh] w-full overflow-hidden text-white lg:h-auto lg:min-h-screen lg:px-6 lg:py-8">
      <PwaInstallPrompt />
      <div className="mx-auto flex h-full w-full items-center justify-center lg:grid lg:min-h-[calc(100vh-4rem)] lg:max-w-6xl lg:grid-cols-[1fr_440px_1fr] lg:gap-8">
        <section className="hidden lg:block">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-[20px] bg-blue-400/15 text-blue-300">
            <Smartphone />
          </div>
          <h1 className="text-4xl font-light leading-tight">
            Samsung Galaxy<br />
            <strong className="font-semibold">One UI 8.5</strong>
          </h1>
          <p className="mt-4 max-w-sm text-sm leading-6 text-white/55">
            Полностью локальный интерактивный симулятор. Данные приложений сохраняются в браузере, камера работает через системное разрешение.
          </p>
        </section>

        <PhoneFrame />

        <section className="hidden lg:block">
          <div className="rounded-[30px] border border-white/8 bg-white/[.04] p-5 backdrop-blur-xl">
            <p className="text-sm font-semibold">Управление</p>
            <p className="mt-3 text-sm leading-6 text-white/55">
              Свайп вниз открывает уведомления, свайп вверх — меню приложений. Escape работает как кнопка «Назад». PIN по умолчанию: <strong className="text-white">2580</strong>.
            </p>
            <button onClick={() => setLocked(!locked)} className="mt-5 w-full rounded-full bg-white/10 py-3 text-sm">
              {locked ? 'Разблокировать без PIN' : 'Заблокировать экран'}
            </button>
            <button
              onClick={() => {
                localStorage.removeItem('galaxy-oneui-85-state');
                location.reload();
              }}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-white/5 py-3 text-sm text-white/60"
            >
              <RotateCcw size={16} />
              Сбросить симулятор
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
