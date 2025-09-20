import React from 'react'

const PaymentCancelPage = () => {
  return (
    <div className="text-center py-10">
    <h1 className="text-2xl text-red-500">Bạn đã huỷ thanh toán</h1>
    <a href="/cart" className="text-blue-500 underline">Quay lại giỏ hàng</a>
  </div>
  )
}

export default PaymentCancelPage