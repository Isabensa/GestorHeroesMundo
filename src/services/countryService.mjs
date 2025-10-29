import axios from "axios";
import https from "https";
import SuperHero from "../models/SuperHero.mjs";

/**
 * Obtiene todos los países guardados con el autor ISABENSA.
 * Si no existen, los carga desde la API externa, los transforma al formato del modelo SuperHero
 * y los guarda en la colección Grupo-02.
 */
export const fetchCountries = async () => {
  try {
    console.log("🔎 Buscando países en la colección Grupo-02 (autor: ISABENSA)...");
    let countries = await SuperHero.find({ autor: "ISABENSA" });

    if (countries.length === 0) {
      console.log("⚠️ No hay países, obteniendo datos desde la API externa...");

      const response = await axios.get(
        "https://restcountries.com/v3.1/all?fields=name,capital,region,subregion,borders,area,population,gini,timezones",
        {
          httpsAgent: new https.Agent({ rejectUnauthorized: false }),
          headers: { Accept: "application/json" },
          timeout: 15000,
        }
      );

      console.log(`🌍 API respondió correctamente con ${response.data.length} países.`);

      // ✅ Transformación robusta con valores garantizados
      const apiCountries = response.data.map((pais) => {
        const nombre = pais?.name?.common?.trim() || "Desconocido";

        // ✅ Capital siempre string
        let capital = "Desconocida";
        if (Array.isArray(pais.capital) && pais.capital.length > 0) {
          capital = String(pais.capital[0]).trim() || "Desconocida";
        } else if (typeof pais.capital === "string" && pais.capital.trim() !== "") {
          capital = pais.capital.trim();
        }

        return {
          nombreSuperHeroe: nombre,
          nombreReal: capital,
          aliados: Array.isArray(pais.borders) ? pais.borders : [],
          edad: pais.gini ? Object.values(pais.gini)[0] : 0,
          planetaOrigen: pais.region || "Desconocido",
          debilidad: pais.subregion || "Desconocido",
          area: pais.area || 0,
          poderes: [
            `Población: ${pais.population || "Desconocido"}`,
            `Área: ${pais.area || 0} km²`,
          ],
          enemigos: Array.isArray(pais.timezones)
            ? pais.timezones
            : ["Sin información"],
          autor: "ISABENSA",
        };
      });

      // ✅ Filtramos por seguridad los países sin capital (por si algún campo falló)
      const validCountries = apiCountries.filter(
        (c) =>
          typeof c.nombreReal === "string" &&
          c.nombreReal.trim() !== "" &&
          typeof c.nombreSuperHeroe === "string" &&
          c.nombreSuperHeroe.trim() !== ""
      );

      await SuperHero.insertMany(validCountries);
      console.log(`✅ ${validCountries.length} países guardados en Grupo-02.`);

      countries = await SuperHero.find({ autor: "ISABENSA" });
    }

    // ✅ Mapeo limpio para la vista
    return countries.map((country) => {
      const areaFromPowers = country.poderes?.find((p) => p.startsWith("Área:"));
      const areaValue = areaFromPowers
        ? parseFloat(areaFromPowers.split(": ")[1].replace(" km²", ""))
        : country.area || 0;

      return {
        id: country._id?.toString() || "No disponible",
        name: country.nombreSuperHeroe || "No especificado",
        capital: country.nombreReal || "No especificado",
        area: areaValue,
        borders: Array.isArray(country.aliados)
          ? country.aliados.join(", ")
          : "Sin fronteras",
        gini:
          typeof country.edad === "number" ? country.edad : "No especificado",
        population:
          country.poderes?.find((p) => p.startsWith("Población:"))?.split(": ")[1] ||
          "No disponible",
        timezones: Array.isArray(country.enemigos)
          ? country.enemigos.join(", ")
          : "Sin información",
        region: country.planetaOrigen || "No especificado",
        subregion: country.debilidad || "No especificado",
        creador: country.autor || "Desconocido",
      };
    });
  } catch (error) {
    console.error("❌ Error al obtener países:", error.message);
    throw new Error("Error al cargar países desde la API o la base de datos.");
  }
};

