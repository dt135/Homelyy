import { useMemo, useState } from 'react'
import { mockProducts } from '../services/mock/data/products'
import { vndFormatter } from '../utils/formatters'

function ProductManagementPage() {
  const [keyword, setKeyword] = useState('')

  const filteredProducts = useMemo(
    () =>
      mockProducts.filter((product) =>
        product.name.toLowerCase().includes(keyword.trim().toLowerCase()),
      ),
    [keyword],
  )

  return (
    <section className="page-stack reveal-up">
      <p className="eyebrow">Quản trị sản phẩm</p>
      <h1 className="page-title">Quản lý sản phẩm</h1>

      <label className="catalog-search">
        <span>Tìm tên sản phẩm</span>
        <input
          type="search"
          placeholder="Nhập tên sản phẩm..."
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
        />
      </label>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên</th>
              <th>Danh mục</th>
              <th>Giá</th>
              <th>Tồn kho</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>{vndFormatter.format(product.price)}</td>
                <td>{product.stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default ProductManagementPage
