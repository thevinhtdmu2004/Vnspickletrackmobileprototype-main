Bạn là Senior UX Designer kiêm Product Analyst.

Hãy tạo một tài liệu trong prototype Figma cho ứng dụng mobile “VNS PickleTrack”.

Mục tiêu:
Tạo tài liệu trực quan mô tả sitemap, luồng màn hình, phân quyền và flow demo cho ứng dụng quản lý học viên Pickleball.

Ứng dụng có 3 vai trò đăng nhập:
1. Admin
2. Coach
3. Học viên / Hội viên

Yêu cầu đầu ra:
- Tạo một page/frame tài liệu tên: “Screen Flow Document”.
- Thiết kế theo dạng documentation board dễ đọc trong Figma.
- Không cần quan tâm công nghệ triển khai.
- Không cần tạo database hoặc logic thật.
- Tập trung vào luồng màn hình và trải nghiệm người dùng.

Phong cách tài liệu:
- Sạch, chuyên nghiệp, dễ đọc.
- Có section rõ ràng.
- Dùng card, flow arrow, bảng ma trận quyền.
- Màu chủ đạo xanh thể thao #0E7C7B.
- Nền sáng #F7F9FA.
- Card trắng #FFFFFF.
- Text chính #1F2933.
- Text phụ #6B7280.
- Warning dùng #E9C46A.
- Danger dùng #E76F51.

Nội dung cần tạo:

# 1. Overview
Tạo section giới thiệu:
- Tên app: VNS PickleTrack
- Mục tiêu: Quản lý học viên Pickleball, lớp học, buổi học, điểm danh, số buổi còn lại, gia hạn gói, báo cáo và sao lưu dữ liệu.
- Đối tượng sử dụng: Admin, Coach, Học viên/Hội viên.

# 2. Role Summary
Tạo bảng 3 cột cho 3 role:

Admin:
- Quản trị toàn hệ thống.
- Quản lý học viên, lớp học, coach, buổi học.
- Điểm danh, gia hạn gói, xem doanh thu, báo cáo, backup.

Coach:
- Vận hành lớp học.
- Xem lớp hôm nay, điểm danh, sửa điểm danh.
- Xem báo cáo lớp/học viên.
- Không xem doanh thu.

Học viên / Hội viên:
- Xem hồ sơ cá nhân.
- Xem số buổi còn lại.
- Xem lịch học, lịch sử học, lịch sử thanh toán.
- Gửi yêu cầu gia hạn.
- Không được điểm danh hoặc xem dữ liệu người khác.

# 3. Login Flow
Vẽ flow:

Splash → Login
Login → Dashboard Admin nếu đăng nhập Admin
Login → Dashboard Coach nếu đăng nhập Coach
Login → Member Dashboard nếu đăng nhập Hội viên

Tài khoản demo:
- Admin: admin / 123456
- Coach: coach / 111111
- Hội viên: member / 222222

# 4. Global Sitemap
Tạo sitemap dạng tree:

VNS PickleTrack
├── Splash
├── Login
├── Admin Area
│   ├── Dashboard Admin
│   ├── Lớp hôm nay
│   ├── Tạo buổi học hôm nay
│   ├── Chi tiết buổi học
│   ├── Điểm danh học viên
│   ├── Học viên
│   ├── Thêm học viên
│   ├── Sửa học viên
│   ├── Chi tiết học viên
│   ├── Gia hạn gói
│   ├── Lịch sử điểm danh
│   ├── Lịch sử thanh toán
│   ├── Lớp học
│   ├── Thêm lớp
│   ├── Sửa lớp
│   ├── Chi tiết lớp
│   ├── Gán học viên vào lớp
│   ├── Báo cáo
│   │   ├── Học viên sắp hết buổi
│   │   ├── Doanh thu tháng
│   │   ├── Lượt học tháng
│   │   ├── Báo cáo theo lớp
│   │   └── Báo cáo học viên
│   └── Cài đặt
│       ├── Sao lưu dữ liệu
│       ├── Xuất CSV
│       ├── Khôi phục dữ liệu — sắp có
│       ├── Quản lý gói học
│       ├── Quản lý người dùng
│       └── Đổi mã PIN
├── Coach Area
│   ├── Dashboard Coach
│   ├── Lớp hôm nay
│   ├── Chi tiết buổi học
│   ├── Điểm danh học viên
│   ├── Học viên trong lớp
│   ├── Báo cáo vận hành
│   └── Đổi mã PIN
└── Member Area
    ├── Member Dashboard
    ├── Lịch học của tôi
    ├── Gói học của tôi
    ├── Lịch sử học của tôi
    ├── Lịch sử thanh toán của tôi
    ├── Yêu cầu gia hạn gói
    ├── Cảnh báo sắp hết buổi
    ├── Liên hệ Coach/Admin
    └── Hồ sơ của tôi

