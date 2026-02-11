// app/api/tasa/route.ts
import { NextResponse } from 'next/server';
import { scrapeBCV } from '@/lib/scraper';

// Revalida cada 3600 segundos (1 hora). 
// Esto garantiza que el 99% de tus usuarios reciban la respuesta en <200ms.
export const revalidate = 3600; 

export async function GET() {
  const result = await scrapeBCV();
  
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json(result, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      // Indicamos al navegador que también puede guardar esto en caché local
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600',
    },
  });
}