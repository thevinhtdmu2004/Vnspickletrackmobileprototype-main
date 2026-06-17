# TỔNG HỢP NỘI DUNG CHỈNH SỬA & CẬP NHẬT GIAO DIỆN
## VNS PickleTrack — Mobile Prototype (Phiên bản Cập nhật Hội viên & Học viên)

Tài liệu này tổng hợp toàn bộ các chỉnh sửa, cập nhật cấu trúc và tối ưu hóa trải nghiệm người dùng (UX) trên bản Prototype React/Vite của ứng dụng **VNS PickleTrack**.

---

## 1. Tóm tắt các yêu cầu chỉnh sửa đã thực hiện

### 1.1 Trạng thái Động của Vai trò: Hội viên vs. Học viên (hasActivePackage)
*   **Mục tiêu**: Tách biệt rõ ràng trải nghiệm giữa **Hội viên thường** (chưa mua gói học) và **Học viên** (đã có gói học đang hoạt động).
*   **Giải pháp**:
    *   **Thanh điều hướng (Bottom Nav)**: Ẩn hoàn toàn tab **Lịch học** đối với Hội viên thường.
    *   **Trang chủ (Dashboard)**: Ẩn các khu vực chứa thông tin lớp học (Buổi học tiếp theo, Thống kê học tập chuyên cần trong tháng).
    *   **Thao tác nhanh**: Ẩn các nút chức năng nâng cao của học viên (Quá trình học, Xem lịch học, Lịch sử học, Đăng ký học bù, Tài liệu khóa học). Chỉ hiển thị các nút liên quan trực tiếp đến Hội viên: *Đăng ký gói học (được đổi tên tự động từ Yêu cầu gia hạn)*, *Liên hệ Coach*, và *Khám phá khóa học*.

### 1.2 Tái cấu trúc Lịch sử Gói học thành Trang riêng
*   **Mục tiêu**: Gom cụm lịch sử thanh toán hóa đơn của gói học gọn gàng thay vì trải dài dưới màn hình chính của tab Gói học.
*   **Giải pháp**:
    *   Tích hợp bộ chọn Segmented Control ở đầu trang Gói học gồm 2 tab: **Gói hiện tại** (hoặc *Mua gói học* nếu chưa kích hoạt) và **Lịch sử hóa đơn**.
    *   Khi chuyển qua tab **Lịch sử hóa đơn**, người dùng sẽ thấy danh sách hóa đơn lịch sử thanh toán các gói học cũ, cho phép nhấp vào để mở modal xem hóa đơn chi tiết (Mã hóa đơn, ngày thanh toán, tổng tiền, phương thức, trạng thái).

### 1.3 Popup Giỏ hàng & Lịch sử Mua hàng Căn tin (Cửa hàng)
*   **Mục tiêu**: Tối ưu hóa luồng mua nước uống/bóng/dịch vụ tại sân bằng popup tiện lợi có lưu trữ lịch sử mua sắm.
*   **Giải pháp**:
    *   **Chuyển đổi giao diện**: Toàn bộ luồng giỏ hàng, cập nhật số lượng, và nút thanh toán được chuyển vào cấu phần popup trượt lên từ phía dưới (**MemberCartPopup**).
    *   **Tách tab trong Popup**: Popup gồm 2 tab:
        1.  **Sản phẩm đã chọn**: Quản lý các mặt hàng đang chọn và nút Xác nhận thanh toán tại sân.
        2.  **Lịch sử mua hàng**: Hiển thị danh sách các đơn hàng căn tin cũ đã mua lẻ trên sân.
    *   **Trang Cửa hàng (Căn tin)**: Loại bỏ khung checkout cố định ở dưới. Chỉ hiển thị lưới sản phẩm và nút thêm nhanh, bổ sung biểu tượng giỏ hàng ở Header hiển thị số lượng badge sản phẩm thời gian thực. Bấm vào icon này sẽ kích hoạt mở Popup giỏ hàng toàn cục.

