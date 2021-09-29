const Proyecto = require("../Models/Proyecto")
const { validationResult } = require("express-validator")


exports.crearProyecto = async (req, res) => {

  //revisar si hay errores
  const errores = validationResult(req)
  if(!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() })
  }

  try {
    //crear un nuevo proyecto
    const proyecto = new Proyecto(req.body)

    proyecto.creador = req.usuario.id

    proyecto.save()
    res.json(proyecto)
    
  } catch (error) {
    console.log(error);
    res.status(400).send("hubo un error")
  }
} 

//obtiene TODOS los proyectos
exports.obtenerProyectos = async (req, res) => {
  try {
    const proyectos = await Proyecto.find({ creador: req.usuario.id }).sort({creado: -1})
    res.json({ proyectos })

  } catch (error) {
    console.log(error);
    res.status(500).send("hubo un error")
  }
}

//actualiza un proyecto
exports.actualizarProyecto = async(req, res) => {
  //revisa si hay errores
  const errores = validationResult(req)
  if(!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() })
  } 
  //extraer informacion del proyecto que se va a actualizar
  const { nombre } = req.body
  const nuevoProyecto = {}

  if(nombre) {
    nuevoProyecto.nombre = nombre
  }

  try {
    //revisa el ID await siempre que se consulte a la DB
    //console.log(req.params.id);
    let proyecto = await  Proyecto.findById(req.params.id)

    //Revisa si el proyecto existe o no
    if(!proyecto) {
      return res.status(404).json({msg: "Proyecto no encontrado"})
    }

    //Verifica el creador del proyecto 
    if(proyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({msg: "No Autorizado"})
    }

    //actualizar (consulta a DB se usa await)
    proyecto = await Proyecto.findByIdAndUpdate(
      {_id: req.params.id}, 
      {$set:nuevoProyecto}, 
      {new: true}
    )

    res.json({proyecto})

  } catch (error) {
    console.log(error);
    res.status(500).send("Error en el servidor")
  }
}

exports.eliminarProyecto = async (req, res) => {

  try {
    //revisa el ID await siempre que se consulte a la DB
    //console.log(req.params.id);
    let proyecto = await  Proyecto.findById(req.params.id)

    //Revisa si el proyecto existe o no
    if(!proyecto) {
      return res.status(404).json({msg: "Proyecto no encontrado"})
    }

    //Verifica el creador del proyecto 
    if(proyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({msg: "No Autorizado"})
    }

    //Eliminar el proyecto
    await Proyecto.findOneAndRemove({ _id: req.params.id})
    res.json({ msg: "Proyecto eliminado" })
    
  } catch (error) {
    console.log(error);
    res.status(500).send("Error en el servidor")
  }
}