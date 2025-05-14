import React from 'react';
import './styles/NotFound.css'; // Import your CSS file for styling

const NotFound = () => {
  return (
    <div className="not-found-container">
      {/* Optional: Add a message on top of the GIF */}
      <div className="not-found-message">
        <h1>404 - Page Not Found</h1>
      </div>
    </div>
  );
};

export default NotFound;
