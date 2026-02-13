import cron from 'node-cron';
import http from 'http';

const API_URL = 'http://localhost:3000/api/tasa';

console.log("🚀 [Scheduler] Sistema iniciado...");
console.log("⏰ [Scheduler] Esperando a las 6:00 AM (VET) para actualizar...");

// Programación para las 6:00 AM de Venezuela
cron.schedule('0 6 * * *', () => {
  console.log("🔔 [6:00 AM] Iniciando petición de actualización...");

  http.get(API_URL, (res) => {
    const { statusCode } = res;
    if (statusCode === 200) {
      console.log("✅ [Scheduler] Tasa actualizada con éxito.");
    } else {
      console.log(`⚠️ [Scheduler] El servidor respondió con error: ${statusCode}`);
    }
  }).on('error', (err: Error) => {
    console.error("❌ [Scheduler] Error de conexión: ", err.message);
  });
}, {
  // Eliminamos 'scheduled: true' porque causaba el error TS2353
  timezone: "America/Caracas"
});