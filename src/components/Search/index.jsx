import React, { useState } from "react";
import "./styles/searchbar.css"; // Import the CSS file

const CollapsibleSearchBar = () => {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <div className="container">
      <input 
        type="checkbox" 
        className="checkbox" 
        checked={isChecked} 
        onChange={() => setIsChecked(!isChecked)}
      />
      
      <div className="mainbox">
        <div className="iconContainer">
          <svg viewBox="0 0 512 512" height="1em" xmlns="http://www.w3.org/2000/svg" className="search_icon">
            <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"></path>
          </svg>
        </div>

        <input 
          type="text" 
          className="search_input" 
          placeholder="Search" 
          style={{ width: isChecked ? "0" : "170px", height: isChecked ? "0" : "100%" }}
        />
      </div>
    </div>
  );
};

export default CollapsibleSearchBar;
