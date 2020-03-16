var express = require("express");
var router = express.Router();
var Ticket = require("../modelos/ticket");


/* GET ticket listing. */
router.get("/", function(req, res, next) {
  Ticket.find({}, (err, tests) => {
    if (res.status == 400) {
      res.send({ mensaje: "error en la petición", res:err });
    } else {
      res.send(tests);
    }
  });
});




//add test
router.post("/", (req, res) => {
  const newTicket = req.body;
     const crearTest = new Ticket(newTicket);
    crearTest.save((err, newTest) => {
      if (err) {
        errMsj = err.message;
  
        res.send(errMsj);
      } else {
        res.send(newTest);
      }
    });
  
});
//get ticket by ID
router.get("/:id", (req, res) => {
  var ticketId = req.params.id;
  Ticket.findById(ticketId)
    .exec()
    .then(data => res.status(200).send(data))
    .catch(err => res.status(400).send(err));
});

//Update ticket
router.put("/:id", (req, res) => {
  const ticketId = req.params.id;
  console.log(ticketId);

  Ticket.findByIdAndUpdate(ticketId, { $set: req.body }, { new: true })
    .then(data => res.status(200).send("Actualizado"))
    .catch(err => res.status(400).send(err));
});


//delete ticket
router.delete("/:id", (req, res) => {
  const ticketId = req.params.id;
  Ticket.findByIdAndDelete(ticketId)
    .then(data => res.status(200).send("Ticket borrado"))
    .catch(err => res.status(400).send(err.message));
});


module.exports = router;
