import { useEffect } from 'react';
import { usePhoneStore } from '../state/usePhoneStore';
import { StatusBar } from './StatusBar';
import { NavigationBar } from './NavigationBar';
import { Toast } from './Toast';
import { HomeScreen } from '../screens/HomeScreen';
import { AppScreen } from '../screens/AppScreen';
import { NotificationPanel } from '../screens/NotificationPanel';
import { RecentsScreen } from '../screens/RecentsScreen';
import { LockScreen } from '../screens/LockScreen';

export function PhoneFrame() {
  const settings = usePhoneStore((s) => s.settings);
  const locked = usePhoneStore((s) => s.locked);
  const currentApp = usePhoneStore((s) => s.currentApp);
  const setShade = usePhoneStore((s) => s.setShade);
  const goBack = usePhoneStore((s) => s.goBack);
  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      if (event.key === 'Escape') goBack();
      if (event.key === 'Home') usePhoneStore.getState().goHome();
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, [goBack]);
  const dark = settings.theme === 'dark';
  const variables = {
    '--accent': settings.accent,
    '--surface': dark ? '#202126' : '#e7e8ed',
    '--app-bg': dark ? '#101116' : '#f6f7fb',
    '--text': dark ? '#f7f7fa' : '#18191d',
    fontSize: `${settings.fontScale}rem`,
  } as React.CSSProperties;
  return <div className="relative mx-auto w-full max-w-[440px] select-none" style={variables}>
    <div className="absolute -left-[7px] top-40 h-24 w-2 rounded-l-md bg-gradient-to-l from-zinc-500 to-zinc-800"/><div className="absolute -right-[7px] top-36 h-20 w-2 rounded-r-md bg-gradient-to-r from-zinc-500 to-zinc-800"/><div className="absolute -right-[7px] top-60 h-32 w-2 rounded-r-md bg-gradient-to-r from-zinc-500 to-zinc-800"/>
    <div className="relative aspect-[1080/2340] w-full rounded-[54px] bg-gradient-to-br from-zinc-500 via-zinc-900 to-zinc-600 p-[7px] shadow-[0_40px_120px_rgba(0,0,0,.7)] ring-1 ring-white/20">
      <div className="pointer-events-none absolute left-1/2 top-[9px] z-[95] h-[5px] w-24 -translate-x-1/2 rounded-full bg-black/85 shadow-inner"/>
      <div className="pointer-events-none absolute left-1/2 top-[18px] z-[96] h-3.5 w-3.5 -translate-x-1/2 rounded-full border border-zinc-900 bg-gradient-to-br from-slate-700 via-black to-blue-950 shadow-[0_0_0_2px_rgba(0,0,0,.5)]"><span className="absolute left-[3px] top-[2px] h-1 w-1 rounded-full bg-blue-300/35"/></div>
      <div data-phone-display className={`phone-screen ${settings.wallpaper.startsWith('data:') ? '' : `wallpaper-${settings.wallpaper}`} relative h-full w-full overflow-hidden rounded-[47px] bg-cover bg-center text-[var(--text)]`} style={{ filter: `brightness(${Math.max(.25, settings.brightness / 100)})`, backgroundImage: settings.wallpaper.startsWith('data:') ? `url(${settings.wallpaper})` : undefined }}>
        <div className="absolute inset-0 bg-black/5"/>
        {!currentApp && <HomeScreen/>}
        <AppScreen/>
        <StatusBar onOpenShade={() => !locked && setShade(1)}/>
        {!locked && <NavigationBar/>}
        {!locked && <NotificationPanel/>}
        {!locked && <RecentsScreen/>}
        {locked && <LockScreen/>}
        <Toast/>
        <div aria-label="Ультразвуковой сканер отпечатка" className="pointer-events-none absolute bottom-24 left-1/2 z-10 h-12 w-12 -translate-x-1/2 rounded-full border border-white/5 bg-[radial-gradient(circle,rgba(255,255,255,.07),transparent_65%)] opacity-40"/>
      </div>
    </div>
    <div className="mx-auto mt-4 flex w-2/3 items-center justify-center gap-3 text-[10px] uppercase tracking-[.35em] text-white/30"><span className="h-px flex-1 bg-white/10"/>Galaxy S25 Ultra<span className="h-px flex-1 bg-white/10"/></div>
  </div>;
}
