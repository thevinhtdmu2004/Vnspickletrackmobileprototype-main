# 1. Tên UC
Mua / thuê buổi học

## 2. Mô tả UC
Use case này cho phép **Học viên** truy cập khu vực **Cửa hàng & Căn tin** để mua các mặt hàng bán lẻ tại quầy, chủ yếu là nước uống và một số đồ dùng/phụ kiện liên quan, chọn sản phẩm phù hợp, thêm vào giỏ hàng và gửi đơn mua theo nhu cầu cá nhân.

## 3. Tác nhân
- Học viên

## 4. Trigger
Học viên nhấn vào nút **Cửa hàng** trong phần **Thao tác nhanh** trên màn hình **Member Dashboard** hoặc chọn biểu tượng giỏ hàng ở thanh điều hướng dưới để vào màn hình **Cửa hàng & Căn tin**.

## 5. Điều kiện trước
- Học viên đã đăng nhập thành công.
- Tài khoản của Học viên chưa bị khóa hoặc vô hiệu hóa bởi Admin.
- Học viên đang ở màn hình Dashboard Hội viên hoặc một màn hình liên quan trong luồng Member.
- Hệ thống đã có dữ liệu mặt hàng bán lẻ để hiển thị trong Cửa hàng & Căn tin.
- Danh mục hiện tại chủ yếu gồm nước uống, bóng pickleball, vợt, dịch vụ thuê vợt và một số đồ dùng/phụ kiện khác.

## 6. Điều kiện sau
- Đơn mua hàng của Học viên được ghi nhận thành công.
- Giỏ hàng hoặc trạng thái đơn hàng được cập nhật trong hệ thống.
- Nếu cần xác nhận thủ công, đơn sẽ ở trạng thái chờ xử lý bởi nhân viên/quầy bán hàng hoặc Admin theo cấu hình prototype.

## 7. Luồng sự kiện

### 7.1. Luồng sự kiện chính
1. UC bắt đầu khi Học viên chọn chức năng **Mua hàng tại Cửa hàng**.
2. Hệ thống kiểm tra phiên đăng nhập hiện tại (**Include: Đăng nhập**).
3. Hệ thống hiển thị màn hình **Cửa hàng & Căn tin** với danh sách các mặt hàng bán lẻ có thể mua.
4. Học viên chọn một mặt hàng phù hợp trong Cửa hàng & Căn tin.
5. Hệ thống hiển thị chi tiết thông tin sản phẩm/dịch vụ.
6. Học viên kiểm tra thông tin và chọn số lượng cần mua.
7. Học viên nhấn **Thêm +** để đưa mặt hàng vào giỏ hàng.
8. Hệ thống ghi nhận mặt hàng đã chọn trong giỏ hàng mua tại quầy.
9. Học viên xác nhận lại thông tin đơn hàng.
10. Hệ thống lưu đơn mua hàng và hiển thị thông báo thành công.
11. UC kết thúc.

### 7.2. Luồng sự kiện thay thế

#### • A1: Xem chi tiết sản phẩm trong cửa hàng
1. Tại bước 4 luồng chính, Học viên nhấn vào một sản phẩm/dịch vụ trong Cửa hàng.
2. Hệ thống mở màn hình chi tiết sản phẩm.
3. Học viên xem mô tả, quyền lợi, số buổi, giá và trạng thái khả dụng.
4. Học viên quay lại danh sách Cửa hàng để tiếp tục lựa chọn.
5. Luồng quay lại bước 3 của luồng chính.

#### • A2: Thêm mặt hàng vào giỏ hàng
1. Tại bước 7 luồng chính, Học viên chọn **Thêm +** khi đang ở Cửa hàng & Căn tin.
2. Hệ thống đưa mặt hàng vào giỏ hàng cá nhân.
3. Hệ thống cập nhật số lượng mặt hàng trong giỏ nếu có.
4. Học viên có thể tiếp tục chọn thêm nước uống hoặc đồ khác trong Cửa hàng & Căn tin hoặc chuyển sang giỏ hàng.
5. Luồng quay lại bước 9 của luồng chính.

#### • A3: Xem hoặc chỉnh sửa giỏ hàng
1. Tại bước 9 luồng chính, Học viên mở giỏ hàng để kiểm tra lại các mục đã chọn từ Cửa hàng & Căn tin.
2. Hệ thống hiển thị danh sách mặt hàng trong giỏ.
3. Học viên có thể xóa mục, điều chỉnh số lượng hoặc quay lại Cửa hàng & Căn tin để chọn thêm.
4. Học viên xác nhận lại giỏ hàng sau khi chỉnh sửa.
5. Luồng quay lại bước 10 của luồng chính.

#### • A4: Xem lịch sử mua hàng tại cửa hàng
1. Sau khi giao dịch hoàn tất, Học viên có thể mở màn hình lịch sử giao dịch liên quan đến Cửa hàng & Căn tin.
2. Hệ thống hiển thị các đơn hàng đã gửi.
3. Học viên theo dõi trạng thái xử lý.
4. Luồng kết thúc.

### 7.3. Luồng ngoại lệ

#### • E1: Chưa đăng nhập
1. Tại bước 2 luồng chính, nếu phiên đăng nhập không hợp lệ.
2. Hệ thống chuyển đến màn hình Đăng nhập.
3. Học viên phải đăng nhập lại trước khi tiếp tục.
4. UC tạm dừng.

#### • E2: Sản phẩm không còn khả dụng
1. Tại bước 4 hoặc bước 5 luồng chính, nếu sản phẩm/dịch vụ đã hết hoặc bị ẩn.
2. Hệ thống thông báo sản phẩm không còn khả dụng.
3. Học viên quay lại danh sách Cửa hàng để chọn sản phẩm khác.
4. Luồng quay lại bước 3 của luồng chính.

#### • E3: Giỏ hàng rỗng
1. Tại bước 9 luồng chính, nếu Học viên xác nhận khi giỏ hàng chưa có mục nào.
2. Hệ thống báo giỏ hàng rỗng.
3. Học viên phải quay lại chọn sản phẩm trước khi tiếp tục.

#### • E4: Đơn cần quầy hoặc Admin xác nhận
1. Tại bước 10 luồng chính, nếu luồng nghiệp vụ yêu cầu xác nhận thủ công.
2. Hệ thống ghi nhận đơn ở trạng thái **chờ xử lý**.
3. Nhân viên quầy hoặc Admin kiểm tra và xác nhận sau.
4. Học viên xem trạng thái trong lịch sử giao dịch hoặc màn hình liên quan.

## 8. Các yêu cầu khác
- Học viên chỉ được thao tác trên dữ liệu cá nhân của chính mình.
- Học viên không được truy cập các màn hình doanh thu hoặc dữ liệu của người khác.
- Luồng mua / thuê phải phù hợp với quyền Member theo prototype freeze.
- Cửa hàng chỉ hiển thị các mặt hàng bán lẻ tại quầy, không phải danh mục gói học.
- Nghiệp vụ chính là mua nước uống và một số đồ dùng/phụ kiện phục vụ tại sân.
- Giao diện Cửa hàng phải rõ ràng, dễ hiểu và phù hợp mobile-first.
- Nút **Cửa hàng** hiện đang nằm trong phần **Thao tác nhanh** của Member Dashboard và điều hướng tới `member-cart` trong prototype để phục vụ nghiệp vụ mua hàng tại cửa hàng.
