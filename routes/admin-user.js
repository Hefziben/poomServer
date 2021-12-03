var express = require("express");
var router = express.Router();
var Admin = require("../modelos/admin-user");
const jwt = require('jsonwebtoken');
require('dotenv').config()
const bcrypt = require('bcrypt');
const saltRounds = 10;

/* GET admins listing. */
router.get("/get", function(req, res, next) {
  Admin.find({}, (err, admins) => {
    if (res.status == 400) {
      res.send({ mensaje: "error en la petición", res: status, err });
    } else {
      res.send(admins);
    }
  });
});



// //add admin with file
// router.post("/cre", (req, res) => {
//   const admin = req.body;
//   const crearAdmin = new Admin(admin);
//   crearAdmin.save((err, nuevo_Admin) => {
//     if (err) {
//       errMsj = err.message;

//       res.send(errMsj);
//     } else {
//       res.send("Admin guardado con exito");
//     }
//   });
// });

router.post("/", (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
      if (err) {
          return res.sendStatus(403);
      }
//process request
if (user.role == "Admin") {
  const admin = req.body; 
  bcrypt.hash(newUser.contrasena,saltRounds,function(err,hash){
    admin.password = hash;
    const crearAdmin = new Admin(admin);
    crearAdmin.save((err, new_User) => {
      if (err) {  
        res.send({ mensaje: "error in post request", res: err });
      } else {
        res.send({ mensaje: "User saved"});
      }
    });
  })
  
}

  });
  } else {
    res.sendStatus(401);
  }

});

//login
router.post("/login/", function(req, res, next) {
  
  const user = req.body;

  Admin.findOne({name:user.name,password:user.password}, (err, response) => {
  
    if (res.status == 400) {
      res.send({ mensaje: "error in get request", res: err });
    } else {
      if (response) {
        // generar token
        const accessToken = jwt.sign({ username: user.name,  role:response.role}, process.env.TOKEN_SECRET,{ expiresIn: '86400s' });

        res.json({
         token:accessToken, data:response
      });
      } else{
        res.send({ data: "credenciales incorrectas" }); 
      }

    }
  });
});

//get admin by ID
router.get("/:id", (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
      if (err) {
          return res.sendStatus(403);
      }
      if (user.role == "Admin") {
        //process request
  var adminId = req.params.id;
  Admin.findById(adminId)
    .exec()
    .then(data => res.status(200).send(data))
    .catch(err => res.status(400).send(err));
      }


  });
  } else {
    res.sendStatus(401);
  }


});

//Update Admin
router.put("/:id", (req, res) => {
  const adminId = req.params.id;
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
      if (err) {
          return res.sendStatus(403);
      }
      if (user.role == "Admin") {
        //process request
Admin.findByIdAndUpdate(adminId, { $set: req.body }, { new: true })
.then(data => res.status(200).send("Actualizado"))
.catch(err => res.status(400).send(err));
      }


  });
  } else {
    res.sendStatus(401);
  }

});

//delete admin
router.delete("/bode/:id", (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
      if (err) {
          return res.sendStatus(403);
      }
      if (user.role == "Admin") {
        //process request
const messageId = req.params.id;
Admin.findByIdAndDelete(messageId)
  .then(data => res.status(200).send("admin borrado"))
  .catch(err => res.status(400).send(err.message));
      }


  });
  } else {
    res.sendStatus(401);
  }

});

router.put("/password/:id", (req, res) => {
  const adminId = req.params.id;
  const admin = req.body;
  bcrypt.hash(admin.password, saltRounds, function(err, hash) {
   admin.password = hash;
   Admin.findByIdAndUpdate(adminId, { $set: admin }, { new: true })
   .then(() => res.status(200).send({mensaje:'Contrasena cambiada con exito'}))
   .catch(err => res.status(400).send(err));
});

});

router.get("/updatePasswords/:id", (req, res) => {
  Admin.find({}, (err, users) => {
    console.log(err);
    if (res.status == 400) {
      res.send({ mensaje: "error in get request", res: err });
    } else {
    users.forEach(item =>{
      bcrypt.hash(item.password, saltRounds, function(err, hash) {
        item.password = hash;
        console.log(item.password);
        Admin.findByIdAndUpdate(item._id, { $set: item }, { new: true })
        .then(() => console.log('Contrasena cambiada con exito'))
        .catch(err => res.status(400).send(err));
     });
    })
    }
  });
  });


module.exports = router;
