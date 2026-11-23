/* data/media.js – video và tình huống thực tế.
   Khi có file video thật: thêm  src:'assets/video/ten-file.mp4'  rồi hiển thị bằng <video> trong pages/videos.js */
SW.data.videos=[
 {id:1,title:'Không chơi khu vực nguy hiểm',desc:'Vì sao không nên chơi gần ao, hồ, suối?',
  quiz:{q:'Nơi nào KHÔNG nên chơi một mình?',o:['Ao, hồ không rào','Sân trường','Thư viện'],a:0}},
 {id:2,title:'Xử lý khi bạn trượt chân, đuối nước',desc:'Hô – Ném – Chìa',
  quiz:{q:'Việc đầu tiên khi thấy bạn trượt xuống nước?',o:['Nhảy xuống kéo bạn','Hô to gọi người lớn','Bỏ chạy'],a:1}},
 {id:3,title:'Sơ cứu tại chỗ sau khi đưa bạn lên bờ',desc:'Kiểm tra – gọi 115 – hồi sinh',youtubeId:'hHXM2rZBGbI',
  quiz:{q:'Sau khi đưa nạn nhân lên bờ cần gọi số nào?',o:['115','Số bất kỳ','Không cần gọi'],a:0}}
];
SW.data.situations=[
 {id:1,title:'Trẻ chơi ở ao làng ngày hè',story:'Một nhóm bạn rủ nhau ra ao tắm, không có người lớn.',note:'Ghi chú: Phân tích nguyên nhân, hành vi đúng và sai.'},
 {id:2,title:'Trượt chân ở suối sau mưa',story:'Dòng nước chảy xiết khiến bạn bị cuốn đi.',note:'Ghi chú: Vì sao không nhảy xuống? Dùng vật gì để cứu?'},
 {id:3,title:'Bé ngã vào xô nước ở nhà',story:'Người lớn rời đi vài phút.',note:'Ghi chú: Vai trò của nắp đậy và giám sát.'}
];
