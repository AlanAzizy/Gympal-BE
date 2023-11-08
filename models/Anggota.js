const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const AnggotaSchema = new mongoose.Schema({
    noTelepon: {
        type: String,
        required: true
    },
    alamat: {
        type: String,
        required: true
    },
    statusKanggotaan: {
        type: Boolean,
        default: false,
        required: true
    },
    foto: {
        type: String,
        required: false
    },
    kumpulanNotifikasi: [{ type: mongoose.Schema.Types.ObjectId, ref: "Notifikasi" }],
    kumpulanKelas: [{ type: mongoose.Schema.Types.ObjectId, ref: "Kelas" }],
    kumpulanPembayaran: [{ type: mongoose.Schema.Types.ObjectId, ref: "Pembayaran" }]
})

const Anggota = mongoose.model("Anggota", AnggotaSchema);
module.exports = Anggota;