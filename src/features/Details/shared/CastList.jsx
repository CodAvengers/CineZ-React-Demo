import React from "react";
import "./CastList.css";

const CastList = ({ cast, className }) => {
  if (!cast?.length) return null;

  return (
    <section className={`cast-list ${className || ""}`.trim()}>
      <h2>Cast</h2>
      <div className="cast-row" role="list">
        {cast.map((person, index) => (
          <article
            key={`${person.name}-${index}`}
            className="cast-member"
            role="listitem"
          >
            {person.profileUrl ? (
              <img src={person.profileUrl} alt="" loading="lazy" />
            ) : (
              <div className="cast-placeholder" aria-hidden="true" />
            )}
            <div className="cast-info">
              <strong>{person.name}</strong>
              <span>{person.character}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default CastList;
