// app/api/tasa/route.ts
import { NextResponse } from 'next/server';
import { scrapeBCV } from '@/lib/scraper';

// Permitimos que Next.js maneje la ruta de forma dinámica pero con cache
export const dynamic = 'force-dynamic';

// 1. Revalidación a nivel de Next.js cada 1 hora
export const revalidate = 3600; 

export async function GET() {
  const result = await scrapeBCV();
  
  if (!result.success) {
    return NextResponse.json(
      { error: result.error }, 
      { status: 503 } 
    );
  }

  return NextResponse.json(result, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      /* 2. Cache-Control ajustado:
         s-maxage=3600: El servidor (CDN/Vercel) guarda la tasa por 1 hora.
         stale-while-revalidate=600: Si pasan 61 minutos, entrega la tasa vieja 
         mientras en background busca la nueva (margen de 10 min).
      */
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600',
    },
  });
}