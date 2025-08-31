const mongoose = require('mongoose');

const VaultSchema = new mongoose.Schema({
    imageHash: { type: String, required: true, unique: true },
    masterPasswordHash: { type: String, required: true },
    encryptedData: { type: String, required: true },
    salt: { type: String, required: true },
    iv: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Vault', VaultSchema);
