import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import {
  createAdminProduct,
  deleteAdminProduct,
  fetchAdminProducts,
  updateAdminProduct,
} from '../services/adminService'
import { getErrorMessage } from '../services/apiClient'
import type { Product } from '../types/product'
import { vndFormatter } from '../utils/formatters'

type ProductForm = {
  id: string
  name: string
  description: string
  category: string
  brand: string
  price: string
  oldPrice: string
  stock: string
  sold: string
  thumbnail: string
  imagesText: string
  specsText: string
  isFeatured: boolean
  isNew: boolean
}

const initialForm: ProductForm = {
  id: '',
  name: '',
  description: '',
  category: '',
  brand: '',
  price: '',
  oldPrice: '',
  stock: '',
  sold: '',
  thumbnail: '',
  imagesText: '',
  specsText: '',
  isFeatured: false,
  isNew: false,
}

function parseSpecs(specsText: string): Record<string, string> {
  return specsText
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .reduce<Record<string, string>>((result, line) => {
      const [key, ...rest] = line.split(':')
      const value = rest.join(':').trim()
      if (key && value) {
        result[key.trim()] = value
      }
      return result
    }, {})
}

function mapProductToForm(product: Product): ProductForm {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    category: product.category,
    brand: product.brand,
    price: String(product.price),
    oldPrice: product.oldPrice == null ? '' : String(product.oldPrice),
    stock: String(product.stock),
    sold: String(product.sold),
    thumbnail: product.thumbnail,
    imagesText: product.images.join(', '),
    specsText: Object.entries(product.specs)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n'),
    isFeatured: Boolean(product.isFeatured),
    isNew: Boolean(product.isNew),
  }
}

function ProductManagementPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [keyword, setKeyword] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<ProductForm>(initialForm)

  async function loadProducts() {
    try {
      setIsLoading(true)
      setErrorMessage('')
      const payload = await fetchAdminProducts()
      setProducts(payload)
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
      setProducts([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  const filteredProducts = useMemo(
    () =>
      products.filter((product) =>
        product.name.toLowerCase().includes(keyword.trim().toLowerCase()),
      ),
    [products, keyword],
  )

  function updateField<K extends keyof ProductForm>(key: K, value: ProductForm[K]) {
    setForm((previous) => ({ ...previous, [key]: value }))
  }

  function resetForm() {
    setEditingId(null)
    setForm(initialForm)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!form.name.trim() || !form.description.trim() || !form.category.trim() || !form.brand.trim()) {
      setErrorMessage('Vui lòng nhập đủ tên, mô tả, danh mục và thương hiệu')
      return
    }

    try {
      setIsSubmitting(true)
      setErrorMessage('')

      const payload = {
        ...(editingId ? {} : { id: form.id.trim() || undefined }),
        name: form.name.trim(),
        description: form.description.trim(),
        category: form.category.trim(),
        brand: form.brand.trim(),
        price: Number(form.price || 0),
        oldPrice: form.oldPrice.trim() ? Number(form.oldPrice) : null,
        stock: Number(form.stock || 0),
        sold: Number(form.sold || 0),
        thumbnail: form.thumbnail.trim() || form.name.trim().toUpperCase(),
        images: form.imagesText
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
        specs: parseSpecs(form.specsText),
        isFeatured: form.isFeatured,
        isNew: form.isNew,
      }

      if (editingId) {
        await updateAdminProduct(editingId, payload)
      } else {
        await createAdminProduct(payload)
      }

      await loadProducts()
      resetForm()
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDelete(productId: string) {
    const shouldDelete = window.confirm('Bạn có chắc muốn xóa sản phẩm này?')
    if (!shouldDelete) {
      return
    }

    try {
      setErrorMessage('')
      await deleteAdminProduct(productId)
      await loadProducts()

      if (editingId === productId) {
        resetForm()
      }
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    }
  }

  function startEdit(product: Product) {
    setEditingId(product.id)
    setForm(mapProductToForm(product))
  }

  return (
    <section className="page-stack reveal-up">
      <p className="eyebrow">Quản trị sản phẩm</p>
      <h1 className="page-title">Quản lý sản phẩm</h1>

      <form className="placeholder-card" onSubmit={handleSubmit}>
        <h2>{editingId ? 'Cập nhật sản phẩm' : 'Tạo sản phẩm mới'}</h2>

        <div className="placeholder-grid">
          {!editingId ? (
            <label className="field">
              <span>ID (tùy chọn)</span>
              <input value={form.id} onChange={(event) => updateField('id', event.target.value)} />
            </label>
          ) : null}

          <label className="field">
            <span>Tên sản phẩm</span>
            <input value={form.name} onChange={(event) => updateField('name', event.target.value)} />
          </label>

          <label className="field">
            <span>Danh mục</span>
            <input value={form.category} onChange={(event) => updateField('category', event.target.value)} />
          </label>

          <label className="field">
            <span>Thương hiệu</span>
            <input value={form.brand} onChange={(event) => updateField('brand', event.target.value)} />
          </label>

          <label className="field">
            <span>Giá</span>
            <input
              type="number"
              min="0"
              value={form.price}
              onChange={(event) => updateField('price', event.target.value)}
            />
          </label>

          <label className="field">
            <span>Giá cũ</span>
            <input
              type="number"
              min="0"
              value={form.oldPrice}
              onChange={(event) => updateField('oldPrice', event.target.value)}
            />
          </label>

          <label className="field">
            <span>Tồn kho</span>
            <input
              type="number"
              min="0"
              value={form.stock}
              onChange={(event) => updateField('stock', event.target.value)}
            />
          </label>

          <label className="field">
            <span>Đã bán</span>
            <input
              type="number"
              min="0"
              value={form.sold}
              onChange={(event) => updateField('sold', event.target.value)}
            />
          </label>

          <label className="field">
            <span>Thumbnail</span>
            <input value={form.thumbnail} onChange={(event) => updateField('thumbnail', event.target.value)} />
          </label>
        </div>

        <label className="field">
          <span>Mô tả</span>
          <textarea value={form.description} onChange={(event) => updateField('description', event.target.value)} />
        </label>

        <label className="field">
          <span>Danh sách ảnh (phân cách bằng dấu phẩy)</span>
          <input value={form.imagesText} onChange={(event) => updateField('imagesText', event.target.value)} />
        </label>

        <label className="field">
          <span>Thông số kỹ thuật (mỗi dòng: Tên: Giá trị)</span>
          <textarea
            value={form.specsText}
            onChange={(event) => updateField('specsText', event.target.value)}
          />
        </label>

        <div className="button-row">
          <label className="inline-check">
            <input
              type="checkbox"
              checked={form.isFeatured}
              onChange={(event) => updateField('isFeatured', event.target.checked)}
            />
            Sản phẩm nổi bật
          </label>
          <label className="inline-check">
            <input
              type="checkbox"
              checked={form.isNew}
              onChange={(event) => updateField('isNew', event.target.checked)}
            />
            Sản phẩm mới
          </label>
        </div>

        <div className="button-row">
          <button type="submit" className="primary-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Đang lưu...' : editingId ? 'Lưu cập nhật' : 'Tạo sản phẩm'}
          </button>
          {editingId ? (
            <button type="button" className="ghost-btn" onClick={resetForm}>
              Hủy chỉnh sửa
            </button>
          ) : null}
        </div>
      </form>

      <label className="catalog-search">
        <span>Tìm tên sản phẩm</span>
        <input
          type="search"
          placeholder="Nhập tên sản phẩm..."
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
        />
      </label>

      {errorMessage ? <div className="state-card">{errorMessage}</div> : null}
      {isLoading ? <div className="state-card">Đang tải danh sách sản phẩm...</div> : null}

      {!isLoading ? (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên</th>
                <th>Danh mục</th>
                <th>Giá</th>
                <th>Tồn kho</th>
                <th>Thao tác</th>
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
                  <td>
                    <div className="button-row">
                      <button type="button" className="ghost-btn" onClick={() => startEdit(product)}>
                        Sửa
                      </button>
                      <button
                        type="button"
                        className="ghost-btn"
                        onClick={() => handleDelete(product.id)}
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </section>
  )
}

export default ProductManagementPage
