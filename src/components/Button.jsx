const Button = ({ children, type = "button", className = "", ...props }) => {
  return (
    <button
      type={type}
      className={`auth-btn ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
