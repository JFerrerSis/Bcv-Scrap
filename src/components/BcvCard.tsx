'use client';
import { useEffect, useState } from 'react';
import { FaDollarSign, FaEuroSign, FaCalendarAlt } from 'react-icons/fa';

export default function BcvCard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/tasa');
        const json = await res.json();
        setData(json);
      } catch (e) {
        console.error("Error cargando la tasa");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full max-w-4xl mx-auto px-4">
      <div className="w-full max-w-xs sm:flex-1 h-48 bg-white/10 backdrop-blur-md rounded-[2.5rem] animate-pulse border border-white/20"></div>
      <div className="w-full max-w-xs sm:flex-1 h-48 bg-white/10 backdrop-blur-md rounded-[2.5rem] animate-pulse border border-white/20"></div>
    </div>
  );

  // Clase base para las tarjetas centradas
  const cardBase = "w-full max-w-xs sm:flex-1 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-[2.5rem] p-8 shadow-xl flex flex-col items-center justify-center transition-all duration-300 hover:scale-105 hover:shadow-2xl";

  return (
    <div className="w-full flex flex-col items-center justify-center px-4">
      
      {/* Contenedor de las dos tarjetas - Centrado en ambos ejes */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-10 w-full max-w-4xl">
        
        {/* Tarjeta Dólar */}
        <div className={cardBase}>
          <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-4 shadow-inner">
            <FaDollarSign className="text-green-600 text-2xl" />
          </div>
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Dólar Oficial</span>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl sm:text-5xl font-black text-slate-800 tracking-tighter">
              {data?.dolar?.toFixed(2)}
            </span>
            <span className="text-sm font-bold text-slate-400 uppercase">Bs</span>
          </div>
        </div>

        {/* Tarjeta Euro */}
        <div className={cardBase}>
          <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-4 shadow-inner">
            <FaEuroSign className="text-blue-600 text-2xl" />
          </div>
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Euro Oficial</span>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl sm:text-5xl font-black text-slate-800 tracking-tighter">
              {data?.euro?.toFixed(2)}
            </span>
            <span className="text-sm font-bold text-slate-400 uppercase">Bs</span>
          </div>
        </div>

      </div>

      {/* Fecha Valor con mejor contraste para el fondo */}
      <div className="flex justify-center w-full">
        <div className="flex items-center gap-3 bg-slate-900/60 backdrop-blur-xl border border-white/20 px-8 py-3 rounded-full text-white shadow-lg">
          <FaCalendarAlt className="text-blue-400 text-sm" />
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest">
            Fecha Valor: {data?.fecha}
          </span>
        </div>
      </div>
    </div>
  );
}