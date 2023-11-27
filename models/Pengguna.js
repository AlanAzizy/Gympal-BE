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

// TODO bikin static function untuk login
PenggunaSchema.statics.login = async function (email, password) {
    const user = await this.findOne({ email: email });
    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            return user;
        }
        else {
            throw new Error("incorrect password");

        }
    } else {
        throw new Error("email not found");
    }
}


PenggunaSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});





const Pengguna = mongoose.model("Pengguna", PenggunaSchema);
module.exports = Pengguna;