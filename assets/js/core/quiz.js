/* ============================================================
   core/quiz.js – bộ máy trắc nghiệm dùng chung (video, game…)
   SW.quiz(phanTuChua, [câu hỏi], tuyChon)
     phanTuChua : phần tử có id (vd. $('#gp'))
     câu hỏi    : {q:'…', o:['A','B','C'], a:chỉ_số_đáp_án_đúng, f:['phản hồi từng đáp án']?}
     tuyChon    : {timer:true}  đếm ngược 10 giây/câu
                  {mt:true}     hiện dãy ⛰️ tăng dần (chế độ Chinh phục đỉnh núi)
   ============================================================ */
SW.quiz=function(el,qs,o={}){
  let i=0,sc=0,tm;
  const r=()=>{
    clearInterval(tm);
    if(i>=qs.length){el.innerHTML=`<div class="card"><h3>🏁 Hoàn thành!</h3>Đúng ${sc}/${qs.length}</div>`;return}
    const q=qs[i];
    el.innerHTML=`<div class="card"><div class="mu">Câu ${i+1}/${qs.length}${o.mt?` · ${'⛰️'.repeat(i+1)}`:''} <b id="qt"></b></div><h3>${q.q}</h3>${q.o.map((x,k)=>`<button class="opt" data-k="${k}">${x}</button>`).join('')}<p id="qf"></p></div>`;
    let t=10;
    const next=()=>{i++;setTimeout(r,1500)};
    const pick=k=>{
      clearInterval(tm);
      $$('#'+el.id+' .opt').forEach(b=>b.disabled=true);
      const ok=k==q.a;if(ok)sc++;
      if(k>=0)$$('#'+el.id+' .opt')[k].classList.add(ok?'ok':'no');
      $$('#'+el.id+' .opt')[q.a].classList.add('ok');
      $('#'+el.id+' #qf').textContent=(k<0?'⏰ Hết giờ! ':'')+(q.f?q.f[k<0?0:k]:ok?'✅ Chính xác!':'❌ Chưa đúng.');
      next();
    };
    $$('#'+el.id+' .opt').forEach(b=>b.onclick=()=>pick(+b.dataset.k));
    if(o.timer){
      const e=$('#'+el.id+' #qt');e.textContent='⏱️ '+t;
      tm=setInterval(()=>{e.textContent='⏱️ '+(--t);if(t<=0)pick(-1)},1000);
    }
  };
  r();
};
