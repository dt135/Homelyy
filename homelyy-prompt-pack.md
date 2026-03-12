# Homelyy Prompt Pack

Bộ prompt hoàn chỉnh để bắt đầu và triển khai dự án **Homelyy** bằng AI.

## Thông tin dự án

- **Tên dự án:** Homelyy
- **Loại dự án:** Website bán đồ điện gia dụng
- **Frontend:** React
- **Deploy:** Docker
- **Điểm nổi bật:** Voice Control
- **Mục tiêu hiện tại:** Thực hiện dự án, chưa cần phần viết CV

---

## 1) Prompt tổng khởi tạo dự án

```text
Tôi muốn xây dựng một project tên là "Homelyy" – website bán đồ điện gia dụng, theo format thực tế để làm portfolio và dự án cá nhân.

Hãy đóng vai Senior Frontend Engineer + Fullstack Architect để hỗ trợ tôi thiết kế và triển khai dự án này theo hướng production-ready nhưng vẫn phù hợp với trình độ intern/junior.

Thông tin dự án:
- Tên dự án: Homelyy
- Loại dự án: Website bán đồ điện gia dụng
- Frontend sử dụng React
- Dự án được deploy bằng Docker
- Dự án cần có kiến trúc source code rõ ràng, module hóa, dễ maintain, dễ mở rộng
- Ngoài các chức năng e-commerce cơ bản, tôi muốn phát triển thêm tính năng Voice Control để điều khiển giao diện bằng giọng nói
- Voice Control chỉ cần hỗ trợ các lệnh đơn giản như:
  + vào trang chủ
  + mở trang sản phẩm
  + tìm vật phẩm
  + mở giỏ hàng
  + quay lại
  + lọc sản phẩm theo danh mục hoặc giá

Mục tiêu của bạn:
1. Phân tích yêu cầu và đề xuất phạm vi dự án phù hợp.
2. Thiết kế kiến trúc hệ thống tổng thể.
3. Đề xuất cấu trúc dự án chuẩn thực tế.
4. Chia dự án thành các phase rõ ràng để triển khai từng bước.
5. Giúp tôi code từng phần theo trình tự hợp lý.
6. Ưu tiên cách làm dễ hiểu, dễ maintain, không quá phức tạp nhưng nhìn chuyên nghiệp.

Yêu cầu đầu ra:
- Trả lời bằng tiếng Việt
- Trình bày theo từng mục rõ ràng
- Ưu tiên tính thực chiến
- Nếu có nhiều lựa chọn, hãy đề xuất phương án tốt nhất trước
- Không viết phần CV, chỉ tập trung vào xây dựng dự án
```

---

## 2) Prompt chốt tech stack

```text
Dựa trên dự án "Homelyy" là website bán đồ điện gia dụng dùng React, có Voice Control và deploy bằng Docker, hãy giúp tôi chọn tech stack tối ưu nhất.

Tiêu chí:
- phù hợp với intern/junior
- dễ học, dễ làm
- dễ mở rộng
- nhìn chuyên nghiệp
- đủ thực tế như một sản phẩm thật

Hãy đề xuất cụ thể:
1. Frontend framework/library
2. Router
3. State management
4. Styling solution
5. Form handling và validation
6. API client
7. Voice Control nên dùng Web Speech API hay thư viện nào
8. Có nên làm backend không
9. Nếu có backend thì nên dùng stack gì
10. Database nên dùng gì
11. Docker nên tổ chức ra sao
12. Testing có cần không, nếu có thì nên dùng gì
13. Công nghệ nào là bắt buộc cho MVP
14. Công nghệ nào là phần nâng cao

Yêu cầu:
- Mỗi mục hãy chọn 1 phương án tốt nhất trước
- Giải thích ngắn vì sao phù hợp
- Cuối cùng hãy chốt 1 stack final đề xuất cho Homelyy
```

---

## 3) Prompt thiết kế scope + feature list

