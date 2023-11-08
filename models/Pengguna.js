const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");


const PenggunaSchema = new mongoose.Schema({
    nama: {
        type: String,
        required: [true, "Please enter your first name"]
    },
    email: {
        type: String,
        required: [true, "please enter your email"],
        unique: true,
        validate: [validator.isEmail, "Please enter valid email"]
    },
    password: {
        type: String,
        required: [true, "please enter password"],
        minlength: [6, "minimum password length is 6"]
    },
    role: {
        type: String,
        required: true,
    },
    roleId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
})



const Pengguna = mongoose.model("Pengguna", PenggunaSchema);
module.exports = Pengguna;