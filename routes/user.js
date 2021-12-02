var express = require("express");
var router = express.Router();
var User = require("../modelos/user");
const multer = require("multer");
const { param } = require("./promo");
const jwt = require('jsonwebtoken');
const axios = require('axios');
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt');
const saltRounds = 10;
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
  bcrypt.hash(newUser.contrasena,saltRounds,function(err,hash){
    newUser.contrasena = hash;
    const createUser = new User(newUser);
    createUser.save((err, new_User) => {
      if (err) {  
        res.send({ mensaje: "error in post request", res: err });
      } else {
        res.send({ mensaje: "User saved"});
      }
    });
  })

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
router.post("/verify/", function(req, res, next) {
  const user = req.body;
  User.findOne({ telefono: user.telefono}, (err, data) => {
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
//Update User
router.put("/:id", (req, res) => {
  const userId = req.params.id;
User.findByIdAndUpdate(userId, { $set: req.body }, { new: true })
  .then(data => res.status(200).send(data))
  .catch(err => res.status(400).send(null));     
  // const authHeader = req.headers.authorization;
  // if (authHeader) {
  //   const token = authHeader.split(' ')[1];
  //   jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
  //     if (err) {
  //         return res.sendStatus(403);
  //     }
  //     if (user.role == "Admin" || user.role == "User") {

   
  //     }


  // });
  // } else {
  //   res.sendStatus(401);
  // }

});

//Update User with file
router.put("/file/:id", upload.single("file_path"), (req, res) => {
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
  const authHeader = req.headers.authorization;
  console.log(authHeader);
  // if (authHeader) {
  //   const token = authHeader.split(' ')[1];
  //   jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
  //     console.log(user);
  //     if (err) {
  //         return res.sendStatus(403);
  //     }
  //     if (user.role == "Admin" || user.role == "User") {

  //     }


  // });
  // } else {
  //   res.sendStatus(401);
  // }

});

router.put("/password/:id", (req, res) => {
  const userId = req.params.id;
  const user = req.body;
  bcrypt.hash(user.contrasena, saltRounds, function(err, hash) {
   user.contrasena = hash;
   User.findByIdAndUpdate(userId, { $set: user }, { new: true })
   .then(() => res.status(200).send({mensaje:'Contrasena cambiada con exito'}))
   .catch(err => res.status(400).send(err));
});

});

router.post("/login/", function(req, res, next) {
  
  const user = req.body;

  User.findOne({telefono:user.telefono,contrasena:user.password}, (err, response) => {
  
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

router.post("/verifyPassword", function(req, res, next) {
  
  const user = req.body;

  User.findOne({telefono:user.telefono}, (err, response) => {

    if (res.status == 400) {
      res.send({ mensaje: "error in get request", res: err });
    } else {
      if (response) {
        bcrypt.compare(user.contrasena, response.contrasena, function(err, result) {
          if (result) {
            // generar token
            const accessToken = jwt.sign({ user: response.telefono,  role:response.role }, process.env.TOKEN_SECRET,{ expiresIn: '86400s' });
            delete response.contrasena
            res.send({ mensaje: "Success", token:accessToken, data: response});
          } else{
            res.send({ mensaje: "credenciales incorrectas", result: result});
          }
         
      });
   
      } else{
        res.send({ data: "credenciales incorrectas" }); 
      }

    }
  });
});

router.get("/updatePasswords/:id", (req, res) => {
  User.find({}, (err, users) => {
    console.log(err);
    if (res.status == 400) {
      res.send({ mensaje: "error in get request", res: err });
    } else {
    users.forEach(item =>{
      bcrypt.hash(item.contrasena, saltRounds, function(err, hash) {
        item.contrasena = hash;
        console.log(item.contrasena);
        User.findByIdAndUpdate(item._id, { $set: item }, { new: true })
        .then(() => console.log('Contrasena cambiada con exito'))
        .catch(err => res.status(400).send(err));
     });
    })
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

//delete User
 router.post("/makePayment", (req, res) => {
  const body = req.body
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
      if (err) {
          return res.sendStatus(403);
      }
      if (user.role == "User") {
//process request
// const options = {
//   Auth: {
//     ApiKey: process.env.ApiKey,
//   },

//   Transactions: [
//     {
//       TransactionType: "sale",
  
//       Amount: body.amount
//     }
//   ],

//   Payment: {
//     BillingCCNumber:body.cardNumber,

//     BillingCCExp: body.expiration,

//     BillingCvv: body.secret,

//     BillingFirstName: body.name,

//     BillingLastName: body.lastname,

//     BillingCCType: "Visa",
//   },
// }
axios
  .post(`${process.env.gatewayUrl}`, {
    Auth: {
      ApiKey: process.env.ApiKey
    },
    Trans: {
      Name: `${body.name} ${body.lastname}`
    },
    Transactions: [
      {
        TransactionType: 'sale',
        paymentMethod: "Creditcard",
        Amount: 0.99
      }
    ],
    Payment: {
      BillingCCNumber: body.cardNumber,
      BillingCCExp: body.expiration,
      BillingCvv: body.secret
    }
  })
  .then(function (response) {
    res.send(response.data);
  })
  .catch(error => {
    res.send(error)
    console.error('[ ERROR ] ', error)
  })
      }


  });
  } else {
    res.sendStatus(401);
  }

});



module.exports = router;
