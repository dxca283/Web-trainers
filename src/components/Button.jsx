
const Button = ({ onClick, type, children, className }) => {
  return (
    <button onClick={onClick} type={type} className={`auth-btn ${className}`}>
      {children}
    </button>
  )
}

export default Button;