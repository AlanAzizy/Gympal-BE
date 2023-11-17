var express = require('express');
var router = express.Router();
const kelasController = require("../controllers/kelasController");

router.put("/mendaftarKelas",kelasController.mendaftarKelas);
router.put("/menghapusKelas",kelasController.menghapusKelas);
module.exports = router;