```text
Hãy giúp tôi xác định scope hợp lý cho dự án Homelyy – website bán đồ điện gia dụng dùng React, có Voice Control và deploy bằng Docker.

Yêu cầu:
1. Liệt kê các tính năng theo nhóm:
   - guest user
   - authenticated user
   - admin
   - voice control
2. Phân loại tính năng thành:
   - MVP
   - nâng cao
   - có thể làm sau
3. Ưu tiên một phạm vi đủ đẹp, đủ thực tế nhưng không quá tải với intern/junior
4. Chỉ ra những tính năng nào là quan trọng nhất để hoàn thành trước
5. Với mỗi nhóm tính năng, giải thích ngắn vì sao nên làm hoặc chưa cần làm

Yêu cầu đầu ra:
- Trình bày rõ ràng
- Tập trung vào triển khai thực tế
- Không lan man lý thuyết
```

---

## 4) Prompt thiết kế user flow

```text
Hãy thiết kế user flow cho dự án Homelyy – website bán đồ điện gia dụng có Voice Control.

Yêu cầu:
1. Thiết kế các flow chính:
   - xem danh sách sản phẩm -> xem chi tiết -> thêm vào giỏ
   - tìm kiếm -> lọc -> xem sản phẩm
   - giỏ hàng -> checkout
   - đăng ký / đăng nhập
   - profile / lịch sử đơn hàng
   - admin quản lý sản phẩm / đơn hàng
   - voice control để điều hướng và tìm kiếm
2. Mỗi flow hãy mô tả tuần tự từng bước
3. Chỉ ra flow nào cần làm trước cho MVP
4. Gợi ý những điểm dễ phát sinh bug hoặc cần lưu ý UX

Yêu cầu:
- Viết rõ ràng, thực tế
- Dùng format dễ đọc
- Phù hợp để làm tài liệu triển khai
```

---

## 5) Prompt thiết kế cấu trúc dự án

```text
Hãy thiết kế cấu trúc dự án chuẩn thực tế cho project Homelyy – website bán đồ điện gia dụng dùng React, có Voice Control, deploy bằng Docker.

Yêu cầu:
- Frontend tổ chức theo kiểu feature-based structure
- Tách rõ các phần:
  + app
  + components
  + features
  + pages
  + services
  + hooks
  + utils
  + assets
  + contexts hoặc store nếu cần
- Có module riêng cho Voice Control
- Nếu cần backend thì đề xuất cấu trúc backend riêng
- Có Dockerfile, docker-compose, nginx config nếu phù hợp
- Có README, .env.example, config files

Đầu ra mong muốn:
1. Cây thư mục hoàn chỉnh dạng tree
2. Giải thích vai trò của từng thư mục chính
3. Naming convention cho component, hook, slice, service, utils
4. Đề xuất cách tổ chức routes
5. Đề xuất cách tổ chức state management
6. Chỉ rõ đâu là phần tối thiểu để dựng MVP trước

Yêu cầu:
- Ưu tiên tính maintainable
- Phù hợp với React project thực tế
- Dễ giải thích khi review code
```

---

## 6) Prompt chọn kiến trúc frontend

```text
Dựa trên dự án Homelyy dùng React, hãy đề xuất kiến trúc frontend phù hợp nhất.

Yêu cầu:
1. Đề xuất cách tổ chức app-level architecture
2. Cách chia reusable components và feature components
3. Cách quản lý state global và local state
4. Cách tổ chức routes public/private/admin
5. Cách xử lý API layer
6. Cách xử lý loading, error, empty state
7. Cách tổ chức constants, helpers, hooks
8. Cách đảm bảo code dễ mở rộng về sau

Yêu cầu đầu ra:
- Trình bày theo hướng thực chiến
- Chọn 1 hướng kiến trúc tốt nhất rồi giải thích ngắn
- Ưu tiên clean code và maintainability
```

---

## 7) Prompt thiết kế database schema

```text
Tôi muốn thiết kế database schema cho dự án Homelyy – website bán đồ điện gia dụng.

Hãy giúp tôi thiết kế schema theo hướng đơn giản nhưng thực tế.

Các entity cần có:
- User
- Product
- Category
- Cart
- Order
- Review
- Wishlist (nếu hợp lý)
- Address (nếu hợp lý)

Yêu cầu:
1. Liệt kê field của từng entity
2. Gợi ý kiểu dữ liệu
3. Nêu quan hệ giữa các bảng / collection
4. Chỉ ra field nào bắt buộc cho MVP
5. Chỉ ra field nào là phần nâng cao
6. Giải thích ngắn logic business chính liên quan đến từng entity

Yêu cầu:
- Thiết kế gọn, thực tế
- Không quá enterprise
- Phù hợp cho intern/junior
```

