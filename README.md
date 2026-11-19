# SafeWater

**Website tương tác rất cao về giáo dục phòng, chống đuối nước cho học sinh**  
Đề tài nghiên cứu khoa học học sinh · Năm 2026

SafeWater là website tĩnh được xây dựng bằng HTML, CSS và JavaScript thuần. Dự án không cần cài đặt thư viện hay chạy bước build.

## Bắt đầu sử dụng

1. Mở `index.html` trực tiếp bằng trình duyệt; hoặc
2. Mở thư mục dự án bằng VS Code và chạy bằng extension **Live Server** để tiện sửa và xem.

Một số nội dung bên ngoài, như phông chữ, cần kết nối Internet.

## Nội dung website

- **Trang chủ** — giới thiệu, cảnh báo và lối tắt tới nội dung học tập.
- **Kiến thức** — bài học, nhận diện nguy cơ, video và tình huống.
- **Trò chơi** — các hoạt động tương tác giúp ôn tập kiến thức an toàn dưới nước.
- **Bản đồ** — khu vực có nguy cơ.
- **Trợ lý AI** — hỏi đáp theo nội dung được cấu hình trong dự án.
- **Khảo sát** — khảo sát trước và sau khi xem nội dung.
- **Giới thiệu** — thông tin đề tài và mã QR.
- **Nút SOS** — hướng dẫn các bước ứng phó khi gặp người đuối nước, dùng chung trên các trang.

## Cấu trúc dự án

```text
safe-water/
├── index.html
├── ban-do/
│   └── index.html
├── gioi-thieu/
│   └── index.html
├── khao-sat/
│   └── index.html
├── kien-thuc/
│   ├── index.html
│   ├── bai-hoc.html
│   ├── bai-hoc/                  8 trang bài học chi tiết
│   ├── nhan-dien-nguy-co.html
│   ├── tinh-huong.html
│   ├── tinh-huong-chi-tiet.html
│   ├── video.html
│   └── video-chi-tiet.html
├── tro-choi/
│   ├── index.html
│   └── các trang trò chơi
├── tro-ly-ai/
│   └── index.html
└── assets/
    ├── css/
    │   ├── base.css              Biến màu, reset và kiểu chữ
    │   ├── layout.css            Header, menu, SOS, footer và bố cục
    │   ├── components.css        Thành phần giao diện dùng chung
    │   ├── lesson-layout.css     Bố cục trang bài học
    │   ├── home.css              Giao diện trang chủ
    │   ├── knowledge.css         Giao diện nhóm kiến thức
    │   ├── games.css             Giao diện tương tác
    │   └── ai.css                Giao diện trợ lý AI
    ├── js/
    │   ├── core/                 Hàm nền tảng và thành phần dùng chung
    │   ├── data/                 Nội dung: bài học, game, khảo sát...
    │   ├── icons/                Bộ sprite biểu tượng
    │   └── pages/                Logic của từng trang
    ├── img/                      Thư mục ảnh
    └── video/                    Thư mục video
```

## Cách tổ chức mã nguồn

- Mỗi trang có một file HTML; nội dung trang đặt trong `<main>`.
- Header, menu, hộp thoại SOS và footer được dựng tập trung tại `assets/js/core/layout.js`.
- Nội dung có thể chỉnh sửa được tách trong `assets/js/data/`; xử lý giao diện và tương tác nằm trong `assets/js/pages/`.
- CSS dùng chung được nạp trên các trang; CSS riêng chỉ nạp ở trang cần sử dụng.
- Các trang dùng thuộc tính trên thẻ `<html>`:
  - `data-root`: đường dẫn tương đối về thư mục gốc, thường là `""`, `"../"` hoặc `"../../"`.
  - `data-nav`: khóa mục menu đang được chọn.
  - `data-page="lesson"`: bật điều hướng nhanh cho trang bài học.
