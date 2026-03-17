import type { ProductQuery } from '../../../types/product'

type SortOption = NonNullable<ProductQuery['sort']>

type SortDropdownProps = {
  value: SortOption
  onChange: (value: SortOption) => void
}

function SortDropdown({ value = 'popular', onChange }: SortDropdownProps) {
  return (
    <label className="catalog-sort">
      <span>Sắp xếp</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as SortOption)}
      >
        <option value="popular">Phổ biến</option>
        <option value="newest">Mới nhất</option>
        <option value="price-asc">Giá tăng dần</option>
        <option value="price-desc">Giá giảm dần</option>
      </select>
    </label>
  )
}

export default SortDropdown
