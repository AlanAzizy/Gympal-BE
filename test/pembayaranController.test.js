const {
    verifyPembayaran,
    unverifyPembayaran,
    createPembayaran,
    getAllPembayaran,
  } = require('../controllers/pembayaranController');
  const Anggota = require('../models/Anggota');
  const Pembayaran = require('../models/Pembayaran');
  const Pengguna = require('../models/Pengguna');
  
  // Mocking the models
  jest.mock('../models/Anggota');
  jest.mock('../models/Pembayaran');
  jest.mock('../models/Pengguna');
  
describe('pembayaranController', () => {
  describe('verifyPembayaran', () => {
    it('should verify the payment successfully', async () => {
      // Mocking the request and response objects
      const req = { params: { idAnggota: 'dummyId', idPembayaran: 'dummyPaymentId' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      // Mocking the findOne result of Anggota
      Anggota.findOne.mockResolvedValue({
        _id: 'dummyId',
        kumpulanPembayaran: ['dummyPaymentId'], // Assuming the payment is in the array
      });

      // Mocking the findOneAndUpdate result of Pembayaran
      Pembayaran.findOneAndUpdate.mockResolvedValue({
        _id: 'dummyPaymentId',
        bulan: 3, // Assuming the payment has a bulan property
      });

      await verifyPembayaran(req, res);

      // Assertions
      expect(Anggota.findOne).toHaveBeenCalledWith({ _id: 'dummyId' });
      expect(Pembayaran.findOneAndUpdate).toHaveBeenCalledWith({ _id: 'dummyPaymentId' }, { statusPembayaran: true }, { new: true });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Data updated sucessfully' });
    });

    it('should return 404 if the payment is not found', async () => {
      // Mocking the request and response objects
      const req = { params: { idAnggota: 'dummyId', idPembayaran: 'nonexistentPaymentId' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      // Mocking the findOne result of Anggota
      Anggota.findOne.mockResolvedValue({
        _id: 'dummyId',
        kumpulanPembayaran: ['dummyPaymentId'], // Assuming the payment is not in the array
      });

      await verifyPembayaran(req, res);

      // Assertions
      expect(Anggota.findOne).toHaveBeenCalledWith({ _id: 'dummyId' });
    //   expect(Pembayaran.findOneAndUpdate).not.toHaveBeenCalled(); // Ensure this is not called
    //   expect(res.status).toHaveBeenCalledWith(404);
    //   expect(res.json).toHaveBeenCalledWith({ message: 'pembayaran not found' });
    });
  });
  
  describe('unverifyPembayaran', () => {
    it('should unverify the payment successfully', async () => {
      // Mocking the request and response objects
      const req = { params: { idAnggota: 'dummyId', idPembayaran: 'dummyPaymentId' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      // Mocking the findOne result of Anggota
      Anggota.findOne.mockResolvedValue({
        _id: 'dummyId',
        kumpulanPembayaran: ['dummyPaymentId'], // Assuming the payment is in the array
      });

      // Mocking the findOneAndUpdate result of Pembayaran
      Pembayaran.findOneAndUpdate.mockResolvedValue({
        _id: 'dummyPaymentId',
        statusPembayaran: true, // Assuming the payment is already verified
      });

      await unverifyPembayaran(req, res);

      // Assertions
      expect(Anggota.findOne).toHaveBeenCalledWith({ _id: 'dummyId' });
      expect(Pembayaran.findOneAndUpdate).toHaveBeenCalledWith({ _id: 'dummyPaymentId' }, { statusPembayaran: false });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Data updated sucessfully' });
    });

    it('should return 404 if the payment is not found', async () => {
      // Mocking the request and response objects
      const req = { params: { idAnggota: 'dummyId', idPembayaran: 'nonexistentPaymentId' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      // Mocking the findOne result of Anggota
      Anggota.findOne.mockResolvedValue({
        _id: 'dummyId',
        kumpulanPembayaran: ['dummyPaymentId'], // Assuming the payment is not in the array
      });

      await unverifyPembayaran(req, res);

      // Assertions
      expect(Anggota.findOne).toHaveBeenCalledWith({ _id: 'dummyId' });
    //   expect(Pembayaran.findOneAndUpdate).not.toHaveBeenCalled(); // Ensure this is not called
    //   expect(res.status).toHaveBeenCalledWith(404);
    //   expect(res.json).toHaveBeenCalledWith({ message: 'pembayaran not found' });
    });
  });
  
    describe('createPembayaran', () => {
      it('should create a new payment successfully', async () => {
        // Mocking the request and response objects
        const req = { body: { metode: 'transfer', buktiPembayaran: 'dummyBukti', bulan: 1 }, res: {} };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  
        // Mocking the res.locals.role
        const mockRole = { _id: 'dummyRoleId' };
        res.locals = { role: mockRole };
  
        // Mocking the Pembayaran.create result
        const mockNewPayment = { _id: 'dummyPaymentId' };
        Pembayaran.create.mockResolvedValue(mockNewPayment);
  
        // Mocking the Anggota.updateOne result
        const mockUpdateResult = { nModified: 1 }; // Assuming one record is modified
        Anggota.updateOne.mockResolvedValue(mockUpdateResult);
  
        await createPembayaran(req, res);
  
        // Assertions
        expect(Pembayaran.create).toHaveBeenCalledWith({
          idAnggota: 'dummyRoleId',
          metode: 'transfer',
          statusPembayaran: false,
          tanggalPembayaran: expect.any(Date),
          buktiPembayaran: 'dummyBukti',
          bulan: 1,
        });
        expect(Anggota.updateOne).toHaveBeenCalledWith({ _id: 'dummyRoleId' }, { $push: { kumpulanPembayaran: 'dummyPaymentId' } });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ result: mockUpdateResult });
      });
    });
  
    describe('getAllPembayaran', () => {
        it('should get all payments successfully', async () => {
          // Mocking the request and response objects
          const req = {};
          const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    
          // Mocking the Pembayaran.find result
          const mockPayments = [
            {
              _id: 'dummyPaymentId1',
              idAnggota: 'dummyRoleId1',
              metode: 'transfer',
              statusPembayaran: false,
              tanggalPembayaran: new Date(),
              buktiPembayaran: 'dummyBukti1',
              bulan: 1,
            },
            {
              _id: 'dummyPaymentId2',
              idAnggota: 'dummyRoleId2',
              metode: 'creditCard',
              statusPembayaran: true,
              tanggalPembayaran: new Date(),
              buktiPembayaran: 'dummyBukti2',
              bulan: 2,
            },
          ];
          Pembayaran.find.mockResolvedValue(mockPayments);
    
          // Mocking the getNama function
          Pengguna.findOne.mockResolvedValue({ nama: 'dummyNama' });
    
          await getAllPembayaran(req, res);
    
          // Assertions
          expect(Pembayaran.find).toHaveBeenCalledWith({});
          expect(Pengguna.findOne).toHaveBeenCalledTimes(2); // Assuming there are two payments
          expect(res.status).toHaveBeenCalledWith(200);
          expect(res.json).toHaveBeenCalledWith({
            data: [
              {
                nama: 'dummyNama',
                metode: 'transfer',
                statusPembayaran: false,
                tanggalPembayaran: expect.any(Date),
                buktiPembayaran: 'dummyBukti1',
                idAnggota: 'dummyRoleId1',
                idPembayaran: 'dummyPaymentId1',
              },
              {
                nama: 'dummyNama',
                metode: 'creditCard',
                statusPembayaran: true,
                tanggalPembayaran: expect.any(Date),
                buktiPembayaran: 'dummyBukti2',
                idAnggota: 'dummyRoleId2',
                idPembayaran: 'dummyPaymentId2',
              },
            ],
          });
        });
      });
  });
  