---

## 8) Prompt thiết kế REST API

```text
Hãy thiết kế REST API cho dự án Homelyy – website bán đồ điện gia dụng.

Yêu cầu:
1. Thiết kế API cho các nhóm:
   - auth
   - products
   - categories
   - cart
   - orders
   - users
   - reviews
   - admin
2. Phân biệt route public, private, admin
3. Với mỗi endpoint, hãy nêu:
   - method
   - path
   - mục đích
   - request body nếu cần
   - response mẫu ngắn
4. Chỉ ra endpoint nào thuộc MVP
5. Chỉ ra validation quan trọng cần có
6. Gợi ý business rules cơ bản

Yêu cầu:
- Trình bày rõ ràng, dễ tra cứu
- Ưu tiên thực tế, không quá phức tạp
```

---

## 9) Prompt dựng roadmap triển khai theo phase

```text
Hãy chia dự án Homelyy thành roadmap triển khai theo phase để tôi có thể làm từng bước.

Thông tin:
- Frontend React
- Có Voice Control
- Deploy bằng Docker
- Có thể có backend đơn giản
- Mục tiêu là hoàn thiện dự án theo hướng production-ready ở mức vừa phải

Yêu cầu:
1. Chia dự án thành các phase rõ ràng
2. Với mỗi phase, nêu:
   - mục tiêu
   - kết quả đầu ra
   - các task cần làm
   - thứ tự ưu tiên
3. Chỉ rõ phase nào là MVP
4. Chỉ rõ phase nào là nâng cao
5. Đề xuất lộ trình hợp lý để tránh bị quá tải

Yêu cầu:
- Thực tế
- Dễ theo dõi
- Có thể dùng như checklist triển khai
```

---

## 10) Prompt khởi tạo frontend base

```text
Tôi muốn bắt đầu code frontend cho dự án Homelyy bằng React.

Hãy hỗ trợ tôi dựng phần base frontend theo hướng production-ready nhưng phù hợp với intern/junior.

Yêu cầu:
1. Đề xuất cấu trúc file ban đầu cho frontend
2. Khởi tạo app setup
3. Cấu hình routing cơ bản
4. Tạo layout chung gồm:
   - Header
   - Footer
   - MainLayout
5. Tạo các trang placeholder ban đầu:
   - HomePage
   - ProductListPage
   - ProductDetailPage
   - CartPage
   - LoginPage
   - RegisterPage
   - ProfilePage
   - NotFoundPage
6. Nếu có state management thì setup phần base luôn
7. Nếu có styling framework thì setup theo stack đã chọn

Yêu cầu format trả lời:
1. Mục tiêu module
2. Danh sách file cần tạo
3. Code từng file
4. Giải thích ngắn
5. Cách chạy và test nhanh

Lưu ý:
- Không code toàn bộ dự án trong một lần
- Chỉ tập trung vào app base và routing/layout
- Ưu tiên code sạch, dễ đọc
```

---

## 11) Prompt làm Home Page

```text
Hãy code HomePage cho dự án Homelyy – website bán đồ điện gia dụng.

Yêu cầu:
- React functional components
- UI hiện đại, sạch, dễ mở rộng
- Có các section:
  + Hero banner
  + Danh mục nổi bật
  + Sản phẩm nổi bật
  + Sản phẩm mới
  + Brands section
  + CTA section
- Dùng mock data tạm thời nếu chưa có API
- Cấu trúc component rõ ràng
- Tách section thành component nếu hợp lý

Hãy trả lời theo format:
1. Mục tiêu
2. Danh sách file
3. Code từng file
4. Giải thích ngắn
5. Cách tích hợp vào app hiện tại
```

---

## 12) Prompt làm Product Listing Page

```text
Hãy code Product Listing Page cho dự án Homelyy.

Yêu cầu:
- Hiển thị danh sách sản phẩm dạng grid
- Có thanh tìm kiếm
- Có bộ lọc theo category, brand, price range
- Có sắp xếp theo giá tăng/giảm, mới nhất, phổ biến
- Có trạng thái loading / empty / error
- Dùng mock data hoặc mock API nếu cần
- Component phải tách hợp lý:
  + ProductGrid
  + ProductCard
  + SearchBar
  + FilterSidebar
  + SortDropdown
- Code theo hướng dễ thay thế bằng API thật sau này

Format trả lời:
1. Mục tiêu
2. File structure
3. Code
4. Giải thích
5. Cách test nhanh
```

