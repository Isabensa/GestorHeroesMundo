import axios from "axios";
import https from "https";

console.log("🧪 Probando conexión con restcountries...");

try {
  const response = await axios.get(
    "https://restcountries.com/v3.1/all?fields=name,capital,region,subregion,borders,area,population,gini,timezones",
    {
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    }
  );
  console.log(`✅ Conexión exitosa. Total países: ${response.data.length}`);
} catch (error) {
  console.error("❌ Error en la solicitud:", error.message);
  if (error.response) {
    console.error("Código de estado:", error.response.status);
    console.error("Datos recibidos:", error.response.data);
  }
}

