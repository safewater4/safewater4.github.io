/* pages/about.js – trang Giới thiệu: mã QR cho từng trang (cần thư viện qrcode.js nạp trong gioi-thieu/index.html) */
(function(){
  const PAGES=[['Trang chủ','index.html'],['Kiến thức','kien-thuc/index.html'],['Trò chơi','tro-choi/index.html'],['Bản đồ','ban-do/index.html'],['Trợ lý AI','tro-ly-ai/index.html'],['Khảo sát','khao-sat/index.html']];
  const abs=p=>new URL(SW.url(p),location.href).href;     // đường dẫn tuyệt đối để QR quét được
  $('#qrs').innerHTML=PAGES.map(p=>`<div class="card" style="text-align:center"><div class="qr" data-u="${abs(p[1])}" style="display:flex;justify-content:center"></div><b>${p[0]}</b></div>`).join('');
  $$('.qr').forEach(e=>{
    try{new QRCode(e,{text:e.dataset.u,width:110,height:110})}catch(x){e.textContent='[QR]'}
  });
})();
