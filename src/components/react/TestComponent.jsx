import React, { useState } from 'react';

export default function TestComponent() {
  const [contador, setContador] = useState(0);

  return (
    <div className="p-8 bg-white rounded-2xl shadow-xl border border-slate-200/80 max-w-md mx-auto text-center transition-all hover:shadow-2xl">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 mb-4">
        <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
        React + Tailwind CSS Activo
      </div>

      <h2 className="text-2xl font-bold text-slate-800 tracking-tight mb-2">
        HelpDesk - Verificación
      </h2>
      <p className="text-slate-500 text-sm mb-6 leading-relaxed">
        Componente React interactivo funcionando dentro de Astro. El estado se gestiona con el hook{' '}
        <code className="bg-slate-100 text-blue-600 px-1.5 py-0.5 rounded text-xs font-mono font-semibold">
          useState
        </code>
        .
      </p>

      <div className="flex items-center justify-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
        <button
          onClick={() => setContador(contador - 1)}
          className="w-10 h-10 flex items-center justify-center bg-white hover:bg-slate-100 active:scale-95 text-slate-700 font-bold rounded-lg border border-slate-200 shadow-sm transition-all"
          aria-label="Decrementar"
        >
          -
        </button>
        <span className="text-3xl font-extrabold text-slate-800 w-16 select-none tabular-nums">
          {contador}
        </span>
        <button
          onClick={() => setContador(contador + 1)}
          className="w-10 h-10 flex items-center justify-center bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold rounded-lg shadow-md shadow-blue-500/20 transition-all"
          aria-label="Incrementar"
        >
          +
        </button>
      </div>
      
      <p className="mt-4 text-xs text-slate-400">
        Haz clic en los botones para verificar la interactividad.
      </p>
    </div>
  );
}
