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
      // 1. Timeout estricto: Si el BCV no responde en 4s, abortar para no bloquear tu app
      timeout: 4000, 
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36...',
        // 2. Pedir solo lo necesario para ahorrar ancho de banda
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
      },
      // 3. Evitar descargar archivos innecesarios si axios intentara algo más
      responseType: 'text',
    });

    const $ = cheerio.load(data);
    
    // Selectores limpios
    const usd = $('#dolar strong').text().trim().replace(',', '.');
    const eur = $('#euro strong').text().trim().replace(',', '.');
    const fecha = $('.date-display-single').first().text().trim();

    // Validación de seguridad para evitar NaN
    const dolarVal = parseFloat(usd);
    const euroVal = parseFloat(eur);

    if (isNaN(dolarVal) || isNaN(euroVal)) {
        throw new Error("Datos de moneda no encontrados en el HTML");
    }

    return {
      dolar: dolarVal,
      euro: euroVal,
      fecha: fecha,
      success: true
    };
  } catch (error: any) {
    // 4. Log más específico para diagnóstico
    console.error("Error en el scraping:", error.message);
    return { success: false, error: "Servidor BCV fuera de línea o lento" };
  }
}