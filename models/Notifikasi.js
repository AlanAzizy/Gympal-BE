const mongoose = require("mongoose");

const NotifikasiSchema = new mongoose.Schema({
    tanggalNotifikasi: {
        type: Date,
        required: true
    },
    detailNotifikasi: {
        type: String,
        required: true
    },
    visibility: {
        type: Boolean,
        required: true,
        default: true
    }
})

const Notifikasi = mongoose.model("Notifikasi", NotifikasiSchema);
module.exports = Notifikasi;