const jwt = require("jsonwebtoken");
const Pengguna = require("../models/Pengguna");
const Anggota = require("../models/Anggota");

module.exports.authCheck = (req, res, next) => {
    // TODO ambil token dari cookies
    const token = req.cookies.jwt;
    // TODO cek keberadaan token
    if (token) {
        // TODO  ada jika: 
        // TODO cek verifikasi token
        jwt.verify(token, "9cdef41de4e4016adb9d8bascbsaocjbasovbaowq9071291179", async (err, decodedToken) => {
            if (!err) {
                // TODO jika terferifikasi : 
                // TODO cek apakah dia merupakan admin atau pengguna
                if (decodedToken.role == "admin") {
                    // TODO jika dia merupakan admin, set local pengguna sebagai pengguna dan local role sebagai obj kosong
                    const pengguna = await Pengguna.findOne({ _id: decodedToken.idPengguna });
                    console.log(pengguna);
                    res.locals.pengguna = pengguna;
                    res.locals.role = {};
                    next();
                }
                else {
                    // TODO jika dia merupakan pengguna, set local pengguna sebagai pengguna dan local role sebagai object anggota yang bersangkutan
                    const pengguna = await Pengguna.findOne({ _id: decodedToken.idPengguna });
                    res.locals.pengguna = pengguna;
                    const anggota = await Anggota.findOne({ _id: decodedToken.idRole });
                    res.locals.role = anggota;
                    next();
                }
            }
            else {
                // TODO jika tidak terverifikasi
                // TODO ubah res.locals.user menjadi null kemudian next
                res.locals.pengguna = null;
                res.locals.role = null;
                next();
            }
        })
    }
    else {
        // TODO jika tidak ada : 
        // TODO ubah res.locals.user menjadi null kemudian next
        res.locals.user = null;
        next();
    }
}


module.exports.protectRoute = (req, res, next) => {
    // TODO ambil token dari cookies
    const token = req.cookies.jwt;
    // TODO cek jwtnya ada ato enggak
    if (jwt) {
        //cek apaka masuk
        console.log(jwt)
        // TODO kalo ada, cek apakah terverifikasi
        jwt.verify(token, "9cdef41de4e4016adb9d8bascbsaocjbasovbaowq9071291179", (err, decodedToken) => {
            if (!err) {
                // TODO kalo terverifikasi, cek apakah ada di database atau tidak
                const idPengguna = decodedToken.idPengguna;
                const pengguna = Pengguna.findOne({ _id: idPengguna })
                if (pengguna) {
                    // TODO kalo ada, next
                    next();
                }
                else {
                    // TODo kalo tidak balikin ke login
                    res.redirect("/auth/login")
                }
            } else {
                // TODO kalo tidak terverifikasi, balikin ke login
                res.redirect("/auth/login")
            }
        })

    }
    else {
        // TODO kalo tidak ada, balikin ke login
        res.redirect("/auth/login")
    }
}
