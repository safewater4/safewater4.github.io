/* pages/hazard.js – "Tìm điểm nguy hiểm" (3 màn, có giờ & điểm) + "Em làm cho cảnh an toàn" (kéo thả).
   Dữ liệu: data/hazards.js */
(function(){
  const {hazardScenes:S,safeZones:Z,safeItems}=SW.data;

  /* ===== Tìm điểm nguy hiểm ===== */
  let lv=0,sc=0,tmr,found=0;

  function startLevel(reset){
    if(reset){lv=0;sc=0}
    clearInterval(tmr);
    const s=S[lv];found=0;
    $('#hlv').textContent=lv+1;
    $('#hl').textContent='Tìm điểm nguy hiểm: '+s.name;
    $('#hsc').textContent=sc;
    let t=s.time;$('#htm').textContent=t;$('#hfb').textContent='';
    const sn=$('#hsn');sn.style.background=s.background;
    sn.innerHTML=s.items.map((h,k)=>`<button class="hs" style="left:${h.x}%;top:${h.y}%" data-k="${k}">${h.icon}</button>`).join('');
    const need=s.items.filter(h=>h.danger).length;
    $$('.hs',sn).forEach(b=>b.onclick=()=>{
      const h=s.items[b.dataset.k];
      if(b.dataset.x)return;b.dataset.x=1;
      if(h.danger){
        sc+=10+t;found++;
        b.style.outline='3px solid red';b.style.borderRadius='50%';
        $('#hfb').textContent='✅ '+h.note;$('#hsc').textContent=sc;
        if(found==need){
          clearInterval(tmr);$('#hfb').textContent='🎉 Xong màn! ';
          if(lv<S.length-1){lv++;setTimeout(()=>startLevel(false),1200)}
          else $('#hfb').textContent+='Em đã hoàn thành cả 3 màn!';
        }
      }else{
        sc=Math.max(0,sc-5);$('#hsc').textContent=sc;$('#hfb').textContent='❌ Chỗ này an toàn (-5)';
      }
    });
    tmr=setInterval(()=>{
      $('#htm').textContent=--t;
      if(t<=0){clearInterval(tmr);$('#hfb').textContent='⏰ Hết giờ! Bấm “Chơi lại”.'}
    },1000);
  }

  function hint(){
    const b=[...$$('#hsn .hs')].find(b=>S[lv].items[b.dataset.k].danger&&!b.dataset.x);
    if(b){
      b.style.transform='translate(-50%,-50%) scale(1.5)';
      sc=Math.max(0,sc-3);$('#hsc').textContent=sc;
      setTimeout(()=>b.style.transform='',900);
    }
  }

  /* ===== Em làm cho cảnh an toàn ===== */
  let risk=100,sel=null;
  const updateRisk=()=>{
    $('#rk').textContent=risk+(risk==0?' 🎉 Cảnh đã an toàn!':'');
    $('#rkb').style.width=Math.max(risk,2)+'%';
  };

  function startSafeScene(){
    risk=100;updateRisk();
    $('#ss').innerHTML=Z.map((z,k)=>`<div class="zone" data-k="${k}" style="left:${z.x}%;top:${z.y}%">${z.label}</div>`).join('');
    $('#its').innerHTML='<b>Vật dụng:</b> '+safeItems.map(i=>`<span class="item" draggable="true" data-i="${i.icon}" title="${i.name}">${i.icon}</span>`).join('');
    $$('.item').forEach(e=>{
      e.ondragstart=ev=>ev.dataTransfer.setData('t',e.dataset.i);
      e.onclick=()=>{$$('.item').forEach(x=>x.classList.remove('sel'));e.classList.add('sel');sel=e.dataset.i};
    });
    $$('.zone').forEach(z=>{
      const put=i=>{
        if(z.dataset.d)return;
        if(Z[z.dataset.k].answer==i){
          z.dataset.d=1;z.textContent=i;z.style.background='#1a9f5a99';z.style.fontSize='30px';
          risk-=25;updateRisk();
        }else{
          z.style.background='#e5383b99';setTimeout(()=>z.style.background='',500);
        }
      };
      z.ondragover=e=>e.preventDefault();
      z.ondrop=e=>{e.preventDefault();put(e.dataTransfer.getData('t'))};
      z.onclick=()=>sel&&put(sel);
    });
  }

  $('#hint-btn').onclick=hint;
  $('#replay-btn').onclick=()=>startLevel(true);
  startLevel(true);
  startSafeScene();
  if(location.hash==='#canh-an-toan')setTimeout(()=>$('#ss').scrollIntoView({behavior:'smooth'}),80);
})();
