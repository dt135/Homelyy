import { useEffect, useMemo, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import {
  createAdminCategory,
  deleteAdminCategory,
  fetchAdminCategories,
  type AdminCategory,
  updateAdminCategory,
} from '../services/adminService'
import { getErrorMessage } from '../services/apiClient'

type CategoryForm = {
  id: string
  name: string
}

const initialForm: CategoryForm = {
  id: '',
  name: '',
}

function CategoryManagementPage() {
  const [categories, setCategories] = useState<AdminCategory[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [keyword, setKeyword] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<CategoryForm>(initialForm)
  const formRef = useRef<HTMLFormElement | null>(null)

  async function loadCategories() {
    try {
      setIsLoading(true)
      setErrorMessage('')
      const payload = await fetchAdminCategories()
      setCategories(payload)
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
      setCategories([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadCategories()
  }, [])

  const filteredCategories = useMemo(
    () =>
      categories.filter((category) =>
        category.name.toLowerCase().includes(keyword.trim().toLowerCase()),
      ),
    [categories, keyword],
  )

  function resetForm() {
    setEditingId(null)
    setForm(initialForm)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!form.name.trim()) {
      setErrorMessage('Vui lòng nhập tên danh mục')
      return
    }

    try {
      setIsSubmitting(true)
      setErrorMessage('')

      if (editingId) {
        await updateAdminCategory(editingId, { name: form.name.trim() })
      } else {
        await createAdminCategory({ id: form.id.trim() || undefined, name: form.name.trim() })
      }

      await loadCategories()
      resetForm()
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  function startEdit(category: AdminCategory) {
    setEditingId(category.id)
    setForm({ id: category.id, name: category.name })
    requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  async function handleDelete(categoryId: string) {
    const shouldDelete = window.confirm('Bạn có chắc muốn xóa danh mục này?')
    if (!shouldDelete) {
      return
    }

    try {
      setErrorMessage('')
      await deleteAdminCategory(categoryId)
      await loadCategories()

      if (editingId === categoryId) {
        resetForm()
      }
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    }
  }

  return (
    <section className="page-stack reveal-up">
      <p className="eyebrow">Quản trị danh mục</p>
      <h1 className="page-title">Quản lý danh mục</h1>

      <form ref={formRef} className="placeholder-card admin-edit-form" onSubmit={handleSubmit}>
        <h2>{editingId ? 'Cập nhật danh mục' : 'Tạo danh mục mới'}</h2>

        <div className="placeholder-grid">
          {!editingId ? (
            <label className="field">
              <span>ID (tùy chọn)</span>
              <input
                value={form.id}
                onChange={(event) => setForm((prev) => ({ ...prev, id: event.target.value }))}
              />
            </label>
          ) : null}

          <label className="field">
            <span>Tên danh mục</span>
            <input
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
            />
          </label>
        </div>

        <div className="button-row">
          <button type="submit" className="primary-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Đang lưu...' : editingId ? 'Lưu cập nhật' : 'Tạo danh mục'}
          </button>
          {editingId ? (
            <button type="button" className="ghost-btn" onClick={resetForm}>
              Hủy chỉnh sửa
            </button>
          ) : null}
        </div>
      </form>

      <label className="catalog-search">
        <span>Tìm tên danh mục</span>
        <input
          type="search"
          placeholder="Nhập tên danh mục..."
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
        />
      </label>

      {errorMessage ? <div className="state-card">{errorMessage}</div> : null}
      {isLoading ? <div className="state-card">Đang tải danh sách danh mục...</div> : null}

      {!isLoading ? (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên danh mục</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.map((category) => (
                <tr key={category.id}>
                  <td>{category.id}</td>
                  <td>{category.name}</td>
                  <td>
                    <div className="button-row">
                      <button type="button" className="ghost-btn" onClick={() => startEdit(category)}>
                        Sửa
                      </button>
                      <button
                        type="button"
                        className="ghost-btn"
                        onClick={() => handleDelete(category.id)}
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

export default CategoryManagementPage
