// lib/scraper.ts
import axios from 'axios';
import * as cheerio from 'cheerio';
import https from 'https';

export async function scrapeBCV() {
// En lib/scraper.ts
const url = `https://www.bcv.org.ve/?t=${new Date().getTime()}`;
  const agent = new https.Agent({ rejectUnauthorized: false });

  try {
    const { data } = await axios.get(url, { 
      httpsAgent: agent,
      timeout: 5000, 
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0' },
      responseType: 'text',
    });

    const $ = cheerio.load(data);
    const usd = $('#dolar strong').text().trim().replace(',', '.');
    const eur = $('#euro strong').text().trim().replace(',', '.');
    const fecha = $('.date-display-single').first().text().trim();

    const dolarVal = parseFloat(usd);
    if (isNaN(dolarVal)) throw new Error("Datos no encontrados en el BCV");

    return { 
      dolar: dolarVal, 
      euro: parseFloat(eur), 
      fecha, 
      success: true 
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}