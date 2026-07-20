import React from "react";
import "./styles/Loader.css";

const Loader = ({ label = "Loading..." }) => {
  return (
    <div className="loader" role="status" aria-live="polite">
      <span className="loader__spinner" aria-hidden="true" />
      <span className="loader__label">{label}</span>
    </div>
  );
};

export default Loader;
