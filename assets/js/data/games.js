/* data/games.js – danh sách trò chơi + câu hỏi của từng trò.
   status:'play' = đã có; 'soon' = khung chờ phát triển.
   page   = tên file trong thư mục tro-choi/ (hoặc đường dẫn từ thư mục gốc nếu bắt đầu bằng "../") */
SW.data.games=[
  {icon:'🚁',glyph:'wave',title:'Biệt đội cứu hộ cao nguyên',sub:'Phiêu lưu 3D & kỹ năng phòng chống đuối nước',tag:'3D MỚI',page:'biet-doi-cuu-ho-cao-nguyen.html',status:'play'},
  {icon:'🛡️',glyph:'mountain',title:'Đội viên tuần tra an toàn',sub:'Nhập vai tuần tra, phát hiện nguy hiểm và giúp người dân',tag:'PHỔ BIẾN',page:'doi-vien-tuan-tra-an-toan.html',status:'play'},
  {icon:'🦸',glyph:'hero',title:'Cuộc chiến cứu người',sub:'Hành động 3D, học cách cứu người an toàn',tag:'3D HÀNH ĐỘNG',page:'cuoc-chien-cuu-nguoi.html',status:'play'},
  {icon:'🃏',glyph:'puzzle',title:'Lật Thẻ Thông Minh',sub:'Lật thẻ tìm cặp hình giống nhau – 100 màn',tag:'TRÍ NHỚ',page:'lat-the-thong-minh.html',status:'play'},
  {icon:'🧩',glyph:'steps',title:'Mê Cung Thủy Quái',sub:'Vượt mê cung, né xoáy nước và đánh bại thủy quái',tag:'PHIÊU LƯU',page:'me-cung-thuy-quai.html',status:'play'}
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
