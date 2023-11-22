const jwt = require("jsonwebtoken");
const Pengguna = require("../models/Pengguna");
const Anggota = require("../models/Anggota");

// auth check
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
                    res.status(401).json({ message: "not authenticated" });
                }
            } else {
                // TODO kalo tidak terverifikasi, balikin ke login
                res.status(401).json({ message: "not authenticated" });
            }
        })

    }
    else {
        // TODO kalo tidak ada, balikin ke login
        res.status(401).json({ message: "not authenticated" });
    }
}

module.exports.adminAuthorization = (req, res, next) => {
    // TODO ambil dulu tokennya, dan lakukan decode terhadap tokennya
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, "9cdef41de4e4016adb9d8bascbsaocjbasovbaowq9071291179", async (err, decodedToken) => {
            // TODO ambil id penggunanya
            const id = decodedToken.idPengguna;
            // TODO cek apakah id tersebut terdapat di database
            const found = await Pengguna.findOne({ _id: id });
            if (found) {
                // TODO jika id tersebut terdapat di database, cek apakah dia merupakan admin
                const role = found.role;
                if (role == "admin") {
                    // TODO jika rolenya admin, next
                    next();
                }
                else {
                    // TODO jika rolenya bukan admin, kembalikan not authorized (status 401)
                    res.status(401).json({ message: "not authorized" });
                }

            }
            else {
                // TODO jika admin tidak ditemukan kembalikan not authenticated (status 401)
                res.status(401).json({ message: "not authenticated" });
            }
        })
    }
    else {
        res.status(401).json({ message: "not authenticated" });
    }
}

