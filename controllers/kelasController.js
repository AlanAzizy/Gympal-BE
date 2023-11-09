const Kelas = require('../models/Kelas')

module.exports.allKelasGet = async (req, res) => {
    const { token } = req.body;
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

module.exports.insertAllKelas = async (req, res) => {
    try {
        const foto = "";
        if (req.body.foto) {
            // udah ada foto
            foto = req.body.foto;
        }

        console.log(1);
        allklas = [{
            namaKelas : "yoga",
            instruktur : "yanti",
            durasi : 45,
            detail : "kelas di adakan di ruang 1. silakan datang tepat waktu",
            tanggal : new Date(2023,11,18,10,0,0)  
        },
        {
            namaKelas : "pilletes",
            instruktur : "yanto",
            durasi : 60,
            detail : "kelas diadakan di ruang 2, jangan lupa makan",
            tanggal : new Date(2023,11,19,12,0,0)  
        },
        {
            namaKelas : "zumba",
            instruktur : "tuti",
            durasi : 60,
            detail : "kelas diadakan di ruang 1 silakan datang tepat waktu",
            tanggal : new Date(2023,11,20,14,0,0)  
        },
        {
            namaKelas : "yoga",
            instruktur : "toto",
            durasi : 30,
            detail : "kelas di adakan di ruang 2. jangan sampai telat",
            tanggal : new Date(2023,11,20,16,0,0)  
        },
        {
            namaKelas : "yoga",
            instruktur : "tuti",
            durasi : 45,
            detail : "kelas di adakan di ruang 2. jangan lupa makan",
            tanggal : new Date(2023,11,21,8,30,0)  
        },
        {
            namaKelas : "zumba",
            instruktur : "yanti",
            durasi : 30,
            detail : "kelas di adakan di ruang 1. silakan datang tepat waktu",
            tanggal : new Date(2023,11,22,10,0,0)  
        },
        {
            namaKelas : "pilletes",
            instruktur : "toto",
            durasi : 40,
            detail : "kelas di adakan di ruang 2. silakan datang tepat waktu",
            tanggal : new Date(2023,23,11,0,0)  
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

module.exports.kelasByIdGet = async (req, res) => {
    const {_id} = req.body;
    try {
        const kelas_found = Kelas.findOne({_id: {$gte:_id} })
        .then((docs)=>{
            res.status(201).json(docs)
        })
        .catch((err)=>{
            console.log(err);
        });
    }
    catch (err) {
        // TODO jika login gagal, lakukan handling error, kembalikan error ke depan, ubah status menjadi 400
        const errorObj = handleErrors(err);
        res.status(400).json({ error: errorObj });
    }
}

module.exports.addNewKelas= async (req,res) => {
    const {namaKelas, instruktur, durasi, detail, tanggal} = req.body;
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
}