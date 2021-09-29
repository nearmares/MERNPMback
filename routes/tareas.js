const express = require("express")
const router = express.Router()
const tareaController = require("../controllers/tareaController")
const auth = require("../middleware/auth")
const { check } = require("express-validator")

//api/tareas
//crear una nueva tarea
router.post("/",
  auth,
  [
    check("nombre", "El Nombre es Obligatorio").not().isEmpty()
  ],
  tareaController.crearTarea
)

// Obtener tareas por proyecto
router.get("/",
  auth,
  tareaController.obtenerTareas
)

// Actualizar tarea
router.put("/:id",
  auth,
  tareaController.actualizarTarea
)

//Eliminar una Tarea
router.delete("/:id",
  auth,
  tareaController.eliminarTarea
)

module.exports = router