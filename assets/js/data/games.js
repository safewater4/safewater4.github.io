/* data/games.js – danh sách trò chơi + câu hỏi của từng trò.
   status:'play' = đã có; 'soon' = khung chờ phát triển.
   page   = tên file trong thư mục tro-choi/ (hoặc đường dẫn từ thư mục gốc nếu bắt đầu bằng "../") */
SW.data.games=[
  {icon:'🌊',glyph:'wave',title:'Mô phỏng đuối nước',sub:'Phản ứng đúng cách khi gặp sự cố',tag:'SẮP CÓ',page:'mo-phong-duoi-nuoc.html',status:'soon'},
  {icon:'🛡️',glyph:'mountain',title:'Đội viên tuần tra an toàn',sub:'Nhập vai tuần tra, phát hiện nguy hiểm và giúp người dân',tag:'PHỔ BIẾN',page:'doi-vien-tuan-tra-an-toan.html',status:'play'},
  {icon:'⏱️',glyph:'clock',title:'Nhận diện tình huống nhanh',sub:'10 giây – một quyết định – một cuộc đời',tag:'THÁCH THỨC',page:'nhan-dien-tinh-huong.html',status:'play'},
  {icon:'🔢',glyph:'steps',title:'Xử lý tình huống đúng thứ tự',sub:'Sắp xếp bước cứu người chuẩn xác',tag:'LOGIC',page:'xu-ly-tinh-huong.html',status:'play'},
  {icon:'🦸',glyph:'hero',title:'Nhập vai cứu người đuối nước',sub:'Trở thành người hùng trong gang tấc (Đồ họa 3D)',tag:'3D HÀNH ĐỘNG',page:'cuoc-chien-cuu-nguoi.html',status:'play'},
  {icon:'🧩',glyph:'puzzle',title:'Ghép cặp biển báo an toàn',sub:'Nhận biết ký hiệu – bảo vệ bản thân',tag:'SẮP CÓ',page:'ghep-cap.html',status:'soon'},
  {icon:'🔍',glyph:'search',title:'Tìm điểm nguy hiểm ẩn nấp',sub:'Phát hiện cạm bẫy trước khi quá muộn',tag:'TRINH THÁM',page:'../kien-thuc/nhan-dien-nguy-co.html',status:'play'}
];

/* Chinh phục đỉnh núi: 5 câu trắc nghiệm */
SW.data.mountainQuiz=[
  {q:'Khi thấy người đuối nước, em làm gì đầu tiên?',o:['Nhảy xuống','Hô gọi người lớn','Quay video'],a:1},
  {q:'Vật nào có thể NÉM cho nạn nhân?',o:['Phao, can nhựa rỗng','Hòn đá','Cái bàn'],a:0},
  {q:'Số cấp cứu y tế ở Việt Nam?',o:['113','114','115'],a:2},
  {q:'Bể chứa nước trong nhà cần gì?',o:['Nắp đậy','Mở cho thoáng','Để trẻ chơi'],a:0},
  {q:'Mưa lũ, nước chảy xiết, em nên?',o:['Lội qua','Tránh xa','Bơi thi'],a:1}
];

/* Nhận diện tình huống: có đếm ngược 10 giây, f = phản hồi riêng cho từng đáp án */
SW.data.recognizeQuiz=[
  {q:'Bạn rủ ra suối tắm khi trời vừa mưa lớn. Em chọn?',o:['Đi cùng','Từ chối, rủ bạn đi chỗ khác','Đi nhưng đứng xa'],a:1,
   f:['Nước dâng nhanh, rất nguy hiểm!','✅ Đúng! Em đã tránh được nguy cơ.','Vẫn còn nguy cơ bị cuốn trôi.']},
  {q:'Bạn trượt chân xuống ao, chưa ai ở gần. Em chọn?',o:['Nhảy xuống cứu','Hô to, tìm phao hoặc gậy dài','Chạy về nhà không nói ai'],a:1,
   f:['Em có thể cùng bị đuối nước!','✅ Hô – Ném – Chìa là an toàn nhất.','Bạn có thể không kịp được cứu.']}
];

/* Xử lý tình huống: các bước theo ĐÚNG thứ tự 1 → 5 (trò sẽ tự xáo trộn khi hiển thị) */
SW.data.rescueSteps=['Hô to gọi người lớn','Ném phao hoặc chìa gậy','Kéo bạn vào bờ an toàn','Kiểm tra ý thức, nhịp thở','Gọi 115 và sơ cứu'];