- JavaScript được nạp bằng thẻ `<script>` thông thường, không dùng ES module, để hỗ trợ mở trang trực tiếp bằng trình duyệt. Thứ tự cơ bản: `dom.js` → sprite biểu tượng → `icons.js` → `layout.js` → dữ liệu cần thiết → mã trang.

## Hướng dẫn cập nhật

### Thêm bài học

1. Tạo trang trong `kien-thuc/bai-hoc/`, tham khảo một trang bài học hiện có.
2. Đặt `data-root="../../"` và `data-nav="kienthuc"` trên `<html>`.
3. Nạp CSS và JavaScript dùng chung tương tự trang mẫu.
4. Thêm liên kết bài học vào `kien-thuc/bai-hoc.html` và cập nhật logic liên quan trong `assets/js/pages/knowledge.js`.

### Thêm video hoặc tình huống

- Cập nhật nội dung trong `assets/js/data/media.js`.
- Đặt video trong `assets/video/` và cập nhật phần hiển thị tương ứng trong `assets/js/pages/videos.js`.

### Thêm trang mới

1. Tạo thư mục và file HTML mới, tham khảo `ban-do/index.html`.
2. Cập nhật `<title>`, `data-nav` và nội dung `<main>`.
3. Thêm mục điều hướng vào mảng `NAV` trong `assets/js/core/layout.js`.

### Thêm trò chơi

1. Thêm trò chơi vào `SW.data.games` trong `assets/js/data/games.js`.
2. Tạo trang trong `tro-choi/`, tham khảo một trò chơi hiện có.
3. Viết logic riêng trong `assets/js/pages/` và nạp file đó ở cuối trang.
4. Với trò chơi trắc nghiệm, có thể dùng bộ máy `SW.quiz` trong `assets/js/core/quiz.js`.

### Thêm biểu tượng

- Thêm `<symbol>` vào `assets/js/icons/sprite-3d.js` (ID dạng `c-…`) hoặc `assets/js/icons/sprite-line.js` (ID dạng `i-…`).
- Nếu cần tự động đổi emoji trong dữ liệu thành biểu tượng, thêm ánh xạ trong `SW.EMOJI_ICON` tại `assets/js/core/icons.js`.

## Trạng thái và việc cần hoàn thiện

Theo cấu hình trong `assets/js/data/games.js`, các trò chơi có trạng thái `play` đã sẵn sàng; những trò chơi có trạng thái `soon` vẫn là khung chờ.

Các nội dung cần rà soát trước khi công bố:

- Điền thông tin nhóm tác giả, lớp/trường, giáo viên hướng dẫn và liên hệ trong `gioi-thieu/index.html`.
- Thay bản đồ mẫu bằng dữ liệu khu vực nghiên cứu.
- Bổ sung video và ảnh minh họa đang để khung giữ chỗ.
- Đối chiếu số liệu trên trang chủ và ghi nguồn đáng tin cậy, cập nhật.
- Khảo sát hiện lưu trong `localStorage` của từng trình duyệt; cần thêm dịch vụ lưu trữ nếu muốn tổng hợp kết quả từ nhiều học sinh.
- Để hỗ trợ sử dụng ngoại tuyến, tải thư viện QR và phông chữ về dự án rồi cập nhật đường dẫn tương ứng.

## Ghi chú về phiên bản chuyển đổi

Website được tách từ bản một trang dùng điều hướng `#hash` thành nhiều trang HTML riêng; menu dùng liên kết thật và mã QR trỏ đến trang Giới thiệu. Trò chơi được mở trên trang riêng. Dữ liệu được chuyển sang các object có tên thuộc tính, sự kiện được gắn trong JavaScript thay cho `onclick` trong HTML, và thư viện QR chỉ được nạp ở trang cần dùng.

Các lỗi đã sửa trong quá trình chuyển đổi:

1. Chạm vào mảnh infographic bài học không hiển thị lời giải thích.
2. Trả lời một câu Đúng/Sai làm khóa các câu còn lại.
3. Gợi ý “Sơ cứu thế nào?” của Trợ lý AI trả lời nhầm nội dung do thứ tự khớp từ khóa.
