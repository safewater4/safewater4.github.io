/* pages/videos.js – danh sách video (#vids) và trang chi tiết (#video, ?id=…) kèm trắc nghiệm */
(function(){
  const {videos}=SW.data;

  const list=$('#vids');
  if(list){
    list.innerHTML=videos.map(v=>`<a class="card tile" href="video-chi-tiet.html?id=${v.id}"><div class="ph">▶️</div><h3>Video ${v.id}: ${v.title}</h3><span class="mu">${v.desc} · Chạm để xem và làm trắc nghiệm</span></a>`).join('');
  }

  const box=$('#video');
  if(box){
    const v=videos.find(x=>x.id==SW.param('id'));
    if(!v){location.replace('video.html');return}
    document.title=`Video ${v.id}: ${v.title} – SafeWater`;
    $('#video-title').textContent=`Video ${v.id}: ${v.title}`;
    box.innerHTML=`<div><div class="ph">▶️ Khung video</div><p class="mu">${v.desc}</p></div><div id="vq2"></div>`;
    SW.quiz($('#vq2'),[v.quiz]);
  }
})();
