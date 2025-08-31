import React, { useState, useEffect } from 'react';

const EditPasswordModal = ({ item, onClose, onSave }) => {
    const [service, setService] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        if (item) {
            setService(item.service);
            setUsername(item.username);
            setPassword(item.password);
        }
    }, [item]);

    const handleSave = () => {
        onSave({ service, username, password });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-6 text-cyan-400">Edit Credential</h2>
                <div className="space-y-4">
                    <input type="text" value={service} onChange={e => setService(e.target.value)} placeholder="Service" className="w-full bg-gray-700 border border-gray-600 rounded-md p-3 focus:ring-2 focus:ring-cyan-500 focus:outline-none" />
                    <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" className="w-full bg-gray-700 border border-gray-600 rounded-md p-3 focus:ring-2 focus:ring-cyan-500 focus:outline-none" />
                    <input type="text" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className="w-full bg-gray-700 border border-gray-600 rounded-md p-3 focus:ring-2 focus:ring-cyan-500 focus:outline-none" />
                </div>
                <div className="mt-6 flex justify-end space-x-4">
                    <button onClick={onClose} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-lg transition">Cancel</button>
                    <button onClick={handleSave} className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-6 rounded-lg transition">Save</button>
                </div>
            </div>
        </div>
    );
};

export default EditPasswordModal;