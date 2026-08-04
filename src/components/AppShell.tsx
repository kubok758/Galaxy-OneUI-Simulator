import { ChevronLeft, MoreVertical } from 'lucide-react';
import type { ReactNode } from 'react';
import { usePhoneStore } from '../state/usePhoneStore';

export function AppShell({ title, children, actions, className = '' }: { title: string; children: ReactNode; actions?: ReactNode; className?: string }) {
  const goBack = usePhoneStore((s) => s.goBack);
  return <section className={`absolute inset-0 overflow-hidden bg-[var(--app-bg)] pt-9 text-[var(--text)] ${className}`} aria-label={title}>
    <header className="flex h-14 items-center gap-3 px-4"><button aria-label="Назад" onClick={goBack} className="oneui-button grid h-10 w-10 place-items-center rounded-full hover:bg-white/8"><ChevronLeft/></button><h1 className="min-w-0 flex-1 truncate text-xl font-semibold">{title}</h1>{actions ?? <MoreVertical className="opacity-40"/>}</header>
    <div className="h-[calc(100%-56px)] overflow-y-auto pb-16">{children}</div>
  </section>;
}
