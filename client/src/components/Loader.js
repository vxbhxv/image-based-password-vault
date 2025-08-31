import React from 'react';

const Loader = ({ text }) => (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex flex-col items-center justify-center z-50">
        <div className="custom-loader"></div>
        <p className="mt-4 text-lg">{text}</p>
    </div>
);

export default Loader;