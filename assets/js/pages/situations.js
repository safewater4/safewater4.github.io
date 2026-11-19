/* pages/situations.js – danh sách tình huống (#ths) và trang chi tiết (#situation, ?id=…) */
(function(){
  const {situations}=SW.data;

  const list=$('#ths');
  if(list){
    list.innerHTML=situations.map(t=>`<a class="card tile" href="tinh-huong-chi-tiet.html?id=${t.id}"><div class="ph">🎞️</div><h3>Tình huống ${t.id}: ${t.title}</h3></a>`).join('');
  }

  const box=$('#situation');
  if(box){
    const t=situations.find(x=>x.id==SW.param('id'));
    if(!t){location.replace('tinh-huong.html');return}
    document.title=`Tình huống ${t.id}: ${t.title} – SafeWater`;
    $('#situation-title').textContent=`Tình huống ${t.id}: ${t.title}`;
    box.innerHTML=`<div><div class="ph">▶️ Video tình huống</div><div class="ph" style="margin-top:8px">🖼️ Ảnh minh họa</div></div><div class="card"><p>${t.story}</p><p class="mu">${t.note}</p><textarea style="width:100%" rows="4" placeholder="Em sẽ làm gì? Viết suy nghĩ của em…"></textarea></div>`;
  }
})();
