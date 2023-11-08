const mongoose = require("mongoose");

const PembayaranSchema = new mongoose.Schema({
    idAnggota: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    metode: {
        type: String,
        required: true
    },
    statusPembayaran: {
        type: Boolean,
        required: true
    },
    tanggalPembayaran: {
        type: Date,
        required: true
    },
    buktiPembayaran: {
        type: String,
        required: true
    }
})

const Pembayaran = mongoose.model("Pembayaran", PembayaranSchema);
module.exports = Pembayaran;