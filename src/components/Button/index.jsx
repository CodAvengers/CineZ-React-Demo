import React from 'react';
import PropTypes from 'prop-types';
import './styles/Button.css';

const Button = ({
  onClick,
  children,
  className = '',
  disabled = false,
  variant = 'primary',
  size = 'medium',
  loading = false,
  icon = null,
}) => {
  const buttonClass = `button button--${variant} button--${size} ${className}`.trim();

  return (
    <button
      className={buttonClass}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading && <span className="button__spinner">⏳</span>}
      {icon && <span className="button__icon">{icon}</span>}
      {children}
    </button>
  );
};

Button.propTypes = {
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  loading: PropTypes.bool,
  icon: PropTypes.node,
};

export default Button;