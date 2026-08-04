import { FileText, Folder, FolderPlus, MoreVertical, Pencil, Plus, Trash2, Upload, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { AppShell } from '../components/AppShell';
import { usePhoneStore } from '../state/usePhoneStore';

export function FilesApp() {
  const files = usePhoneStore((s) => s.files);
  const addFile = usePhoneStore((s) => s.addFile);
  const renameFile = usePhoneStore((s) => s.renameFile);
  const deleteFile = usePhoneStore((s) => s.deleteFile);
  const [folder, setFolder] = useState<string|null>(null);
  const [selected, setSelected] = useState<string|null>(null);
  const [editor, setEditor] = useState<{id?:string;name:string;content:string}|null>(null);
  const visible = useMemo(() => files.filter((f) => f.parentId === folder), [files, folder]);
  const currentFolder = files.find((f) => f.id === folder);
  const createFolder = () => { const name = prompt('Название папки'); if(name?.trim()) addFile({ parentId: folder, name:name.trim(), kind:'folder' }); };
  const upload = (file?:File) => { if(!file) return; const reader = new FileReader(); reader.onload=()=>addFile({parentId:folder,name:file.name,kind:'file',size:file.size,content:typeof reader.result==='string'?reader.result:'Бинарный файл'}); reader.readAsText(file); };
  const saveEditor = () => { if(!editor) return; if(editor.id){ renameFile(editor.id,editor.name); usePhoneStore.setState((state)=>({files:state.files.map((f)=>f.id===editor.id?{...f,content:editor.content,size:editor.content.length}:f)})); } else addFile({parentId:folder,name:editor.name||'Новый файл.txt',kind:'file',size:editor.content.length,content:editor.content}); setEditor(null); };
  return <AppShell title={currentFolder?.name ?? 'Мои файлы'} actions={<div className="flex gap-3"><button aria-label="Создать папку" onClick={createFolder}><FolderPlus/></button><button aria-label="Создать файл" onClick={()=>setEditor({name:'Новый файл.txt',content:''})}><Plus/></button></div>}>
    {folder && <button onClick={()=>setFolder(currentFolder?.parentId??null)} className="mx-4 mb-3 rounded-full bg-white/8 px-4 py-2 text-sm">← На уровень выше</button>}
    <div className="px-4">{visible.map((file)=><div key={file.id} className="mb-2 flex items-center gap-3 rounded-[24px] bg-[var(--surface)] p-3"><button aria-label={`Открыть ${file.name}`} onClick={()=>file.kind==='folder'?setFolder(file.id):setEditor({id:file.id,name:file.name,content:file.content??''})} className="flex min-w-0 flex-1 items-center gap-3 text-left"><span className={`grid h-11 w-11 place-items-center rounded-2xl ${file.kind==='folder'?'bg-amber-500/20 text-amber-400':'bg-blue-500/20 text-blue-400'}`}>{file.kind==='folder'?<Folder/>:<FileText/>}</span><span className="min-w-0"><strong className="block truncate">{file.name}</strong><small className="opacity-50">{file.kind==='folder'?'Папка':`${file.size??0} байт`}</small></span></button><button aria-label={`Действия ${file.name}`} onClick={()=>setSelected(selected===file.id?null:file.id)}><MoreVertical/></button>{selected===file.id&&<div className="absolute right-8 z-10 rounded-2xl bg-zinc-800 p-2 shadow-xl"><button onClick={()=>{const name=prompt('Новое имя',file.name);if(name)renameFile(file.id,name);setSelected(null);}} className="flex w-full items-center gap-2 rounded-xl px-3 py-2"><Pencil size={16}/>Переименовать</button><button onClick={()=>{if(confirm(`Удалить ${file.name}?`))deleteFile(file.id);setSelected(null);}} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-red-400"><Trash2 size={16}/>Удалить</button></div>}</div>)}</div>
    <label className="absolute bottom-20 right-5 grid h-14 w-14 cursor-pointer place-items-center rounded-full bg-[var(--accent)] text-zinc-950 shadow-xl" aria-label="Загрузить файл"><Upload/><input type="file" className="hidden" onChange={(e)=>upload(e.target.files?.[0])}/></label>
    {editor&&<div className="absolute inset-0 z-20 flex flex-col bg-[var(--app-bg)] p-4 pt-12"><div className="flex items-center gap-2"><input aria-label="Имя файла" value={editor.name} onChange={(e)=>setEditor({...editor,name:e.target.value})} className="h-11 min-w-0 flex-1 rounded-2xl bg-[var(--surface)] px-3 outline-none"/><button onClick={()=>setEditor(null)}><X/></button></div><textarea aria-label="Содержимое файла" value={editor.content} onChange={(e)=>setEditor({...editor,content:e.target.value})} className="mt-3 flex-1 resize-none rounded-[24px] bg-[var(--surface)] p-4 outline-none"/><button onClick={saveEditor} className="mt-3 rounded-full bg-[var(--accent)] py-3 text-zinc-950">Сохранить</button></div>}
  </AppShell>;
}
