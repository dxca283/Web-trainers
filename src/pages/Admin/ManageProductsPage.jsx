import  { useState, useEffect } from "react";

// ManageProductsPage.jsx
// - Single-file React component that mocks `products` based on the provided Prisma schema.
// - Uses TailwindCSS utility classes for quick styling.
// - Features included (mock, frontend-only):
//   • List products with images, category, price, created_at
//   • Add / Edit / Delete product (modal form)
//   • Manage categories (add / delete)
//   • Manage stock per size (product_sizes)
//   • Upload product images (client-side preview only)
// Note: This file is frontend-only and uses mock state. Replace mock operations with API calls to your backend when ready.

export default function ManageProductsPage() {
  // mock categories (from categories model)
  const [categories, setCategories] = useState([
    { id: 1, name: "Sneakers", description: "Casual shoes" },
    { id: 2, name: "Running", description: "Sport running" },
    { id: 3, name: "Boots", description: "Outdoor boots" },
  ]);

  // initial mock products following products model
  const [products, setProducts] = useState([
    {
      id: 101,
      category_id: 1,
      name: "AirFlex Runner",
      description: "Lightweight runner with breathable mesh.",
      price: 129.99,
      created_at: new Date().toISOString(),
      product_images: [
        { id: 1, image_url: "https://via.placeholder.com/150?text=airflex-1" },
      ],
      product_sizes: [
        { id: 1, size_id: 1, size_label: "36", stock_quantity: 12, reserved_quantity: 0 },
        { id: 2, size_id: 2, size_label: "37", stock_quantity: 8, reserved_quantity: 0 },
      ],
    },
    {
      id: 102,
      category_id: 2,
      name: "RoadMaster 2",
      description: "Durable and cushioned running shoe.",
      price: 89.5,
      created_at: new Date().toISOString(),
      product_images: [
        { id: 2, image_url: "https://via.placeholder.com/150?text=roadmaster-1" },
        { id: 3, image_url: "https://via.placeholder.com/150?text=roadmaster-2" },
      ],
      product_sizes: [
        { id: 3, size_id: 3, size_label: "38", stock_quantity: 5, reserved_quantity: 0 },
        { id: 4, size_id: 4, size_label: "39", stock_quantity: 0, reserved_quantity: 0 },
      ],
    },
  ]);

  // modal state
  const [isProductModalOpen, setProductModalOpen] = useState(false);
  const [isCategoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState(emptyForm());

  function emptyForm() {
    return {
      id: null,
      category_id: categories.length ? categories[0].id : null,
      name: "",
      description: "",
      price: "",
      product_images: [], // { id, image_url }
      product_sizes: [], // { id, size_id, size_label, stock_quantity }
    };
  }

  useEffect(() => {
    // whenever categories change, ensure form has a valid category_id
    setForm((f) => ({ ...f, category_id: f.category_id ?? (categories[0]?.id ?? null) }));
  }, [categories]);

  // ----------------------------
  // Product CRUD (mocked)
  // ----------------------------
  function openAddProduct() {
    setEditingProduct(null);
    setForm(emptyForm());
    setProductModalOpen(true);
  }

  function openEditProduct(prod) {
    // load product into form
    setEditingProduct(prod);
    setForm({
      id: prod.id,
      category_id: prod.category_id,
      name: prod.name,
      description: prod.description || "",
      price: String(prod.price),
      product_images: prod.product_images ? [...prod.product_images] : [],
      product_sizes: prod.product_sizes ? [...prod.product_sizes] : [],
    });
    setProductModalOpen(true);
  }

  function saveProduct(e) {
    e.preventDefault();
    const now = new Date().toISOString();
    if (editingProduct) {
      // update
      setProducts((prev) =>
        prev.map((p) => (p.id === editingProduct.id ? { ...p, ...form, price: parseFloat(form.price) } : p))
      );
    } else {
      const newProd = {
        ...form,
        id: Date.now(),
        created_at: now,
        price: parseFloat(form.price || 0),
      };
      setProducts((prev) => [newProd, ...prev]);
    }

    setProductModalOpen(false);
  }

  function deleteProduct(id) {
    if (!confirm("Xác nhận xoá sản phẩm này?")) return;
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  // ----------------------------
  // Category management (mocked)
  // ----------------------------
  const [newCategoryName, setNewCategoryName] = useState("");
  function addCategory() {
    if (!newCategoryName.trim()) return;
    const id = Date.now();
    setCategories((c) => [...c, { id, name: newCategoryName.trim(), description: "" }]);
    setNewCategoryName("");
  }
  function deleteCategory(id) {
    if (!confirm("Xác nhận xoá danh mục này? Sản phẩm thuộc danh mục sẽ không bị xoá, chỉ mất liên kết.")) return;
    setCategories((c) => c.filter((x) => x.id !== id));
    // remove category relation from products
    setProducts((p) => p.map((prod) => (prod.category_id === id ? { ...prod, category_id: null } : prod)));
  }

  // ----------------------------
  // Image upload (client-side preview only)
  // ----------------------------
  function handleImageFiles(files) {
    const arr = Array.from(files);
    arr.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const url = ev.target.result;
        setForm((f) => ({ ...f, product_images: [...f.product_images, { id: Date.now() + Math.random(), image_url: url }] }));
      };
      reader.readAsDataURL(file);
    });
  }

  // ----------------------------
  // Stock (product_sizes) management
  // ----------------------------
  function addSizeToForm(size_label, qty = 0) {
    setForm((f) => ({
      ...f,
      product_sizes: [
        ...f.product_sizes,
        { id: Date.now() + Math.random(), size_id: Date.now() % 10000, size_label: String(size_label), stock_quantity: Number(qty), reserved_quantity: 0 },
      ],
    }));
  }

  function updateSizeQtyInForm(id, qty) {
    setForm((f) => ({
      ...f,
      product_sizes: f.product_sizes.map((s) => (s.id === id ? { ...s, stock_quantity: Number(qty) } : s)),
    }));
  }

  function removeSizeFromForm(id) {
    setForm((f) => ({ ...f, product_sizes: f.product_sizes.filter((s) => s.id !== id) }));
  }

  // For quick stock edit directly in table
  function updateStockInline(productId, sizeId, qty) {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? { ...p, product_sizes: p.product_sizes.map((s) => (s.id === sizeId ? { ...s, stock_quantity: Number(qty) } : s)) }
          : p
      )
    );
  }

  // ----------------------------
  // Helpers
  // ----------------------------
  function getCategoryName(id) {
    return categories.find((c) => c.id === id)?.name || "(Không có)";
  }

 
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-white">Quản lý sản phẩm</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setCategoryModalOpen(true)}
            className="px-3 py-2 rounded-lg border border-gray-700 bg-gray-900 text-amber-50 hover:bg-dark-200 transition"
          >
            📂 Quản lý danh mục
          </button>
          <button
            onClick={openAddProduct}
            className="px-3 py-2 rounded-lg bg-violet-600 text-white border border-violet-500 hover:bg-violet-700 transition"
          >
            ➕ Thêm sản phẩm
          </button>
        </div>
      </div>

      <div className="border border-gray-700 rounded-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="p-3 text-left">#</th>
              <th className="p-3 text-left">Ảnh</th>
              <th className="p-3 text-left">Tên</th>
              <th className="p-3 text-left">Danh mục</th>
              <th className="p-3 text-left">Giá</th>
              <th className="p-3 text-left">Kho (sizes)</th>
              <th className="p-3 text-left">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t border-gray-700 text-white hover:bg-dark-200 transition">
                <td className="p-3 align-top">{p.id}</td>
                <td className="p-3">
                  <div className="w-16 h-12 rounded overflow-hidden border border-gray-700">
                    <img
                      src={p.product_images?.[0]?.image_url || "https://via.placeholder.com/150?text=No+Image"}
                      alt={p.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </td>
                <td className="p-3 align-top">
                  <div className="font-medium text-light-100">{p.name}</div>
                  <div className="text-xs text-gray-300 mt-1 line-clamp-2">{p.description}</div>
                </td>
                <td className="p-3 align-top text-gray-300">{getCategoryName(p.category_id)}</td>
                <td className="p-3 align-top text-green-400 font-semibold">₫{Number(p.price).toLocaleString()}</td>
                <td className="p-3 align-top">
                  <div className="flex gap-2 flex-wrap">
                    {p.product_sizes?.map((s) => (
                      <div key={s.id} className="text-sm border rounded px-2 py-1 flex items-center gap-2 bg-gray-800 border-gray-700">
                        <span className="font-medium">{s.size_label}</span>
                        <input
                          type="number"
                          value={s.stock_quantity ?? 0}
                          onChange={(e) => updateStockInline(p.id, s.id, e.target.value)}
                          className="w-16 border rounded px-1 text-sm bg-gray-900 text-white"
                        />
                      </div>
                    ))}
                  </div>
                </td>
                <td className="p-3 align-top">
                  <div className="flex gap-2">
                    <button onClick={() => openEditProduct(p)} className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm transition">
                      Sửa
                    </button>
                    <button onClick={() => deleteProduct(p.id)} className="px-3 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm transition">
                      Xoá
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Product modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-start justify-center p-4 z-50">
          <div className="bg-dark-100 w-full max-w-3xl rounded-2xl border border-gray-700 shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">{editingProduct ? "Sửa sản phẩm" : "Thêm sản phẩm"}</h2>
              <button onClick={() => setProductModalOpen(false)} className="text-gray-400 hover:text-white">✖</button>
            </div>

            <form onSubmit={saveProduct} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-light-100">Tên</label>
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-gray-900 border border-gray-700 text-white rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm text-light-100">Danh mục</label>
                  <select value={form.category_id ?? ""} onChange={(e) => setForm({ ...form, category_id: Number(e.target.value) })} className="w-full bg-gray-900 border border-gray-700 text-white rounded px-3 py-2">
                    <option value="">(Không chọn)</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm text-light-100">Mô tả</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full bg-gray-900 border border-gray-700 text-white rounded px-3 py-2" rows={3}></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-light-100">Giá</label>
                  <input required type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full bg-gray-900 border border-gray-700 text-white rounded px-3 py-2" />
                </div>

                <div>
                  <label className="block text-sm text-light-100">Hình ảnh</label>
                  <input type="file" multiple accept="image/*" onChange={(e) => handleImageFiles(e.target.files)} className="text-sm text-light-100" />
                  <div className="flex gap-2 mt-2">
                    {form.product_images?.map((img) => (
                      <div key={img.id} className="w-20 h-20 border rounded overflow-hidden">
                        <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-light-100">Kích thước & tồn kho</label>
                <div className="mt-2 grid grid-cols-1 gap-2">
                  {form.product_sizes?.map((s) => (
                    <div key={s.id} className="flex gap-2 items-center">
                      <input value={s.size_label} onChange={(e) => setForm((f) => ({ ...f, product_sizes: f.product_sizes.map(x => x.id === s.id ? { ...x, size_label: e.target.value } : x) }))} className="border border-gray-700 bg-gray-900 text-white px-2 py-1 w-24 rounded" />
                      <input type="number" value={s.stock_quantity ?? 0} onChange={(e) => updateSizeQtyInForm(s.id, e.target.value)} className="border border-gray-700 bg-gray-900 text-white px-2 py-1 w-28 rounded" />
                      <button type="button" onClick={() => removeSizeFromForm(s.id)} className="px-2 py-1 rounded bg-red-500 text-white">X</button>
                    </div>
                  ))}

                  <div className="flex gap-2">
                    <input id="new-size" placeholder="VD: 38" className="border border-gray-700 bg-gray-900 text-white px-2 py-1 w-28 rounded" />
                    <input id="new-qty" type="number" defaultValue={0} className="border border-gray-700 bg-gray-900 text-white px-2 py-1 w-28 rounded" />
                    <button type="button" onClick={() => {
                      const sizeEl = document.getElementById('new-size');
                      const qtyEl = document.getElementById('new-qty');
                      if (sizeEl && sizeEl.value) {
                        addSizeToForm(sizeEl.value, Number(qtyEl.value || 0));
                        sizeEl.value = '';
                        qtyEl.value = '0';
                      }
                    }} className="px-3 py-1 rounded bg-green-600 text-white">Thêm kích thước</button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setProductModalOpen(false)} className="px-3 py-1 rounded bg-gray-800 border border-gray-700 text-light-100">Huỷ</button>
                <button type="submit" className="px-4 py-1 rounded bg-violet-600 text-white border border-violet-500">Lưu</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-start justify-center p-4 z-40">
          <div className="bg-dark-100 w-full max-w-xl rounded-2xl border border-gray-700 p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Quản lý danh mục</h2>
              <button onClick={() => setCategoryModalOpen(false)} className="text-gray-400 hover:text-white">✖</button>
            </div>

            <div className="space-y-4">
              <div className="flex gap-2">
                <input placeholder="Tên danh mục" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} className="w-full bg-gray-900 border border-gray-700 text-white px-3 py-2 rounded" />
                <button onClick={addCategory} className="px-3 py-2 rounded bg-green-600 text-white">Thêm</button>
              </div>

              <div>
                <table className="min-w-full text-white">
                  <thead>
                    <tr className="text-left text-gray-300"><th className="px-2 py-2">ID</th><th className="px-2 py-2">Tên</th><th className="px-2 py-2">Hành động</th></tr>
                  </thead>
                  <tbody>
                    {categories.map((c) => (
                      <tr key={c.id} className="border-t border-gray-700">
                        <td className="px-2 py-2">{c.id}</td>
                        <td className="px-2 py-2">{c.name}</td>
                        <td className="px-2 py-2"><button onClick={() => deleteCategory(c.id)} className="px-2 py-1 rounded bg-red-600 text-white">Xoá</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end">
                <button onClick={() => setCategoryModalOpen(false)} className="px-3 py-2 rounded bg-gray-800 border border-gray-700 text-light-100">Đóng</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
