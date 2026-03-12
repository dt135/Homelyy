type FilterSidebarProps = {
  categories: string[]
  brands: string[]
  selectedCategory: string
  selectedBrand: string
  minPrice: string
  maxPrice: string
  onCategoryChange: (value: string) => void
  onBrandChange: (value: string) => void
  onMinPriceChange: (value: string) => void
  onMaxPriceChange: (value: string) => void
  onReset: () => void
}

function FilterSidebar({
  categories,
  brands,
  selectedCategory,
  selectedBrand,
  minPrice,
  maxPrice,
  onCategoryChange,
  onBrandChange,
  onMinPriceChange,
  onMaxPriceChange,
  onReset,
}: FilterSidebarProps) {
  return (
    <aside className="catalog-filter-card">
      <div className="catalog-filter-header">
        <h3>Bộ lọc</h3>
        <button type="button" className="inline-link" onClick={onReset}>
          Đặt lại
        </button>
      </div>

      <label className="field">
        <span>Danh mục</span>
        <select value={selectedCategory} onChange={(event) => onCategoryChange(event.target.value)}>
          <option value="">Tất cả danh mục</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </label>

      <label className="field">
        <span>Thương hiệu</span>
        <select value={selectedBrand} onChange={(event) => onBrandChange(event.target.value)}>
          <option value="">Tất cả thương hiệu</option>
          {brands.map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>
      </label>

      <div className="price-range-grid">
        <label className="field">
          <span>Giá từ</span>
          <input
            type="number"
            min="0"
            step="100000"
            placeholder="0"
            value={minPrice}
            onChange={(event) => onMinPriceChange(event.target.value)}
          />
        </label>
        <label className="field">
          <span>Đến</span>
          <input
            type="number"
            min="0"
            step="100000"
            placeholder="10000000"
            value={maxPrice}
            onChange={(event) => onMaxPriceChange(event.target.value)}
          />
        </label>
      </div>
    </aside>
  )
}

export default FilterSidebar