---

## 13) Prompt làm Product Detail Page

```text
Hãy code Product Detail Page cho dự án Homelyy.

Yêu cầu:
- Hiển thị chi tiết sản phẩm gồm:
  + tên
  + giá
  + hình ảnh
  + mô tả
  + thông số
  + rating
  + số lượng tồn kho
- Có nút thêm vào giỏ hàng
- Có phần sản phẩm liên quan
- Có loading / error state
- Dễ tích hợp với API thật
- Tổ chức component rõ ràng

Format:
1. Mục tiêu
2. Danh sách file
3. Code
4. Giải thích
5. Cách tích hợp với routing/app
```

---

## 14) Prompt làm Cart Page

```text
Hãy code Cart module cho dự án Homelyy.

Yêu cầu:
- Có CartPage
- Hiển thị danh sách sản phẩm trong giỏ
- Có tăng/giảm số lượng
- Có xóa sản phẩm
- Có tính tổng tiền
- Có nút tiếp tục mua hàng và thanh toán
- Nếu dùng state management thì tổ chức cart state rõ ràng
- Dữ liệu có thể lưu localStorage tạm thời
- Code dễ maintain và dễ mở rộng

Format:
1. Mục tiêu
2. Danh sách file
3. Code từng file
4. Giải thích logic state/cart
5. Cách test nhanh
```

---

## 15) Prompt làm Auth module

```text
Hãy code Auth module cho dự án Homelyy.

Yêu cầu:
- Có LoginPage và RegisterPage
- Có form validation
- UI gọn gàng, thực tế
- Tổ chức code theo feature auth
- Nếu chưa có backend thì mock auth flow tạm thời
- Nếu có backend giả định thì tổ chức api layer sẵn để dễ thay thế
- Có protected route cơ bản cho profile hoặc checkout

Format:
1. Mục tiêu
2. Danh sách file
3. Code từng file
4. Giải thích luồng auth
5. Cách test nhanh
```

---

## 16) Prompt làm Checkout + Order flow

```text
Hãy code checkout flow cơ bản cho dự án Homelyy.

Yêu cầu:
- Có CheckoutPage
- Form thông tin giao hàng
- Chọn phương thức thanh toán giả lập
- Hiển thị order summary
- Validate dữ liệu cơ bản
- Sau khi submit có thể tạo order mock và điều hướng sang trang thành công
- Kiến trúc phải dễ thay thế bằng API thật

Format:
1. Mục tiêu
2. Danh sách file
3. Code
4. Giải thích flow
5. Cách test
```

---

## 17) Prompt làm Profile + Order History

```text
Hãy code Profile module cho dự án Homelyy.

Yêu cầu:
- Có ProfilePage
- Hiển thị thông tin người dùng
- Có khu vực cập nhật profile cơ bản
- Có OrderHistoryPage
- Hiển thị danh sách đơn hàng trước đó bằng mock data nếu chưa có backend
- Tổ chức component rõ ràng
- Có bảo vệ route nếu chưa đăng nhập

Format:
1. Mục tiêu
2. Danh sách file
3. Code
4. Giải thích logic
5. Cách test
```

---

## 18) Prompt làm Admin module

```text
Hãy code module admin cơ bản cho dự án Homelyy.

Yêu cầu:
- Có các trang:
  + AdminDashboardPage
  + ProductManagementPage
  + OrderManagementPage
- UI cơ bản nhưng rõ ràng
- Có mock data nếu chưa có backend
- Có phân quyền route admin đơn giản
- Tổ chức code theo feature admin
- Không cần quá phức tạp, chỉ cần đủ để thể hiện luồng quản trị

Format:
1. Mục tiêu
2. Danh sách file
3. Code
4. Giải thích logic
5. Cách test
```

---

## 19) Prompt thiết kế module Voice Control

