import React, { useRef } from 'react';

const UploadSection = ({ onImageUpload }) => {
    const fileInputRef = useRef(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            onImageUpload(file);
        }
        event.target.value = null; // Reset file input
    };

    return (
        <div className="bg-gray-700 border-2 border-dashed border-gray-500 rounded-xl p-8 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="mt-4 text-lg text-gray-300">Upload an image to create or unlock a vault.</p>
            <p className="mt-1 text-sm text-gray-500">This image acts as your unique key. Do not lose it.</p>
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
            />
            <button
                onClick={() => fileInputRef.current.click()}
                className="mt-6 bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105"
            >
                Select Image
            </button>
        </div>
    );
};


export default UploadSection;