### 1.4 Dòng thời gian Lịch sử Hoạt động Tổng hợp trên Profile
*   **Mục tiêu**: Cung cấp một trang nhật ký hoạt động tổng hợp (Unified Activity Timeline) để người dùng xem lại toàn bộ tương tác của mình với hệ thống sân Pickleball.
*   **Giải pháp**:
    *   Bổ sung phần **"Lịch sử hoạt động tổng hợp"** ở trang Cá nhân (Profile).
    *   Timeline tự động tổng hợp: Lịch sử kích hoạt gói tập, điểm danh tham gia lớp học (Có mặt/Vắng/Trễ), lịch sử duyệt học bù và lịch sử thanh toán đơn hàng căn tin.
    *   Đồng bộ hóa trực tiếp: Khi đặt mua nước/bóng thành công từ Popup giỏ hàng, sự kiện lập tức xuất hiện trên Profile timeline.
    *   Lọc thông minh: Khi là Hội viên chưa có gói học, timeline tự động ẩn toàn bộ các sự kiện liên quan tới điểm danh/học bù lớp học.

---

## 2. Chi tiết các Tệp tin thay đổi (File-by-File Changes)

### 2.1 [App.tsx](file:///e:/Projects/thuctap/Vnspickletrackmobileprototype-main/src/app/App.tsx) (Điều phối viên chính)
*   **Thay đổi**:
    *   Import thêm cấu phần `MemberCartPopup`.
    *   Định nghĩa các state toàn cục phục vụ mô phỏng tương tác:
        *   `cartItems`: Danh sách sản phẩm đang nằm trong giỏ hàng.
        *   `isCartOpen`: Điều khiển trạng thái đóng/mở của Popup giỏ hàng.
        *   `isCartOrdered`: Trạng thái đặt hàng thành công của giỏ hiện tại.
        *   `purchaseHistory`: Lưu trữ lịch sử mua nước/bóng căn tin.
    *   Viết các hàm callback đồng bộ: `handleAddToCart`, `handleUpdateCartQuantity`, `handleRemoveFromCart`, `handleCheckoutCart` (khi checkout sẽ tự động tạo một hóa đơn ngẫu nhiên và đẩy vào `purchaseHistory`), và `handleResetCartOrder`.
    *   Truyền các props mới cho các case render: `member-dashboard`, `member-profile`, `member-package`, và `member-cart`.
    *   Render `MemberCartPopup` toàn cục đè lên trên khung thiết bị di động.

### 2.2 [MemberBottomNavigation.tsx](file:///e:/Projects/thuctap/Vnspickletrackmobileprototype-main/src/app/components/MemberBottomNavigation.tsx) (Menu điều hướng)
*   **Thay đổi**:
    *   Đổi tên tab "Giỏ hàng" thành "Cửa hàng", sử dụng biểu tượng `ShoppingBag` thay thế cho `ShoppingCart`.
    *   Nhận prop `hasActivePackage` từ `App.tsx`. Thực hiện lọc danh sách tab khi render để loại bỏ hoàn toàn tab `member-schedule` (Lịch học) nếu `hasActivePackage` là `false`.

### 2.3 [MemberDashboard.tsx](file:///e:/Projects/thuctap/Vnspickletrackmobileprototype-main/src/app/components/MemberDashboard.tsx) (Trang chủ Hội viên)
*   **Thay đổi**:
    *   Nhập thêm icon `ShoppingCart` từ `lucide-react`.
    *   Nhận thêm các props: `onOpenCart` và `cartItemsCount`.
    *   Thiết kế lại góc trên bên phải header: Thêm icon Giỏ hàng có hiển thị số lượng badge màu đỏ, bên cạnh icon Chuông thông báo.
    *   Sử dụng điều kiện `hasActivePackage` để ẩn/hiện:
        *   Card hiển thị "BUỔI HỌC TIẾP THEO" ở trang chủ.
        *   Card thống kê học tập chuyên cần "THÁNG NÀY".
    *   Áp dụng hàm lọc `.filter(...)` trên danh sách thao tác nhanh để ẩn hoàn toàn các tính năng học viên khi chưa mua gói học, đồng thời tự động đổi tên nút Gia hạn thành "Đăng ký gói học" trỏ tới tab Gói học.

### 2.4 [MemberCartScreen.tsx](file:///e:/Projects/thuctap/Vnspickletrackmobileprototype-main/src/app/components/MemberCartScreen.tsx) (Màn hình Cửa hàng)
*   **Thay đổi**:
    *   Loại bỏ toàn bộ phần giỏ hàng, bảng tính tiền và thanh toán cố định ở dưới cùng.
    *   Tái quy hoạch thành trang danh mục sản phẩm sạch sẽ gồm tiêu đề "Cửa hàng & Căn tin" và icon Giỏ hàng ở Header có hiển thị badge số lượng sản phẩm.
    *   Liên kết sự kiện click icon giỏ hàng với callback `onOpenCart` để mở popup.
    *   Liên kết nút "Thêm +" của các thẻ sản phẩm với callback `onAddToCart` để đẩy sản phẩm vào giỏ hàng chung ở `App.tsx`.

