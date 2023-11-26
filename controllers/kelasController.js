const Kelas = require('../models/Kelas')
const Anggota = require('../models/Anggota')



//all role
module.exports.allKelasGet = async (req, res) => {

    try {
        const kelas = await Kelas.getAllKelas();
        res.status(201).json({ kelas })
    }
    catch (err) {
        // TODO jika login gagal, lakukan handling error, kembalikan error ke depan, ubah status menjadi 400
        res.status(400).json({"message" : "gagal mendapatkan kelas"});
    }
}


//perlu cek role isAdmin
module.exports.addNewKelas = async (req, res) => {
    var { namaKelas, instruktur, durasi, detail, tanggal } = req.body;

    //syarat buat nambah kelas baru
    if (namaKelas === undefined) { return res.status(300).json({ "message": "masukkan nama kelas" }); }
    if (instruktur === undefined) { return res.status(300).json({ "message": "masukkan nama instruktur" }); }
    if (durasi === undefined) { return res.status(300).json({ "message": "masukkan durasi kelas" }) }
    if (tanggal === undefined) { return res.status(300).json({ "message": "masukkan tanggal kelas" }) }
    if (durasi === undefined) { durasi = "" }

    if (new Date(tanggal) > new Date()) {
        try {
            const new_kelas = await Kelas.create({ namaKelas, instruktur, durasi, detail, tanggal });
            if (new_kelas) {
                res.status(201).json({
                    "message": "create Kelas succes",
                    new_kelas
                })
            } else {
                res.status(300).json({
                    "message": "failed to create Kelas"
                })
            }
        } catch (err) {
            res.status(400).json({ "error": err.message });
        }
    } else {
        res.status(400).json({
            "message": "Tidak dapat membuat kelas dengan waktu yang telah terlewat"
        })
    }
}

module.exports.removeKelas = async (req, res) => {
    const kelas_id = req.params.kelas_id;

    kelas_akan_dihapus = await Kelas.findOne(
        { _id: kelas_id }
    )
    
    try{
        if (!kelas_akan_dihapus) {
            res.status(300).json({ "message": "kelas tidak tersedia" });
        } else {
            try{
                await Kelas.deleteOne(
                { _id: kelas_id }
                )   
            }catch(error){
                res.status(402).json({"message" : "tidak dapat menghapus"})
            }
            //update atribut kumpulanKelas di anggota
            try{
                Anggota.updateMany(
                    {},
                    { $pull: { "kumpulanKelas": kelas_id } });
            }catch(error){
                res.status(403).json({"message" : "gagal menghapus di bagian anggota"})
            }
    
            try{
                kelas_terhapus = await Kelas.findOne(
                    { _id: kelas_id }
                )
            }catch(error){
                res.status(410).json({"message" : "kelas masih belum terhapus"})
            }
    
            if (!kelas_terhapus) {
                res.status(201).json({ "message": "berhasil menghapus kelas", "kelas": kelas_akan_dihapus });
            }
    }
    }catch(error){
        res.status(401).json({"message" : "terdapat error"});
    }


}

