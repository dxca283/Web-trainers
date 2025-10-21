import MainLayout from "../layouts/MainLayout";
import HomePage from "../pages/HomePage";
import ProductsPage from "../pages/ProductsPage";
import CategoryPage from "../pages/CategoryPage";
import ProductDetailPage from "../pages/ProductDetailPage";
import CartPage from "../pages/CartPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ProtectedRoute from "./ProtectedRoute";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import CheckEmailPage from "../pages/CheckEmailPage";
import ChangePasswordPage from "../pages/ChangePasswordPage";
import OrderPage from "../pages/OrderPage";
import PaymentSuccessPage from "../pages/PaymentSuccessPage";
import PaymentCancelPage from "../pages/PaymentCancelPage";
import ConfirmOrderPage from "../pages/ConfirmOrderPage";
import OrderHistoryPage from "../pages/OrderHistoryPage";
import ProfilePage from "../pages/ProfilePage";
import VerifyAccountPage from "../pages/VerifyAccountPage";
import VerifyNoticePage from "../pages/VerifyNoticePage";
import FavoriteProductPage from "../pages/FavoriteProductPage";
import AdminPage from "../pages/Admin/AdminPage";
import AdminLayout from "../layouts/AdminLayout";
import ManageUserPage from "../pages/Admin/ManageUserPage";
import ManageProductsPage from "../pages/Admin/ManageProductsPage";

export const routes = [
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "products", element: <ProductsPage /> },
      { path: "categories/:category_id", element: <CategoryPage /> },
      { path: "ProductDetail/:product_id", element: <ProductDetailPage /> },
      {
        path: "cart",
        element: (
          <ProtectedRoute>
            <CartPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "confirm-order",
        element: (
          <ProtectedRoute>
            <OrderPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "order-history",
        element: (
          <ProtectedRoute>
            <OrderHistoryPage />
          </ProtectedRoute>
        ),
      },
      { path: "sign-in", element: <LoginPage /> },
      { path: "sign-up", element: <RegisterPage /> },
      {
        path: "verify-notice",
        element: <VerifyNoticePage />,
      },
      {
        path: "edit-profile",
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "favorite-items",
        element: (
          <ProtectedRoute>
            <FavoriteProductPage />
          </ProtectedRoute>
        ),
      },
      { path: "forgot-password", element: <ForgotPasswordPage /> },
      { path: "reset-password", element: <ResetPasswordPage /> },
      { path: "check-email", element: <CheckEmailPage /> },
      { path: "verify-account", element: <VerifyAccountPage /> },
      {
        path: "change-password",
        element: (
          <ProtectedRoute>
            <ChangePasswordPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "payment/success",
        element: <PaymentSuccessPage />,
      },
      {
        path: "payment/cancel",
        element: <PaymentCancelPage />,
      },
      {
        path: "order/confirm-order",
        element: (
          <ProtectedRoute>
            <ConfirmOrderPage />
          </ProtectedRoute>
        ),
      },
      { path: "about", element: <h1>About Page</h1> },
      { path: "contact", element: <h1>Contact Page</h1> },
    ],
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute roles={["admin"]}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      // thêm route admin khác...
      { index: true, element: <AdminPage /> },
      {path: "users", element: <ManageUserPage />},
      {path: "products", element: <ManageProductsPage />}
    ],
  },
];