```text
Tôi muốn thiết kế module Voice Control cho dự án Homelyy – website bán đồ điện gia dụng dùng React.

Yêu cầu:
1. Thiết kế kiến trúc module Voice Control
2. Đề xuất cấu trúc file cho module này
3. Thiết kế luồng hoạt động:
   - bắt đầu ghi âm
   - nhận speech-to-text
   - parse command
   - xác định intent
   - thực thi action tương ứng
   - hiển thị feedback cho user
4. Phân nhóm command:
   - navigation commands
   - search commands
   - cart commands
   - filter/sort commands
5. Đề xuất cách tích hợp với React Router và state hiện tại
6. Chỉ ra edge cases cần xử lý
7. Đề xuất UI/UX cho nút micro và feedback box

Yêu cầu:
- Cách làm đơn giản nhưng thực tế
- Không dùng NLP phức tạp
- Phù hợp để triển khai thật trong React app
```

---

## 20) Prompt code Voice Control

```text
Hãy code module Voice Control cho dự án Homelyy.

Yêu cầu:
- Dùng React functional components
- Có module riêng, tách rõ:
  + VoiceButton
  + useVoiceCommands hook
  + command parser
  + command config
  + feedback UI
- Hỗ trợ các lệnh:
  + về trang chủ
  + mở trang sản phẩm
  + mở giỏ hàng
  + tìm [tên sản phẩm]
  + quay lại
  + lọc theo category
  + lọc theo giá
- Có xử lý:
  + browser không hỗ trợ speech recognition
  + command không hợp lệ
  + speech nhận sai
- Có thể dùng Web Speech API hoặc react-speech-recognition
- Code phải dễ đọc, dễ maintain

Format:
1. Mục tiêu
2. Danh sách file
3. Code từng file
4. Giải thích cách hoạt động
5. Cách tích hợp vào app Homelyy
6. Cách test nhanh
```

---

## 21) Prompt làm services + API layer

```text
Hãy giúp tôi tổ chức API layer và services cho dự án Homelyy theo hướng dễ maintain.

Yêu cầu:
1. Thiết kế axios client hoặc fetch wrapper
2. Tách service theo feature:
   - authService
   - productService
   - cartService
   - orderService
   - userService
3. Tổ chức error handling cơ bản
4. Tổ chức file constants cho endpoints
5. Đề xuất cách tích hợp với state management

Yêu cầu đầu ra:
- Có file structure
- Có code mẫu rõ ràng
- Hướng tới việc thay mock API bằng API thật sau này
```

---

## 22) Prompt làm mock data / mock API

```text
Tôi chưa muốn làm backend ngay cho Homelyy. Hãy giúp tôi tổ chức mock data và mock API theo cách chuyên nghiệp để frontend vẫn phát triển như đang làm với API thật.

Yêu cầu:
1. Tổ chức mock data cho:
   - products
   - categories
   - users
   - orders
2. Tạo mock service hoặc fake API layer
3. Có giả lập loading và error nếu cần
4. Dễ thay thế bằng backend thật sau này
5. Không để mock data rải rác lung tung trong component

Format:
1. Mục tiêu
2. Danh sách file
3. Code
4. Giải thích cách dùng
```

---

## 23) Prompt làm backend Express

```text
Tôi muốn bắt đầu backend cho dự án Homelyy.

Yêu cầu:
- Dùng Node.js + Express
- Kiến trúc backend rõ ràng, phù hợp với intern/junior nhưng thực tế
- Có các phần:
  + config
  + routes
  + controllers
  + services
  + models
  + middlewares
  + utils
- Hãy dựng backend base gồm:
  1. app setup
  2. server setup
  3. kết nối database
  4. cấu trúc route cơ bản
  5. error handling middleware
  6. env config
  7. Dockerfile backend nếu phù hợp

Format:
1. Mục tiêu
2. Danh sách file
3. Code từng file
4. Giải thích kiến trúc
5. Cách chạy backend
```

---

## 24) Prompt làm Docker deployment

