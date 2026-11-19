# TÀI LIỆU KỸ THUẬT: HỆ THỐNG KIỂM TRA & BẢNG XẾP HẠNG (SAFEWATER)
> **Lưu ý**: Tài liệu nội bộ dành cho AI và Lập trình viên quản trị. Không hiển thị ra trang chủ.

---

## 1. Cấu Trúc Thư Mục & File Liên Quan

```
safe-water/
├── assets/
│   └── js/
│       ├── core/
│       │   └── layout.js          # Menu điều hướng toàn site (đã thêm 'kiemtra')
│       ├── data/
│       │   ├── quiz-bank.js       # Ngân hàng 200 câu hỏi (ĐÃ MÃ HÓA nhị phân)
│       │   ├── generate-bank.ps1  # Script tạo ngân hàng câu hỏi gốc
│       │   ├── encrypt-bank.ps1   # Script mã hóa dữ liệu chống học sinh F12
│       │   └── send-test-utf8.ps1 # Script test bắn dữ liệu mẫu tiếng Việt
│       └── pages/
│           └── kiem-tra.js        # Logic thi trắc nghiệm, tính giờ, điểm, Google Sheets
└── kiem-tra/
    └── index.html                 # Giao diện thi 2 cột (Bài thi bên trái, Bảng vàng bên phải)
```

---

## 2. Quy Cách Hoạt Động & Thuật Toán

### A. Ma Trận Đề Thi (10 câu ngẫu nhiên / lần)
- **5 câu Nhận biết (50%)**: Trích xuất ngẫu nhiên từ nhóm `nhanBiet` (100 câu).
- **3 câu Thông hiểu (30%)**: Trích xuất ngẫu nhiên từ nhóm `thongHieu` (60 câu).
- **2 câu Vận dụng (20%)**: Trích xuất ngẫu nhiên từ nhóm `vanDung` (40 câu).
- **Xáo trộn đáp án**: Mỗi câu hỏi tự động tráo đổi vị trí 4 phương án ngẫu nhiên mỗi lượt bốc đề.

### B. Thang Điểm 100 + Thưởng Tốc Độ
- **Điểm kiến thức**: $10 \text{ câu} \times 10đ = 100đ$ tối đa.
- **Thời gian**: $180 \text{ giây}$ (3 phút).
- **Thưởng tốc độ**: $+0.5đ$ cho mỗi giây còn dư trước khi hết giờ.
  $$\text{Tổng điểm} = (\text{Số câu đúng} \times 10) + \text{Round}(\text{Số giây còn lại} \times 0.5)$$

### C. Cơ Chế Chống Gian Lận / Chống Bot
- **Honeypot Field**: `<input id="inp-website" class="hp-field">` ẩn với mắt người. Bot tự điền sẽ bị bỏ qua không lưu.
- **Mã hóa ngân hàng câu hỏi**: Thuật toán XOR `0x5A` + Base64 + Salt băm đáp án đúng `ans_salt_X`. Mở F12 không thể đọc plaintext.

---

## 3. Tích Hợp Google Sheets (2 Chiều)

- **URL Web App**:
  `https://script.google.com/macros/s/AKfycbxihBfQUHiQj6M0TXon-6ufZxjt6a9Lre-jeO3fvsNiE2EwlzTN71Gi2n3V7A6Q8hl3/exec`
- **Phương thức POST**: Nộp kết quả bài thi từ website vào Sheets.
- **Phương thức GET**: Website kéo dữ liệu từ Sheets về vẽ Bảng vàng vinh danh (Top 3 Podium + Top 10 + Toàn bộ).

---

## 4. Bố Cục Giao Diện (Layout 2 Cột)
- **Cột Trái (Main Column)**:
  - Form nhập thông tin thí sinh (Tự focus Họ tên, điền sẵn TH&THCS Nguyễn Du, Thuận Hạnh, Lâm Đồng).
  - Khung làm bài 10 câu kèm đồng hồ đếm ngược.
  - Khung tổng kết kết quả thi.
- **Cột Phải (Sidebar Sticky)**:
  - Bảng Vàng Vinh Danh thiết kế thẻ cao cấp.
  - **Không dùng thanh cuộn (No scrollbar)**, tự fit chiều cao gọn gàng.
  - Bục Podium Top 3 🥇 🥈 🥉 và danh sách Top 10.
