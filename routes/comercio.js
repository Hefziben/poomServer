var express = require("express");
var router = express.Router();
var Comercio = require("../modelos/comercio");
const multer = require("multer");
const jwt = require("jsonwebtoken");
require("dotenv").config();

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
  Comercio.find({}, (err, comercios) => {
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
  Comercio.findOne({'productos._id':id}, (err, selected) => {
    if (res.status == 400) {
      res.send({ mensaje: "error en la petición", res: status, err });
    } else {
      res.send(selected);
    }
  });
});
router.get("/promociones", function (req, res, next) {
  const {id} = req.params
  Comercio.find({'productos.isPromo':true}, (err, selected) => {
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
          res.send({mensaje:"Comercio guardado con exito",resp:nuevo_Comercio});
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
      Comercio.findByIdAndUpdate(comercio._id, { $set: comercio }, { new: true })
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
      console.log(newArray);
      Comercio.findByIdAndUpdate({"_id":comercio._id,"productos._id": producto._id }, { $set:{ "productos" : newArray }}, { new: true })
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
          res.send({message:"Comercio guardado con exito",respuesta:nuevo_Comercio});
        }
      });
  

});
//get comercio by ID
router.get("/:id", (req, res) => {
      //process request
      var id = req.params.id;
      Comercio.findOne({ $or: [{ "promociones.codigo": id }, { _id: id }] })
        .exec()
        .then((data) => res.status(200).send(data))
        .catch((err) => res.status(400).send(err));
  
});

//Update Comercio
router.put("/:id", (req, res) => {
  const comercioId = req.params.id;
  console.log(comercioId);

  Comercio.findByIdAndUpdate(comercioId, { $set: req.body }, { new: true })
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
      Comercio.findByIdAndUpdate(comercioId, { $set: comercio }, { new: true })
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

router.post("/login/", function(req, res, next) {
  
  const cliente = req.body;
  Comercio.find({telefono:cliente.telefono}, (err, response) => {
    console.log(response);
    const comercio = response.filter(a => a.telefono == cliente.telefono && a.password == cliente.password);
    console.log(comercio);
    if (res.status == 400) {
      res.send({ mensaje: "error in get request", res: err });
    } else {
      if (comercio) {
      
        // generar token
        const accessToken = jwt.sign({ user: comercio.telefono,  role:comercio.cliente_tipo }, process.env.TOKEN_SECRET,{ expiresIn: '86400s' });

        res.json({
         token:accessToken, data:comercio
      });
      } else{
        res.send({ data: "credenciales incorrectas" }); 
      }

    }
  });
});

module.exports = router;
