import React from "react";

const ServerSwitcher = ({ providers = [], value, onChange }) => {
  if (providers.length < 2) return null;

  return (
    <div className="server-switcher" role="group" aria-label="Playback server">
      <span className="server-switcher__label">Server</span>
      <div className="server-switcher__options">
        {providers.map((provider) => {
          const isActive = provider.id === value;
          return (
            <button
              key={provider.id}
              type="button"
              className={`server-switcher__btn ${isActive ? "is-active" : ""}`}
              aria-pressed={isActive}
              onClick={() => onChange(provider.id)}
            >
              {provider.label || provider.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ServerSwitcher;
