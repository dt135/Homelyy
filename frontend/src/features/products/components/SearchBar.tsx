type SearchBarProps = {
  value: string
  onChange: (value: string) => void
}

function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <label className="catalog-search">
      <span>Tìm sản phẩm</span>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="VD: nồi chiên, máy hút bụi..."
      />
    </label>
  )
}

export default SearchBar
