import mongoose from 'mongoose';

const countrySchema = new mongoose.Schema({
    name: { type: String, required: true }, // Nombre del país
    capital: { type: [String], default: ['Desconocida'] }, // Capital
    languages: { type: [String], required: true }, // Idiomas como array de strings
    population: { type: Number, min: 0, default: 0 }, // Población
    region: { type: String, default: 'Desconocido' }, // Región
    subregion: { type: String, default: 'Desconocido' }, // Subregión
    area: { type: Number, min: 0, default: 0 }, // Área del país
    flags: { type: String, default: '' }, // URL de la bandera
    creador: { type: String, default: 'IsA' }, // Creador
    createdAt: { type: Date, default: Date.now } // Fecha de creación
});

export default mongoose.model('Country', countrySchema, 'Countries');
