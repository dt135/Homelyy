import { useEffect, useMemo, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import {
  createAdminProduct,
  deleteAdminProduct,
  fetchAdminProducts,
  updateAdminProduct,
} from '../services/adminService'
import { getErrorMessage } from '../services/apiClient'
import type { Product } from '../types/product'
import { isLikelyImageUrl } from '../utils/images'
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

function parseImageList(imagesText: string): string[] {
  return imagesText
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
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
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [uploadedImagePreviewUrls, setUploadedImagePreviewUrls] = useState<string[]>([])
  const [selectedUploadedImageIndex, setSelectedUploadedImageIndex] = useState<number | null>(null)
  const formRef = useRef<HTMLFormElement | null>(null)

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

  const existingImageChoices = useMemo(() => {
    const merged = [form.thumbnail.trim(), ...parseImageList(form.imagesText)]
    return [...new Set(merged.filter(Boolean))]
  }, [form.imagesText, form.thumbnail])

  useEffect(() => {
    if (imageFiles.length === 0 || typeof URL === 'undefined') {
      setUploadedImagePreviewUrls([])
      return
    }

    const objectUrls = imageFiles.map((file) => URL.createObjectURL(file))
    setUploadedImagePreviewUrls(objectUrls)

    return () => {
      objectUrls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [imageFiles])

  function updateField<K extends keyof ProductForm>(key: K, value: ProductForm[K]) {
    setForm((previous) => ({ ...previous, [key]: value }))
  }

  function resetForm() {
    setEditingId(null)
    setForm(initialForm)
    setThumbnailFile(null)
    setImageFiles([])
    setUploadedImagePreviewUrls([])
    setSelectedUploadedImageIndex(null)
  }

  function handleThumbnailFileChange(file: File | null) {
    setThumbnailFile(file)
    if (file) {
      setSelectedUploadedImageIndex(null)
    }
  }

  function handleImageFilesChange(files: File[]) {
    setImageFiles(files)
    setThumbnailFile(null)
    setSelectedUploadedImageIndex(files.length > 0 ? 0 : null)
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

      const shouldUseFormData = Boolean(thumbnailFile || imageFiles.length > 0)

      if (shouldUseFormData) {
        const formData = new FormData()

        if (!editingId && payload.id) {
          formData.append('id', payload.id)
        }

        formData.append('name', payload.name)
        formData.append('description', payload.description)
        formData.append('category', payload.category)
        formData.append('brand', payload.brand)
        formData.append('price', String(payload.price))
        formData.append('oldPrice', payload.oldPrice == null ? '' : String(payload.oldPrice))
        formData.append('stock', String(payload.stock))
        formData.append('sold', String(payload.sold))
        if (!thumbnailFile) {
          formData.append('thumbnail', payload.thumbnail)
        }
        formData.append('images', JSON.stringify(payload.images))
        formData.append('specs', JSON.stringify(payload.specs))
        formData.append('isFeatured', String(payload.isFeatured))
        formData.append('isNew', String(payload.isNew))

        if (
          selectedUploadedImageIndex != null &&
          selectedUploadedImageIndex >= 0 &&
          selectedUploadedImageIndex < imageFiles.length
        ) {
          formData.append('thumbnailImageIndex', String(selectedUploadedImageIndex))
        }

        if (thumbnailFile) {
          formData.append('thumbnail', thumbnailFile)
        }

        imageFiles.forEach((file) => {
          formData.append('images', file)
        })

        if (editingId) {
          await updateAdminProduct(editingId, formData)
        } else {
          await createAdminProduct(formData)
        }
      } else if (editingId) {
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
    setThumbnailFile(null)
    setImageFiles([])
    setSelectedUploadedImageIndex(null)
    requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  return (
    <section className="page-stack reveal-up">
      <p className="eyebrow">Quản trị sản phẩm</p>
      <h1 className="page-title">Quản lý sản phẩm</h1>

      <form ref={formRef} className="placeholder-card admin-product-form" onSubmit={handleSubmit}>
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
            <input
              value={form.thumbnail}
              onChange={(event) => {
                updateField('thumbnail', event.target.value)
                setSelectedUploadedImageIndex(null)
              }}
            />
          </label>

          <label className="field">
            <span>Tải thumbnail mới (tùy chọn)</span>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={(event) => handleThumbnailFileChange(event.target.files?.[0] ?? null)}
            />
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
          <span>Tải thêm ảnh sản phẩm (tùy chọn)</span>
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            multiple
            onChange={(event) => handleImageFilesChange(Array.from(event.target.files || []))}
          />
        </label>

        {existingImageChoices.length > 0 ? (
          <div className="field">
            <span>Chọn ảnh hiển thị từ ảnh hiện có</span>
            <div className="product-image-choice-grid">
              {existingImageChoices.map((imageUrl) => {
                const isActive = selectedUploadedImageIndex == null && form.thumbnail.trim() === imageUrl

                return (
                  <button
                    key={`existing-${imageUrl}`}
                    type="button"
                    className={`product-image-choice ${isActive ? 'is-active' : ''}`}
                    onClick={() => {
                      updateField('thumbnail', imageUrl)
                      setThumbnailFile(null)
                      setSelectedUploadedImageIndex(null)
                    }}
                    title="Đặt làm ảnh hiển thị"
                  >
                    {isLikelyImageUrl(imageUrl) ? (
                      <img src={imageUrl} alt="Ảnh sản phẩm" className="product-image-choice-thumb" />
                    ) : (
                      <span className="product-image-choice-fallback">{imageUrl}</span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        ) : null}

        {uploadedImagePreviewUrls.length > 0 ? (
          <div className="field">
            <span>Chọn ảnh hiển thị từ ảnh vừa tải lên</span>
            <div className="product-image-choice-grid">
              {uploadedImagePreviewUrls.map((imageUrl, index) => {
                const isActive = selectedUploadedImageIndex === index

                return (
                  <button
                    key={`uploaded-${imageUrl}`}
                    type="button"
                    className={`product-image-choice ${isActive ? 'is-active' : ''}`}
                    onClick={() => {
                      setSelectedUploadedImageIndex(index)
                      setThumbnailFile(null)
                    }}
                    title="Đặt làm ảnh hiển thị"
                  >
                    <img src={imageUrl} alt={`Ảnh tải lên ${index + 1}`} className="product-image-choice-thumb" />
                  </button>
                )
              })}
            </div>
          </div>
        ) : null}

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
