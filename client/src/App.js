import React, { useState } from 'react';
import axios from 'axios';
import { hashData, encryptData, decryptData } from './crypto/crypto';
import UploadSection from './components/UploadSection';
import MasterPasswordModal from './components/MasterPasswordModal';
import AddPasswordForm from './components/AddPasswordForm';
import PasswordList from './components/PasswordList';
import EditPasswordModal from './components/EditPasswordModal';
import Loader from './components/Loader';
import AlertBox from './components/AlertBox';

const API_URL = 'http://localhost:5001/api/vault';

function App() {
    const [isVaultOpen, setIsVaultOpen] = useState(false);
    const [vaultData, setVaultData] = useState([]);
    const [currentImageHash, setCurrentImageHash] = useState(null);
    const [currentMasterPassword, setCurrentMasterPassword] = useState(null);

    const [modal, setModal] = useState({ isOpen: false, type: '', data: null });
    const [loading, setLoading] = useState({ isActive: false, text: '' });
    const [alert, setAlert] = useState({ isVisible: false, message: '', isError: false });

    const showAlert = (message, isError = true) => {
        setAlert({ isVisible: true, message, isError });
        setTimeout(() => setAlert({ isVisible: false, message: '', isError: false }), 3000);
    };

    // --- API Functions (same as before, unchanged) ---
    const handleImageUpload = async (file) => {
        if (!file) return;
        setLoading({ isActive: true, text: 'Analyzing image...' });
        try {
            const buffer = await file.arrayBuffer();
            const imageHash = await hashData(buffer);
            setCurrentImageHash(imageHash);

            const res = await axios.get(`${API_URL}/${imageHash}`);
            if (res.data.exists) {
                setModal({ isOpen: true, type: 'unlock' });
            } else {
                setModal({ isOpen: true, type: 'create' });
            }
        } catch (error) {
            showAlert('Could not connect to the server.');
            console.error(error);
        } finally {
            setLoading({ isActive: false, text: '' });
        }
    };

    const handleMasterPasswordSubmit = async (password) => {
        if (modal.type === 'create') {
            if (password.length < 8) {
                showAlert("Password must be at least 8 characters long.");
                return;
            }
            setLoading({ isActive: true, text: 'Creating vault...' });
            try {
                const { encryptedPackage } = await encryptData([], password);
                
                await axios.post(`${API_URL}/create`, {
                    imageHash: currentImageHash,
                    masterPassword: password,
                    encryptedData: encryptedPackage.encryptedData,
                    salt: encryptedPackage.salt,
                    iv: encryptedPackage.iv,
                });

                setCurrentMasterPassword(password);
                setVaultData([]);
                setIsVaultOpen(true);
                setModal({ isOpen: false, type: '' });
                showAlert('Vault created successfully!', false);
            } catch (error) {
                const message = error.response?.data?.message || 'Failed to create vault on the server.';
                showAlert(message);
            } finally {
                setLoading({ isActive: false, text: '' });
            }
        }

        if (modal.type === 'unlock') {
            setLoading({ isActive: true, text: 'Unlocking vault...' });
            try {
                const res = await axios.post(`${API_URL}/unlock`, {
                    imageHash: currentImageHash,
                    masterPassword: password,
                });

                const decrypted = await decryptData(res.data, password);
                if (decrypted) {
                    setCurrentMasterPassword(password);
                    setVaultData(decrypted);
                    setIsVaultOpen(true);
                    setModal({ isOpen: false, type: '' });
                    showAlert('Vault unlocked!', false);
                } else {
                    showAlert('Decryption failed. Incorrect password or corrupt data.');
                }
            } catch (error) {
                const message = error.response?.data?.message || 'Failed to unlock vault.';
                showAlert(message);
            } finally {
                setLoading({ isActive: false, text: '' });
            }
        }
    };
    
    const saveVault = async (newData) => {
        setLoading({ isActive: true, text: 'Saving vault...' });
        try {
            const { encryptedPackage } = await encryptData(newData, currentMasterPassword);
            await axios.put(`${API_URL}/${currentImageHash}`, {
                masterPassword: currentMasterPassword,
                encryptedData: encryptedPackage.encryptedData,
                salt: encryptedPackage.salt,
                iv: encryptedPackage.iv
            });
            setVaultData(newData);
            showAlert('Vault saved successfully!', false);
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to save the vault.';
            showAlert(message);
        } finally {
            setLoading({ isActive: false, text: '' });
        }
    };

    const handleAddPassword = (newItem) => {
        const newData = [...vaultData, newItem];
        saveVault(newData);
    };

    const handleUpdatePassword = (updatedItem) => {
        const newData = vaultData.map((item, index) =>
            index === modal.data.index ? updatedItem : item
        );
        saveVault(newData);
        setModal({ isOpen: false, type: '', data: null });
    };

    const handleDeletePassword = (indexToDelete) => {
        if (window.confirm('Are you sure you want to delete this entry?')) {
            const newData = vaultData.filter((_, index) => index !== indexToDelete);
            saveVault(newData);
        }
    };
    
    const lockVault = () => {
        setIsVaultOpen(false);
        setVaultData([]);
        setCurrentImageHash(null);
        setCurrentMasterPassword(null);
    };

    return (
        <div className="bg-black text-white flex items-center justify-center min-h-screen font-sans transition-all duration-500">
            <div className="w-full max-w-2xl mx-auto p-6 md:p-10">
                <div className="bg-[#111] rounded-2xl shadow-xl p-10 transition-all duration-500 hover:shadow-2xl">
                    <header className="text-center mb-10 animate-fade-in">
                        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                            ImageGuard Vault
                        </h1>
                        <p className="text-gray-400 mt-3 text-lg">
                            Minimal. Secure. Yours.
                        </p>
                    </header>

                    {!isVaultOpen ? (
                        <div className="animate-slide-up">
                            <UploadSection onImageUpload={handleImageUpload} />
                        </div>
                    ) : (
                        <div className="animate-fade-in">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-semibold text-white">Password Vault</h2>
                                <button 
                                    onClick={lockVault} 
                                    className="border border-white text-white px-4 py-2 rounded-lg hover:bg-white hover:text-black transition duration-300"
                                >
                                    Lock Vault
                                </button>
                            </div>
                            <AddPasswordForm onAdd={handleAddPassword} />
                            <PasswordList
                                items={vaultData}
                                onDelete={handleDeletePassword}
                                onEdit={(index, item) => setModal({ isOpen: true, type: 'edit', data: { index, item } })}
                            />
                        </div>
                    )}
                </div>
            </div>

            {loading.isActive && <Loader text={loading.text} />}
            {alert.isVisible && <AlertBox message={alert.message} isError={alert.isError} />}

            {modal.isOpen && modal.type !== 'edit' && (
                <MasterPasswordModal
                    type={modal.type}
                    onClose={() => setModal({ isOpen: false, type: '' })}
                    onSubmit={handleMasterPasswordSubmit}
                />
            )}
            
            {modal.isOpen && modal.type === 'edit' && (
                <EditPasswordModal
                    item={modal.data.item}
                    onClose={() => setModal({ isOpen: false, type: '', data: null })}
                    onSave={handleUpdatePassword}
                />
            )}
        </div>
    );
}

export default App;