```text
Tôi muốn cấu hình Docker cho dự án Homelyy.

Bối cảnh:
- Frontend React
- Có thể có backend Express
- Muốn chạy local bằng Docker
- Muốn cấu trúc gọn, dễ hiểu, chuyên nghiệp

Yêu cầu:
1. Viết Dockerfile cho frontend production build
2. Nếu cần thì thêm nginx config
3. Nếu có backend thì viết Dockerfile cho backend
4. Viết docker-compose.yml để chạy toàn bộ hệ thống
5. Hướng dẫn cách tổ chức .env và .env.example
6. Nêu các lưu ý quan trọng khi chạy Docker local
7. Cấu hình theo cách đơn giản nhưng thực tế

Format:
1. Mục tiêu
2. Danh sách file
3. Code từng file
4. Giải thích ngắn
5. Cách chạy bằng Docker
```

---

## 25) Prompt tối ưu UI/UX

```text
Hãy review UI/UX cho dự án Homelyy – website bán đồ điện gia dụng.

Yêu cầu:
1. Đề xuất cải thiện trải nghiệm người dùng cho:
   - homepage
   - product listing
   - product detail
   - cart
   - checkout
   - voice control
2. Gợi ý các trạng thái cần có:
   - loading
   - empty
   - error
   - success
3. Gợi ý các tương tác nên thêm:
   - toast
   - skeleton loading
   - disabled button
   - confirm action
4. Chỉ ra các lỗi UX phổ biến cần tránh
5. Đề xuất các cải tiến nhỏ nhưng làm app nhìn chuyên nghiệp hơn

Yêu cầu:
- Tập trung vào tính thực tế
- Không đòi hỏi quá nhiều effort
- Ưu tiên các cải tiến có tác động lớn
```

---

## 26) Prompt review và refactor code

```text
Hãy review codebase dự án Homelyy theo góc nhìn Senior Frontend Engineer.

Yêu cầu:
1. Kiểm tra project structure có hợp lý không
2. Chỉ ra phần nào đang coupling cao hoặc khó maintain
3. Đề xuất refactor cho:
   - components
   - hooks
   - services
   - state management
   - routes
   - Voice Control module
4. Chỉ ra các lỗi phổ biến về naming, file organization, duplicate logic
5. Đề xuất cách cải thiện mà không làm dự án quá phức tạp

Yêu cầu:
- Tập trung vào maintainability
- Chỉ ra vấn đề + cách sửa cụ thể
- Phù hợp với level intern/junior
```

---

## 27) Prompt viết README kỹ thuật cho dự án

```text
Hãy viết README kỹ thuật cho dự án Homelyy.

README cần có:
1. Giới thiệu dự án
2. Tính năng chính
3. Tech stack
4. Cấu trúc thư mục
5. Hướng dẫn cài đặt local
6. Hướng dẫn chạy bằng Docker
7. Danh sách Voice Commands được hỗ trợ
8. Mô tả ngắn về kiến trúc dự án
9. Hướng phát triển tiếp theo

Yêu cầu:
- Viết bằng tiếng Việt hoặc song ngữ nếu phù hợp
- Chỉ tập trung vào kỹ thuật và cách chạy dự án
- Không viết phần CV
- Dùng markdown chuẩn, có thể copy trực tiếp vào README.md
```

---

## 28) Prompt debug lỗi khi đang code

```text
Tôi đang gặp lỗi khi làm dự án Homelyy. Hãy đóng vai Senior Engineer để debug có hệ thống.

Yêu cầu:
1. Phân tích lỗi dựa trên message tôi cung cấp
2. Xác định nguyên nhân có khả năng cao nhất
3. Đề xuất cách sửa ngắn gọn, thực tế
4. Nếu cần sửa code, hãy chỉ rõ file nào cần sửa
5. Nếu có nhiều khả năng, hãy ưu tiên theo thứ tự xác suất
6. Sau khi sửa, hãy gợi ý cách test lại

Đây là lỗi / log / code liên quan:
[PASTE LỖI HOẶC CODE TẠI ĐÂY]
```

---

## 29) Prompt all-in-one mentor cho toàn bộ dự án

