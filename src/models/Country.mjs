import mongoose from 'mongoose';

const countrySchema = new mongoose.Schema({
  name: { type: String, required: true }, // Nombre del país
  capital: { type: String, default: 'Desconocida' }, // Capital
  languages: { type: [String], default: [] }, // Idiomas
  population: { type: Number, min: 0, default: 0 }, // Población
  region: { type: String, default: 'Desconocido' }, // Región
  subregion: { type: String, default: 'Desconocido' }, // Subregión
  area: { type: Number, min: 0, default: 0 }, // Área
  flags: { type: String, default: '' }, // URL bandera
  creador: { type: String, default: 'ISABENSA' }, // Autor
  createdAt: { type: Date, default: Date.now }, // Fecha creación
});

export default mongoose.model('Country', countrySchema, 'Countries');
