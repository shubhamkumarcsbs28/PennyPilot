export const Button = ({
  children, variant = 'primary', size = '', onClick,
  disabled = false, type = 'button', className = '', style = {},
}) => (
  <button
    type={type}
    className={`btn btn-${variant} ${size ? `btn-${size}` : ''} ${className}`}
    onClick={onClick}
    disabled={disabled}
    style={style}
  >
    {children}
  </button>
)
