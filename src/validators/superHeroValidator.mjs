import { body, param, validationResult } from "express-validator";

// =======================================
// NORMALIZADOR DE ARRAYS (NO TOCAR)
// =======================================
const normalizeArrayFields = (fields) => {
  return (req, res, next) => {
    fields.forEach((field) => {
      console.log(`Campo antes de normalizar: ${field}`, req.body[field]);

      if (req.body[field] && typeof req.body[field] !== "string" && !Array.isArray(req.body[field])) {
        console.warn(`Campo ${field} tiene un formato inesperado:`, req.body[field]);
        req.body[field] = [];
      }

      if (req.body[field] && typeof req.body[field] === "string") {
        req.body[field] = req.body[field]
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item !== "");
      }

      console.log(`Campo después de normalizar: ${field}`, req.body[field]);
    });

    next();
  };
};

// =======================================
// VALIDACIÓN: CREAR SUPERHÉROE
// =======================================
export const crearSuperHeroeValidation = [
  normalizeArrayFields(["poderes", "aliados", "enemigos"]),

  body("nombreSuperHeroe")
    .notEmpty().withMessage("El nombre del superhéroe es obligatorio")
    .isString().withMessage("Debe ser texto")
    .trim()
    .isLength({ min: 3, max: 60 }).withMessage("Debe tener entre 3 y 60 caracteres"),

  body("nombreReal")
    .notEmpty().withMessage("El nombre real es obligatorio")
    .isString().withMessage("Debe ser texto")
    .trim()
    .isLength({ min: 3, max: 60 }).withMessage("Debe tener entre 3 y 60 caracteres"),

  body("edad")
    .notEmpty().withMessage("La edad es obligatoria")
    .isInt({ min: 0 }).withMessage("Debe ser un número entero >= 0")
    .toInt(),

  body("poderes")
    .notEmpty().withMessage("Debe indicar al menos un poder")
    .isArray({ min: 1 }).withMessage("Los poderes deben ser un arreglo")
    .custom((poderes) =>
      poderes.every(
        (poder) =>
          typeof poder === "string" &&
          poder.trim().length >= 3 &&
          poder.trim().length <= 60
      )
    ).withMessage("Cada poder debe tener entre 3 y 60 caracteres"),

  body("aliados")
    .optional()
    .isArray().withMessage("Los aliados deben ser un arreglo")
    .custom((arr) =>
      arr.every((e) => typeof e === "string" && e.trim().length >= 3 && e.trim().length <= 60)
    ).withMessage("Cada aliado debe tener entre 3 y 60 caracteres"),

  body("enemigos")
    .optional()
    .isArray().withMessage("Los enemigos deben ser un arreglo")
    .custom((arr) =>
      arr.every((e) => typeof e === "string" && e.trim().length >= 3 && e.trim().length <= 60)
    ).withMessage("Cada enemigo debe tener entre 3 y 60 caracteres"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error("Errores de validación:", errors.array());
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// =======================================
// VALIDACIÓN: ACTUALIZAR SUPERHÉROE
// =======================================
export const actualizarSuperHeroeValidation = [
  normalizeArrayFields(["poderes", "aliados", "enemigos"]),

  param("id").isMongoId().withMessage("El ID debe ser válido"),

  body("nombreSuperHeroe")
    .optional()
    .isString().withMessage("Debe ser texto")
    .isLength({ min: 3, max: 60 }).withMessage("Entre 3 y 60 caracteres"),

  body("nombreReal")
    .optional()
    .isString().withMessage("Debe ser texto")
    .isLength({ min: 3, max: 60 }).withMessage("Entre 3 y 60 caracteres"),

  body("edad")
    .optional()
    .isInt({ min: 0 }).withMessage("Debe ser entero >= 0")
    .toInt(),

  body("poderes")
    .optional()
    .isArray().withMessage("Debe ser un arreglo")
    .custom((arr) =>
      arr.every((e) => typeof e === "string" && e.trim().length >= 3 && e.trim().length <= 60)
    ).withMessage("Poder inválido"),

  body("aliados")
    .optional()
    .isArray()
    .custom((arr) =>
      arr.every((e) => typeof e === "string" && e.trim().length >= 3 && e.trim().length <= 60)
    ).withMessage("Aliado inválido"),

  body("enemigos")
    .optional()
    .isArray()
    .custom((arr) =>
      arr.every((e) => typeof e === "string" && e.trim().length >= 3 && e.trim().length <= 60)
    ).withMessage("Enemigo inválido"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error("Errores:", errors.array());
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// =======================================
// VALIDACIÓN: ELIMINAR SUPERHÉROE
// =======================================
export const eliminarSuperheroeValidation = [
  param("id")
    .notEmpty().withMessage("El ID es obligatorio")
    .isMongoId().withMessage("ID de MongoDB inválido"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error("Errores en DELETE:", errors.array());
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];



