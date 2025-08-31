import React, { useState } from 'react';

const AddPasswordForm = ({ onAdd }) => {
    const [service, setService] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!service || !username || !password) {
            alert("All fields are required.");
            return;
        }
        onAdd({ service, username, password });
        setService('');
        setUsername('');
        setPassword('');
    };

    return (
        <div className="bg-gray-700 p-6 rounded-xl mb-6">
            <h3 className="font-semibold text-lg mb-4">Add New Credential</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input type="text" value={service} onChange={e => setService(e.target.value)} placeholder="Service (e.g., Google)" className="bg-gray-800 border border-gray-600 rounded-md p-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none" />
                <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username / Email" className="bg-gray-800 border border-gray-600 rounded-md p-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none" />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className="bg-gray-800 border border-gray-600 rounded-md p-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none" />
                <button type="submit" className="md:col-span-3 mt-4 w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-lg transition">Add and Save</button>
            </form>
        </div>
    );
};


export default AddPasswordForm;