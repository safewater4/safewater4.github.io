/* pages/knowledge.js – trang Kiến thức (hub 4 nhóm). Dữ liệu lấy từ data/media.js */
(function(){
  const {videos,situations}=SW.data;

  /* mỗi nhóm: icon, tên, dải màu, danh sách thẻ [icon, tiêu đề, mô tả, đường dẫn trong kien-thuc/] */
  const groups=[
    {icon:'🃏',title:'Bài học an toàn dưới nước',colors:'#ff7e5f,#feb47b',
     cards:[
       ['🌊','Bài 1: An toàn trong môi trường nước','Nhận biết nguy cơ và nguyên tắc an toàn','bai-hoc/bai-hoc-2-an-toan-trong-moi-truong-nuoc.html'],
       ['🏡','Bài 2: Nước quanh nhà','Nhận diện những nơi có nguy cơ đuối nước','bai-hoc/bai-hoc-3-nuoc-quanh-nha-cho-nao-nguy-hiem.html'],
       ['🛶','Bài 3: An toàn khi đi thuyền','Nhớ mặc áo phao khi đi đò, thuyền nhỏ','bai-hoc/bai-hoc-4-di-do-di-thuyen-nho-mac-ao-phao.html'],
       ['🌧️','Bài 4: An toàn mùa mưa bão, lũ lụt','Giữ an toàn khi có mưa bão và lũ lụt','bai-hoc/bai-hoc-5-mua-bao-lu-lut-o-dau-an-toan.html'],
       ['🏊','Bài 5: Xử lý khi bị chuột rút','Bình tĩnh và nổi ngửa khi đang bơi','bai-hoc/bai-hoc-6-chuot-rut-khi-boi-binh-tinh-noi-ngua.html'],
       ['🌀','Bài 6: Gặp vùng nước xoáy','Nhận biết và ứng phó với nước xoáy','bai-hoc/bai-hoc-7-gap-xoay-nuoc-dung-boi-vao-tam.html'],
       ['🏖️','Bài 7: Dòng chảy cuốn ra xa bờ','Cách ứng phó khi gặp dòng chảy xa bờ','bai-hoc/bai-hoc-8-bi-cuon-ra-xa-bo-dung-boi-nguoc-dong.html'],
       ['🛟','Bài 8: Kỹ năng cứu đuối','Hỗ trợ người gặp nạn an toàn cho bản thân','bai-hoc/bai-hoc-9-ky-nang-cuu-duoi-an-toan-cho-ban-than.html']
     ]},
    {icon:'🔍',title:'Nhận diện nguy cơ',colors:'#11998e,#38ef7d',
     cards:[['🏞️','Tìm điểm nguy hiểm','Ao · suối · nhà · trường, 3 độ khó','nhan-dien-nguy-co.html'],
            ['🛠️','Em làm cho cảnh an toàn','Kéo thả vật dụng, giảm thanh nguy cơ','nhan-dien-nguy-co.html#canh-an-toan']]},
    {icon:'🎬',title:'Video',colors:'#8e2de2,#c471ed',inlineVideos:videos,
     cards:videos.map(v=>['▶️',v.title,'Có trắc nghiệm sau video',`video-chi-tiet.html?id=${v.id}`])},
    {icon:'📰',title:'Phân tích tình huống thực tế',colors:'#f12711,#f5af19',
     cards:situations.map(t=>['🎞️',`Tình huống ${t.id}: ${t.title}`,'Video + ảnh + ghi chú',`tinh-huong-chi-tiet.html?id=${t.id}`])}
  ];

  $('#ktm').innerHTML=groups.map((g,groupIndex)=>`
    <div class="kh" style="background:linear-gradient(90deg,${g.colors})"><span class="big">${SW.icon(g.icon)}</span><h2 style="margin:0;color:#fff">${g.title}</h2></div>
    <div class="grid${g.inlineVideos ? ' knowledge-video-grid' : ''}">${g.cards.map((c,index)=>{
      const video = g.inlineVideos?.[index];
      if (video?.youtubeId) {
        return `<article class="card tile knowledge-video-card">
          <h3>${c[1]}</h3>
          ${SW.renderYouTubeLink(video)}
          <a class="b o" href="${c[3]}#vq2">Làm trắc nghiệm</a>
        </article>`;
      }
      if(groupIndex===0){
        return `<a class="card tile lesson-card" href="${c[3]}">
          <img class="lesson-card__image" src="${SW.data.lessonImages[index]}" alt="" loading="lazy" decoding="async" width="512" height="512">
          <span class="lesson-card__number" aria-hidden="true">${String(index+1).padStart(2,'0')}</span>
          <div class="lesson-card__content"><h3>${c[1]}</h3><span class="mu">${c[2]}</span><span class="lesson-card__link" aria-hidden="true">Khám phá bài học <span>↗</span></span></div>
        </a>`;
      }
      return `<a class="card tile" href="${c[3]}"><div class="big">${SW.icon(c[0])}</div><h3>${c[1]}</h3><span class="mu">${c[2]}</span></a>`;
    }).join('')}</div>`).join('');
})();
