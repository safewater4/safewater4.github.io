/* data/hazards.js – trò "Tìm điểm nguy hiểm" và "Em làm cho cảnh an toàn" */

/* Tìm điểm nguy hiểm: mỗi màn là 1 cảnh.
   time = số giây;  items: x%, y% (vị trí trong cảnh), icon, danger (1 = nguy hiểm), note (lời giải thích) */
SW.data.hazardScenes=[
 {name:'Ao làng',background:'linear-gradient(#bfe,#3a9)',time:40,items:[
   {x:30,y:60,icon:'🕳️',danger:1,note:'Bờ ao trơn, không rào'},
   {x:70,y:50,icon:'🌊',danger:1,note:'Nước sâu'},
   {x:50,y:25,icon:'🌳',danger:0},
   {x:15,y:25,icon:'🏡',danger:0}]},
 {name:'Suối',background:'linear-gradient(#cdf,#58a)',time:30,items:[
   {x:25,y:65,icon:'🪨',danger:1,note:'Đá rêu trơn'},
   {x:60,y:60,icon:'🌧️',danger:1,note:'Nước dâng sau mưa'},
   {x:80,y:30,icon:'🦋',danger:0},
   {x:45,y:28,icon:'⛰️',danger:0},
   {x:12,y:35,icon:'🏊',danger:1,note:'Bơi không người lớn'}]},
 {name:'Nhà & trường',background:'linear-gradient(#fde,#e9a)',time:25,items:[
   {x:20,y:60,icon:'🪣',danger:1,note:'Xô nước không nắp'},
   {x:50,y:55,icon:'🛁',danger:1,note:'Bể nước mở'},
   {x:78,y:60,icon:'🌊',danger:1,note:'Bể bơi trường không cứu hộ'},
   {x:35,y:25,icon:'📚',danger:0},
   {x:65,y:25,icon:'🪑',danger:0},
   {x:88,y:25,icon:'🎒',danger:0}]}
];

/* Em làm cho cảnh an toàn: 4 ô cần đặt đúng vật dụng (mỗi ô đúng giảm 25% nguy cơ) */
SW.data.safeZones=[
  {x:20,y:35,label:'Ao không rào',answer:'🚧'},
  {x:75,y:40,label:'Giếng hở',answer:'🪵'},
  {x:25,y:75,label:'Bờ ao trơn',answer:'⚠️'},
  {x:75,y:78,label:'Nơi chơi gần nước',answer:'🛟'}
];
SW.data.safeItems=[
  {icon:'🪵',name:'Nắp đậy'},
  {icon:'🚧',name:'Rào chắn'},
  {icon:'⚠️',name:'Biển báo'},
  {icon:'🛟',name:'Phao'}
];
