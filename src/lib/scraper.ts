// lib/scraper.ts
import axios from 'axios';
import * as cheerio from 'cheerio';
import https from 'https';

export async function scrapeBCV() {
  const url = "https://www.bcv.org.ve/";
  
  // Agente para ignorar problemas de certificados SSL del BCV
  const agent = new https.Agent({ rejectUnauthorized: false });

  try {
    const { data } = await axios.get(url, { 
      httpsAgent: agent,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36'
      }
    });

    const $ = cheerio.load(data);
    
    // Selectores exactos de la web bcv.org.ve
    const usd = $('#dolar strong').text().trim().replace(',', '.');
    const eur = $('#euro strong').text().trim().replace(',', '.');
    const fecha = $('.date-display-single').first().text().trim();

    return {
      dolar: parseFloat(usd),
      euro: parseFloat(eur),
      fecha: fecha,
      success: true
    };
  } catch (error) {
    console.error("Error en el scraping:", error);
    return { success: false, error: "No se pudo conectar con el BCV" };
  }
}