'use client';
import useSWR from 'swr';
import { FaDollarSign, FaEuroSign, FaCalendarAlt } from 'react-icons/fa';

// Función para obtener los datos
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function BcvCard() {
  // SWR maneja el estado, la carga y la caché automáticamente
  const { data, isLoading } = useSWR('/api/tasa', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 600000, // Evita peticiones repetidas por 10 min
  });

  if (isLoading && !data) return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full max-w-4xl mx-auto px-4">
      <div className="w-full max-w-xs sm:flex-1 h-48 bg-white/10 backdrop-blur-md rounded-[2.5rem] animate-pulse border border-white/20"></div>
      <div className="w-full max-w-xs sm:flex-1 h-48 bg-white/10 backdrop-blur-md rounded-[2.5rem] animate-pulse border border-white/20"></div>
    </div>
  );

  const cardBase = "w-full max-w-xs sm:flex-1 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-[2.5rem] p-8 shadow-xl flex flex-col items-center justify-center transition-all duration-300 hover:scale-105 hover:shadow-2xl";

  return (
    <div className="w-full flex flex-col items-center justify-center px-4">
      
      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-10 w-full max-w-4xl">
        
        {/* Tarjeta Dólar */}
        <div className={cardBase}>
          <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-4 shadow-inner">
            <FaDollarSign className="text-green-600 text-2xl" />
          </div>
          <span className="text-[10px] font-black text-gray-800 uppercase tracking-[0.2em] mb-2">Dólar Oficial</span>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl sm:text-5xl font-black text-slate-800 tracking-tighter">
              {data?.dolar?.toFixed(2)}
            </span>
            <span className="text-sm font-bold text-slate-800 uppercase">Bs</span>
          </div>
        </div>

        {/* Tarjeta Euro */}
        <div className={cardBase}>
          <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-4 shadow-inner">
            <FaEuroSign className="text-blue-600 text-2xl" />
          </div>
          <span className="text-[10px] font-black text-gray-800 uppercase tracking-[0.2em] mb-2">Euro Oficial</span>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl sm:text-5xl font-black text-slate-800 tracking-tighter">
              {data?.euro?.toFixed(2)}
            </span>
            <span className="text-sm font-bold text-slate-800 uppercase">Bs</span>
          </div>
        </div>

      </div>

      {/* <div className="flex justify-center w-full">
        <div className="flex items-center gap-3 bg-slate-900/60 backdrop-blur-xl border border-white/20 px-8 py-3 rounded-full text-white shadow-lg">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest">
            Fecha Valor: {data?.fecha}
          </span>
        </div>
      </div> */}
    </div>
  );
}