```text
Tôi muốn bạn đóng vai Senior Frontend Engineer + Fullstack Architect + Technical Mentor để đồng hành cùng tôi xây dựng dự án "Homelyy".

Thông tin dự án:
- Homelyy là website bán đồ điện gia dụng
- Frontend dùng React
- Dự án deploy bằng Docker
- Kiến trúc source code phải rõ ràng, module hóa, thực tế, dễ maintain
- Có các chức năng e-commerce cơ bản:
  + homepage
  + product listing
  + product detail
  + search
  + filter
  + cart
  + checkout
  + auth
  + profile
- Có thể có admin cơ bản
- Điểm nổi bật là Voice Control để điều hướng UI bằng giọng nói với các lệnh đơn giản:
  + vào trang chủ
  + mở giỏ hàng
  + mở trang sản phẩm
  + tìm [tên sản phẩm]
  + quay lại
  + lọc sản phẩm

Cách bạn cần hỗ trợ tôi:
1. Phân tích yêu cầu và chốt scope phù hợp
2. Đề xuất tech stack tối ưu
3. Thiết kế project structure chuẩn
4. Chia phase triển khai
5. Thiết kế feature list và user flow
6. Thiết kế frontend architecture
7. Thiết kế backend và API nếu cần
8. Thiết kế module Voice Control riêng
9. Hỗ trợ code từng module một, không code cả dự án trong một lần
10. Mỗi module cần có:
   - mục tiêu
   - danh sách file
   - code đầy đủ
   - giải thích ngắn
   - cách test
11. Khi review code, hãy ưu tiên clean code, maintainability, naming rõ ràng
12. Không viết phần CV, chỉ tập trung thực hiện dự án

Yêu cầu:
- Trả lời bằng tiếng Việt
- Ưu tiên thực chiến
- Nếu có nhiều lựa chọn, chọn phương án tốt nhất trước
- Không lan man lý thuyết
- Luôn giữ đúng bối cảnh và kiến trúc của dự án Homelyy trong các câu trả lời tiếp theo
```

---

## 30) Thứ tự nên dùng các prompt

### Giai đoạn 1: Chốt định hướng
1. Prompt tổng khởi tạo dự án  
2. Prompt chốt tech stack  
3. Prompt scope + feature list  
4. Prompt user flow  
5. Prompt cấu trúc dự án  
6. Prompt kiến trúc frontend  

### Giai đoạn 2: Bắt đầu triển khai
7. Prompt roadmap phase  
8. Prompt khởi tạo frontend base  
9. Prompt HomePage  
10. Prompt Product Listing  
11. Prompt Product Detail  
12. Prompt Cart  
13. Prompt Auth  
14. Prompt Checkout  
15. Prompt Profile  

### Giai đoạn 3: Điểm nổi bật
16. Prompt thiết kế Voice Control  
17. Prompt code Voice Control  

### Giai đoạn 4: Dữ liệu và backend
18. Prompt mock data / mock API  
19. Prompt database schema  
20. Prompt REST API  
21. Prompt backend Express  

### Giai đoạn 5: Deploy và hoàn thiện
22. Prompt services + API layer  
23. Prompt Docker deployment  
24. Prompt tối ưu UI/UX  
25. Prompt review/refactor code  
26. Prompt README kỹ thuật  

### Khi có lỗi
27. Prompt debug lỗi

---

## 31) Câu lệnh bổ sung nên gắn cuối prompt khi yêu cầu code

```text
Lưu ý thêm:
- Không code toàn bộ dự án trong một lần.
- Chỉ làm đúng module tôi yêu cầu.
- Trước khi code, hãy nêu ngắn gọn mục tiêu của module.
- Mọi file cần tạo phải được liệt kê rõ path.
- Code phải sạch, dễ đọc, dễ maintain.
- Ưu tiên React functional components.
- Không dùng giải pháp quá phức tạp so với level intern/junior.
- Nếu có nhiều cách làm, chọn cách thực tế nhất.
```

---

## 32) Bộ prompt tối giản nếu muốn bắt đầu ngay

### Prompt 1
Dùng prompt tổng khởi tạo dự án.

### Prompt 2
```text
Dựa trên dự án Homelyy, hãy chốt:
1. tech stack final
2. scope MVP
3. project structure frontend
4. roadmap phase triển khai

Trả lời ngắn gọn nhưng đủ rõ để tôi bắt đầu code.
```

### Prompt 3
```text
Hãy bắt đầu triển khai dự án Homelyy theo roadmap đã chốt.

Module đầu tiên cần làm:
- setup frontend React
- routing
- layout
- các page placeholder cơ bản

Format trả lời:
1. mục tiêu
2. danh sách file
3. code từng file
4. giải thích ngắn
5. cách test
```
