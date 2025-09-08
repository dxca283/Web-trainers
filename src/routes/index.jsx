import MainLayout from "../layouts/MainLayout";
import HomePage from "../pages/HomePage";
import ProductsPage from "../pages/ProductsPage";
import CategoryPage from "../pages/CategoryPage";
import ProductDetailPage from "../pages/ProductDetailPage";
import CartPage from "../pages/CartPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ProtectedRoute from "./ProtectedRoute";

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
      { path: "sign-in", element: <LoginPage /> },
      { path: "sign-up", element: <RegisterPage /> },
      { path: "about", element: <h1>About Page</h1> },
      { path: "contact", element: <h1>Contact Page</h1> },
    ],
  },
];
