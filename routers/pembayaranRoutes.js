var express = require('express');
var router = express.Router();
var pembayaranController = require("../controllers/pembayaranController");

// ! ROUTES
router.put("/verifyPembayaran/:idAnggota/:idPembayaran", pembayaranController.verifyPembayaran);
router.put("/unverifyPembayaran/:idAnggota/:idPembayaran", pembayaranController.unverifyPembayaran);
router.post("/createPembayaran", pembayaranController.createPembayaran);

module.exports = router;


