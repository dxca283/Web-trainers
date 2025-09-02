
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider  } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import './App.css'
import HomePage from './pages/HomePage'
import ProductsPage from './pages/ProductsPage'
import CategoryPage from './pages/CategoryPage'

function App() {

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="/categories/:id" element={<CategoryPage />} />
        <Route path="about" element={<h1 className='text-2xl font-bold'>About Page</h1>} />
        <Route path="contact" element={<h1 className='text-2xl font-bold'>Contact Page</h1>} />
      </Route>
    )
  )
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
