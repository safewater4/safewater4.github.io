/* pages/games.js – trang Trò chơi: danh sách game (data/games.js), mỗi game là 1 trang trong tro-choi/ */
(function(){
  /* Dedicated illustrations for the game cards. */
  $('#gl').innerHTML=SW.data.games.map((g,index)=>{
    const ready=g.status==='play';
    const action=ready?'Chơi ngay':'Sắp ra mắt';
    const art=`<img class="game-card__image" src="${SW.url('assets/img/game-'+g.glyph+'-card.webp')}" alt="" loading="lazy" decoding="async" width="800" height="800">`;
    return `<a class="game-card${ready?' is-ready':' is-soon'}" href="${g.page}">
      <span class="game-card__art" aria-hidden="true">${art}
        <span class="game-card__status"><i></i>${action}</span>
        ${g.tag?`<span class="game-card__tag">${g.tag}</span>`:''}
      </span>
      <span class="game-card__body">
        <span class="game-card__level">MÀN ${String(index+1).padStart(2,'0')}</span>
        <span class="game-card__title">${g.title}</span>
        <span class="game-card__sub">${g.sub||''}</span>
        <span class="game-card__action">${action}<span aria-hidden="true">↗</span></span>
      </span>
    </a>`;
  }).join('');
})();