# 5. Admin Flow
Tạo section flow Admin gồm:

Admin Bottom Navigation:
- Trang chủ
- Điểm danh
- Học viên
- Báo cáo
- Cài đặt

Admin Dashboard Flow:
Dashboard Admin → Lớp hôm nay
Dashboard Admin → Thêm học viên
Dashboard Admin → Gia hạn gói
Dashboard Admin → Học viên sắp hết buổi
Dashboard Admin → Sao lưu dữ liệu

Admin Attendance Flow:
Lớp hôm nay → Tạo buổi học hôm nay → Chọn lớp → Xác nhận tạo buổi học → Chi tiết buổi học → Điểm danh học viên → Lưu điểm danh → Success

Admin Student Flow:
Học viên → Thêm học viên → Chi tiết học viên
Học viên → Chi tiết học viên → Sửa học viên
Học viên → Chi tiết học viên → Gia hạn gói
Học viên → Chi tiết học viên → Lịch sử điểm danh
Học viên → Chi tiết học viên → Lịch sử thanh toán

Admin Class Flow:
Lớp học → Thêm lớp học
Lớp học → Chi tiết lớp → Gán học viên
Lớp học → Chi tiết lớp → Tạo buổi học hôm nay
Lớp học → Chi tiết lớp → Sửa lớp

Admin Report Flow:
Báo cáo → Học viên sắp hết buổi
Báo cáo → Doanh thu tháng
Báo cáo → Lượt học tháng
Báo cáo → Báo cáo theo lớp
Báo cáo → Báo cáo học viên

Admin Settings Flow:
Cài đặt → Sao lưu dữ liệu
Cài đặt → Xuất CSV
Cài đặt → Quản lý gói học
Cài đặt → Quản lý người dùng
Cài đặt → Đổi mã PIN

# 6. Coach Flow
Tạo section flow Coach gồm:

Coach Bottom Navigation:
- Trang chủ
- Điểm danh
- Học viên
- Báo cáo
- Cài đặt

Coach Flow:
Dashboard Coach → Lớp hôm nay → Chi tiết buổi học → Điểm danh học viên → Lưu điểm danh

Coach Report Flow:
Báo cáo → Lượt học tháng
Báo cáo → Báo cáo theo lớp
Báo cáo → Báo cáo học viên

Coach không được thấy:
- Doanh thu tháng
- Xu hướng doanh thu
- Báo cáo doanh thu chi tiết
- Quản lý gói học
- Quản lý người dùng
- Backup dữ liệu

# 7. Member / Hội viên Flow
Tạo section flow Hội viên gồm:

Member Bottom Navigation:
- Trang chủ
- Lịch học
- Gói học
- Lịch sử
- Cá nhân

Member Dashboard Flow:
Member Dashboard → Lịch học của tôi
Member Dashboard → Gói học của tôi
Member Dashboard → Lịch sử học của tôi
Member Dashboard → Yêu cầu gia hạn gói
Member Dashboard → Liên hệ Coach/Admin

Member Schedule Flow:
Lịch học của tôi → Buổi học sắp tới
Lịch học của tôi → Buổi học đã qua

Member Package Flow:
Gói học của tôi → Xem tổng buổi / đã học / còn lại
Gói học của tôi → Yêu cầu gia hạn gói

Member History Flow:
Lịch sử → Lịch sử học của tôi
Lịch sử → Lịch sử thanh toán của tôi

Member Profile Flow:
Cá nhân → Hồ sơ của tôi
Cá nhân → Đổi mã PIN
Cá nhân → Liên hệ Admin/Coach
Cá nhân → Đăng xuất

Member không được thấy:
- Điểm danh
- Danh sách toàn bộ học viên
- Doanh thu
- Quản lý lớp
- Backup dữ liệu
- Quản lý gói học
- Quản lý người dùng