/**
 * Busca un país por ID
 */
export const fetchCountryById = async (id) => {
  try {
    const country = await SuperHero.findById(id);
    if (!country) return null;

    const areaFromPowers = country.poderes?.find((p) => p.startsWith("Área:"));
    const areaValue = areaFromPowers
      ? parseFloat(areaFromPowers.split(": ")[1].replace(" km²", ""))
      : country.area || 0;

    return {
      id: country._id?.toString() || "No disponible",
      name: country.nombreSuperHeroe || "No especificado",
      capital: country.nombreReal || "No especificado",
      area: areaValue,
      borders: Array.isArray(country.aliados)
        ? country.aliados.join(", ")
        : "Sin fronteras",
      gini: typeof country.edad === "number" ? country.edad : "No especificado",
      population:
        country.poderes?.find((p) => p.startsWith("Población:"))?.split(": ")[1] ||
        "No disponible",
      timezones: Array.isArray(country.enemigos)
        ? country.enemigos.join(", ")
        : "Sin información",
      region: country.planetaOrigen || "No especificado",
      subregion: country.debilidad || "No especificado",
      creador: country.autor || "Desconocido",
    };
  } catch (error) {
    console.error("❌ Error al buscar país por ID:", error.message);
    throw error;
  }
};

/**
 * Guarda o actualiza un país
 */
export const saveCountry = async (data) => {
  try {
    if (data.id) {
      const updatedCountry = await SuperHero.findByIdAndUpdate(
        data.id.trim(),
        mapCountryToSuperHero(data),
        { new: true, runValidators: true }
      );
      if (!updatedCountry)
        return { success: false, message: "No se encontró el país para actualizar." };
      return { success: true, message: "País actualizado exitosamente.", country: updatedCountry };
    } else {
      const newCountry = new SuperHero(mapCountryToSuperHero(data));
      const savedCountry = await newCountry.save();
      return { success: true, message: "País guardado exitosamente.", country: savedCountry };
    }
  } catch (error) {
    console.error("❌ Error al guardar país:", error.message);
    return { success: false, message: "Error interno del servidor." };
  }
};

/**
 * Elimina un país por ID (solo si autor = ISABENSA)
 */
export const deleteCountryById = async (id) => {
  try {
    const result = await SuperHero.findOneAndDelete({
      _id: id.trim(),
      autor: "ISABENSA",
    });
    return result
      ? { success: true, message: "País eliminado exitosamente." }
      : { success: false, message: "No se encontró el país." };
  } catch (error) {
    console.error("❌ Error al eliminar país:", error.message);
    return { success: false, message: "Error interno del servidor." };
  }
};

/**
 * Mapea los datos del formulario al formato del modelo SuperHero
 */
const mapCountryToSuperHero = (data) => {
  return {
    nombreSuperHeroe: data.name || "Desconocido",
    nombreReal: data.capital?.trim() || "Desconocida",
    aliados: Array.isArray(data.borders)
      ? data.borders
      : data.borders
      ? data.borders.split(",").map((b) => b.trim())
      : [],
    edad:
      data.gini !== undefined && data.gini !== null
        ? parseFloat(data.gini)
        : 0,
    planetaOrigen: data.region || "No especificado",
    debilidad: data.subregion || "No especificado",
    area: data.area && !isNaN(data.area) ? parseFloat(data.area) : 0,
    poderes: [`Población: ${data.population}`, `Área: ${data.area} km²`],
    enemigos: Array.isArray(data.timezones)
      ? data.timezones
      : data.timezones
      ? data.timezones.split(",").map((z) => z.trim())
      : ["Sin información"],
    autor: "ISABENSA",
  };
};
