'use client';
import useSWR from 'swr';
import { FaDollarSign, FaEuroSign, FaSyncAlt, FaCalculator, FaExchangeAlt, FaHistory, FaTimes } from 'react-icons/fa';
import { useState, useMemo, useEffect, useRef } from 'react';
import { toast } from 'sonner';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const formatNumber = (num: number | string) => {
  const value = typeof num === 'string' ? parseFloat(num) : num;
  if (isNaN(value)) return '0,00';
  return new Intl.NumberFormat('de-DE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export default function BcvCard() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [amount, setAmount] = useState<string>('');
  const [isForeignToBs, setIsForeignToBs] = useState(true);
  const [selectedCurrency, setSelectedCurrency] = useState<'usd' | 'eur'>('usd');
  const [showCalculator, setShowCalculator] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const calcInputRef = useRef<HTMLInputElement>(null);

  const { data, isLoading, mutate } = useSWR('/api/tasa', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 600000,
  });

  // FUNCIÓN PARA ABRIR CALCULADORA SEGÚN MONEDA
  const openCalculator = (currency: 'usd' | 'eur') => {
    setSelectedCurrency(currency);
    setIsForeignToBs(true); // Por defecto de Divisa a Bs
    setShowCalculator(true);
    setShowHistory(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        setShowCalculator(prev => !prev);
        setShowHistory(false);
      }
      if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'h') {
        e.preventDefault();
        setShowHistory(prev => !prev);
        setShowCalculator(false);
      }
      if (e.key === 'Escape') {
        setShowCalculator(false);
        setShowHistory(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (showCalculator) {
      setTimeout(() => calcInputRef.current?.focus(), 100);
    }
  }, [showCalculator]);

  const conversionFormatted = useMemo(() => {
    if (!amount || !data?.[selectedCurrency === 'usd' ? 'dolar' : 'euro']) return '0,00';
    const rate = data[selectedCurrency === 'usd' ? 'dolar' : 'euro'];
    const numAmount = parseFloat(amount);
    const result = isForeignToBs ? numAmount * rate : numAmount / rate;
    return formatNumber(result);
  }, [amount, data, selectedCurrency, isForeignToBs]);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    const toastId = toast.loading('Consultando al BCV...');
    try {
      const result = await mutate();
      if (result?.success) toast.success('Tasas actualizadas', { id: toastId });
      else toast.error('Error al conectar con BCV', { id: toastId });
    } catch (err) {
      toast.error('Error de servidor local', { id: toastId });
    } finally {
      setTimeout(() => setIsRefreshing(false), 800);
    }
  };

  if (isLoading && !data) return (
    <div className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-[#0a0a0a]">
      {/* Fondo con efecto de profundidad */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/10 blur-[120px] rounded-full" />
      </div>

      {/* Spinner y Texto */}
      <div className="relative flex flex-col items-center gap-6 animate-in fade-in duration-700">
        <div className="relative w-16 h-16">
          {/* Aro de luz exterior */}
          <div className="absolute inset-0 border-4 border-blue-500/10 rounded-full"></div>
          {/* Spinner animado */}
          <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <h2 className="text-white text-[12px] font-black uppercase tracking-[0.3em] ml-[0.3em]">
            BCV Monitor
          </h2>
          <div className="flex items-center gap-2">
            <span className="w-1 h-1 bg-blue-500 rounded-full animate-pulse"></span>
            <p className="text-gray-500 text-[9px] font-bold uppercase tracking-widest">
              Sincronizando Tasas
            </p>
            <span className="w-1 h-1 bg-blue-500 rounded-full animate-pulse delay-75"></span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full flex flex-col items-center px-4 relative overflow-hidden bg-transparent">

      {/* TARJETAS PRINCIPALES */}
      {/* TARJETAS PRINCIPALES: Añadimos py-10 para que al crecer hacia arriba/abajo no se corte */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-8 w-full max-w-5xl z-10 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out py-10 px-4">

        {/* Card Dólar */}
        <button
          onClick={() => openCalculator('usd')}
          className="group relative w-full max-w-70 sm:flex-1 bg-white/95 rounded-[2.5rem] p-8 shadow-2xl flex flex-col items-center justify-center transition-all duration-300 hover:scale-105 hover:z-20 hover:shadow-blue-500/20 active:scale-95 cursor-pointer border-4 border-transparent hover:border-blue-500/10 z-10"
        >
          <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-4 shadow-inner group-hover:bg-green-200 transition-colors">
            <FaDollarSign className="text-green-600 text-2xl" />
          </div>
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Dólar Oficial</span>
          <div className="flex items-baseline gap-2 text-slate-800">
            <span className="text-4xl font-black tracking-tighter">{formatNumber(data.dolar)}</span>
            <span className="text-sm font-bold opacity-40">Bs</span>
          </div>
          <div className="absolute bottom-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            <span className="text-[8px] font-black text-blue-600 uppercase tracking-widest">Click para calcular</span>
          </div>
        </button>

        {/* Card Euro */}
        <button
          onClick={() => openCalculator('eur')}
          className="group relative w-full max-w-70 sm:flex-1 bg-white/95 rounded-[2.5rem] p-8 shadow-2xl flex flex-col items-center justify-center transition-all duration-300 hover:scale-105 hover:z-20 hover:shadow-blue-500/20 active:scale-95 cursor-pointer border-4 border-transparent hover:border-blue-500/10 z-10"
        >
          <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-4 shadow-inner group-hover:bg-blue-200 transition-colors">
            <FaEuroSign className="text-blue-600 text-2xl" />
          </div>
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Euro Oficial</span>
          <div className="flex items-baseline gap-2 text-slate-800">
            <span className="text-4xl font-black tracking-tighter">{formatNumber(data.euro)}</span>
            <span className="text-sm font-bold opacity-40">Bs</span>
          </div>
          <div className="absolute bottom-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            <span className="text-[8px] font-black text-blue-600 uppercase tracking-widest">Click para calcular</span>
          </div>
        </button>
      </div>

      {/* Resto del código (Footer y Modales) se mantiene igual... */}
      {/* ... */}

      {/* FOOTER Y ACCIONES */}
      <div className="flex flex-col items-center gap-4 z-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300 fill-mode-both">
        <div className="flex flex-wrap justify-center gap-3">
          <button onClick={() => setShowCalculator(true)} className="text-[8px] text-gray-400 font-black bg-white/5 px-4 py-2 rounded-full border border-white/5 tracking-widest hover:text-white hover:bg-white/10 transition-all active:scale-90">
            CALC: <span className="text-blue-500 font-bold">CTRL + ALT + C</span>
          </button>
          <button onClick={() => setShowHistory(true)} className="text-[8px] text-gray-400 font-black bg-white/5 px-4 py-2 rounded-full border border-white/5 tracking-widest hover:text-white hover:bg-white/10 transition-all active:scale-90">
            HISTORIAL: <span className="text-blue-500 font-bold">CTRL + ALT + H</span>
          </button>
        </div>

        <div className="flex flex-col items-center gap-3">
          <div className="px-4 py-1 bg-white/5 rounded-full border border-white/5">
            <p className="text-[8px] text-white/30 font-bold uppercase tracking-[0.2em]">Actualizado: {data?.fecha || 'Hoy'}</p>
          </div>
          <button onClick={handleManualRefresh} disabled={isRefreshing} className="group flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-full transition-all hover:bg-blue-500 hover:scale-105 active:scale-95 shadow-[0_10px_30px_rgba(37,99,235,0.3)] disabled:opacity-50">
            <FaSyncAlt className={`text-xs ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="text-[10px] font-black uppercase tracking-widest">Actualizar Monitor</span>
          </button>
        </div>
      </div>

      {/* MODALES (Calculadora y Historial) */}
      {(showCalculator || showHistory) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-300"
            onClick={() => { setShowCalculator(false); setShowHistory(false); }}
          />

          {showCalculator && (
            <div className="relative w-full max-w-md bg-[#1a1a1a] border border-white/10 p-6 md:p-8 rounded-[2.5rem] md:rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-in zoom-in-95 fade-in duration-300">

              {/* BOTÓN CERRAR: Subido de top-5 a top-3 y ajustado a la derecha */}
              <button
                onClick={() => setShowCalculator(false)}
                className="absolute top-3 right-4 text-gray-500 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full z-10"
              >
                <FaTimes className="text-lg" />
              </button>

              {/* SELECTOR DE MONEDA: He añadido mt-6 para que no choque con la X subida */}
              <div className="flex bg-black/40 p-1 rounded-2xl mb-6 mt-6">
                <button onClick={() => setSelectedCurrency('usd')} className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${selectedCurrency === 'usd' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-white'}`}>USD</button>
                <button onClick={() => setSelectedCurrency('eur')} className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${selectedCurrency === 'eur' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-white'}`}>EUR</button>
              </div>

              <div className="flex justify-between items-center mb-6 gap-2">
                <div className="flex items-center gap-2 shrink-0">
                  <FaCalculator className="text-blue-500" />
                  <h3 className="text-white text-[10px] font-black uppercase tracking-widest">Calculadora</h3>
                </div>
                <button
                  onClick={() => setIsForeignToBs(!isForeignToBs)}
                  className="bg-blue-600/20 text-blue-400 px-3 py-1.5 rounded-full text-[9px] font-bold hover:bg-blue-600 hover:text-white transition-all whitespace-nowrap"
                >
                  <FaExchangeAlt className="inline mr-1" /> {isForeignToBs ? 'DIVISA ➔ BS' : 'BS ➔ DIVISA'}
                </button>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <input
                    ref={calcInputRef}
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-black/60 border border-white/5 rounded-2xl pl-6 pr-14 py-5 text-white font-bold text-2xl focus:border-blue-500/50 outline-none transition-all placeholder:text-gray-700 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <span className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-xl pointer-events-none">
                    {isForeignToBs ? (selectedCurrency === 'usd' ? '$' : '€') : 'Bs'}
                  </span>
                </div>

                <div className="bg-blue-600/10 border border-blue-500/20 rounded-2xl p-6 md:p-8 text-center shadow-inner overflow-hidden">
                  <p className="text-blue-400/60 text-[9px] uppercase font-black tracking-widest mb-2">Resultado</p>
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-3xl md:text-5xl font-black text-white tracking-tighter leading-tight break-all">
                      {conversionFormatted}
                      <span className="ml-2 text-sm md:text-xl text-blue-500 uppercase">
                        {isForeignToBs ? 'Bs' : (selectedCurrency === 'usd' ? '$' : '€')}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {showHistory && data?.history && (
            <div className="relative w-full max-w-md bg-[#1a1a1a] border border-white/10 p-6 md:p-8 rounded-[2.5rem] md:rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-in slide-in-from-bottom-12 fade-in duration-400">
              <button
                onClick={() => setShowHistory(false)}
                className="absolute top-5 right-6 text-gray-500 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full"
              >
                <FaTimes className="text-lg" />
              </button>

              <div className="flex items-center gap-2 mb-6 text-white uppercase text-[10px] font-black tracking-widest border-b border-white/10 pb-4 mt-4">
                <FaHistory className="text-blue-500" /> Registro Reciente
              </div>

              <div className="max-h-80 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                {data.history.map((item: any, i: number) => {
                  const previousItem = data.history[i + 1];
                  const currentDolar = parseFloat(item.dolar);
                  const prevDolar = previousItem ? parseFloat(previousItem.dolar) : null;

                  const isHigher = prevDolar ? currentDolar > prevDolar : false;
                  const isLower = prevDolar ? currentDolar < prevDolar : false;

                  const percentageChange = prevDolar
                    ? ((currentDolar - prevDolar) / prevDolar * 100).toFixed(2)
                    : null;

                  return (
                    <div key={i} className="flex justify-between items-center bg-black/40 p-5 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-all group">
                      <div className="flex flex-col gap-1">
                        <span className="text-gray-400 text-[10px] font-bold">{item.fecha}</span>
                        {prevDolar && (
                          <div className="flex items-center gap-1.5">
                            <span className={`text-[8px] font-black uppercase tracking-tighter ${isHigher ? 'text-red-400' : isLower ? 'text-green-400' : 'text-gray-600'}`}>
                              {isHigher ? '▲' : isLower ? '▼' : '●'} {Math.abs(Number(percentageChange))}%
                            </span>
                            <span className="text-[7px] text-white/20 font-bold uppercase">vs anterior</span>
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <p className="text-white font-black text-lg leading-none">
                            {formatNumber(item.dolar)}
                            <span className="ml-1 text-[9px] text-gray-500 font-bold">USD</span>
                          </p>
                        </div>
                        <p className="text-blue-400/80 font-bold text-xs mt-1">
                          {formatNumber(item.euro)}
                          <span className="ml-1 text-[9px] opacity-60 font-bold">EUR</span>
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}