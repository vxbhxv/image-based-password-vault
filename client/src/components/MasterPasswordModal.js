import React, { useState } from 'react';

const MasterPasswordModal = ({ type, onClose, onSubmit }) => {
    const [password, setPassword] = useState('');

    const title = type === 'create' ? 'Create New Vault' : 'Unlock Vault';
    const description = type === 'create'
        ? 'Set a strong master password for this new vault. This password cannot be recovered.'
        : 'This image has an existing vault. Enter the master password to unlock it.';

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password) {
            onSubmit(password);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl w-full max-w-sm">
                <h2 className="text-2xl font-bold text-center mb-4 text-cyan-400">{title}</h2>
                <p className="text-center text-gray-400 mb-6">{description}</p>
                <form onSubmit={handleSubmit}>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded-md p-3 mb-4 text-center focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                        placeholder="Enter Master Password"
                        autoFocus
                    />
                    <button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-4 rounded-lg transition mb-2">
                        Confirm
                    </button>
                    <button type="button" onClick={onClose} className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition">
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    );
};

export default MasterPasswordModal;