const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const AnggotaSchema = new mongoose.Schema({
    noTelepon: {
        type: String,
        required: [true, "please enter your phone number"]
    },
    alamat: {
        type: String,
        required: [true, "please enter your address"]
    },
    statusKeanggotaan: {
        type: Boolean,
        default: false,
        required: true
    },
    foto: {
        type: String,
        required: false
    },
    expdate:{
        type:Date,
        default : new Date(),
        required : true 
    },
    kumpulanNotifikasi: [{ type: mongoose.Schema.Types.ObjectId, ref: "Notifikasi" }],
    kumpulanKelas: [{ type: mongoose.Schema.Types.ObjectId, ref: "Kelas" }],
    kumpulanPembayaran: [{ type: mongoose.Schema.Types.ObjectId, ref: "Pembayaran" }]
})

AnggotaSchema.statics.getAllAnggota = async function () {
    const anggotaAll = await this.find();
    if (anggotaAll) {
        return anggotaAll;
    } else {
        throw new Error("anggota not found");
    }
}

const Anggota = mongoose.model("Anggota", AnggotaSchema);
module.exports = Anggota;