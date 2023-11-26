const {addNewKelas, removeKelas} = require("../controllers/kelasController");
const Kelas = require("../models/Kelas");
const Anggota = require('../models/Anggota');
const { fn } = require("jquery");

// Mocking the Kelas and Anggota models and their methods

jest.mock('../models/Anggota', () => ({
  updateMany : jest.fn()
}));

// Mock Kelas model and its create method (assuming you're using a model named Kelas)
jest.mock("../models/Kelas", () => ({
  create: jest.fn(),
  findOne : jest.fn(),
  deleteOne : jest.fn()
}));

let tempId;

describe('addNewKelas function', () => {
  it('should create a new class if the date is in the future', async () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1); // Setting the date to tomorrow

    const mockReq = {
      body: {
        namaKelas: 'Yoga',
        instruktur: 'yogi',
        durasi: 30,
        detail: 'tidak ada',
        tanggal: futureDate,
      },
    };

    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mocking Kelas.create method behavior using Jest mockResolvedValueOnce
    const kelas = Kelas.create.mockResolvedValueOnce({
      namaKelas: 'Yoga',
      instruktur: 'yogi',
      durasi: 30,
      detail: 'tidak ada',
      tanggal: futureDate,
    });

    tempId = kelas._id;


    await addNewKelas(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'create Kelas succes',
      new_kelas: {
        namaKelas: 'Yoga',
        instruktur: 'yogi',
        durasi: 30,
        detail: 'tidak ada',
        tanggal: futureDate,
      },
    });
  });

  it('should handle invalid input', async () => {
    const mockReq = {
      body: {
        // Invalid input (missing namaKelas)
        instruktur: 'yogi',
        durasi: 30,
        detail: 'tidak ada',
        tanggal: new Date(),
      },
    };

    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await addNewKelas(mockReq, mockRes);

    // Expecting a 300 status due to missing namaKelas
    expect(mockRes.status).toHaveBeenCalledWith(300);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'masukkan nama kelas' });
  });

  // More test cases for other conditions (missing instruktur, durasi, etc.) and error handling can be added here
});

// Import the function you want to test


describe('removeKelas function', () => {
  it('should remove a class and update related data', async () => {
    const kelas_id = tempId;
    const mockReq = { params: { kelas_id } };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock Kelas.findOne to simulate finding a class
    Kelas.findOne.mockResolvedValueOnce({
      _id: kelas_id,
      // Other properties of the class
    });

    // Mock Kelas.deleteOne to simulate deleting the class
    Kelas.deleteOne.mockResolvedValueOnce();

    // Mock Anggota.updateMany to simulate updating related data in Anggota
    Anggota.updateMany.mockResolvedValueOnce();

    // Mock Kelas.findOne after deletion to simulate checking if class is deleted
    Kelas.findOne.mockResolvedValueOnce(null); // Indicates class is deleted

    await removeKelas(mockReq, mockRes);

    expect(Kelas.findOne).toHaveBeenCalledWith({ _id: kelas_id });
    expect(Kelas.deleteOne).toHaveBeenCalledWith({ _id: kelas_id });
    expect(Anggota.updateMany).toHaveBeenCalledWith({}, { $pull: { kumpulanKelas: kelas_id } });
    expect(Kelas.findOne).toHaveBeenCalledWith({ _id: kelas_id });
    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'berhasil menghapus kelas',
      kelas: expect.any(Object), // Adjust the expectation based on your data structure
    });
  });

  // Other test cases for different scenarios (such as class not found, errors, etc.) can be added here
});



  