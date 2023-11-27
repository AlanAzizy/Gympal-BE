const { loginPost, signUpPost, handleErrors, createToken } = require('../controllers/authController');
const Pengguna = require('../models/Pengguna');
const Anggota = require("../models/Anggota");




// Mocking createToken
// jest.mock('../controllers/authController');
// const createToken = jest.fn();
// createToken.mockResolvedValueOnce('mockToken');  // Ensure createToken is correctly imported and mockReturnValueOnce is available



jest.mock('../models/Pengguna', () => ({
    login: jest.fn(),
    create: jest.fn(),
    findOne: jest.fn()
}));
jest.mock('../models/Anggota', () => ({
    create: jest.fn()
}));

describe('loginPost function', () => {
    it('should login an admin', async () => {
        const mockReq = {
            body: {
                email: 'diding@gmail.com',
                password: 'inididing',
            },
        };

        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            cookie: jest.fn(),
        };

        // Mocking Pengguna.login for an admin
        const adminUser = {
            _id: 'adminUserId',
            role: 'admin',
            roleId: 'adminRoleId',
        };
        Pengguna.login.mockResolvedValueOnce(adminUser);

        await loginPost(mockReq, mockRes);

        expect(Pengguna.login).toHaveBeenCalledWith('diding@gmail.com', 'inididing');
        expect(mockRes.cookie).toHaveBeenCalled();
        expect(mockRes.status).toHaveBeenCalledWith(201);
        expect(mockRes.json).toHaveBeenCalledWith({
            pengguna: adminUser,
            token: expect.any(String),
        });
    });

    it('should login a regular user', async () => {
        const mockReq = {
            body: {
                email: 'user@example.com',
                password: 'userpassword',
            },
        };

        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            cookie: jest.fn(),
        };

        // Mocking Pengguna.login for a regular user
        const regularUser = {
            _id: 'regularUserId',
            role: 'anggota',
            roleId: 'anggotaRoleId',
        };
        Pengguna.login.mockResolvedValueOnce(regularUser);
        createToken.mockResolvedValueOnce('mockToken');
        await loginPost(mockReq, mockRes);

        expect(Pengguna.login).toHaveBeenCalledWith('user@example.com', 'userpassword');
        expect(mockRes.cookie).toHaveBeenCalled();
        expect(mockRes.status).toHaveBeenCalledWith(201);
        expect(mockRes.json).toHaveBeenCalledWith({
            pengguna: regularUser,
            token: expect.any(String),
        });
    });

    it('should handle login errors', async () => {
        const mockReq = {
            body: {
                email: 'invalid@example.com',
                password: 'invalidpassword',
            },
        };

        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        // Mocking Pengguna.login for an error scenario
        const error = new Error('Invalid credentials');
        Pengguna.login.mockRejectedValueOnce(error);

        await loginPost(mockReq, mockRes);

        expect(Pengguna.login).toHaveBeenCalledWith('invalid@example.com', 'invalidpassword');
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({
            error: expect.any(Object),
        });
    });
    it('should sign up a new user', async () => {
        const mockReq = {
            body: {
                noTelepon: '123456789',
                alamat: 'Jl. Contoh No. 123',
                nama: 'John Doe',
                email: 'john@example.com',
                password: 'password123',
                foto: 'base64encodedimage',
            },
        };

        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            cookie: jest.fn(),
        };


        // Mocking Anggota.create
        const createdAnggota = {
            noTelepon: '123456789',
            alamat: 'Jl. Contoh No. 123',
            statusKeanggotaan: false,
            foto: 'base64encodedimage',
        };
        Anggota.create.mockResolvedValueOnce(createdAnggota);

        // Mocking Pengguna.create
        const createdUser = {
            nama: 'John Doe',
            email: 'john@example.com',
            password: 'hashedPassword',
            role: 'anggota',
            roleId: 'anggotaId',
        };
        Pengguna.create.mockResolvedValueOnce(createdUser);

        const pengguna = await Pengguna.findOne({email : "john@example.com"})

        await signUpPost(mockReq, mockRes);

        expect(Anggota.create).toHaveBeenCalledWith(createdAnggota);
        expect(Pengguna.create).toHaveBeenCalledWith({
            nama: 'John Doe',
            email: 'john@example.com',
            password: 'password124',
            role: 'anggota',
            roleId: undefined,
        });
        expect(mockRes.cookie).toHaveBeenCalledWith('jwt', mockToken, { httpOnly: true, maxAge: expect.any(Number) });
        expect(mockRes.status).toHaveBeenCalledWith(201);
        expect(mockRes.json).toHaveBeenCalledWith({ anggota: createdAnggota, token: mockToken });
    });
});