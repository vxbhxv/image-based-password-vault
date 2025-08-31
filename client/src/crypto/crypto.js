export async function hashData(data) {
    const buffer = typeof data === 'string' ? new TextEncoder().encode(data) : data;
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Converts ArrayBuffer ↔ Base64 safely (works with large buffers).
 */
function bufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const chunkSize = 0x8000; // 32KB chunks
    for (let i = 0; i < bytes.length; i += chunkSize) {
        binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
    }
    return btoa(binary);
}

function base64ToBuffer(base64) {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
}

/**
 * Derives an AES-GCM encryption key from a password and salt using PBKDF2.
 * @param {string} password - The master password.
 * @param {Uint8Array} salt - The salt for key derivation.
 * @returns {Promise<CryptoKey>} The derived encryption key.
 */
async function getEncryptionKey(password, salt) {
    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
        'raw',
        enc.encode(password),
        { name: 'PBKDF2' },
        false,
        ['deriveKey']
    );
    return crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt: salt,
            iterations: 100000,
            hash: 'SHA-256'
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
    );
}

/**
 * Encrypts a data object using a master password.
 * @param {object} dataObject - The JSON object to encrypt.
 * @param {string} password - The master password.
 * @returns {Promise<object>} An object containing the encrypted data and necessary metadata.
 */
export async function encryptData(dataObject, password) {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const key = await getEncryptionKey(password, salt);
    const dataString = JSON.stringify(dataObject);
    const encodedData = new TextEncoder().encode(dataString);
    
    const encryptedContent = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv: iv },
        key,
        encodedData
    );

    return {
        encryptedPackage: {
            salt: bufferToBase64(salt),
            iv: bufferToBase64(iv),
            encryptedData: bufferToBase64(encryptedContent)
        }
    };
}

/**
 * Decrypts an encrypted package using the master password.
 * @param {object} encryptedPackage - The object containing encrypted data and metadata from the server.
 * @param {string} password - The master password.
 * @returns {Promise<object|null>} The decrypted JSON object, or null if decryption fails.
 */
export async function decryptData(encryptedPackage, password) {
    try {
        const salt = base64ToBuffer(encryptedPackage.salt);
        const iv = base64ToBuffer(encryptedPackage.iv);
        const encryptedData = base64ToBuffer(encryptedPackage.encryptedData);

        const key = await getEncryptionKey(password, salt);

        const decryptedContent = await crypto.subtle.decrypt(
            { name: 'AES-GCM', iv: iv },
            key,
            encryptedData
        );

        const decodedData = new TextDecoder().decode(decryptedContent);
        return JSON.parse(decodedData);
    } catch (error) {
        console.error("Decryption failed:", error);
        console.warn("Check that password, salt, and iv are identical to those used during encryption.");
        return null; // Indicates wrong password or corrupted data
    }
}

/* ------------------------------------------------------------------
   SELF-TEST HARNESS
   Encrypts and then decrypts { hello: "world" } with password "test123"
   to prove encryption/decryption works in isolation.
-------------------------------------------------------------------*/
(async () => {
    const testData = { hello: "world" };
    const password = "test123";

    console.log("---- SELF TEST START ----");
    const { encryptedPackage } = await encryptData(testData, password);
    console.log("Encrypted package:", encryptedPackage);

    const decrypted = await decryptData(encryptedPackage, password);
    console.log("Decrypted result:", decrypted);
    console.log("---- SELF TEST END ----");
})();
