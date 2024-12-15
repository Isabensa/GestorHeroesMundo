import mongoose from 'mongoose';

const countrySchema = new mongoose.Schema({
    name: { type: String, required: true }, // Nombre del país
    region: { type: String, default: 'Desconocido' }, // Región
    subregion: { type: String, default: 'Desconocido' }, // Subregión
    population: { type: Number, min: 0 }, // Población
    languages: { type: [String] }, // Idiomas
    area: { type: Number, min: 0 }, // Área del país
    capital: { type: [String], default: ['Desconocida'] }, // Capital
    flags: { type: String }, // URL de la bandera
    creador: { type: String, default: 'Isabel' }, // Creador
    createdAt: { type: Date, default: Date.now } // Fecha de creación
});

export default mongoose.model('Country', countrySchema, 'Paises');
