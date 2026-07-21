import React from "react";

const DetailsBackdrop = ({ src, alt }) => {
  if (!src) return null;

  return (
    <div className="backdrop-image">
      <img src={src} alt={alt} />
      <div className="backdrop-overlay"></div>
    </div>
  );
};

export default DetailsBackdrop;
