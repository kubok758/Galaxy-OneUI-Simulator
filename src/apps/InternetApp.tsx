import { ArrowLeft, ArrowRight, ExternalLink, Plus, RefreshCw, Search, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { AppShell } from '../components/AppShell';
import { usePhoneStore } from '../state/usePhoneStore';

const normalizeUrl = (input:string) => {
  const value=input.trim();
  if(!value) return 'https://www.google.com';
  if(/^https?:\/\//i.test(value)) return value;
  if(value.includes('.')&&!value.includes(' ')) return `https://${value}`;
  return `https://www.google.com/search?q=${encodeURIComponent(value)}`;
};

export function InternetApp() {
  const tabs=usePhoneStore((s)=>s.tabs); const activeTabId=usePhoneStore((s)=>s.activeTabId);
  const addTab=usePhoneStore((s)=>s.addTab); const closeTab=usePhoneStore((s)=>s.closeTab); const setActive=usePhoneStore((s)=>s.setActiveTab);
  const navigate=usePhoneStore((s)=>s.navigateTab); const back=usePhoneStore((s)=>s.browserBack); const forward=usePhoneStore((s)=>s.browserForward);
  const [address,setAddress]=useState(''); const [reloadKey,setReloadKey]=useState(0); const [tabOverview,setTabOverview]=useState(false);
  const active=useMemo(()=>tabs.find((t)=>t.id===activeTabId)??tabs[0],[tabs,activeTabId]);
  const go=()=>{try{const url=normalizeUrl(address);navigate(url);setAddress('');}catch{usePhoneStore.getState().showToast('Некорректный адрес');}};
  return <AppShell title="Samsung Internet" actions={<button aria-label="Новая вкладка" onClick={()=>addTab()}><Plus/></button>}>
    <div className="flex h-full flex-col px-2"><div className="mb-2 flex items-center gap-2"><button aria-label="Назад в браузере" onClick={back} className="p-2"><ArrowLeft/></button><button aria-label="Вперёд в браузере" onClick={forward} className="p-2"><ArrowRight/></button><div className="flex min-w-0 flex-1 items-center rounded-full bg-[var(--surface)] px-3"><Search size={16}/><input aria-label="Адрес или поисковый запрос" value={address} onChange={(e)=>setAddress(e.target.value)} onKeyDown={(e)=>e.key==='Enter'&&go()} className="h-11 min-w-0 flex-1 bg-transparent px-2 text-sm outline-none" placeholder={active?.url}/><button aria-label="Перезагрузить" onClick={()=>setReloadKey((k)=>k+1)}><RefreshCw size={17}/></button></div><button aria-label="Открыть снаружи" onClick={()=>active&&window.open(active.url,'_blank','noopener,noreferrer')} className="p-2"><ExternalLink/></button></div>
      <div className="relative flex-1 overflow-hidden rounded-t-[24px] bg-white">{active&&<iframe key={`${active.id}-${reloadKey}`} title={active.title} src={active.url} className="h-full w-full border-0" sandbox="allow-forms allow-scripts allow-same-origin allow-popups" onError={()=>usePhoneStore.getState().showToast('Страница запретила встраивание. Откройте её во внешней вкладке.')}/>}<div className="pointer-events-none absolute bottom-2 left-2 right-2 rounded-xl bg-black/75 px-3 py-2 text-center text-[10px] text-white/70">Некоторые сайты запрещают iframe политикой безопасности. Кнопка ↗ откроет текущий адрес напрямую.</div></div>
      <div className="flex h-12 items-center justify-center"><button onClick={()=>setTabOverview(!tabOverview)} className="rounded-full bg-[var(--surface)] px-5 py-2 text-sm">Вкладки: {tabs.length}</button></div>
      {tabOverview&&<div className="absolute inset-0 z-20 bg-[var(--app-bg)] p-4 pt-14"><div className="mb-4 flex items-center justify-between"><h2 className="text-xl font-semibold">Вкладки</h2><button onClick={()=>setTabOverview(false)}><X/></button></div><div className="grid grid-cols-2 gap-3">{tabs.map((tab)=><div key={tab.id} className={`relative rounded-[24px] border p-3 ${tab.id===activeTabId?'border-[var(--accent)]':'border-white/10'} bg-[var(--surface)]`}><button onClick={()=>{setActive(tab.id);setTabOverview(false);}} className="h-28 w-full text-left"><strong className="block truncate">{tab.title}</strong><small className="mt-2 block break-all opacity-50">{tab.url}</small></button><button aria-label={`Закрыть вкладку ${tab.title}`} onClick={()=>closeTab(tab.id)} className="absolute right-2 top-2"><X size={16}/></button></div>)}</div></div>}
    </div>
  </AppShell>;
}
