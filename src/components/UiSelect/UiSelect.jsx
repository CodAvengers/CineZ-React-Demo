import React, { useEffect, useId, useRef, useState } from "react";

/**
 * Accessible custom select with app-wide `.ui-select` styling.
 * options: [{ value: string|number, label: string }]
 */
const UiSelect = ({
  id,
  value,
  onChange,
  options = [],
  placeholder = "Select…",
  className = "",
  disabled = false,
}) => {
  const reactId = useId();
  const selectId = id || reactId;
  const listboxId = `${selectId}-listbox`;
  const rootRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const selectedIndex = options.findIndex(
    (option) => String(option.value) === String(value)
  );
  const selected = selectedIndex >= 0 ? options[selectedIndex] : null;

  useEffect(() => {
    if (!open) return undefined;

    const onPointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
    }
  }, [open, selectedIndex]);

  const commit = (option) => {
    onChange?.(option.value);
    setOpen(false);
  };

  const onTriggerKeyDown = (event) => {
    if (disabled) return;

    if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setOpen(true);
      return;
    }

    if (!open) return;

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => Math.max(0, (index < 0 ? 0 : index) - 1));
    }
  };

  const onListKeyDown = (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => Math.min(options.length - 1, index + 1));
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => Math.max(0, index - 1));
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      const option = options[activeIndex];
      if (option) commit(option);
      return;
    }

    if (event.key === "Home") {
      event.preventDefault();
      setActiveIndex(0);
      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      setActiveIndex(options.length - 1);
    }
  };

  return (
    <div
      ref={rootRef}
      className={`ui-select ${open ? "is-open" : ""} ${className}`.trim()}
    >
      <button
        type="button"
        id={selectId}
        className="ui-select__trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        disabled={disabled}
        onClick={() => !disabled && setOpen((wasOpen) => !wasOpen)}
        onKeyDown={onTriggerKeyDown}
      >
        <span className={`ui-select__value ${selected ? "" : "is-placeholder"}`}>
          {selected?.label ?? placeholder}
        </span>
        <span className="ui-select__chevron" aria-hidden="true" />
      </button>

      {open && (
        <ul
          id={listboxId}
          className="ui-select__menu"
          role="listbox"
          tabIndex={-1}
          aria-labelledby={selectId}
          onKeyDown={onListKeyDown}
        >
          {options.map((option, index) => {
            const isSelected = String(option.value) === String(value);
            const isActive = index === activeIndex;

            return (
              <li key={String(option.value)} role="presentation">
                <button
                  type="button"
                  role="option"
                  className={`ui-select__option ${isSelected ? "is-selected" : ""} ${isActive ? "is-active" : ""}`.trim()}
                  aria-selected={isSelected}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => commit(option)}
                >
                  {option.label}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default UiSelect;
