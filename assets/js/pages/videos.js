/* pages/videos.js – Hiển thị video trực tiếp chia 2 cột không chuyển trang & trang chi tiết kèm trắc nghiệm */
(function(){
  const {videos} = SW.data;

  // Render danh sách video trực tiếp 2 cột trên trang kien-thuc/video.html
  const list = $('#vids');
  if (list && Array.isArray(videos)) {
    list.innerHTML = videos.map(v => `
      <div class="video-card">
        <div class="video-wrapper">
          <iframe 
            src="https://www.youtube-nocookie.com/embed/${v.youtubeId}?rel=0" 
            title="${v.title}" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            allowfullscreen 
            loading="lazy"
            referrerpolicy="strict-origin-when-cross-origin">
          </iframe>
        </div>
        <div class="video-info">
          <div class="video-badge">
            <svg class="i" style="width:14px;height:14px;display:inline-block" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            <span>${v.location || 'Cảnh báo nguy cơ'}</span>
          </div>
          <h3 class="video-title">${v.title}</h3>
          <div class="video-hazard">
            <b>Cảnh báo hiểm họa:</b> ${v.hazard || v.desc}
          </div>
        </div>
      </div>
    `).join('');
  }

  // Khung xem chi tiết kèm câu hỏi trắc nghiệm (nếu truy cập video-chi-tiet.html?id=...)
  const box = $('#video');
  if (box && Array.isArray(videos)) {
    const v = videos.find(x => x.id == SW.param('id')) || videos[0];
    if (!v) { location.replace('video.html'); return; }
    document.title = `Video: ${v.title} – SafeWater`;
    const titleEl = $('#video-title');
    if (titleEl) titleEl.textContent = v.title;
    
    box.innerHTML = `
      <div class="video-card" style="margin-bottom:20px">
        <div class="video-wrapper">
          <iframe 
            src="https://www.youtube-nocookie.com/embed/${v.youtubeId}?rel=0" 
            title="${v.title}" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen
            referrerpolicy="strict-origin-when-cross-origin">
          </iframe>
        </div>
        <div class="video-info">
          <div class="video-hazard">
            <b>Cảnh báo:</b> ${v.hazard || v.desc}
          </div>
        </div>
      </div>
      <div id="vq2"></div>
    `;
    if (v.quiz && typeof SW.quiz === 'function') {
      SW.quiz($('#vq2'), [v.quiz]);
    }
  }
})();
