/* ============================================================
   core/dom.js – không gian tên SW + tiện ích DOM dùng chung
   Nạp ĐẦU TIÊN trên mọi trang.
   ============================================================ */
window.SW=window.SW||{};
SW.data=SW.data||{};            // dữ liệu nội dung (assets/js/data/*.js)

/* Rút gọn querySelector / querySelectorAll */
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>r.querySelectorAll(s);

/* Thư mục gốc của site, đọc từ <html data-root="../"> (trang ở thư mục con) */
SW.root=document.documentElement.dataset.root||'';
SW.url=p=>SW.root+p;

/* Đọc tham số ?id=… trên địa chỉ trang (dùng cho trang chi tiết) */
SW.param=(k)=>new URLSearchParams(location.search).get(k);

/* Render iframe YouTube nhúng responsive */
SW.renderYouTubeLink = function(v) {
  if (!v || !v.youtubeId) return '';
  return `
    <div style="position:relative;width:100%;padding-top:56.25%;background:#091726;border-radius:14px;overflow:hidden;margin:10px 0">
      <iframe src="https://www.youtube-nocookie.com/embed/${v.youtubeId}?rel=0" title="${v.title || 'Video'}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy" referrerpolicy="strict-origin-when-cross-origin" style="position:absolute;top:0;left:0;width:100%;height:100%;border:none"></iframe>
    </div>
  `;
};
