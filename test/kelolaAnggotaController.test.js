const { setActive, setNonActive } = require('../controllers/kelolaAnggotaController'); // Updated path
const Anggota = require('../models/Anggota');

jest.mock('../models/Anggota');
jest.mock('../models/Pengguna');

describe('kelolaAnggotaController', () => {
    describe('setActive', () => {
        it('should set the statusKeanggotaan to true', async () => {
            // Mock findOneAndUpdate to resolve with a dummy response
            Anggota.findOneAndUpdate.mockResolvedValue({});

            const req = { params: { idAnggota: 'dummyId' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await setActive(req, res);

            expect(Anggota.findOneAndUpdate).toHaveBeenCalledWith({ _id: 'dummyId' }, { statusKeanggotaan: true });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'Data Updated Sucessfully' });
        });
    });

    describe('setNonActive', () => {
        it('should set the statusKeanggotaan to false', async () => {
            // Mock findOneAndUpdate to resolve with a dummy response
            Anggota.findOneAndUpdate.mockResolvedValue({});

            const req = { params: { idAnggota: 'dummyId' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await setNonActive(req, res);

            expect(Anggota.findOneAndUpdate).toHaveBeenCalledWith({ _id: 'dummyId' }, { statusKeanggotaan: false });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'Data Updated Sucessfully' });
        });
    });
});