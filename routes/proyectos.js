const express = require("express")
const router = express.Router()
const proyectoController = require("../controllers/proyectoController")
const auth = require("../middleware/auth")
const { check } = require("express-validator")

//api/proyectos
//Crea proyectos
router.post("/", 
  auth,
  [
    check("nombre", "El nombre es obligatorio").not().isEmpty()
  ],
  proyectoController.crearProyecto
)

//obtiene todos los proyectos
router.get("/", 
  auth,
  proyectoController.obtenerProyectos
)

//actualizar UN proyecto
router.put("/:id",
  auth,
  [
    check("nombre", "El nombre es obligatorio").not().isEmpty()
  ],
  proyectoController.actualizarProyecto
)

//Elimina un proyecto
router.delete("/:id",
  auth,
  proyectoController.eliminarProyecto
)


module.exports= router