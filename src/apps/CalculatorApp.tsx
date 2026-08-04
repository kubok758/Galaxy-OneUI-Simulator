import { History, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { AppShell } from '../components/AppShell';

const normalizeExpression = (expr: string) => expr
  .replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-')
  .replace(/π/g, `(${Math.PI})`).replace(/√\(/g, 'sqrt(')
  .replace(/sin\(/g, 'sin(').replace(/cos\(/g, 'cos(').replace(/tan\(/g, 'tan(').replace(/log\(/g, 'log10(');

function calculate(expr: string): number {
  const normalized = normalizeExpression(expr);
  if (!/^[0-9+\-*/().,%\sA-Za-z]+$/.test(normalized)) throw new Error('Недопустимое выражение');
  const names = ['sin','cos','tan','sqrt','log10','abs','pow'];
  const values = [Math.sin,Math.cos,Math.tan,Math.sqrt,Math.log10,Math.abs,Math.pow];
  const result = Function(...names, `"use strict"; return (${normalized.replace(/%/g,'/100')});`)(...values);
  if (typeof result !== 'number' || !Number.isFinite(result)) throw new Error('Невозможно вычислить');
  return result;
}

export function CalculatorApp() {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('0');
  const [scientific, setScientific] = useState(false);
  const [history, setHistory] = useState<{expression:string;result:string}[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const press = (value:string) => setExpression((e) => e + value);
  const equals = () => { try { const value = calculate(expression); const text = Number(value.toFixed(10)).toString(); setResult(text); setHistory((h) => [{expression,result:text},...h].slice(0,30)); setExpression(text); } catch (e) { setResult(e instanceof Error ? e.message : 'Ошибка'); } };
  const keys = scientific ? ['sin(','cos(','tan(','√(','log(','π','(',')','7','8','9','÷','4','5','6','×','1','2','3','−','0','.','%','+'] : ['7','8','9','÷','4','5','6','×','1','2','3','−','0','.','%','+'];
  return <AppShell title="Калькулятор" actions={<div className="flex gap-2"><button aria-label="История вычислений" onClick={() => setHistoryOpen(!historyOpen)}><History/></button><button onClick={() => setScientific(!scientific)} className="rounded-full bg-white/8 px-3 py-2 text-xs">{scientific?'Обычный':'Научный'}</button></div>}>
    <div className="flex h-full flex-col px-4"><div className="min-h-36 flex-1 overflow-auto py-5 text-right"><p className="break-all text-2xl opacity-55">{expression || '0'}</p><p data-testid="calculator-result" className="mt-3 break-all text-5xl font-light">{result}</p></div>{historyOpen && <div className="absolute inset-x-4 top-24 z-10 max-h-80 overflow-auto rounded-[28px] bg-zinc-800 p-4 shadow-2xl"><div className="mb-3 flex justify-between"><strong>История</strong><button onClick={() => setHistory([])}><RotateCcw size={18}/></button></div>{history.map((h,i) => <button key={i} onClick={() => {setExpression(h.result);setHistoryOpen(false);}} className="block w-full border-b border-white/5 py-3 text-right"><small className="block opacity-50">{h.expression}</small><span>{h.result}</span></button>)}</div>}<div className={`grid ${scientific?'grid-cols-4':'grid-cols-4'} gap-2 pb-4`}><button aria-label="Очистить" onClick={() => {setExpression('');setResult('0');}} className="col-span-2 rounded-[22px] bg-red-500/20 py-4 text-red-300">AC</button><button aria-label="Удалить символ" onClick={() => setExpression((e)=>e.slice(0,-1))} className="rounded-[22px] bg-[var(--surface)]">⌫</button><button aria-label="Равно" onClick={equals} className="rounded-[22px] bg-[var(--accent)] text-2xl text-zinc-950">=</button>{keys.map((key,index) => <button aria-label={`Клавиша ${key}`} key={`${key}-${index}`} onClick={() => press(key)} className={`rounded-[22px] py-4 text-lg ${['÷','×','−','+'].includes(key)?'bg-[var(--accent)]/25 text-[var(--accent)]':'bg-[var(--surface)]'}`}>{key}</button>)}</div></div>
  </AppShell>;
}
