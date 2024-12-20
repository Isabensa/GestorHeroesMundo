import { body } from 'express-validator';

export const validateCountry = [
  body('name')
    .isLength({ min: 3, max: 90 }).withMessage('El nombre oficial debe tener entre 3 y 90 caracteres.')
    .trim().notEmpty().withMessage('El nombre oficial no puede estar vacío.'),

  body('capital')
    .isLength({ min: 3, max: 90 }).withMessage('La capital debe tener entre 3 y 90 caracteres.')
    .trim().notEmpty().withMessage('La capital no puede estar vacía.'),

  body('borders')
    .optional()
    .isString().withMessage('Las fronteras deben ser una cadena de texto separada por comas.')
    .custom((value) => {
      const borders = value.split(',').map(border => border.trim());
      for (const border of borders) {
        if (!/^[A-Z]{3}$/.test(border)) {
          throw new Error('Cada frontera debe ser un código de 3 letras mayúsculas.');
        }
        if (border.length < 3 || border.length > 60) {
          throw new Error('Cada frontera debe tener entre 3 y 60 caracteres.');
        }
      }
      return true;
    }),

  body('area')
    .isFloat({ min: 1 }).withMessage('El área debe ser un número positivo.'),

  body('population')
    .isInt({ min: 1 }).withMessage('La población debe ser un número entero positivo.'),

  body('gini')
    .optional()
    .isFloat({ min: 0, max: 100 }).withMessage('El índice GINI debe ser un número entre 0 y 100.'),

  body('timezones')
    .optional()
    .isString().withMessage('Las zonas horarias deben ser una cadena de texto separada por comas.')
    .custom((value) => {
      const timezones = value.split(',').map(timezone => timezone.trim());
      for (const timezone of timezones) {
        if (timezone.length < 3 || timezone.length > 60) {
          throw new Error('Cada zona horaria debe tener entre 3 y 60 caracteres.');
        }
      }
      return true;
    }),
];
