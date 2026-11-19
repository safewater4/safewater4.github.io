/* pages/lessons.js – danh sách bài học (#lcards) và trang chi tiết 1 bài (#lesson, ?id=1…) */
(function(){
  const {lessons}=SW.data;

  /* --- Trang danh sách --- */
  const list=$('#lcards');
  if(list){
    list.innerHTML=lessons.map(l=>`<a class="card tile" href="bai-hoc-chi-tiet.html?id=${l.id}"><div class="big">${l.parts.map(p=>p.icon).join('')}</div><h3>Bài ${l.id}: ${l.title}</h3><span class="mu">Chạm để học</span></a>`).join('');
  }

  /* --- Trang chi tiết --- */
  const box=$('#lesson');
  if(box){
    const l=lessons.find(x=>x.id==SW.param('id'));
    if(!l){location.replace('bai-hoc.html');return}
    document.title=`Bài ${l.id}: ${l.title} – SafeWater`;
    $('#lesson-title').textContent=`Bài ${l.id}: ${l.title}`;
    box.innerHTML=`<div class="card"><h3>Infographic – chạm từng phần</h3>${l.parts.map(p=>`<div class="card tile part" style="margin:6px 0"><span class="big">${p.icon}</span> <b>${p.title}</b><br><span class="part-text" hidden>${p.text}</span></div>`).join('')}</div>
<div class="card"><h3>Đúng hay sai?</h3>${l.trueFalse.map((t,k)=>`<div class="tf"><p>${k+1}. ${t.text}</p><button class="opt" style="display:inline-block;width:auto" data-v="1" data-ans="${t.answer?1:0}">Đúng</button><button class="opt" style="display:inline-block;width:auto" data-v="0" data-ans="${t.answer?1:0}">Sai</button></div>`).join('')}</div>`;

    /* chạm 1 mảnh infographic → hiện lời giải thích */
    $$('.part',box).forEach(p=>p.onclick=()=>{$('.part-text',p).hidden=false});

    /* trả lời Đúng/Sai: chỉ khóa 2 nút của câu vừa trả lời */
    $$('.tf .opt',box).forEach(b=>b.onclick=()=>{
      b.classList.add(b.dataset.v===b.dataset.ans?'ok':'no');
      $$('.opt',b.parentNode).forEach(x=>x.disabled=true);
    });
  }
})();
