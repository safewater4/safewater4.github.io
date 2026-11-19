/* data/chatbot.js – "bộ não" tạm của Trợ lý AI (khớp từ khóa).
   Khi nối AI thật: thay hàm trả lời trong pages/ai.js, giữ nguyên giao diện.
   rules: pattern = biểu thức chính quy khớp câu hỏi; mood = biểu cảm linh vật.
   LƯU Ý: luật được thử từ TRÊN xuống, luật nào khớp trước thì thắng → đặt luật cụ thể (vd. "sơ cứu")
   TRƯỚC luật rộng (vd. "cứu"). */
SW.data.chatbot={
  rules:[
    {pattern:/sơ cứu|bất tỉnh|không thở/i,answer:'Đưa nạn nhân lên bờ, kiểm tra ý thức và hơi thở, gọi 115 ngay và làm theo hướng dẫn ép tim – thổi ngạt của tổng đài viên.',mood:'😮'},
    {pattern:/đuối|cứu|thấy bạn/i,answer:'Hãy HÔ to gọi người lớn, NÉM phao hoặc vật nổi, CHÌA gậy dài. Đừng nhảy xuống nếu em chưa được huấn luyện!',mood:'😟'},
    {pattern:/bơi|ở đâu/i,answer:'Chỉ bơi ở nơi có người lớn và cứu hộ, có phao. Tránh ao hồ, sông suối không rào chắn.',mood:'🤔'},
    {pattern:/phao|dụng cụ/i,answer:'Phao tròn, áo phao, can nhựa rỗng đậy kín đều nổi tốt. Luôn mặc áo phao khi đi thuyền!',mood:'😊'},
    {pattern:/giỏi|cảm ơn|hay/i,answer:'Em thật tuyệt vời! Hãy chia sẻ cho bạn bè nhé 🎉',mood:'🥳'}
  ],
  fallback:{answer:'Mình chưa hiểu rõ. Em thử hỏi về: cứu người, sơ cứu, nơi bơi an toàn, dụng cụ nổi nhé.',mood:'🤔'},
  quickQuestions:['Thấy bạn đuối nước phải làm gì?','Sơ cứu thế nào?']
};
