const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Vault = require('../models/Vault');

// ✅ GET /api/vault/:imageHash → check if vault exists
router.get('/:imageHash', async (req, res) => {
    try {
        const vault = await Vault.findOne({ imageHash: req.params.imageHash });
        res.json({ exists: !!vault });
    } catch (error) {
        console.error("Vault lookup error:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

// ✅ POST /api/vault/create → create new vault
router.post('/create', async (req, res) => {
    try {
        const { imageHash, masterPassword, encryptedData, salt, iv } = req.body;

        if (!imageHash || !masterPassword || !encryptedData || !salt || !iv) {
            return res.status(400).json({ message: 'Missing required fields.' });
        }

        const existingVault = await Vault.findOne({ imageHash });
        if (existingVault) {
            return res.status(400).json({ message: 'Vault already exists for this image.' });
        }

        const masterPasswordHash = await bcrypt.hash(masterPassword, 10);

        const newVault = new Vault({
            imageHash,
            masterPasswordHash,
            encryptedData,
            salt,
            iv
        });

        await newVault.save();
        res.json({ message: 'Vault created successfully!' });
    } catch (error) {
        console.error("Vault creation error:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

// ✅ POST /api/vault/unlock → unlock existing vault
router.post('/unlock', async (req, res) => {
    try {
        const { imageHash, masterPassword } = req.body;

        if (!imageHash || !masterPassword) {
            return res.status(400).json({ message: 'Missing required fields.' });
        }

        const vault = await Vault.findOne({ imageHash });
        if (!vault) {
            return res.status(404).json({ message: 'Vault not found.' });
        }

        const isMatch = await bcrypt.compare(masterPassword, vault.masterPasswordHash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid master password.' });
        }

        // Return encrypted package to frontend for decryption
        res.json({
            encryptedData: vault.encryptedData,
            salt: vault.salt,
            iv: vault.iv
        });
    } catch (error) {
        console.error("Vault unlock error:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

// ✅ PUT /api/vault/:imageHash → update vault data
router.put('/:imageHash', async (req, res) => {
    try {
        const { encryptedData, salt, iv } = req.body;

        if (!encryptedData || !salt || !iv) {
            return res.status(400).json({ message: 'Missing required fields.' });
        }

        const updatedVault = await Vault.findOneAndUpdate(
            { imageHash: req.params.imageHash },
            { encryptedData, salt, iv, updatedAt: new Date() },
            { new: true }
        );

        if (!updatedVault) {
            return res.status(404).json({ message: 'Vault not found.' });
        }

        res.json({ message: 'Vault updated successfully!' });
    } catch (error) {
        console.error("Vault update error:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
