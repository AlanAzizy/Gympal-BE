const Kelas = require('../models/Kelas')
const Anggota = require('../models/Anggota')

module.exports.allKelasGet = async (req, res) => {

    try {
        const kelas = await Kelas.getAllKelas();
        res.status(201).json({kelas})
    }
    catch (err) {
        // TODO jika login gagal, lakukan handling error, kembalikan error ke depan, ubah status menjadi 400
        const errorObj = handleErrors(err);
        res.status(400).json({ error: errorObj });
    }
}

module.exports.mendaftarKelas = async (req,res) => {
    const kelas_id = req.body._id;
    if (kelas_id){
        const _id = res.locals.role._id.toHexString();
        try{
            const anggota = await Anggota.findOne({_id: _id });
            const kelas = await Kelas.findOne({ _id:kelas_id } );
            if (anggota.statusKeanggotaan){ //cek apakah status kenaggotaan aktif
                if (kelas.tanggal  > new Date()){ //cek apakah kelasnya sudah atau belum dilaksanakan
                    console.log(anggota.kumpulanKelas);
                    if (anggota.kumpulanKelas.length==0 || anggota.kumpulanKelas.some(id => { if (id.equals(kelas._id)){return false;} })){ //cek apakah anggota sudah terdaftar
                        await Anggota.findOneAndUpdate(
                            { "_id": _id }, // Kriteria untuk mencari dokumen yang ingin diubah
                            { $push: { "kumpulanKelas": kelas._id } } // Perintah untuk menambahkan kelas ke dalam array kumpulanKelas
                          );
                          res.status(201).json({"message" : "berhasil menambah kelas", "kelas" : kelas});
                    }else{
                          res.status(400).json({"message" : "Anda telah terdaftar"});
                    }
                }
                else{
                    res.status(400).json({"message" : "kelas telah usai"});
                }
            }else{
                res.status(428).json({"message" : "Silakan melakukan pembayaran keanggotaan"});
            }
        }catch(err){
            res.status(400).json(err.message);
        }
    }
}

module.exports.menghapusKelas = async (req,res) => {
    const kelas_id = req.body._id;
    if (kelas_id){
        const _id = res.locals.role._id;
        try{
            const anggota = await Anggota.findOne({_id: {$gte:_id} });
            const kelas = await Kelas.findOne({_id: {$gte:kelas_id} });
            if (anggota.statusKeanggotaan){ //cek apakah status keanggotaan aktif
                if (new Date(kelas.tanggal)  > new Date()){ //cek apakah kelasnya sudah atau belum dilaksanakan
                    if (anggota.kumpulanKelas.length!=0 || anggota.kumpulanKelas.some(id => {if (id.equals(kelas._id)){return true;} })){ //cek apakah anggota sudah terdaftar
                        await Anggota.updateOne(
                            { "_id": _id }, // Kriteria untuk mencari dokumen yang ingin diubah
                            { $pull: { "kumpulanKelas": kelas._id } } // Perintah untuk menghapus kelas dari array kumpulanKelas
                          );
                          res.status(201).json({"message" : `Anda berhasil menghapus kelas ${kelas.namaKelas} dari daftar anda`});
                    }else{
                          res.status(400).json({"message" : "Anda belum mendaftar kelas ini"});
                    }
                }
                else{
                    res.status(400).json({"message" : "kelas telah usai"});
                }
            }else{
                res.status(428).json({"message" : "Silakan melakukan pembayaran keanggotaan"});
            }
        }catch(err){
            res.status(400).json(err.message);
        }
    }
}
