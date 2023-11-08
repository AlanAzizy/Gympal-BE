const jwt = require("jsonwebtoken");
const Anggota = require("../models/Anggota");
const Pengguna = require("../models/Pengguna");


// ! MEMBUAT JWT
const maxAge = 1 * 24 * 60 * 60;
const createToken = (idPengguna, idRole, role) => {
    return jwt.sign({ idPengguna, idRole, role: role }, "9cdef41de4e4016adb9d8bascbsaocjbasovbaowq9071291179", { expiresIn: maxAge });
}


// ! ERROR HANDILNG
const handleErrors = (err) => {
    const errorObj = {
        nama: "",
        email: "",
        password: "",
        noTelepon: "",
        alamat: ""
    }
    console.log(err);
    if (err.code === 11000) {
        errorObj.email = 'that email is already registered';
        return errorObj;
    }
    if (err.message === "incorrect password") {
        errorObj.password = "incorrect password";
    }
    if (err.message === "email not found") {
        errorObj.email = "email not found";
    }
    if (err.message.includes("user validation failed")) {
        Object.values(err.errors).forEach(({ properties }) => {
            errorObj[properties.path] = properties.message;
        })
    }

    return errorObj;
}




// ! REALISASI
module.exports.signUpGet = (req, res) => {
    // Mengambalikan halaman signup
}

module.exports.signUpPost = async (req, res) => {
    try {
        const { noTelepon, alamat } = req.body;
        const foto = "";
        if (req.body.foto) {
            // udah ada foto
            foto = req.body.foto;
        }
        const anggota = await Anggota.create({ noTelepon, alamat, statusKeanggotaan: false, foto });
        // TODO kalau berhasil, bikin jwt, masukin cookies, kembalikan object user sebagai penanda keberhasilan
        const { nama, email, password } = req.body;
        const user = await Pengguna.create({ nama, email, password, role: "anggota", roleId: anggota._id });
        const token = createToken(user._id, anggota._id, "anggota");
        const cookieConfig = { httpOnly: true, maxAge: maxAge * 1000 };
        res.cookie("jwt", token, cookieConfig);
        res.status(201).json({ anggota: anggota });
    }
    catch (err) {
        // TODO kalau gagal, error handling, dan kirim errr
        console.log(err);
        const errorObj = handleErrors(err);
        res.status(400).json({ error: errorObj });
    }

}

module.exports.loginGet = (req, res) => {
    // Kembalikan halaman login
}

module.exports.loginPost = async (req, res) => {
    // TODO ambil dulu masukan email dan password
    const { email, password } = req.body;
    try {
        // TODO panggil fungsi login pada model User
        const pengguna = await Pengguna.login(email, password);

        // TODO cek apakah penggunna merupakan admin atau anggota
        if (pengguna.role == "admin") {
            // TODO jika pengguna merupakan admin, bikin jwt untuk admin
            // TODO jika login berhasil, buat jwt, masukkan cookies, kembalikan kembalian user untuk menandai pada view, ubah status menjadi 201 (try)
            const token = createToken(pengguna._id, pengguna.roleId, "admin");
            const cookieConfig = { httpOnly: true, maxAge: maxAge * 1000 };
            res.cookie("jwt", token, cookieConfig);
            res.status(201).json({ pengguna: pengguna });

        }
        else if (pengguna.role == "anggota") {
            // TODO jika pengguna meupakan anggota, tambahkan jwt untuk anggota
            // TODO jika pengguna merupakan admin, bikin jwt untuk admin
            // TODO jika login berhasil, buat jwt, masukkan cookies, kembalikan kembalian user untuk menandai pada view, ubah status menjadi 201 (try)
            const token = createToken(pengguna._id, pengguna.roleId, "anggota");
            const cookieConfig = { httpOnly: true, maxAge: maxAge * 1000 };
            res.cookie("jwt", token, cookieConfig);
            res.status(201).json({ pengguna: pengguna });

        }
    }
    catch (err) {
        // TODO jika login gagal, lakukan handling error, kembalikan error ke depan, ubah status menjadi 400
        const errorObj = handleErrors(err);
        res.status(400).json({ error: errorObj });
    }
}

module.exports.logoutGet = (req, res) => {
    // TODO hapus dulu cookienya
    res.clearCookie("jwt");
    // TODO redirect ke home
    res.redirect("/");
}
