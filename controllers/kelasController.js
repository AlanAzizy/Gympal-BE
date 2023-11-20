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

//perlu cek role isAdmin
module.exports.addNewKelas= async (req,res) => {
    const {namaKelas, instruktur, durasi, detail, tanggal} = req.body;

    //syarat buat nambah kelas baru
    if (namaKelas===undefined){ return res.status(300).json({"message" : "masukkan nama kelas"});}
    if (instruktur===undefined){ return res.status(300).json({"message" : "masukkan nama instruktur"});}
    if (durasi===undefined){ return res.status(300).json({"message" : "masukkan durasi kelas"})}
    if (tanggal===undefined){return  res.status(300).json({"message" : "masukkan tanggal kelas"})}

    if (tanggal > new Date()){
        try {
            const new_kelas = await Kelas.create({namaKelas, instruktur, durasi, detail, tanggal});
            if (new_kelas){
                res.status(201).json({
                    "message" : "create Kelas succes",
                    new_kelas
                })
            }else{
                res.status(300).json({
                    "message" : "failed to create Kelas"
                })
            }
        }catch(err){
            res.status(400).json(err.message);
        }
    }else{
        res.status(400).json({
            "message" : "Tidak dapat membuat kelas dengan waktu yang telah terlewat"
        })
    }
}

module.exports.removeKelas= async (req,res) => {
    const kelas_id =req.body.kelas_id;
    Kelas.deleteOne(
        { _id: kelas_id },
        function(err, result) {
          if (err) {
            console.error('Error occurred while deleting document:', err);
            res.status(300).json({
                "message" : "Gagal untuk menghapus kelas"
            })
            return result;
          }
          //update atribut kumpulanKelas di anggota
          Anggota.updateMany(
            {},
            {$pull: { "kumpulanKelas": kelas_id }},
            function(err, result) {
                if (err) {
                  console.error('Error occurred while deleting document:', err);
                  res.status(300).json({
                      "message" : "Gagal untuk menghapus kelas"
                  })
                  return;
                }
                res.status(201).json({
                    "message" : "Berhasil untuk menghapus kelas"
                })
            }
          )
        }
      );
}

module.exports.updateKelas = async (req,res) => {
    const {kelas_id,namaKelas,instruktur,durasi,detail} = req.body;
    //req body harus lengkap
    const kelas_lama = await Kelas.findOne({"_id" : kelas_id});
    //syarat buat update kelas
    if (kelas_id===undefined){return res.status(400).json({"message" : "Silakan masukkan id kelas"})};
    if (namaKelas===undefined){namaKelas=kelas_lama.namaKelas};
    if (instruktur===undefined){instruktur=kelas_lama.instruktur};
    if (durasi===undefined){durasi=kelas_lama.durasi};
    if (detail===undefined){detail=kelas_lama.detail};
    if (Kelas.findOne({"_id" : kelas_id})){       
        Kelas.updateOne(
            { "_id": kelas_id },
            {$set : { "nameKelas": namaKelas, "instruktur" : instruktur, "durasi" : durasi, "detail": detail}},
            function(err, result) {
              if (err) {
                console.error('Error occurred while deleting document:', err);
                res.status(300).json({
                    "message" : "Gagal untuk menghapus kelas"
                })
                return result;
              }
            }
          );
    }
}

