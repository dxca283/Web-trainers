const Button = ({
  children,
  type = "button",
  className = "",
  loading = false,
  ...props
}) => {
  return (
    <button
      type={type}
      className={`auth-btn ${className}`}
      disabled={loading}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
