/* data/lessons.js – 4 bài học thẻ.
   parts     : các mảnh infographic (chạm để hiện giải thích)
   trueFalse : câu Đúng/Sai, answer=true nghĩa là câu đó ĐÚNG
   Thêm bài mới: thêm 1 object vào cuối mảng, id tăng dần. */
SW.data.lessons=[
 {id:1,title:'Nhận biết nơi nguy hiểm',
  parts:[
   {icon:'🏞️',title:'Ao, hồ, sông, suối',text:'Nước sâu, bờ trơn, có thể có dòng xoáy.'},
   {icon:'🪣',title:'Trong nhà',text:'Xô, chậu, bể chứa nước nên có nắp đậy.'},
   {icon:'🌧️',title:'Mưa lũ',text:'Không lội, không chơi gần nước dâng.'}],
  trueFalse:[
   {text:'Chỉ cần biết bơi là có thể chơi ở bất cứ đâu.',answer:false},
   {text:'Xô nước lớn trong nhà cũng có thể gây đuối nước ở trẻ nhỏ.',answer:true},
   {text:'Nên tránh xa nước dâng sau mưa lũ.',answer:true}]},
 {id:2,title:'Quy tắc Hô – Ném – Chìa',
  parts:[
   {icon:'📢',title:'HÔ',text:'Kêu to để người lớn đến giúp.'},
   {icon:'🛟',title:'NÉM',text:'Ném phao, can nhựa, chai rỗng đậy kín.'},
   {icon:'🌿',title:'CHÌA',text:'Đưa cành cây, gậy dài cho bạn nắm.'}],
  trueFalse:[
   {text:'Thấy bạn đuối nước, hãy nhảy xuống kéo bạn ngay.',answer:false},
   {text:'Ném vật nổi cho nạn nhân là cách làm an toàn.',answer:true},
   {text:'Việc đầu tiên là hô gọi người lớn.',answer:true}]},
 {id:3,title:'Kỹ năng nổi và tự cứu',
  parts:[
   {icon:'😮‍💨',title:'Bình tĩnh',text:'Hoảng loạn làm chìm nhanh hơn.'},
   {icon:'🧍',title:'Ngả người, ngửa mặt',text:'Giữ mặt trên mặt nước, thở đều.'},
   {icon:'🙋',title:'Vẫy tay kêu cứu',text:'Hô và vẫy tay khi còn sức.'}],
  trueFalse:[
   {text:'Khi bị chìm cần giãy mạnh thật nhanh.',answer:false},
   {text:'Nên ngửa mặt, thở đều để nổi.',answer:true},
   {text:'Vẫy tay kêu cứu là hợp lý.',answer:true}]},
 {id:4,title:'Sơ cứu sau khi cứu lên bờ',
  parts:[
   {icon:'📞',title:'Gọi 115',text:'Gọi cấp cứu ngay, báo vị trí.'},
   {icon:'👀',title:'Kiểm tra',text:'Nạn nhân tỉnh không? Có thở không?'},
   {icon:'❤️',title:'Hồi sinh',text:'Nếu không thở: ép tim – thổi ngạt theo hướng dẫn của 115.'}],
  trueFalse:[
   {text:'Không cần gọi cấp cứu nếu nạn nhân đã ho.',answer:false},
   {text:'Cần kiểm tra ý thức và nhịp thở.',answer:true},
   {text:'Có thể làm theo hướng dẫn của tổng đài 115.',answer:true}]}
];
