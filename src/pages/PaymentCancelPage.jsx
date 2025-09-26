import { Link } from "react-router-dom";

const PaymentCancelPage = () => {
  return (
    <div className="text-center py-10">
      <h1 className="text-2xl text-red-500">Bạn đã huỷ thanh toán</h1>
      <Link to="/cart" className="text-blue-500 underline">Quay lại giỏ hàng</Link>
    </div>
  )
}

export default PaymentCancelPage;
