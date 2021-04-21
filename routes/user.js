var express = require("express");
var router = express.Router();
var User = require("../modelos/user");
const multer = require("multer");
const { param } = require("./promo");
const jwt = require('jsonwebtoken');
require('dotenv').config()

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "uploads");
  },
  filename: function(req, file, cb) {
    cb(null, new Date().getTime() + file.originalname);
  }
});
const upload = multer({
  storage: storage
});

/* GET User listing. */
router.get("/", function(req, res, next) {
  User.find({}, (err, user) => {
    if (res.status == 400) {
      res.send({ mensaje: "error in get request", res: err });
    } else {
      res.send({ mensaje: "Success", res: user });
    }
  });
});

//create a new user
router.post("/", (req, res) => {
  const newUser = req.body;
  console.log(newUser);
  const createUser = new User(newUser);
  createUser.save((err, new_User) => {
    if (err) {  
      res.send({ mensaje: "error in post request", res: err });
    } else {
      res.send({ mensaje: "User saved", res: new_User });
    }
  });
});

//get User by ID
router.get("/:id", (req, res) => {
  var userId = req.params.id;
  User.findById(userId)
    .exec()
    .then(data => res.status(200).send(data))
    .catch(err => res.status(400).send(err));
});

/* Veryfi user. */
router.get("/verify/:id", function(req, res, next) {
  const param = req.params.id;
  User.findOne({ $or: [ { telefono: param}, { email: param } ] }, (err, data) => {
    if (res.status == 400) {
      res.send({ mensaje: "error in get request", res: err });
    } else {
      if(data){
              res.send('usario existe');
} else{
                res.send('usario no existe');
}

    }
  });
});
//Update User
router.put("/:id", (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
      if (err) {
          return res.sendStatus(403);
      }
      if (user.role == "Admin" || user.role == "User") {
//process request
const userId = req.params.id;
User.findByIdAndUpdate(userId, { $set: req.body }, { new: true })
  .then(data => res.status(200).send(data))
  .catch(err => res.status(400).send(err));        
      }


  });
  } else {
    res.sendStatus(401);
  }

});

//Update User with file
router.put("/file/:id", upload.single("file_path"), (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
      if (err) {
          return res.sendStatus(403);
      }
      if (user.role == "Admin" || user.role == "User") {
//process request
const userId = req.params.id;
const file = req.file;
const update = {
  imagen: file.path,
};
console.log(update);


User.findByIdAndUpdate(userId, { $set: update }, { new: true })
  .then(data => res.status(200).send({mensaje:"usuario actualizado",url:data.imagen}))
  .catch(err => res.status(400).send(err));
      }


  });
  } else {
    res.sendStatus(401);
  }

});

router.post("/login/", function(req, res, next) {
  
  const user = req.body;

  Usuario.findOne({telefono:user.telefono,contrasena:user.contrasena}, (err, response) => {
  
    if (res.status == 400) {
      res.send({ mensaje: "error in get request", res: err });
    } else {
      if (response) {
        console.log(response);
        // generar token
        const accessToken = jwt.sign({ user: response.telefono,  role:response.role }, process.env.TOKEN_SECRET,{ expiresIn: '86400s' });

        res.json({
         token:accessToken, data:response
      });
      } else{
        res.send({ data: "credenciales incorrectas" }); 
      }

    }
  });
});

//delete User
router.delete("/:id", (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
      if (err) {
          return res.sendStatus(403);
      }
      if (user.role == "Admin") {
//process request
const userId = req.params.id;
User.findByIdAndDelete(userId)
  .then(data => res.status(200).send(data))
  .catch(err => res.status(400).send(err));        
      }


  });
  } else {
    res.sendStatus(401);
  }

});


module.exports = router;