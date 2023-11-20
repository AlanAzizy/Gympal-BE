var express = require('express');
var router = express.Router();
var pembayaranController = require("../controllers/pembayaranController");
const authMiddlewares = require("../middlewares/authMiddlewares");

// ! ROUTES
router.put("/verifyPembayaran/:idAnggota/:idPembayaran", authMiddlewares.adminAuthorization, pembayaranController.verifyPembayaran);
router.put("/unverifyPembayaran/:idAnggota/:idPembayaran", authMiddlewares.adminAuthorization, pembayaranController.unverifyPembayaran);
router.post("/createPembayaran", pembayaranController.createPembayaran);
router.get("/getAllPembayaran", authMiddlewares.adminAuthorization, pembayaranController.getAllPembayaran);

module.exports = router;




