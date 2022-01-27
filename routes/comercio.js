var express = require("express");
var router = express.Router();
var Comercio = require("../modelos/comercio");
var User = require('../modelos/user')
const multer = require("multer");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().getTime() + file.originalname);
  },
});
const upload = multer({
  storage: storage,
});

/* GET comercios listing. */
router.get("/", function (req, res, next) {
  Comercio.find({},{ password: 0, __v: 0}, (err, comercios) => {
    if (res.status == 400) {
      res.send({ mensaje: "error en la petición", res: status, err });
    } else {
      res.send(comercios);
    }
  });
});

//get producto by Id
router.get("/producto/:id", function (req, res, next) {
  const {id} = req.params
  Comercio.findOne({'productos._id':id},{ password: 0, __v: 0}, (err, selected) => {
    if (res.status == 400) {
      res.send({ mensaje: "error en la petición", res: status, err });
    } else {
      res.send(selected);
    }
  });
});
router.get("/promociones", function (req, res, next) {
  const {id} = req.params
  Comercio.find({'productos.isPromo':true},{ password: 0, __v: 0}, (err, selected) => {
    if (res.status == 400) {
      res.send({ mensaje: "error en la petición", res: status, err });
    } else {
      res.send(selected);
    }
  });
});

//add comercio with file
router.post("/crear", upload.single("file_path"), (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      //process request
      const file = req.file;
      let comercio = JSON.parse(req.body.comercio);
      comercio.imagen = `https://api.poomapp.com/uploads/${file.filename}`;
  
      console.log(comercio);
      const crearComercio = new Comercio(comercio);
      crearComercio.save((err, nuevo_Comercio) => {
        if (err) {
          errMsj = err.message;

          res.send(errMsj);
        } else {
          res.send({mensaje:"Comercio guardado con exito"});
        }
      });
    });
  } else {
    res.sendStatus(401);
  }
});
//añadir producto a comercio 
router.post("/producto", upload.single("file_path"), (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      //process request
      const file = req.file;
      const producto = JSON.parse(req.body.producto);
      const comercio = JSON.parse(req.body.comercio);
      producto.imagen = `https://api.poomapp.com/uploads/${file.filename}`;
      console.log(producto);
      comercio.productos.push(producto);
      Comercio.findByIdAndUpdate(comercio._id, { $set: comercio }, { new: true }).select({password: 0, __v: 0 }).exec()
      .then((data) => res.status(200).send({mensaje:"Producto añadido",resp:data}))
      .catch((err) => res.status(400).send(err));
    });
  } else {
    res.sendStatus(401);
  }
});

//actualizar producto en comercio 
router.post("/producto_update", upload.single("file_path"), (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      //process request
      const file = req.file;
      let producto = JSON.parse(req.body.producto);
       let comercio = JSON.parse(req.body.comercio);
       producto.imagen = `https://api.poomapp.com/uploads/${file.filename}`;
       console.log(producto);
       let newArray = [];
      for (let i = 0; i < comercio.productos.length; i++) {
        let el = comercio.productos[i];
        if (el._id == producto._id) {
          newArray.push(producto);
        } else{
          newArray.push(el)
        }
        
      }
      Comercio.findByIdAndUpdate({"_id":comercio._id,"productos._id": producto._id }, { $set:{ "productos" : newArray }}, { new: true }).select({password: 0, __v: 0 }).exec()
      .then((data) => res.status(200).send({mensaje:"Producto actuslizado",resp:data}))
      .catch((err) => res.status(400).send(err));
    });
  } else {
    res.sendStatus(401);
  }
});
//add comercio
router.post("/", (req, res) => { 
  console.log(req.body);
      const crearComercio = new Comercio(req.body);
      crearComercio.save((err, nuevo_Comercio) => {
        if (err) {
          errMsj = err.message;

          res.send(errMsj);
        } else {
          res.send({message:"Comercio guardado con exito"});
        }
      });
  

});
//get comercio by ID
router.get("/:id", (req, res) => {
      //process request
      var id = req.params.id;
      Comercio.findOne({ $or: [{ "promociones.codigo": id }, { _id: id }] },{ password: 0, __v: 0})
        .exec()
        .then((data) => res.status(200).send(data))
        .catch((err) => res.status(400).send(err));
  
});

