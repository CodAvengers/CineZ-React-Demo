import React from "react";
import "./DetailsShell.css";

const DetailsShell = ({ backdropUrl, backdropAlt = "", children }) => {
  return (
    <div className="details-shell">
      {backdropUrl && (
        <div className="details-backdrop" aria-hidden="true">
          <img src={backdropUrl} alt="" />
          <div className="details-backdrop__fade" />
        </div>
      )}

      <div className="details-shell__content page-rail">{children}</div>
    </div>
  );
};

export function DetailsHero({ title, meta = [], rating, credit }) {
  const items = meta.filter(Boolean);

  return (
    <header className="details-hero">
      <h1>{title}</h1>

      {(items.length > 0 || rating != null) && (
        <div className="details-meta">
          {items.map((item, index) => (
            <React.Fragment key={`${item}-${index}`}>
              {index > 0 && <span className="details-meta__dot" />}
              <span>{item}</span>
            </React.Fragment>
          ))}
          {rating != null && !Number.isNaN(rating) && (
            <>
              {items.length > 0 && <span className="details-meta__dot" />}
              <span className="details-rating">
                <span>{rating.toFixed(1)}</span>/10
              </span>
            </>
          )}
        </div>
      )}

      {credit && <p className="details-credit">{credit}</p>}
    </header>
  );
}

export function DetailsSection({ title, children }) {
  if (!children) return null;

  return (
    <section className="details-section">
      {title && <h2>{title}</h2>}
      {children}
    </section>
  );
}

export default DetailsShell;