module.exports.updateKelas = async (req, res) => {
    var { kelas_id, namaKelas, instruktur, durasi, detail, tanggal } = req.body;
    //req body harus lengkap
    try {

        const kelas_lama = await Kelas.findOne({ "_id": kelas_id });
        //syarat buat update kelas
        if (kelas_id === undefined) { return res.status(400).json({ "message": "Silakan masukkan id kelas" }) };
        if (namaKelas === undefined) { namaKelas = kelas_lama.namaKelas };
        if (instruktur === undefined) { instruktur = kelas_lama.instruktur };
        if (durasi === undefined) { durasi = kelas_lama.durasi };
        if (detail === undefined) { detail = kelas_lama.detail };
        if (tanggal === undefined) { tanggal = kelas_lama.tanggal };
        console.log(kelas_lama);
        if (kelas_lama) {
            try {
                await Kelas.findOneAndUpdate(
                    { "_id": kelas_id },
                    { $set: { "namaKelas": namaKelas, "instruktur": instruktur, "durasi": durasi, "detail": detail, "tanggal": new Date(tanggal) } }
                );
                kelas_baru = await Kelas.find(
                    { "_id": kelas_id }
                );
                res.status(201).json({ "message": "berhasil mengupdate kelas", "kelas": kelas_baru })
            } catch (err) {
                res.status(209).json({ "message": "gagal mengupdate kelas" });
            }
        } else {
            res.status(210).json({ "message": "id kelas salah" });
        }
    } catch (err) {
        res.status(400).json({ "message": "id kelas salah" });
    }
}
module.exports.mendaftarKelas = async (req, res) => {
    const kelas_id = req.body._id;
    if (kelas_id) {
        console.log(res.locals);
        const _id = res.locals.role._id;
        try {
            const anggota = await Anggota.findOne({ _id: _id });
            const kelas = await Kelas.findOne({ _id: kelas_id });
            if (anggota.statusKeanggotaan) { //cek apakah status kenaggotaan aktif
                if (kelas.tanggal > new Date()) { //cek apakah kelasnya sudah atau belum dilaksanakan
                    if (anggota.kumpulanKelas.length == 0 || (!anggota.kumpulanKelas.some(id => id.equals(kelas_id)))) { //cek apakah anggota sudah terdaftar
                        await Anggota.findOneAndUpdate(
                            { "_id": _id }, // Kriteria untuk mencari dokumen yang ingin diubah
                            { $push: { "kumpulanKelas": kelas._id } } // Perintah untuk menambahkan kelas ke dalam array kumpulanKelas
                        );
                        res.status(201).json({ "message": "berhasil menambah kelas", "kelas": kelas });
                    } else {
                        res.status(209).json({ "message": "Anda telah terdaftar" });
                    }
                }
                else {
                    res.status(210).json({ "message": "kelas telah usai" });
                }
            } else {
                res.status(211).json({ "message": "Silakan melakukan pembayaran keanggotaan" });
            }
        } catch (err) {
            res.status(400).json(err.message);
        }
    }
}

module.exports.menghapusKelas = async (req, res) => {
    const kelas_id = req.body._id;
    if (kelas_id) {
        const _id = res.locals.role._id;
        try {
            const anggota = await Anggota.findOne({ _id: { $gte: _id } });
            const kelas = await Kelas.findOne({ _id: { $gte: kelas_id } });
            if (anggota.statusKeanggotaan) { //cek apakah status keanggotaan aktif
                if (new Date(kelas.tanggal) > new Date()) { //cek apakah kelasnya sudah atau belum dilaksanakan
                    if (anggota.kumpulanKelas.length != 0 || anggota.kumpulanKelas.some(id => { if (id.equals(kelas._id)) { return true; } })) { //cek apakah anggota sudah terdaftar
                        await Anggota.updateOne(
                            { "_id": _id }, // Kriteria untuk mencari dokumen yang ingin diubah
                            { $pull: { "kumpulanKelas": kelas._id } } // Perintah untuk menghapus kelas dari array kumpulanKelas
                        );
                        res.status(201).json({ "message": `Anda berhasil menghapus kelas ${kelas.namaKelas} dari daftar anda` });
                    } else {
                        res.status(400).json({ "message": "Anda belum mendaftar kelas ini" });
                    }
                }
                else {
                    res.status(400).json({ "message": "kelas telah usai" });
                }
            } else {
                res.status(428).json({ "message": "Silakan melakukan pembayaran keanggotaan" });
            }
        } catch (err) {
            res.status(400).json(err.message);
        }
    }
}
//anggota
module.exports.getKelasByAnggotaTerdaftar = async (req, res) => {
    const _id = res.locals.role._id;
    const arrayId = [];
    const kelas = [];
    try {
        const anggota = await Anggota.findOne({ _id: { $gte: _id } });
        console.log(anggota.kumpulanKelas);
        anggota.kumpulanKelas.forEach((id) => {
            arrayId.push(id.toHexString());
        }
        )
        for (id of arrayId) {
            kelas.push(await Kelas.findOne({ _id: id }))
        }

        res.status(201).json({ kelas });
    }
    catch (err) {
        // TODO jika login gagal, lakukan handling error, kembalikan error ke depan, ubah status menjadi 400
        res.status(400).json(err.message);
    }
}

