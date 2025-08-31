import React from 'react';

const AlertBox = ({ message, isError }) => {
    const bgColor = isError ? 'bg-red-500' : 'bg-green-500';
    return (
        <div className={`fixed bottom-5 right-5 text-white py-3 px-6 rounded-lg shadow-lg transition-opacity duration-300 ${bgColor}`}>
            <p>{message}</p>
        </div>
    );
};

export default AlertBox;