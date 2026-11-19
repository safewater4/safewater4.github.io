/* pages/home.js – trang chủ: số liệu chạy, bong bóng, linh vật, thẻ cảnh báo, lợi ích */
(function(){
  const {warnings,benefits,mascotSays}=SW.data;
  const homeIcons={'🏞️':'pond','🌊':'flood','🪣':'bucket','🏊':'supervised','🛟':'vest','🧯':'rescue','🚑':'medical','🏡':'family'};
  const homeIcon=key=>`<svg class="i3 home-icon" aria-hidden="true" focusable="false"><use href="#hc-${homeIcons[key]}"/></svg>`;

  /* Lợi ích khi có kiến thức */
  $('#ben').innerHTML=benefits.map(b=>`<div class="card"><div class="big">${homeIcon(b.icon)}</div><b>${b.title}</b><br><span class="mu">${b.text}</span></div>`).join('');

  /* Thẻ cảnh báo: chạm để mở/đóng lời giải thích */
  $('#warn').innerHTML=warnings.map(w=>`<div class="wc" style="background:linear-gradient(135deg,${w.colors})"><span class="em">${homeIcon(w.icon)}</span><h3>${w.title}</h3><span>Chạm để xem ▸</span><p>${w.text}</p></div>`).join('');
  $$('#warn .wc').forEach(c=>c.onclick=()=>c.classList.toggle('o'));

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
  for(let i=0;i<14;i++){
    const b=document.createElement('i');b.className='bb';
    const z=8+Math.random()*22;
    b.style.cssText=`left:${Math.random()*100}%;width:${z}px;height:${z}px;animation-delay:${Math.random()*6}s;animation-duration:${5+Math.random()*6}s`;
    b.onclick=()=>b.remove();
    $('.hero2').appendChild(b);
  }

  /* Linh vật Giọt nước SafeBuddy: mỗi lần chạm đổi câu nói */
  let k=0;
  $('.mc').onclick=()=>{k=(k+1)%mascotSays.length;$('#bub').textContent=mascotSays[k]};
})();
