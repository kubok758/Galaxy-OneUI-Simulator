import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import { usePhoneStore } from '../state/usePhoneStore';

export function Toast() {
  const toast = usePhoneStore((s) => s.toast);
  const clearToast = usePhoneStore((s) => s.clearToast);
  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(clearToast, 2600);
    return () => window.clearTimeout(timer);
  }, [toast, clearToast]);
  return <AnimatePresence>{toast && (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }} className="absolute bottom-16 left-1/2 z-[100] -translate-x-1/2 rounded-full bg-zinc-100 px-4 py-2 text-center text-sm font-medium text-zinc-900 shadow-2xl">
      {toast}
    </motion.div>
  )}</AnimatePresence>;
}
