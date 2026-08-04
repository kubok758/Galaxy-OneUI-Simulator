import type { LucideIcon } from 'lucide-react';

export function QuickToggle({ icon: Icon, label, active, onClick }: { icon: LucideIcon; label: string; active: boolean; onClick: () => void }) {
  return <button aria-label={`${label}: ${active ? 'включено' : 'выключено'}`} aria-pressed={active} onClick={onClick} className="oneui-button flex flex-col items-center gap-2 text-center text-[11px]">
    <span className={`grid h-12 w-12 place-items-center rounded-full ${active ? 'bg-[var(--accent)] text-zinc-950' : 'bg-white/10 text-white'}`}><Icon size={21}/></span>
    <span>{label}</span>
  </button>;
}
