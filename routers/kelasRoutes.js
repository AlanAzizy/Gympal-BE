var express = require('express');
var router = express.Router();
const kelasController = require("../controllers/kelasController");


router.put("/mendaftarKelas",kelasController.mendaftarKelas);
router.put("/menghapusKelas",kelasController.menghapusKelas);
router.get("/allKelas", kelasController.allKelasGet);
router.get("/kelasBelumDilakukan", kelasController.kelasBelumDilakukan)
router.get("/kelasTerdaftar",kelasController.getKelasByAnggotaTerdaftar)
// router.post("/insertAllKelas", kelasController.insertAllKelas);
router.get("/kelasById/:_id", kelasController.kelasByIdGet);
router.post("/addNewKelas", kelasController.addNewKelas);
module.exports = router;
