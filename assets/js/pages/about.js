/* pages/about.js – trang Giới thiệu: mã QR động hoàn toàn theo địa chỉ hiện tại */
(function(){
  // Tự động lấy URL tuyệt đối theo tên miền / máy chủ hiện tại (100% dynamic, đổi host tự nhận)
  const abs = p => new URL(SW.url(p), window.location.href).href;

  const PAGES = [
    ['Trang chủ', 'index.html'],
    ['Kiến thức', 'kien-thuc/index.html'],
    ['Trò chơi', 'tro-choi/index.html'],
    ['Bản đồ', 'ban-do/index.html'],
    ['Trợ lý AI', 'tro-ly-ai/index.html'],
    ['Khảo sát', 'khao-sat/index.html']
  ];

  const qrsContainer = $('#qrs');
  if (qrsContainer) {
    qrsContainer.innerHTML = PAGES.map(p => {
      const u = abs(p[1]);
      return `
        <div class="card qr-card">
          <div class="qr-wrap">
            <div class="qr" data-u="${u}"></div>
          </div>
          <a class="qr-title" href="${u}" target="_blank" rel="noopener">${p[0]} ↗</a>
        </div>
      `;
    }).join('');

    $$('.qr').forEach(e => {
      try {
        new QRCode(e, {
          text: e.dataset.u,
          width: 110,
          height: 110,
          colorDark: '#0b2540',
          colorLight: '#ffffff',
          correctLevel: QRCode.CorrectLevel.M
        });
      } catch (err) {
        e.textContent = '[QR]';
      }
    });
  }
})();
