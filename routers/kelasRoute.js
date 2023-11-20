var express = require('express');
var router = express.Router();
const kelasController = require("../controllers/kelasController");




// ! TO CONTROLLER
router.put("/updateKelas", kelasController.updateKelas);
router.post("/addNewKelas", kelasController.addNewKelas);
router.delete("/removeKelas", kelasController.removeKelas);

module.exports = router;