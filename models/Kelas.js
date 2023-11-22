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


KelasSchema.statics.getAllKelas = async function () {
    const kelasAll = await this.find();
    if (kelasAll) {
        return kelasAll;
    } else {
        throw new Error("kelas not found");
    }
}

const Kelas = mongoose.model("Kelas", KelasSchema);
module.exports = Kelas;