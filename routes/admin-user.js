var express = require("express");
var router = express.Router();
var Admin = require("../modelos/admin-user");
const jwt = require('jsonwebtoken');
require('dotenv').config()

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
const crearAdmin = new Admin(admin);
crearAdmin.save((err,nuevo_Admin) => {
  if (err) {
    errMsj = err.message;

    res.send(errMsj);
  } else {
    res.send("Admin guardado con exito");
  }
});
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


module.exports = router;