//all role
module.exports.kelasBelumDilakukan = async (req, res) => {
    const waktu_sekarang = new Date();
    try {
        //Gett array kelas -> filter waktu, terus send hasil filter
        const kelas = await Kelas.getAllKelas();
        kelas_filtered = kelas.filter((elemen) => {
            if (elemen.tanggal > waktu_sekarang) {
                return elemen;
            }
        });
        res.status(201).json({ kelas_filtered })
    }
    catch (err) {
        res.status(400).json(err.message);
    }
}

//tambah dummy data
module.exports.insertAllKelas = async (req, res) => {
    try {
        const foto = "";
        if (req.body.foto) {
            // udah ada foto
            foto = req.body.foto;
        }

        console.log(1);
        allklas = [{
            namaKelas: "yoga",
            instruktur: "yanti",
            durasi: 45,
            detail: "kelas di adakan di ruang 1. silakan datang tepat waktu",
            tanggal: new Date(2023, 11, 18, 10, 0, 0)
        },
        {
            namaKelas: "pilletes",
            instruktur: "yanto",
            durasi: 60,
            detail: "kelas diadakan di ruang 2, jangan lupa makan",
            tanggal: new Date(2023, 11, 19, 12, 0, 0)
        },
        {
            namaKelas: "zumba",
            instruktur: "tuti",
            durasi: 60,
            detail: "kelas diadakan di ruang 1 silakan datang tepat waktu",
            tanggal: new Date(2023, 11, 20, 14, 0, 0)
        },
        {
            namaKelas: "yoga",
            instruktur: "toto",
            durasi: 30,
            detail: "kelas di adakan di ruang 2. jangan sampai telat",
            tanggal: new Date(2023, 11, 20, 16, 0, 0)
        },
        {
            namaKelas: "yoga",
            instruktur: "tuti",
            durasi: 45,
            detail: "kelas di adakan di ruang 2. jangan lupa makan",
            tanggal: new Date(2023, 11, 21, 8, 30, 0)
        },
        {
            namaKelas: "zumba",
            instruktur: "yanti",
            durasi: 30,
            detail: "kelas di adakan di ruang 1. silakan datang tepat waktu",
            tanggal: new Date(2023, 11, 22, 10, 0, 0)
        },
        {
            namaKelas: "pilletes",
            instruktur: "toto",
            durasi: 40,
            detail: "kelas di adakan di ruang 2. silakan datang tepat waktu",
            tanggal: new Date(2023, 23, 11, 0, 0)
        }
        ]
        res.status(201).json("succes create")
    }
    catch (err) {
        // TODO kalau gagal, error handling, dan kirim errr
        console.log(err);
        const errorObj = handleErrors(err);
        res.status(400).json({ error: errorObj });
    }
}

//all role
module.exports.kelasByIdGet = async (req, res) => {
    const _id = req.params;
    try {
        const kelas_found = Kelas.findOne({ _id: { $gte: _id } })
            .then((docs) => {
                res.status(201).json(docs)
            })
            .catch((err) => {
                res.status(400).json({
                    "message": "kelas dengan id tersebut tidak ditemukan"
                })
            });
    }
    catch (err) {
        // TODO jika login gagal, lakukan handling error, kembalikan error ke depan, ubah status menjadi 400
        res.status(400).json(err.message);
    }
}

//admin
// module.exports.addNewKelas = async (req, res) => {
//     const { namaKelas, instruktur, durasi, detail, tanggal } = req.body;
//     if (namaKelas === undefined) { return res.status(300).json({ "message": "masukkan nama kelas" }); }
//     if (instruktur === undefined) { return res.status(300).json({ "message": "masukkan nama instruktur" }); }
//     if (durasi === undefined) { return res.status(300).json({ "message": "masukkan durasi kelas" }) }
//     if (tanggal === undefined) { return res.status(300).json({ "message": "masukkan tanggal kelas" }) }
//     try {
//         const new_kelas = await Kelas.create({ namaKelas, instruktur, durasi, detail, tanggal });
//         if (new_kelas) {
//             res.status(201).json({
//                 "message": "create Kelas succes",
//                 new_kelas
//             })
//         } else {
//             res.status(300).json({
//                 "message": "failed to create Kelas"
//             })
//         }
//     } catch (err) {
//         console.log(err.message);
//         res.status(400).json(err.message)
//     }
// }