### 2.5 [MemberPackageScreen.tsx](file:///e:/Projects/thuctap/Vnspickletrackmobileprototype-main/src/app/components/MemberPackageScreen.tsx) (Quản lý Gói học)
*   **Thay đổi**:
    *   Nhận prop `hasActivePackage`.
    *   Khai báo state `activeTab` để chuyển đổi giữa `'main'` và `'history'`.
    *   Render bộ chọn Segmented Control nằm ở dưới tiêu đề trang trong Header.
    *   Nếu ở tab Gói hiện tại:
        *   Nếu `hasActivePackage = true`: hiển thị card thông tin gói hiện tại, nút gia hạn, gợi ý gói học và lưu ý.
        *   Nếu `hasActivePackage = false`: hiển thị banner cảnh báo chưa đăng ký kèm các gợi ý để đăng ký.
    *   Nếu ở tab Lịch sử hóa đơn: hiển thị danh sách hóa đơn cũ gọn gàng và click mở modal chi tiết hóa đơn.

### 2.6 [MemberProfileScreen.tsx](file:///e:/Projects/thuctap/Vnspickletrackmobileprototype-main/src/app/components/MemberProfileScreen.tsx) (Trang cá nhân)
*   **Thay đổi**:
    *   Nhận các props: `purchaseHistory` và `hasActivePackage`.
    *   Xây dựng mảng dữ liệu lịch sử hoạt động tổng hợp (`allActivities`) bằng cách hợp nhất lịch sử điểm danh vắng/có mặt/học bù mặc định với danh sách mua căn tin động (`purchaseHistory`).
    *   Nếu `hasActivePackage` là `false`, lọc bỏ toàn bộ các dòng điểm danh/học bù lớp học.
    *   Render phần giao diện dòng thời gian (timeline) chuyên nghiệp nằm giữa card Thông tin cá nhân và card Tài khoản.

---

## 3. Hướng dẫn Kịch bản Kiểm thử UAT mẫu (UAT Test Scripts)

Bạn có thể chạy thử nghiệm các luồng tương tác trên bản Prototype theo các bước sau để thấy sự liên kết và đồng bộ trạng thái:

| Bước kiểm thử | Hành động | Kết quả mong đợi | Trạng thái |
|---|---|---|---|
| **1. Đăng ký Gói học** | Nhấp switch simulator trên trang chủ sang "Chưa có gói". | Ẩn tab Lịch học, ẩn card buổi học sắp tới, ẩn thống kê tháng này, ẩn 5 nút của học viên ở Thao tác nhanh. | Thành công |
| **2. Xem Cửa hàng** | Chuyển sang tab "Cửa hàng" dưới Menu. | Chỉ hiển thị danh sách sản phẩm. Badge giỏ hàng ở header đồng bộ số lượng. | Thành công |
| **3. Thêm & Thanh toán** | Nhấn "Thêm +" sản phẩm, sau đó click icon Giỏ hàng ở Header. | Popup giỏ hàng trượt lên, cho phép thay đổi số lượng, nhấn thanh toán. Đơn hàng đặt thành công sẽ tự động ghi nhận vào lịch sử. | Thành công |
| **4. Xem hoạt động Profile** | Chuyển sang tab "Cá nhân" dưới Menu. | Timeline hiển thị sự kiện mua hàng căn tin động vừa thực hiện ở Bước 3. Các sự kiện lớp học vắng mặt/điểm danh vẫn ẩn vì chưa có gói. | Thành công |
| **5. Kích hoạt Học viên** | Nhấp switch simulator sang "Có gói học". | Mở khóa đầy đủ Lịch học, hiện card lớp học sắp tới trên Trang chủ và mở lại toàn bộ timeline điểm danh/học bù lớp học trên Profile. | Thành công |
| **6. Lịch sử Gói học** | Vào tab "Gói học", chuyển sang Segment "Lịch sử hóa đơn". | Xem danh sách hóa đơn cũ, bấm hóa đơn `#INV-109` hiển thị modal thông tin chi tiết. | Thành công |

---
*Dữ liệu trên bản prototype được mô phỏng cục bộ bằng React State cấp cao nhất để phục vụ cho các buổi trình diễn UAT nhanh và độc lập.*
