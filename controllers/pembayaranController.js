const Anggota = require("../models/Anggota");
const Pembayaran = require("../models/Pembayaran");
const Pengguna = require("../models/Pengguna");

// ! REALISASI
module.exports.verifyPembayaran = async (req, res) => {
    // TODO ambil idAnggota dari parameter
    const idAnggota = req.params.idAnggota;
    try {
        // TODO cari anggota dengan id yang bersesuaian
        const anggota = await Anggota.findOne({ _id: idAnggota });
        // TODO ambil atribut arraynya
        const pembayaranAnggota = anggota.kumpulanPembayaran;
        // TODO ambil idPembayaran dari paramater
        const idPembayaran = req.params.idPembayaran;
        // TODO cek apakah idPembayaran ada di dalam arranya
        var found = false
        pembayaranAnggota.forEach((element) => {
            if (element == idPembayaran) {
                found = true;
            }
        })
        if (found) {
            // TODO jika terdapat di dalam array, lakukan pencarian terhadap idPembayaran di collection pembayaran kemudian set statusPembayaran menjadi true 
            const pembayaran = await Pembayaran.findOneAndUpdate({ _id: idPembayaran }, { statusPembayaran: true }, { new: true });
            const currentDate = new Date();
            const inputDate = new Date();
            inputDate.setDate(currentDate.getDate() + (pembayaran.bulan * 30));
            const ang = await Anggota.findOneAndUpdate({ _id: idAnggota }, { expdate: inputDate });
            res.status(200).json({ message: "Data updated sucessfully" });
        }
        else {
            // TODO jika tidak terdapat di dalam array, kembalikan 404 (pembayaran not found)
            res.status(404).json({ message: "pembayaran not found" });
        }
    } catch (err) {
        res.status(400).json({ error: err })
    }
}

module.exports.unverifyPembayaran = async (req, res) => {
    // TODO ambil idAnggota dari parameter
    idAnggota = req.params.idAnggota;
    try {
        // TODO cari anggota dengan id yang bersesuaian
        const anggota = await Anggota.findOne({ _id: idAnggota });
        // TODO ambil atribut arraynya
        const pembayaranAnggota = anggota.kumpulanPembayaran;
        // TODO ambil idPembayaran dari paramater
        idPembayaran = req.params.idPembayaran;
        // TODO cek apakah idPembayaran ada di dalam arranya
        var found = false
        pembayaranAnggota.forEach((element) => {
            if (element == idPembayaran) {
                found = true;
            }
        })
        if (found) {
            // TODO jika terdapat di dalam array, lakukan pencarian terhadap idPembayaran di collection pembayaran kemudian set statusPembayaran menjadi true 
            const pembayaran = await Pembayaran.findOneAndUpdate({ _id: idPembayaran }, { statusPembayaran: false });
            res.status(200).json({ message: "Data updated sucessfully" });
        }
        else {
            // TODO jika tidak terdapat di dalam array, kembalikan 404 (pembayaran not found)
            res.status(404).json({ message: "pembayaran not found" });
        }
    } catch (err) {
        res.status(400).json({ error: err })
    }
}

module.exports.createPembayaran = async (req, res) => {
    // TODO ambil data currentAnggota terlebih dahulu dari res.local.role
    const currentAnggota = res.locals.role;
    // TODO cek apakah res.local.rolenya null atau tidak
    if (currentAnggota) {
        // TODO jika tidak null (berarti dia anggota), ambil roleIdnya (currentAnggota._id),  bikin record baru dalam collection pembayaran, ambil idPembayaran dari recordnya, kemudian push ke kumpulanPembayaran dari anggotanya (anggota dengan _id nya adalah idRole)
        roleId = currentAnggota._id;
        // TODO ambil dulu si datanya dari req.body
        const { metode, buktiPembayaran, bulan } = req.body;
        try {
            newPembayaran = await Pembayaran.create({
                idAnggota: roleId,
                metode: metode,
                statusPembayaran: false,
                tanggalPembayaran: new Date(),
                buktiPembayaran: buktiPembayaran,
                bulan: bulan
            })
            newIdPembayaran = newPembayaran._id;
            const result = await Anggota.updateOne({ _id: roleId }, { $push: { kumpulanPembayaran: newIdPembayaran } });
            res.status(200).json({ result: result });

        }
        catch (err) {
            res.status(400).json({ error: err });
        }
    }
    else {
        // TODO jika null (berarti dia admin), keluarkan pesan bahwa hanya anggota yang dapat create pembayaran
        res.status(401).json({ message: "Hanya anggota yang dapat create pembayaran" })
    }

}

const getNama = async function (idAnggota) {
    // cari pengguna dengan roleId nya adalah idAnggota
    const pengguna = await Pengguna.findOne({ roleId: idAnggota });
    // simpen si penggunanya
    // kembalikan pengguna.nama
    console.log(pengguna);
    return pengguna.nama;
}
module.exports.getAllPembayaran = async (req, res) => {
    try {
        // TODO ambil keseluruhan data dari pembayaran menggunakan findmany dengan nol filter
        const payments = await Pembayaran.find({});
        const allPaymnets = await Promise.all(payments.map(async (el) => {
            const x = {
                nama: await getNama(el.idAnggota),
                metode: el.metode,
                statusPembayaran: el.statusPembayaran,
                tanggalPembayaran: el.tanggalPembayaran,
                buktiPembayaran: el.buktiPembayaran,
                idAnggota: el.idAnggota,
                idPembayaran: el._id
            }
            return x;
        }))
        // TODO kembalikan sebagai json dan set status 200
        res.status(200).json({ data: allPaymnets });
    }
    catch (err) {
        res.status(400).json(err.message);
    }
}