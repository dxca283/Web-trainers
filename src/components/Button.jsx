import Spinner from "./Spinner.jsx";

const Button = ({
  children,
  loading = false,
  disabled = false,
  className = "",
  type = "button",
  onClick,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`auth-btn relative flex items-center justify-center ${className} ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
      style={{ minWidth: "120px" }} // giữ button không bị thay đổi kích thước
    >
      {/* Spinner nằm giữa */}
      {loading && (
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <Spinner size="sm" />
        </span>
      )}
      {/* Text giữ chỗ */}
      <span className={`${loading ? "invisible" : ""}`}>{children}</span>
    </button>
  );
};

export default Button;
