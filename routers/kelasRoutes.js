var express = require('express');
var router = express.Router();
const kelasController = require("../controllers/kelasController");

router.get("/allKelas", kelasController.allKelasGet);
router.get("/kelasBelumDilakukan", kelasController.kelasBelumDilakukan)
router.get("/kelasTerdaftar",kelasController.getKelasByAnggotaTerdaftar)
// router.post("/insertAllKelas", kelasController.insertAllKelas);
router.post("/kelasById", kelasController.kelasByIdGet);
router.post("/addNewKelas", kelasController.addNewKelas);
module.exports = router;
