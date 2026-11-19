/* ============================================================
   core/icons.js – đổi emoji trong dữ liệu thành icon 3D
   Thêm emoji mới: bổ sung 1 cặp  'emoji':'ten-icon'  (ten-icon = id c-… trong sprite-3d.js)
   ============================================================ */
SW.EMOJI_ICON={'🃏':'card','🔍':'search','🎬':'video','📰':'news','🏞':'pond','🛠':'tool','▶':'play','🎞':'video','📢':'megaphone','😮‍💨':'swim','📞':'phone','🌊':'wave','🏔':'mountain','⏱':'clock','🔢':'steps','🦸':'shield','🧩':'game','🛟':'life','🧯':'shield','🚑':'heart','🏡':'home','🪣':'bucket','🏊':'swim'};
SW.icon=function(k){
  const n=SW.EMOJI_ICON[String(k).replace(/\ufe0f/g,'')];
  return n?`<svg class="i3"><use href="#c-${n}"/></svg>`:k;   // không có icon → giữ nguyên emoji
};