//Update Comercio
router.put("/:id", (req, res) => {
  const comercioId = req.params.id;
  console.log(comercioId);
  console.log(req.body);

  Comercio.findByIdAndUpdate(comercioId,{ $set: req.body },{ new: true }).select({password: 0, __v: 0 }).exec()
    .then((data) => res.status(200).send({mensaje:"Actualizado",update:data}))
    .catch((err) => res.status(400).send(err));
});

//Update comercio with file
router.put("/file/:id", upload.single("file_path"), (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }

      //process request
      const comercioId = req.params.id;
      const file = req.file;
      console.log(file);

      let comercio = JSON.parse(req.body.comercio);
      comercio.imagen = `https://api.poomapp.com/uploads/${file.filename}`;
 
      console.log(comercio);
      Comercio.findByIdAndUpdate(comercioId,{ $set: comercio }, { new: true }).select({password: 0, __v: 0 }).exec()
        .then((data) => res.status(200).send({mensaje:"comercio actualizado",resp:data}))
        .catch((err) => res.status(400).send(err));
    });
  } else {
    res.sendStatus(401);
  }
});

//delete message
router.delete("/:id", (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      //process request
      const messageId = req.params.id;
      Comercio.findByIdAndDelete(messageId)
        .then((data) => res.status(200).send("comercio borrado"))
        .catch((err) => res.status(400).send(err.message));
    });
  } else {
    res.sendStatus(401);
  }
});

router.post("/login", function(req, res, next) {
  
  const comercio = req.body;

  Comercio.findOne({telefono:comercio.telefono}, (err, response) => {

    if (res.status == 400) {
      res.send({ mensaje: "error in get request", res: err });
    } else {
      if (response) {
        console.log(comercio.password, response.password);
          bcrypt.compare(comercio.password, response.password, function(err, result) {
            console.log(result,err);
          if (result) {
            Comercio.findOne({telefono:comercio.telefono},{ password: 0, __v: 0}, (err, userFilter) => {
                // generar token
              const accessToken = jwt.sign({ user: userFilter.telefono,  role:response.role }, process.env.TOKEN_SECRET,{ expiresIn: '86400s' });
              res.send({ mensaje: "Success", token:accessToken, data: userFilter});
            })
          
          } else{
            res.send({ mensaje: "credenciales incorrectas 2", result: result});
          }
         
      });
   
      } else{
        res.send({ data: "credenciales incorrectas 1" }); 
      }

    }
  });
});

router.put("/password/:id", (req, res) => {
  const comercioId = req.params.id;
  const comercio = req.body;
  bcrypt.hash(comercio.password, saltRounds, function(err, hash) {
   comercio.password = hash;
   console.log(commercio);
   User.findByIdAndUpdate(comercioId, { $set: comercio }, { new: true })
   .then(() => res.status(200).send({mensaje:'Contrasena cambiada con exito'}))
   .catch(err => res.status(400).send(err));
});

});


/* Veryfi comercio. */
router.post("/verify/", function(req, res, next) {
  const user = req.body;
  Comercio.findOne({ telefono: `507${user.telefono}`},{ password: 0, __v: 0}, (err, data) => {
    if (res.status == 400) {
      res.send({ mensaje: "error in get request", res: err });
    } else {
      if(data){
              res.send({ mensaje: "usuario existe", user: data });
} else{
                res.send({ mensaje: "usuario no existe"});
}

    }
  });
});

// router.get("/updatePasswords/:id", (req, res) => {
//   Comercio.find({}, (err, users) => {
//     console.log(err);
//     if (res.status == 400) {
//       res.send({ mensaje: "error in get request", res: err });
//     } else {
//     users.forEach(item =>{
//       bcrypt.hash(item.password, saltRounds, function(err, hash) {
//         item.password = hash;
//         console.log(item.password);
//         Comercio.findByIdAndUpdate(item._id, { $set: item }, { new: true })
//         .then(() => console.log('Contrasena cambiada con exito'))
//         .catch(err => res.status(400).send(err));
//      });
//     })
//     }
//   });
// })

module.exports = router;
