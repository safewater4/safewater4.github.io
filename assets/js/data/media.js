/* data/media.js – Dữ liệu video cảnh báo nguy cơ thực tế và tình huống SafeWater Lâm Đồng */
window.SW = window.SW || {};
window.SW.data = window.SW.data || {};

SW.data.videos = [
  {
    id: 1,
    title: 'Cầu Bãi Đá',
    location: 'Lâm Đồng',
    hazard: 'Nước chảy xiết xoáy ngầm lực nước đổ từ trên cao tạo ra dòng cuộn mạnh và dễ cuốn trôi.',
    desc: 'Cảnh báo nguy cơ tại Cầu Bãi Đá: Dòng chảy cuộn xoáy ngầm cực mạnh do nước đổ từ trên cao, dễ dàng cuốn trôi người và phương tiện.',
    youtubeId: 'N_gmQ21HPwA',
    quiz: {
      q: 'Mối nguy hiểm lớn nhất tại khu vực Cầu Bãi Đá là gì?',
      o: ['Nước chảy xiết, xoáy ngầm và dòng nước cuộn mạnh', 'Nước hồ cạn có nhiều bùn', 'Nước rất ấm thích hợp để tắm'],
      a: 0
    }
  },
  {
    id: 2,
    title: 'Hồ bạt nhựa',
    location: 'Tây Nguyên / Lâm Đồng',
    hazard: 'Hồ bạt nhựa dốc, cực trơn khiến không thể bám víu để tự trèo lên nằm ở nơi vắng vẻ khó ứng cứu.',
    desc: 'Cảnh báo nguy cơ hồ tưới cà phê lót bạt nhựa: Vách bạt dốc đứng, siêu trơn trượt không thể tự bám trèo lên khi ngã xuống.',
    youtubeId: 'EivNsWgy2Ic',
    quiz: {
      q: 'Tại sao hồ nước lót bạt nhựa nông nghiệp lại đặc biệt nguy hiểm?',
      o: ['Thành bạt dốc đứng và cực trơn, không có điểm tựa để trèo lên bờ', 'Nước hồ có nhiều rêu xanh', 'Hồ nước có sóng lớn như biển'],
      a: 0
    }
  },
  {
    id: 3,
    title: 'Đi thác',
    location: 'Xã Thuận Hạnh, Lâm Đồng',
    hazard: 'Thác xã Thuận Hạnh Nước đổ mạnh tạo dòng cuộn dễ cuốn trôi Bờ đá rêu dễ gây trượt ngã xuống vực sâu',
    desc: 'Cảnh báo nguy cơ tại Thác xã Thuận Hạnh: Lực nước đổ dữ dội tạo vùng xoáy cuộn nguy hiểm, bờ đá phủ rêu trơn dễ trượt chân xuống vực.',
    youtubeId: 'LCRvCeXUKzw',
    quiz: {
      q: 'Đặc điểm nguy hiểm tiềm ẩn tại Thác nước xã Thuận Hạnh là gì?',
      o: ['Lực nước đổ mạnh tạo dòng cuộn và bờ đá rêu trơn trượt', 'Không có bóng cây che nắng', 'Nước suối quá trong nhìn thấy đáy'],
      a: 0
    }
  },
  {
    id: 4,
    title: 'Cầu cháy Đăk Thốt',
    location: 'Đăk Thốt, Lâm Đồng',
    hazard: 'Cầu cháy Đăk Thốt Nước sâu và xoáy mạnh; bờ dốc trơn thành bê tông thẳng đứng không có rào chắn',
    desc: 'Cảnh báo nguy cơ tại Cầu cháy Đăk Thốt: Lòng nước sâu có xoáy ngầm mạnh, thành bê tông dốc đứng trơn trượt không có rào chắn bảo vệ.',
    youtubeId: 'cnsRd9PMSBk',
    quiz: {
      q: 'Khu vực Cầu cháy Đăk Thốt tiềm ẩn rủi ro tai nạn gì?',
      o: ['Vực nước sâu, dòng xoáy mạnh, thành bê tông đứng không rào chắn', 'Lòng suối cạn nước', 'Nước chảy nhẹ nhàng an toàn'],
      a: 0
    }
  }
];

SW.data.situations = [
  {id:1,title:'Trẻ chơi ở ao làng ngày hè',story:'Một nhóm bạn rủ nhau ra ao tắm, không có người lớn.',note:'Ghi chú: Phân tích nguyên nhân, hành vi đúng và sai.'},
  {id:2,title:'Trượt chân ở suối sau mưa',story:'Dòng nước chảy xiết khiến bạn bị cuốn đi.',note:'Ghi chú: Vì sao không nhảy xuống? Dùng vật gì để cứu?'},
  {id:3,title:'Bé ngã vào xô nước ở nhà',story:'Người lớn rời đi vài phút.',note:'Ghi chú: Vai trò của nắp đậy và giám sát.'}
];
