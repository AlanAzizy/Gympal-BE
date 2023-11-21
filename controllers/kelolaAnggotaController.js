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
        for (satu_anggota of anggota){
            last_index = satu_anggota.kumpulanPembayaran.length-1;
            if (last_index>0){
                anggota.last_payment = await Pembayaran.findOne({_id : satu_anggota.kumpulanPembayaran[last_index]._id});
            }else{
                anggota.last_payment = {};
            }
        }
        const millisecondsInMonth = 30 * 24 * 60 * 60 * 1000;
        for (satu_anggota of anggota){
            if (satu_anggota.last_payment.statusPembayaran && (new Date() - anggota.tanggalPembayaran > millisecondsInMonth)){
                satu_anggota.payment = true;
                
            }else{
                satu_anggota.payment = false;
            }

            satu_anggota.expdate = new Date(anggota.tanggalPembayaran+millisecondsInMonth);
        }
        res.status(201).json(anggota);

    }catch(err){
        res.status(400).json(err.message);
    }

}
