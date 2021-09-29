const Tarea = require("../Models/Tarea")
const Proyecto = require("../Models/Proyecto")
const { validationResult } = require("express-validator")

//Crea un nueva tarea
exports.crearTarea = async (req, res) => {
  //revisar si hay errores
  const errores = validationResult(req)
  if(!errores.isEmpty()) {
    return res.status(400).json({errores: errores.array()})
  }

  //extraer el proyecto y comprobar si existe
  const { proyecto } = req.body

  try {
    const existeProyecto = await Proyecto.findById(proyecto)
    if(!existeProyecto) {
      return res.status(404).json({ msg: "Proyecto no encontrado"})
    }

    //revisar si el proyecto actual pertenece al usuario
    if( existeProyecto.creador.toString() !== req.usuario.id ) {
      return res.status(401).json({msg: "No Autorizado"})
    }

    //Crear la tarea
    const tarea = new Tarea(req.body)
    await tarea.save()
    res.json({ tarea: tarea})

  } catch (error) {
    console.log(error)
    res.status(500).send("Hubo un error")
  }
}

//obtener las tareas por proyecto
exports.obtenerTareas = async (req, res) => {
  
  try {
    //extraer el proyecto y comprobar si existe
    //req.QUERY porque se usa "params" como request
    const { proyecto } = req.query

    const existeProyecto = await Proyecto.findById(proyecto) 
    if(!existeProyecto) {
      return res.status(404).json({ msg: "Proyecto no encontrado"})
    }

    //revisar si el proyecto actual pertenece al usuario
    if( existeProyecto.creador.toString() !== req.usuario.id ) {
      return res.status(401).json({msg: "No Autorizado"})
    }

    //obtener tareas por proyecto
    //metodo find consigue todas las coincidencias
    const tareas = await Tarea.find({ proyecto: proyecto}).sort({ creado: -1})
    res.json({ tareas: tareas})
    
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error")
  }
}

//Actualiza una tarea
exports.actualizarTarea = async (req, res) => {
  try {
    //extraer el proyecto y comprobar si existe la TAREA
    const { proyecto, nombre, estado } = req.body

    let tarea = await Tarea.findById(req.params.id)
    if(!tarea) {
      return res.status(404).json({ msg: "No existe esa Tarea"})
    }
    
    const existeProyecto = await Proyecto.findById(proyecto)

    //revisar si el proyecto actual pertenece al usuario
    if( existeProyecto.creador.toString() !== req.usuario.id ) {
      return res.status(401).json({msg: "No Autorizado"})
    }

    const nuevaTarea = {}
    nuevaTarea.nombre = nombre
    nuevaTarea.estado = estado
    
    //guardar la Tarea
    tarea = await Tarea.findOneAndUpdate(
      { _id: req.params.id}, 
      nuevaTarea, 
      { new: true }
    )
    res.json({ tarea: tarea})

  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error")
  }
}

//Eliminar una tarea
exports.eliminarTarea = async (req, res) => {

  try {
    //extraer el proyecto y comprobar si existe la TAREA
    const { proyecto } = req.query

    let tarea = await Tarea.findById(req.params.id)
    if(!tarea) {
      return res.status(404).json({ msg: "No existe esa Tarea"})
    }
    
    const existeProyecto = await Proyecto.findById(proyecto)

    //revisar si el proyecto actual pertenece al usuario
    if( existeProyecto.creador.toString() !== req.usuario.id ) {
      return res.status(401).json({msg: "No Autorizado"})
    }

    //Eliminar
    await Tarea.findOneAndRemove({_id: req.params.id})
    res.json({msg: "Tarea Eliminada!"})

  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error")
  }

}