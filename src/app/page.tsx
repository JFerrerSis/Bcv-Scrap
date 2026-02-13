// app/page.tsx
import { Metadata } from 'next';
import NextImage from 'next/image';
import BcvCard from '@/components/BcvCard';
import fondo from '../utils/fondo.jpg';

export default function Home() {
  return (
    // CAMBIO: h-screen y justify-center para evitar scroll y centrar todo
    <main className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-[#05070a]">

      {/* 1. Fondo Nítido */}
      <div className="absolute inset-0 z-0">
        <NextImage
          src={fondo}
          alt="Background"
          fill
          priority
          className="object-cover object-center opacity-30"
        />
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-[#05070a]/40 to-[#05070a]"></div>
      </div>

      {/* 2. Contenido UI */}
      <div className="relative z-10 w-full px-6 flex flex-col items-center justify-center">

        {/* ANIMACIÓN DEL TÍTULO: slide-down + fade-in + blur */}
        <header className="mb-4 md:mb-6 text-center animate-in fade-in slide-in-from-top-10 duration-1000 ease-out fill-mode-both">
          <h1 className="text-5xl md:text-7xl font-extralight text-white mb-2 tracking-tighter">
            Monitor <span className="font-black text-blue-500 italic">BCV</span>
          </h1>

          {/* Reducimos mb-6 a mb-3 */}
          <div className="h-0.5 w-12 bg-blue-500 mx-auto mb-3 shadow-[0_0_20px_rgba(59,130,246,0.6)] animate-in zoom-in-0 duration-700 delay-500 fill-mode-both"></div>

          <p className="text-[9px] md:text-[10px] text-slate-500 uppercase tracking-[0.5em] font-bold animate-in fade-in duration-1000 delay-700 fill-mode-both">
            Tasa Del Dia • Tiempo Real
          </p>
        </header>
        {/* 3. Componente de Tarjetas */}
        <div className="w-full">
          <BcvCard />
        </div>
      </div>
    </main>
  );
}