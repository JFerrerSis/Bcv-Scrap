// app/page.tsx
import { Metadata } from 'next';
import NextImage from 'next/image';
import BcvCard from '@/components/BcvCard';
import fondo from '../utils/fondo.jpg';


export default function Home() {
  return (
    <main className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#05070a]">
      
      {/* 1. Fondo Nítido */}
      <div className="absolute inset-0 z-0">
        <NextImage
          src={fondo}
          alt="Background"
          fill
          priority
          className="object-cover object-center opacity-30" 
        />
        {/* Usando bg-linear-to-b sugerido por Tailwind */}
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-[#05070a]/40 to-[#05070a]"></div>
      </div>

      {/* 2. Contenido UI */}
      <div className="relative z-10 w-full px-6 py-12 flex flex-col items-center justify-center">
        
        <header className="mb-14 md:mb-24 text-center">
          <h1 className="text-5xl md:text-8xl font-extralight text-white mb-4 tracking-tighter">
            Monitor <span className="font-black text-blue-500 italic">BCV</span>
          </h1>
          {/* Corregido h-[2px] a h-0.5 según la sugerencia */}
          <div className="h-0.5 w-16 bg-blue-500 mx-auto mb-8 shadow-[0_0_20px_rgba(59,130,246,0.6)]"></div>
          <p className="text-[10px] md:text-xs text-slate-500 uppercase tracking-[0.6em] font-bold">
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