# 8. Attendance Rule
Tạo bảng quy tắc điểm danh:

Có mặt → Trừ buổi: Có
Trễ → Trừ buổi: Có
Học bù → Trừ buổi: Có
Vắng → Trừ buổi: Không
Nghỉ phép → Trừ buổi: Không

Lưu ý:
- Đây là nghiệp vụ quan trọng nhất.
- Học bù phải được tính là trừ buổi.

# 9. Permission Matrix
Tạo bảng ma trận quyền với các cột:
- Screen / Feature
- Admin
- Coach
- Member

Dữ liệu:
Dashboard Admin: Admin Có, Coach Không, Member Không
Dashboard Coach: Admin Không, Coach Có, Member Không
Member Dashboard: Admin Không, Coach Không, Member Có
Lớp hôm nay: Admin Có, Coach Có, Member Không
Điểm danh học viên: Admin Có, Coach Có, Member Không
Danh sách học viên toàn hệ thống: Admin Có, Coach Giới hạn, Member Không
Chi tiết học viên: Admin Có, Coach Giới hạn, Member Chỉ bản thân
Gia hạn gói: Admin Có, Coach Không, Member Gửi yêu cầu
Doanh thu tháng: Admin Có, Coach Không, Member Không
Báo cáo vận hành: Admin Có, Coach Có, Member Không
Backup dữ liệu: Admin Có, Coach Không, Member Không
Quản lý gói học: Admin Có, Coach Không, Member Không
Quản lý người dùng: Admin Có, Coach Không, Member Không
Lịch học của tôi: Admin Không, Coach Không, Member Có
Gói học của tôi: Admin Không, Coach Không, Member Có
Hồ sơ của tôi: Admin Không, Coach Không, Member Có

# 10. Demo Flows
Tạo 7 demo flow dạng card:

Demo 1 — Admin điểm danh:
Login Admin → Dashboard Admin → Lớp hôm nay → Chi tiết buổi học → Điểm danh học viên → Lưu điểm danh

Demo 2 — Admin thêm học viên và gia hạn:
Login Admin → Học viên → Thêm học viên → Chi tiết học viên → Gia hạn gói → Success

Demo 3 — Admin tạo lớp và gán học viên:
Login Admin → Lớp học → Thêm lớp → Chi tiết lớp → Gán học viên → Lưu

Demo 4 — Coach điểm danh:
Login Coach → Dashboard Coach → Lớp hôm nay → Điểm danh học viên → Lưu điểm danh

Demo 5 — Hội viên xem thông tin:
Login Member → Member Dashboard → Gói học của tôi → Lịch học của tôi → Lịch sử học → Hồ sơ của tôi

Demo 6 — Hội viên yêu cầu gia hạn:
Login Member → Gói học của tôi → Yêu cầu gia hạn → Gửi yêu cầu → Success

Demo 7 — Admin backup:
Login Admin → Cài đặt → Sao lưu dữ liệu → Sao lưu ngay → Sao lưu thành công

# 11. Prototype Demo Checklist
Tạo checklist:
- Login Admin vào đúng Dashboard Admin.
- Login Coach vào đúng Dashboard Coach.
- Login Member vào đúng Member Dashboard.
- Admin xem được doanh thu.
- Coach không xem được doanh thu.
- Member không thấy menu Admin/Coach.
- Điểm danh có đủ 5 trạng thái.
- Học bù được tính là trừ buổi.
- Member gửi được yêu cầu gia hạn.
- Admin backup flow chạy được.

# 12. Visual layout
Hãy thiết kế tài liệu theo layout:
- Header lớn ở trên cùng.
- Bên dưới là 3 role cards.
- Tiếp theo là Login Flow.
- Tiếp theo là Sitemap.
- Sau đó chia 3 lane ngang: Admin Flow, Coach Flow, Member Flow.
- Sau cùng là Permission Matrix, Attendance Rule, Demo Flow và Checklist.

Yêu cầu cuối:
- Tất cả nội dung bằng tiếng Việt.
- Dễ đọc khi zoom trong Figma.
- Dùng icon phù hợp: Shield/Admin, Whistle/Coach, User/Member, Calendar, Clipboard, Wallet, Database.
- Sắp xếp gọn gàng, chuyên nghiệp.