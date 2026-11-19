/* pages/game-order.js – Xử lý tình huống: chạm các bước theo đúng thứ tự 1 → 5 */
(function(){
  const ST=SW.data.rescueSteps;
  let n=0;
  const shuffled=[...ST.keys()].sort(()=>Math.random()-.5);
  $('#gp').innerHTML=`<div class="card"><h3>Sắp xếp đúng thứ tự cứu người</h3><p class="mu">Chạm lần lượt từ bước 1 → ${ST.length}</p><div id="stl"></div><p id="stm"></p></div>`;
  shuffled.forEach(k=>{
    const b=document.createElement('button');
    b.className='opt';b.textContent=ST[k];
    b.onclick=()=>{
      if(k==n){
        b.classList.add('ok');b.disabled=true;n++;
        if(n==ST.length)$('#stm').textContent='🎉 Chính xác!';
      }else{
        b.classList.add('no');setTimeout(()=>b.classList.remove('no'),500);
      }
    };
    $('#stl').appendChild(b);
  });
})();
