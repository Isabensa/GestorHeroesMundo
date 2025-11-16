import { validationResult } from "express-validator";

/**
 * Middleware para manejar errores de validación de express-validator.
 * Detecta si la solicitud espera JSON o una vista, y responde adecuadamente.
 */
export const validationHandler = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorDetails = errors.array().map((error) => ({
      field: error.param,
      message: error.msg,
      value: error.value,
    }));

    // ✔ Si espera JSON
    if (req.headers["accept"]?.includes("application/json")) {
      return res.status(400).json({
        message: "Error en la validación de los datos enviados.",
        errors: errorDetails,
      });
    }

    // ✔ Si la ruta pertenece a DELETE → usar page/delete
    if (req.originalUrl.includes("/heroes/") && req.method === "POST") {
      return res.status(400).render("pages/delete", {
        title: "Eliminación de Superhéroe",
        superhero: null,
        successMessage: null,
        error: errorDetails.map((e) => e.message).join(", "),
      });
    }

    // ✔ Caso general (EDIT)
    return res.status(400).render("pages/edit", {
      title: "Editar Superhéroe",
      superhero: null,
      success: null,
      error: errorDetails.map((e) => e.message).join(", "),
    });
  }

  next();
};
