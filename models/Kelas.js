const mongoose = require("mongoose");

const KelasSchema = new mongoose.Schema({
    namaKelas: {
        type: String,
        required: true
    },
    instruktur: {
        type: String,
        required: true
    },
    durasi: {
        type: Number,
        required: true
    },
    detail: {
        type: String,
        required: true
    },
    tanggal: {
        type: Date,
        required: true
    }
})

const Kelas = mongoose.model("Kelas", KelasSchema);
module.exports = Kelas;