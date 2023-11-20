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

    if (new Date(tanggal) > new Date()){
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
            res.status(400).json({"error" : err.message});
        }
    }else{
        res.status(400).json({
            "message" : "Tidak dapat membuat kelas dengan waktu yang telah terlewat"
        })
    }
}

module.exports.removeKelas= async (req,res) => {
    const kelas_id =req.body.id;

    kelas_akan_dihapus = await Kelas.findOne(
        { _id: kelas_id }
    )

    if (!kelas_akan_dihapus){
        res.status(300).json({"message" : "kelas tidak tersedia"});
    }else{
        await Kelas.deleteOne(
            { _id: kelas_id }
            )
        //update atribut kumpulanKelas di anggota
        Anggota.updateMany(
            {},
            {$pull: { "kumpulanKelas": kelas_id}});
        
        kelas_terhapus = await Kelas.findOne(
            { _id: kelas_id }
        )
    
        if (!kelas_terhapus){
            res.status(201).json({"message" : "berhasil menghapus kelas", "kelas" : kelas_akan_dihapus});
        }
    }


}

module.exports.updateKelas = async (req,res) => {
    const {kelas_id,namaKelas,instruktur,durasi,detail,tanggal} = req.body;
    //req body harus lengkap
    try {

        const kelas_lama = await Kelas.findOne({"_id" : kelas_id});
        //syarat buat update kelas
        if (kelas_id===undefined){return res.status(400).json({"message" : "Silakan masukkan id kelas"})};
        if (namaKelas===undefined){namaKelas=kelas_lama.namaKelas};
        if (instruktur===undefined){instruktur=kelas_lama.instruktur};
        if (durasi===undefined){durasi=kelas_lama.durasi};
        if (detail===undefined){detail=kelas_lama.detail};
        if (tanggal===undefined){tanggal=kelas_lama.tanggal};
        console.log(kelas_lama);
        if (kelas_lama){  
            try{
                await Kelas.findOneAndUpdate(
                    { "_id": kelas_id },
                    {$set : { "nameKelas": namaKelas, "instruktur" : instruktur, "durasi" : durasi, "detail": detail, "tanggal" : new Date(tanggal)}}
                  );
                  kelas_baru = await Kelas.find(
                    { "_id": kelas_id }
                  );
                res.status(201).json({"message" : "berhasil mengupdate kelas", "kelas" :kelas_baru })
            }   catch(err){
                res.status(400).json({"message" : "gagal mengupdate kelas"});
            }  
        }
    }catch (err){
        res.status(400).json(err.message)
    }
}

