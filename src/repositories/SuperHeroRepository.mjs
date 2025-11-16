import mongoose from 'mongoose';
import SuperHero from '../models/SuperHero.mjs';
import IRepository from './IRepository.mjs';

// ==================================================
//  SUPERHERO REPOSITORY
// ==================================================
class SuperHeroRepository extends IRepository {

  async obtenerPorId(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("ID no válido");
    }

    try {
      return await SuperHero.findById(id);
    } catch (error) {
      console.error('Error al obtener superhéroe por ID:', error);
      throw error;
    }
  }

  async obtenerTodos() {
    try {
      return await SuperHero.find({});
    } catch (error) {
      console.error('Error al obtener todos los superhéroes:', error);
      throw error;
    }
  }

  async buscarPorAtributo(atributo, valor) {
    const query = { [atributo]: new RegExp(valor, 'i') };

    try {
      return await SuperHero.find(query);
    } catch (error) {
      console.error(`Error al buscar superhéroes por ${atributo}:`, error);
      throw error;
    }
  }

  async obtenerMayoresDe30() {
    try {
      return await SuperHero.find({
        edad: { $gt: 30 },
        planetaOrigen: 'Tierra',
        $expr: { $gte: [{ $size: "$poderes" }, 2] }
      });
    } catch (error) {
      console.error('Error al obtener superhéroes mayores de 30:', error);
      throw error;
    }
  }

  async crearSuperheroe(data) {
    try {
      const nuevoSuperheroe = new SuperHero(data);
      return await nuevoSuperheroe.save();
    } catch (error) {
      console.error('Error al crear superhéroe:', error);
      throw error;
    }
  }

  async actualizarSuperheroe(id, data) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("ID no válido");
    }

    try {
      const superheroeActualizado = await SuperHero.findByIdAndUpdate(
        id,
        data,
        { new: true }
      );

      if (!superheroeActualizado) {
        throw new Error("Superhéroe no encontrado para actualizar");
      }

      return superheroeActualizado;

    } catch (error) {
      console.error(`Error al actualizar superhéroe con ID (${id}):`, error);
      throw error;
    }
  }

  async eliminarSuperheroe(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("ID no válido");
    }

    try {
      const superheroeEliminado = await SuperHero.findByIdAndDelete(id);

      if (!superheroeEliminado) {
        throw new Error("Superhéroe no encontrado para eliminar");
      }

      return superheroeEliminado;

    } catch (error) {
      console.error(`Error al eliminar superhéroe con ID (${id}):`, error);
      throw error;
    }
  }
}

// Exportar instancia única
export default new SuperHeroRepository();
