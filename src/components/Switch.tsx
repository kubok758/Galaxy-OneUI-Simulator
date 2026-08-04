import { motion } from 'framer-motion';

export function Switch({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return (
    <button role="switch" aria-checked={checked} aria-label={label} onClick={onChange} className={`relative h-7 w-12 rounded-full p-1 transition ${checked ? 'bg-[var(--accent)]' : 'bg-white/20'}`}>
      <motion.span layout className={`block h-5 w-5 rounded-full ${checked ? 'ml-5 bg-zinc-900' : 'ml-0 bg-white'}`} />
    </button>
  );
}
