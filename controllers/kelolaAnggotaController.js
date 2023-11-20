const Anggota = require("../models/Anggota");

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
