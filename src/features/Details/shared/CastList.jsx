import React from "react";
import "./CastList.css";

const CastList = ({ cast, className }) => {
  if (!cast?.length) return null;

  return (
    <div className={`cast-list ${className || ""}`.trim()}>
      <h2>Cast</h2>
      <div className="cast-grid">
        {cast.map((person, index) => (
          <div key={`${person.name}-${index}`} className="cast-member">
            {person.profileUrl ? (
              <img src={person.profileUrl} alt={person.name} />
            ) : (
              <div className="cast-placeholder"></div>
            )}
            <div className="cast-info">
              <strong>{person.name}</strong>
              <span>{person.character}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CastList;
