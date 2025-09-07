import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
    return (
        <div className="text-white text-center p-8 flex flex-col items-center justify-center h-screen font-mono">
            <h1 className="text-6xl font-bold text-primary-cyan">404</h1>
            <p className="text-2xl mt-4 text-light-gray">Page Not Found</p>
            <p className="text-light-gray/80 mt-2">The requested resource could not be found.</p>
            <Link to="/" className="mt-8 py-2 px-6 bg-primary-cyan text-gray-900 font-bold rounded-lg">
                Return to Lobby
            </Link>
        </div>
    );
};

export default NotFoundPage;