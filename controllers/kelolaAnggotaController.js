const Anggota = require("../models/Anggota");
const Pembayaran = require("../models/Pembayaran");

module.exports.setActive = async (req, res) => {
    try {
        // aman
        const response = await Anggota.findOneAndUpdate({ _id: req.params.idAnggota }, { statusKeanggotaan: true });
        res.status(200).json({ message: "Data Updated Sucessfully" });
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ error: err });
    }
}

module.exports.setNonActive = async (req, res) => {
    try {
        // aman
        const response = await Anggota.findOneAndUpdate({ _id: req.params.idAnggota }, { statusKeanggotaan: false });
        res.status(200).json({ message: "Data Updated Sucessfully" });
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ error: err });
    }
}

// butuh endpoint get all data anggota
module.exports.getAllDataPengguna = async (req, res) => {
    try{
        const anggota = await Anggota.find();
        const added_anggota = [];
        for (satu_anggota of anggota){
            added_anggota.push({
                noTelepon : satu_anggota.noTelepon,
                alamat : satu_anggota.alamat,
                statusKeanggotaan : satu_anggota.statusKeanggotaan,
                foto : satu_anggota.foto,
                kumpulanKelas : satu_anggota.kumpulanKelas,
                kumpulanPembayaran : satu_anggota.kumpulanPembayaran,
                kumpulanNotifikasi : satu_anggota.kumpulanNotifikasi,
                last_payment : {},
                payment : false
            })
        }
        for (satu_anggota of added_anggota){
            last_index = satu_anggota.kumpulanPembayaran.length-1;
            if (last_index>0){
                satu_anggota.last_payment = await Pembayaran.findOne({_id : satu_anggota.kumpulanPembayaran[last_index]._id});
            }else{
                satu_anggota.last_payment = {};
            }
        }
        const millisecondsInMonth = 30 * 24 * 60 * 60 * 1000;
        for (satu_anggota of added_anggota){
            
            if (satu_anggota.last_payment.statusPembayaran!==undefined){
                if (satu_anggota.last_payment.statusPembayaran && (new Date() - satu_anggota.tanggalPembayaran > millisecondsInMonth)){
                    satu_anggota.payment = true;
                    
                }else{
                    satu_anggota.payment = false;
                }
            }else{
                satu_anggota.payment = false;
            }

            satu_anggota.expdate = new Date(satu_anggota.tanggalPembayaran+millisecondsInMonth);
        }
        res.status(201).json(added_anggota);

    }catch(err){
        res.status(400).json(err.message);
    }

}
