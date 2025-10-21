const CheckEmailPage = () => {
  return (
    <div className="auth-bg flex items-center justify-center min-h-screen">
      <div className="auth-card text-center">
        <h1 className="auth-title text-gradient">Vui lòng kiểm tra email</h1>
        <p className="text-red-600 mt-2">
          Nếu địa chỉ email bạn cung cấp hợp lệ, chúng tôi đã gửi một liên kết đặt lại mật khẩu.
          <br />
          Hãy kiểm tra hộp thư đến (hoặc thư mục Spam).
        </p>
      </div>
    </div>
  );
};

export default CheckEmailPage;
