const Usuario = require("../Models/Usuario")
const bcryptjs =  require("bcryptjs")
const { validationResult } = require("express-validator")
const jwt = require("jsonwebtoken")


exports.crearUsuario = async (req, res) => {

  const errores = validationResult(req);
  if(!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() })
  }

  const { email, password } = req.body

  try {
    //se valida si el usuario existe o no
    let usuario = await Usuario.findOne({ email })
    if(usuario) {
      return res.status(400).json({msg: "El Usuario ya existe"})
    }
    //crea usuario nuevo con el modelo(schema)
    usuario = new Usuario(req.body)
    
    //se hashea el password y se guarda
    const salt = await bcryptjs.genSalt(10)
    usuario.password = await bcryptjs.hash(password, salt)

    await usuario.save()
    //crear y firmar el json web token
    const payload= {
      usuario: {
        id: usuario.id
      }
    }

    jwt.sign(payload, process.env.SECRETA, {
      expiresIn: 3600
    }, (error, token) => {
      if(error) throw error;
      res.json({ token: token})
    })
    //res.json("Usuario creado correctamente")

  } catch (error) {
    console.log(error)
    res.status(400).json({msg :"Hubo un error"})
  }
}