// app/api/tasa/route.ts
import { NextResponse } from 'next/server';
import { scrapeBCV } from '@/lib/scraper';

export async function GET() {
  const result = await scrapeBCV();
  
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  // Creamos la respuesta
  const response = NextResponse.json(result);

  // Configuramos cabeceras para permitir cualquier origen (útil para pruebas por IP)
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

  return response;
}

// Para manejar peticiones pre-flight de los navegadores
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}