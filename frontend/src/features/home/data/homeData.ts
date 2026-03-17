import type {
  BrandSpotlight,
  CategorySpotlight,
  ProductSpotlight,
  TrustHighlight,
} from '../types'

export const categories: CategorySpotlight[] = [
  {
    id: 'kitchen',
    name: 'Nhà bếp thông minh',
    description: 'Nồi chiên, máy xay, lò nướng và thiết bị giúp tiết kiệm thời gian nấu.',
    imageLabel: 'Góc bếp',
    commandHint: 'Lệnh voice: lọc danh mục nhà bếp',
  },
  {
    id: 'cleaning',
    name: 'Vệ sinh nhà cửa',
    description: 'Máy hút bụi, máy lau nhà và dụng cụ giúp dọn dẹp nhẹ nhàng hơn.',
    imageLabel: 'Thiết bị vệ sinh',
    commandHint: 'Lệnh voice: lọc danh mục vệ sinh',
  },
  {
    id: 'air-care',
    name: 'Không khí và sức khỏe',
    description: 'Máy lọc không khí, máy hút ẩm và thiết bị kiểm soát nhiệt độ.',
    imageLabel: 'Chăm sóc không khí',
    commandHint: 'Lệnh voice: lọc danh mục không khí',
  },
  {
    id: 'smart-living',
    name: 'Nhà thông minh',
    description: 'Thiết bị kết nối app và voice, dễ đồng bộ cho một căn nhà thông minh.',
    imageLabel: 'Nhà thông minh',
    commandHint: 'Lệnh voice: tìm nhà thông minh',
  },
]

export const featuredProducts: ProductSpotlight[] = [
  {
    id: 'af-510',
    name: 'Nồi chiên không dầu LuxAir 5L',
    category: 'Nhà bếp',
    price: 2590000,
    oldPrice: 2990000,
    rating: 4.8,
    sold: 326,
    tag: 'Bán chạy',
  },
  {
    id: 'vc-x2',
    name: 'Máy hút bụi SmartClean X2',
    category: 'Vệ sinh',
    price: 3290000,
    rating: 4.7,
    sold: 204,
    tag: 'Đánh giá cao',
  },
  {
    id: 'bl-pro',
    name: 'Máy xay TurboMix Pro',
    category: 'Nhà bếp',
    price: 1490000,
    rating: 4.6,
    sold: 189,
    tag: 'Phổ biến',
  },
  {
    id: 'ac-guard',
    name: 'Máy lọc không khí AirGuard S',
    category: 'Không khí',
    price: 4190000,
    oldPrice: 4590000,
    rating: 4.9,
    sold: 141,
    tag: 'Cao cấp',
  },
]

export const newArrivals: ProductSpotlight[] = [
  {
    id: 'hm-wave',
    name: 'Lò vi sóng HeatWave 32L',
    category: 'Nhà bếp',
    price: 2890000,
    rating: 4.5,
    sold: 58,
    tag: 'Mới',
  },
  {
    id: 'dry-flow',
    name: 'Máy hút ẩm DryFlow A1',
    category: 'Không khí',
    price: 2390000,
    rating: 4.4,
    sold: 42,
    tag: 'Mới',
  },
  {
    id: 'steam-go',
    name: 'Bàn ủi hơi nước SteamGo Mini',
    category: 'Chăm sóc quần áo',
    price: 990000,
    rating: 4.3,
    sold: 67,
    tag: 'Nổi bật',
  },
  {
    id: 'light-eco',
    name: 'Đèn bàn thông minh LightEco',
    category: 'Nhà thông minh',
    price: 790000,
    rating: 4.6,
    sold: 73,
    tag: 'Xu hướng',
  },
]

export const brands: BrandSpotlight[] = [
  {
    id: 'nova',
    name: 'Nova Home',
    slogan: 'Thiết kế gọn gàng cho nhịp sống thoải mái mỗi ngày',
  },
  {
    id: 'aeris',
    name: 'Aeris',
    slogan: 'Công nghệ không khí cho ngôi nhà đô thị',
  },
  {
    id: 'modena',
    name: 'Modena Kitchen',
    slogan: 'Tối ưu lại trải nghiệm bếp núc hằng ngày',
  },
  {
    id: 'swift',
    name: 'Swift Electric',
    slogan: 'Nguồn điện bền bỉ cho mọi sinh hoạt',
  },
  {
    id: 'hush',
    name: 'HushCare',
    slogan: 'Thiết bị êm ái cho không gian thư thái',
  },
]

export const trustHighlights: TrustHighlight[] = [
  {
    id: 'delivery',
    title: 'Giao nhanh nội thành',
    description: 'Đơn nội thành có thể giao trong ngày, hỗ trợ lắp đặt cơ bản nếu cần.',
    badge: 'Nhanh và đúng hẹn',
  },
  {
    id: 'warranty',
    title: 'Bảo hành chính hãng',
    description: 'Sản phẩm từ thương hiệu uy tín, chính sách bảo hành minh bạch theo từng ngành hàng.',
    badge: 'An tâm sử dụng',
  },
  {
    id: 'support',
    title: 'Tư vấn dễ hiểu',
    description: 'Đội ngũ hỗ trợ giúp chọn đúng sản phẩm theo diện tích nhà và ngân sách gia đình.',
    badge: 'Thân thiện cho mọi nhà',
  },
]
