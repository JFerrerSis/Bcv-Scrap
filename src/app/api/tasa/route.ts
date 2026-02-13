import { NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';
import https from 'https';
import { Pool } from 'pg';

// Configuración del Pool de PostgreSQL usando variables de entorno
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
});

interface BcvData {
  dolar: number;
  euro: number;
  fecha: string;
  success: boolean;
  error?: string;
  history?: any[];
}

async function scrapeBCV(): Promise<BcvData> {
  const url = "https://www.bcv.org.ve/";
  const agent = new https.Agent({ rejectUnauthorized: false });

  try {
    const { data } = await axios.get(url, { 
      httpsAgent: agent,
      timeout: 8000,
      headers: { 
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' 
      },
      responseType: 'text',
    });

    const $ = cheerio.load(data);
    const usdText = $('#dolar strong').text().trim().replace(',', '.');
    const eurText = $('#euro strong').text().trim().replace(',', '.');
    const fecha = $('.date-display-single').first().text().trim();

    const dolar = parseFloat(usdText);
    const euro = parseFloat(eurText);

    if (isNaN(dolar) || isNaN(euro)) throw new Error("Estructura del BCV inválida.");

    return { dolar, euro, fecha, success: true };
  } catch (error: any) {
    return { success: false, error: error.message, dolar: 0, euro: 0, fecha: "" };
  }
}

export async function GET() {
  const timestamp = new Date().toLocaleTimeString('es-VE', { timeZone: 'America/Caracas' });
  console.log(`🚀 [${timestamp}] Iniciando scraping y persistencia en Postgres...`);

  const result = await scrapeBCV();
  
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  try {
    // 1. Insertar o actualizar la tasa del día (UPSERT)
    // ON CONFLICT evita que se dupliquen registros de la misma fecha
    await pool.query(
      `INSERT INTO bcv_history (dolar, euro, fecha)
       VALUES ($1, $2, $3)
       ON CONFLICT (fecha) DO UPDATE 
       SET dolar = EXCLUDED.dolar, euro = EXCLUDED.euro`,
      [result.dolar, result.euro, result.fecha]
    );

    // 2. Obtener los últimos 30 registros para el historial
    const historyRes = await pool.query(
      'SELECT dolar, euro, fecha FROM bcv_history ORDER BY id DESC LIMIT 30'
    );

    console.log(`✅ Base de datos actualizada: ${result.fecha}`);

    return NextResponse.json({ 
      ...result, 
      history: historyRes.rows // Retornamos los registros de la DB
    }, {
      headers: { 'Cache-Control': 'no-store, max-age=0' }
    });

  } catch (err) {
    console.error("❌ Error procesando base de datos:", err);
    // Si falla la DB, devolvemos al menos el resultado del scraping
    return NextResponse.json({ ...result, history: [] });
  }
}