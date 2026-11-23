# Cấu hình trang Kiểm tra SafeWater

## 1. Nhập đáp án vào Google Sheets

1. Mở bảng tính riêng tư dùng cho trang Kiểm tra. Quyền truy cập bảng tính có thể tiếp tục để **Hạn chế**.
2. Chọn **Tệp → Nhập → Tải lên**, chọn tệp riêng `DapAn-SafeWater.csv` và chọn **Chèn trang tính mới** với dấu phân cách là dấu phẩy.
3. Đổi tên trang tính vừa nhập thành **DapAn**. Hàng đầu có ba cột `id`, `group`, `correctIndex`. Các số từ 0 đến 3 tương ứng với vị trí của phương án trong ngân hàng câu hỏi, trước khi trang xáo trộn.
4. Giữ tệp CSV và bảng đáp án ngoài kho website công khai. Người quản trị cần cập nhật đồng bộ mã câu hỏi, thứ tự phương án và đáp án khi thay đổi ngân hàng. Thực hiện ngoài lúc học sinh đang làm bài.

## 2. Cài Apps Script

1. Trong bảng tính, chọn **Tiện ích mở rộng → Apps Script**. Thay mã cũ của ứng dụng Kiểm tra bằng nội dung [Code.gs](Code.gs).
2. Chọn hàm **setupSafeWaterExam**, bấm **Chạy** và cấp quyền cho tài khoản quản trị. Hàm kiểm tra bảng đáp án, tạo trang **KetQuaKiemTra** và lưu cấu hình nội bộ của dự án.
3. Chọn **Triển khai → Quản lý lượt triển khai**. Nếu dùng lượt triển khai cũ của trang Kiểm tra, chỉnh sửa lượt đó và chọn **Phiên bản mới** để giữ nguyên địa chỉ. Nếu tạo mới, chọn loại **Ứng dụng web**.
4. Chọn thực thi dưới tài khoản của bạn và cấp quyền truy cập **Bất kỳ ai** để học sinh dùng mà không cần đăng nhập. Bảng tính vẫn giữ quyền truy cập riêng. Nếu nhà trường chặn web app truy cập ẩn danh, cần dùng một tài khoản triển khai có quyền này hoặc đổi cách truy cập cho học sinh. [Hướng dẫn triển khai của Google](https://developers.google.com/apps-script/guides/web)
5. Nếu địa chỉ ứng dụng web thay đổi, đặt địa chỉ kết thúc bằng `/exec` vào `GOOGLE_SCRIPT_URL` trong [leaderboard.js](../assets/js/data/leaderboard.js). Đưa bản website mới lên cùng lúc với bản Apps Script mới.

## 3. Kiểm tra trước khi mở cho học sinh

Nếu đã triển khai bản trước, hãy thay toàn bộ mã Apps Script trong tệp hiện tại và triển khai **Phiên bản mới**, rồi cập nhật website. Giữ nguyên tab **DapAn**, không cần nhập lại CSV hay chạy lại hàm thiết lập. Các bài cũ vẫn lưu trong **KetQuaKiemTra**. Bảng Vàng xét các lượt 14 câu để mọi thí sinh được so theo cùng thang chấm. Lượt theo đề cũ còn mở cần bắt đầu lại sau khi cập nhật, nên triển khai ngoài giờ làm bài.

1. Mở địa chỉ `/exec` trong cửa sổ ẩn danh. Khi chưa có bài thi, kết quả là `{"ok":true,"entries":[]}`.
2. Mở trang Kiểm tra trong cửa sổ ẩn danh. Làm thử một bài rồi kiểm tra màn hình kết quả, một dòng mới trong **KetQuaKiemTra** và vị trí trên Bảng Vàng. Thử lại với cùng họ tên, lớp và trường để kiểm tra hai lượt được lưu nhưng chỉ có một vị trí.
3. Thử một số bài nộp gần nhau để kiểm tra thời gian phản hồi. Học sinh có thể bấm nộp lại nếu phản hồi bị gián đoạn. Một lượt đã lưu sẽ trả kết quả cũ mà không ghi thêm dòng.

Mỗi đề bốc 14 câu khác nhau từ 95 nội dung đại diện, gồm 5 câu nhận biết (5 điểm/câu), 5 câu thông hiểu (7 điểm/câu) và 4 câu vận dụng (10 điểm/câu). Một câu vẫn có thể xuất hiện ở hai lượt khác nhau. Khi cập nhật nội dung ngân hàng, kiểm tra lại danh sách mã đại diện `UNIQUE_QUESTION_IDS` trong Apps Script.

Top 10 tích lũy theo tổng điểm, số câu vận dụng đúng, số câu thông hiểu đúng, rồi thời gian ngắn hơn. Thời gian tính từ lúc Apps Script cấp lượt đến lúc nhận bài. Nếu vẫn bằng nhau, bài máy chủ nhận trước đứng trước. Đồng hồ web tự nộp sau 10 phút. Apps Script chấp nhận tối đa 15 giây thêm để bài tự nộp có thời gian đến máy chủ. Tên trùng cả họ tên, lớp và trường sẽ được gộp, nên cần đối chiếu nếu có trường hợp này.

Đáp án và lời giải đã được bỏ khỏi tệp công khai hiện tại. Nếu phiên bản cũ đã được công khai, đáp án có thể vẫn tồn tại trong lịch sử Git hoặc bản sao cũ. Phương án này xác minh điểm từ bài nộp và giữ biểu mẫu đơn giản với họ tên và lớp tự khai.
