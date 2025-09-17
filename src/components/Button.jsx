
const Button = ({ onClick, type, children }) => {
  return (
    <button onClick={onClick} type={type} className="auth-btn">
      {children}
    </button>
  )
}

export default Button;