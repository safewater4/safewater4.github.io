/* pages/home.js – trang chủ: số liệu chạy, bong bóng, linh vật, thẻ cảnh báo, lợi ích & Bảng vàng vinh danh */
(function(){
  const {warnings,benefits,mascotSays}=SW.data;
  const homeIcons={'🏞️':'pond','🌊':'flood','🪣':'bucket','🏊':'supervised','🛟':'vest','🧯':'rescue','🚑':'medical','🏡':'family'};
  const homeIcon=key=>`<svg class="i3 home-icon" aria-hidden="true" focusable="false"><use href="#hc-${homeIcons[key]}"/></svg>`;

  /* Lợi ích khi có kiến thức */
  if ($('#ben')) {
    $('#ben').innerHTML=benefits.map(b=>`<div class="card"><div class="big">${homeIcon(b.icon)}</div><b>${b.title}</b><br><span class="mu">${b.text}</span></div>`).join('');
  }

  /* Thẻ cảnh báo: chạm để mở/đóng lời giải thích */
  if ($('#warn')) {
    $('#warn').innerHTML=warnings.map(w=>`<div class="wc" style="background:linear-gradient(135deg,${w.colors})"><span class="em">${homeIcon(w.icon)}</span><h3>${w.title}</h3><span>Chạm để xem ▸</span><p>${w.text}</p></div>`).join('');
    $$('#warn .wc').forEach(c=>c.onclick=()=>c.classList.toggle('o'));
  }

  /* Số liệu chạy từ 0 → giá trị (data-n = số, data-p = tiền tố, data-s = hậu tố) */
  const count=()=>$$('.num').forEach(e=>{
    const n=+e.dataset.n,t0=performance.now();
    const f=t=>{
      const p=Math.min((t-t0)/1800,1);
      e.textContent=(e.dataset.p||'')+Math.round(n*p).toLocaleString('vi-VN')+(e.dataset.s||'');
      p<1&&requestAnimationFrame(f);
    };
    requestAnimationFrame(f);
  });
  count();
  $$('.stt').forEach(s=>s.onclick=count);

  /* Bong bóng bay trong hero: chạm để làm vỡ */
  const heroEl = $('.hero2');
  if (heroEl) {
    for(let i=0;i<14;i++){
      const b=document.createElement('i');b.className='bb';
      const z=8+Math.random()*22;
      b.style.cssText=`left:${Math.random()*100}%;width:${z}px;height:${z}px;animation-delay:${Math.random()*6}s;animation-duration:${5+Math.random()*6}s`;
      b.onclick=()=>b.remove();
      heroEl.appendChild(b);
    }
  }

  /* Linh vật Giọt nước SafeBuddy: mỗi lần chạm đổi câu nói */
  let k=0;
  if ($('.mc')) {
    $('.mc').onclick=()=>{k=(k+1)%mascotSays.length;$('#bub').textContent=mascotSays[k]};
  }

  /* ==========================================================
     BẢNG VÀNG VINH DANH TRANG CHỦ & HIỆU ỨNG CHUYỂN ĐỘNG BẮT MẮT
     ========================================================== */
  const api = window.SW.leaderboard;
  const updateHomeList = api.mountList($('#home-ranking-list'));

  function escapeHtml(value) {
    const entities = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
    return String(value ?? '').replace(/[&<>"']/g, char => entities[char]);
  }

  function animateCounter(el, target, suffix = '') {
    if (!el) return;
    const duration = 1400;
    const start = 0;
    const startTime = performance.now();

    function update(time) {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Easing out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (target - start) * eased);
      el.textContent = `${current}${suffix}`;
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = `${target}${suffix}`;
      }
    }
    requestAnimationFrame(update);
  }

  function fireConfetti(colType = 'gold') {
    if (!window.confetti) return;
    let colors = ['#fbbf24', '#f59e0b', '#0a84d6', '#00b4d8', '#ffffff'];
    if (colType === 'silver') colors = ['#94a3b8', '#cbd5e1', '#0a84d6', '#ffffff'];
    if (colType === 'bronze') colors = ['#ea580c', '#fdba74', '#0a84d6', '#ffffff'];

    window.confetti({
      particleCount: 55,
      spread: 60,
      origin: { y: 0.65 },
      colors
    });
  }

  async function renderHomeLeaderboard() {
    const podiumEl = $('#home-podium-area');
    const { entries: list, stale } = await api.getLeaderboard();
    $('#home-lb-status').textContent = stale ? 'Đang mất kết nối. Bảng có thể chưa cập nhật.' : 'Trực tiếp từ hệ thống thi';
    updateHomeList(list);
    const top1 = list[0] || { name: 'Chưa có', cls: '-', score: 0 };
    const top2 = list[1] || { name: 'Chưa có', cls: '-', score: 0 };
    const top3 = list[2] || { name: 'Chưa có', cls: '-', score: 0 };

    // 1. Render Bục Vinh Quang Top 3
    podiumEl.innerHTML = `
      <!-- HẠNG 2 (BẠC) -->
      <div class="podium-col rank-2" id="podium-rank-2" title="Chúc mừng Hạng Nhì: ${escapeHtml(top2.name)}">
        <div class="podium-avatar-wrap">
          <div class="podium-crown">🥈</div>
        </div>
        <div class="podium-user-name">${escapeHtml(top2.name)}</div>
        <span class="podium-user-class">${escapeHtml(top2.cls || '-')}</span>
        <div class="podium-base">
          <span class="rank-num">2</span>
          <span class="score-val" id="score-top-2">0đ</span>
        </div>
      </div>

      <!-- HẠNG 1 (VÀNG) -->
      <div class="podium-col rank-1" id="podium-rank-1" title="Quán quân SafeWater: ${escapeHtml(top1.name)} (Chạm để bắn pháo hoa)">
        <div class="podium-avatar-wrap">
          <div class="sparkle-container">
            <span class="sparkle sp-1">✨</span>
            <span class="sparkle sp-2">⭐</span>
            <span class="sparkle sp-3">🌟</span>
          </div>
          <div class="podium-crown">👑</div>
        </div>
        <div class="podium-user-name">${escapeHtml(top1.name)}</div>
        <span class="podium-user-class">${escapeHtml(top1.cls || '-')}</span>
        <div class="podium-base">
          <span class="rank-num">1</span>
          <span class="score-val" id="score-top-1">0đ</span>
        </div>
      </div>

      <!-- HẠNG 3 (ĐỒNG) -->
      <div class="podium-col rank-3" id="podium-rank-3" title="Chúc mừng Hạng Ba: ${escapeHtml(top3.name)}">
        <div class="podium-avatar-wrap">
          <div class="podium-crown">🥉</div>
        </div>
        <div class="podium-user-name">${escapeHtml(top3.name)}</div>
        <span class="podium-user-class">${escapeHtml(top3.cls || '-')}</span>
        <div class="podium-base">
          <span class="rank-num">3</span>
          <span class="score-val" id="score-top-3">0đ</span>
        </div>
      </div>
    `;

    // Hiệu ứng đếm điểm số mượt mà
    animateCounter($('#score-top-1'), top1.score, 'đ');
    animateCounter($('#score-top-2'), top2.score, 'đ');
    animateCounter($('#score-top-3'), top3.score, 'đ');

    // Bắt sự kiện click vào bục để nổ pháo hoa chúc mừng
    $('#podium-rank-1').onclick = () => fireConfetti('gold');
    $('#podium-rank-2').onclick = () => fireConfetti('silver');
    $('#podium-rank-3').onclick = () => fireConfetti('bronze');

    // Cập nhật thông số Thẻ Kỷ Lục Đỉnh Cao ở cột trái
    const recScore = $('#record-score');
    const recTime = $('#record-time');
    const recAcc = $('#record-acc');
    if (recScore) animateCounter(recScore, top1.score, 'đ');
    if (recTime) recTime.textContent = top1.elapsed || '—';
    if (recAcc) recAcc.textContent = top1.correct || '—';
  }

  renderHomeLeaderboard();
  setInterval(() => {
    if (!document.hidden) renderHomeLeaderboard();
  }, 60000);
})();
