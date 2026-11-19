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
