/* pages/ai.js – Trợ lý SafeWater: Tích hợp Gemini API trực tiếp + chế độ ngoại tuyến + đọc to + nhập giọng nói. */
(function(){
  const defaultChatbot={
    rules:[
      {pattern:/tàu|thuyền|máy bay|biển|chìm|sóng thần/i,answer:'Khi gặp tai nạn trên biển hoặc chìm tàu, điều sống còn là: 1. Giữ bình tĩnh, mặc áo phao ngay lập tức; 2. Bám chặt vào bất kỳ vật nổi nào (can nhựa, mảnh ván); 3. Áp dụng tư thế cuộn tròn giữ nhiệt (H.E.L.P) nếu nước lạnh để chống hạ thân nhiệt; 4. Báo hiệu vị trí bằng còi, phản quang hoặc giơ tay khi thấy tàu cứu hộ.',mood:'🆘'},
      {pattern:/sơ cứu|bất tỉnh|không thở|cpr|ép tim/i,answer:'Quy trình CPR cấp cứu: 1. Đưa nạn nhân lên mặt phẳng khô ráo, an toàn; 2. Kiểm tra nhịp thở trong 5-10 giây; 3. Nếu ngừng thở, lập tức gọi 115 và ép tim ngoài lồng ngực 30 lần (sâu 4-5cm, tốc độ 100-120 nhịp/phút) kết hợp 2 lần thổi ngạt kiên trì cho đến khi y tế đến.',mood:'😮'},
      {pattern:/đuối|cứu|thấy bạn/i,answer:'Nguyên tắc cứu đuối gián tiếp HÔ - NÉM - CHÌA: 1. HÔ to gọi người lớn ngay lập tức; 2. NÉM phao, can nhựa rỗng, vật nổi cho bạn; 3. CHÌA gậy dài, sào hoặc dây thừng từ trên bờ. Tuyệt đối KHÔNG tự ý nhảy xuống nước nếu chưa được huấn luyện cứu sinh!',mood:'😟'},
      {pattern:/bơi|ở đâu|an toàn/i,answer:'Chỉ bơi ở những nơi có người lớn trông coi, có lực lượng cứu hộ và rào chắn/biển báo an toàn. Tuyệt đối tránh xa vùng nước sâu, nước chảy xiết và ao hồ tưới tiêu.',mood:'🤔'},
      {pattern:/phao|dụng cụ|can nhựa/i,answer:'Các vật dụng cứu sinh hiệu quả gồm: áo phao đúng kích cỡ, phao tròn, can nhựa rỗng đậy chặt nắp, săm lốp xe bơm căng hoặc can dầu ăn sạch. Luôn mặc áo phao khi đi thuyền bè!',mood:'😊'},
      {pattern:/chuột rút/i,answer:'Khi bị chuột rút: 1. Giữ bình tĩnh, không vùng vẫy; 2. Hít sâu và thả nổi ngửa người; 3. Dùng tay xoa bóp và kéo căng các ngón chân ngược về phía mu bàn chân; 4. Hô to cầu cứu để được hỗ trợ vào bờ.',mood:'😮'},
      {pattern:/ao|lâm đồng|thác|tưới tiêu|lót bạt/i,answer:'Địa hình Lâm Đồng đặc biệt nguy hiểm với các ao hồ tưới tiêu lót bạt nilon trơn trượt (rơi xuống không có điểm bám để leo lên) và thác ghềnh đá trơn chảy siết (Cam Ly, Datanla, Prenn). Học sinh tuyệt đối không chơi đùa gần bờ ao, thác suối!',mood:'⚠️'},
      {pattern:/giỏi|cảm ơn|hay/i,answer:'Cảm ơn bạn! SafeBuddy rất vui được chia sẻ những kiến thức an toàn hữu ích này. Hãy cùng lan tỏa thông điệp phòng chống đuối nước đến bạn bè và người thân nhé 🎉',mood:'🥳'}
    ],
    fallback:{answer:'SafeBuddy là trợ lý phòng chống đuối nước và kỹ năng sinh tồn SafeWater. Bạn có thể hỏi mình về: cách xử lý khi thấy bạn đuối nước, kỹ năng thả nổi sống sót, sơ cứu CPR ngừng thở, xử lý chuột rút hoặc an toàn ao hồ lót bạt Lâm Đồng nhé!',mood:'💧'},
    quickQuestions:['Thấy bạn đuối nước phải làm gì?','Sơ cứu thế nào?']
  };

  const cbData=(window.SW&&window.SW.data&&window.SW.data.chatbot)||defaultChatbot;
  const rules=cbData.rules||[];
  const fallback=cbData.fallback||defaultChatbot.fallback;
  const quickQuestions=cbData.quickQuestions||defaultChatbot.quickQuestions;

  const chatHistory=[];
  const SYSTEM_PROMPT=`Bạn là SafeBuddy 💧 - người bạn đồng hành thông minh, tâm lý và am hiểu sâu sắc về an toàn sông nước trong đề tài Nghiên cứu khoa học SafeWater (Giáo dục phòng chống đuối nước cho học sinh tỉnh Lâm Đồng).

PHONG CÁCH & VAI TRÒ:
- Xưng hô: "mình" hoặc "SafeBuddy", gọi người dùng là "bạn" hoặc "em" với thái độ ân cần, gần gũi, khích lệ.
- Văn phong: Truyền cảm hứng, sinh động, dễ hiểu, giàu cảm xúc nhưng cực kỳ chính xác về mặt khoa học y tế và kỹ năng sinh tồn.
- Luôn trả lời có chiều sâu, rõ ràng từng bước (step-by-step), giải thích cả nguyên nhân và cách phòng tránh thay vì trả lời cộc lốc hay máy móc.

KIẾN THỨC CHUYÊN SÂU CẦN KHẮC SÂU:
1. NGUYÊN TẮC CỨU ĐUỐI GIÁN TIẾP "HÔ - NÉM - CHÌA":
   - Tuyệt đối KHÔNG bao giờ nhảy xuống nước cứu bạn khi chưa được huấn luyện cứu sinh chuyên nghiệp.
   - HÔ: Hô hoán thật to để gọi người lớn gần nhất; gọi cấp cứu 115 hoặc Tổng đài bảo vệ trẻ em 111.
   - NÉM: Ném phao tròn, can nhựa rỗng có nắp đậy kín, can dầu ăn cũ, quả bóng hoặc bất kỳ vật nổi nào về phía bạn.
   - CHÌA: Nằm sát xuống bờ đất vững chắc rồi chìa cành cây dài, sào tre, dây thừng hoặc quần áo buộc nối lại để kéo bạn vào bờ.

2. KỸ NĂNG TỰ CỨU KHI GẶP NGUY HIỂM:
   - Bình tĩnh thả lỏng toàn bộ cơ thể ngửa mặt lên trời để phổi làm "phao tự nhiên" (kỹ thuật bơi sống sót / thả nổi ngửa).
   - Khi bị chuột rút: Giữ bình tĩnh hít sâu thả nổi, dùng tay xoa bóp kéo căng ngón chân ngược về mu bàn chân và hô hoán cầu cứu.

3. ĐẶC ĐIỂM ĐỊA HÌNH SÔNG NƯỚC LÂM ĐỒNG:
   - Cảnh báo cực mạnh về "AO HỒ TƯỚI TIÊU LÓT BẠT NILON" tại các vườn cà phê, chè: Thành ao dốc đứng, bạt trơn trượt không có điểm bám, trượt chân xuống là cực kỳ khó leo lên bờ.
   - Các dòng chảy xiết, xoáy ngầm ngầm, thác ghềnh đá trơn nguy hiểm như Thác Cam Ly, Datanla, Prenn, hồ Tuyền Lâm, hồ Xuân Hương, hồ Đan Kia.

4. HỒI SINH TIM PHỔI (CPR) CHUẨN KHOA HỌC:
   - Đưa nạn nhân lên mặt phẳng khô ráo, thoáng khí.
   - Kiểm tra phản ứng và nhịp thở (áp má vào mũi miệng, quan sát lồng ngực).
   - Nếu ngừng thở: Ép tim ngoài lồng ngực với tần số 100-120 lần/phút, độ sâu 4-5cm, kết hợp thổi ngạt theo chu kỳ 30 lần ép tim - 2 lần thổi ngạt kiên trì cho tới khi nhân viên y tế 115 đến.`;

  function getApiKey(){
    return (window.SW&&typeof window.SW.getGeminiKey==='function'&&window.SW.getGeminiKey())
      || localStorage.getItem('safewater-gemini-key')
      || (window.SW&&window.SW.GEMINI_API_KEY)
      || 'AQ.Ab8RN6LzS7fQM8e2_9WE5z1mf7ms8RrppK3TRLBZbdVH78hgew';
  }

  function answerOffline(q){
    return rules.find(r=>r.pattern.test(q))||fallback;
  }

  // Danh mục câu chào và xã giao phản hồi tức thì không cần gọi AI
  const instantGreetings=[
    {pattern:/^(chào|xin chào|chao|xin chao|hello|hi|hé lô|helo|alo|hế lô|chào bạn|chào em|chào bot|chào buddy|chào safebuddy)\b/i,answer:'Chào bạn! Mình là SafeBuddy 💧 - giọt nước đồng hành cùng bạn học phòng chống đuối nước. Hôm nay bạn cần mình hỗ trợ điều gì nè?',mood:'😊'},
    {pattern:/^(bạn là ai|bạn tên gì|cậu là ai|em là ai|giới thiệu về bạn|who are you)\b/i,answer:'Mình là SafeBuddy 💧 - linh vật thông minh của dự án giáo dục phòng chống đuối nước SafeWater tỉnh Lâm Đồng!',mood:'🤗'},
    {pattern:/^(tạm biệt|bye|bye bye|bai|tạm biệt bạn|hẹn gặp lại|chào tạm biệt|see you)\b/i,answer:'Tạm biệt bạn nhé! Chúc bạn luôn vui vẻ, học tốt và nhớ luôn cẩn thận khi ở gần ao hồ, sông suối nha! 👋',mood:'😊'},
    {pattern:/^(cảm ơn|cảm ơn bạn|cam on|thanks|thank you|cảm ơn nhé|tuyệt vời|bạn giỏi quá|hay quá)\b/i,answer:'Rất vui được hỗ trợ bạn nè! Hãy cùng SafeBuddy lan tỏa kiến thức an toàn nước đến mọi người nhé 🎉',mood:'🥳'},
    {pattern:/^(khỏe không|bạn khỏe không|bạn thế nào|hôm nay thế nào)\b/i,answer:'Mình luôn tràn đầy năng lượng và sẵn sàng giúp đỡ bạn tìm hiểu về an toàn sông nước đây! 💧',mood:'💪'}
  ];

  function appendBotMessage(container, text){
    const msgDiv=document.createElement('div');
    msgDiv.className='m a';
    const textSpan=document.createElement('span');
    textSpan.innerHTML=text.replace(/\n/g,'<br>');
    const speakBtn=document.createElement('button');
    speakBtn.type='button';
    speakBtn.className='msg-speak-btn';
    speakBtn.title='Bấm để nghe đọc';
    speakBtn.innerHTML='🔊';
    speakBtn.onclick=(e)=>{
      e.stopPropagation();
      if(window.SW&&typeof window.SW.speakVietnamese==='function'){
        window.SW.speakVietnamese(text);
      }
    };
    msgDiv.appendChild(textSpan);
    msgDiv.appendChild(speakBtn);
    container.appendChild(msgDiv);
    container.scrollTop=1e5;
  }

  async function ask(q){
    if(!q)return;
    const c=$('#chat');
    c.innerHTML+=`<div class="m u">${q}</div>`;
    c.scrollTop=1e5;

    // Phản hồi tức thì với các câu chào hỏi, xã giao cơ bản
    const cleanQ=q.trim();
    const matchedGreeting=instantGreetings.find(g=>g.pattern.test(cleanQ));
    if(matchedGreeting){
      appendBotMessage(c,matchedGreeting.answer);
      if($('#mas'))$('#mas').textContent=matchedGreeting.mood;
      if($('#tts')&&$('#tts').checked){
        if(window.SW&&typeof window.SW.speakVietnamese==='function'){
          window.SW.speakVietnamese(matchedGreeting.answer);
        }
      }
      return;
    }

    const typingId='typing-'+Date.now();
    c.innerHTML+=`<div class="m a typing-indicator" id="${typingId}">💧 SafeBuddy đang suy nghĩ...</div>`;
    c.scrollTop=1e5;

    let answer='';
    let mood='😊';
    const apiKey=getApiKey();

    if(apiKey){
      try{
        chatHistory.push({role:'user',parts:[{text:q}]});
        if(chatHistory.length>6)chatHistory.splice(0,chatHistory.length-6);
        const candidateModels=['gemini-1.5-flash','gemini-2.0-flash','gemini-1.5-pro'];
        let data=null;
        for(const m of candidateModels){
          try{
            const controller=new AbortController();
            const timeoutId=setTimeout(()=>controller.abort(),7500);
            const endpoint=`https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${encodeURIComponent(apiKey)}`;
            const res=await fetch(endpoint,{
              method:'POST',
              signal:controller.signal,
              headers:{'Content-Type':'application/json'},
              body:JSON.stringify({
                systemInstruction:{parts:[{text:SYSTEM_PROMPT}]},
                contents:chatHistory,
                generationConfig:{temperature:0.65,maxOutputTokens:500}
              })
            });
            clearTimeout(timeoutId);
            if(res.ok){
              data=await res.json();
              if(data?.candidates?.[0]?.content?.parts?.[0]?.text)break;
            }
          }catch(e){
            console.warn(`Model ${m} timeout hoặc bận:`,e.message);
          }
        }
        answer=data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if(!answer)throw new Error('Chuyển sang trả lời nhanh từ kho tri thức');
        chatHistory.push({role:'model',parts:[{text:answer}]});
        mood='💡';
        const bg=$('#ai-status-badge');if(bg){bg.textContent='● Trực tuyến (Gemini AI)';bg.style.background='#dcfce7';bg.style.color='#15803d';}
      }catch(err){
        const r=answerOffline(q);
        answer=r.answer;
        mood=r.mood;
      }
    }else{
      const r=answerOffline(q);
      answer=r.answer;
      mood=r.mood;
    }

    const typingEl=document.getElementById(typingId);
    if(typingEl)typingEl.remove();

    appendBotMessage(c,answer);
    if($('#mas'))$('#mas').textContent=mood;

    if($('#tts')&&$('#tts').checked){
      if(window.SW&&typeof window.SW.speakVietnamese==='function'){
        window.SW.speakVietnamese(answer);
      }
    }
  }

  if($('#qk')){
    $('#qk').innerHTML=quickQuestions.map(q=>`<button class="opt" type="button">${q}</button>`).join('');
    $$('#qk .opt').forEach(b=>b.onclick=()=>ask(b.textContent));
  }
  if($('#tts')){
    $('#tts').onchange=()=>{if(!$('#tts').checked&&window.SW&&window.SW.stopSpeaking)window.SW.stopSpeaking();};
  }

  // Âm lượng trang chính
  const pageVol=$('#page-vol');
  const pageMute=$('#page-mute');
  const pageVolVal=$('#page-vol-val');
  if(pageVol){
    pageVol.oninput=()=>{
      const v=parseFloat(pageVol.value);
      if(window.SW)window.SW.speechVolume=v;
      if(pageVolVal)pageVolVal.textContent=Math.round(v*100)+'%';
      if(pageMute)pageMute.textContent=v===0?'🔇':'🔊';
    };
  }
  if(pageMute){
    let prevV=1.0;
    pageMute.onclick=()=>{
      let v=(window.SW&&window.SW.speechVolume)||1.0;
      if(v>0){
        prevV=v;
        v=0;
        if(pageMute)pageMute.textContent='🔇';
      }else{
        v=prevV||1.0;
        if(pageMute)pageMute.textContent='🔊';
      }
      if(window.SW)window.SW.speechVolume=v;
      if(pageVol)pageVol.value=v;
      if(pageVolVal)pageVolVal.textContent=Math.round(v*100)+'%';
    };
  }

  if($('#snd'))$('#snd').onclick=()=>{ask($('#cin').value.trim());$('#cin').value=''};
  if($('#cin'))$('#cin').onkeydown=e=>e.key==='Enter'&&$('#snd').click();

  // Nhận diện giọng nói micro trang chính
  const mainMic=$('#mic');
  const mainIn=$('#cin');
  let pageRecognizer=null;
  let isPageListening=false;

  if(mainMic&&mainIn){
    mainMic.onclick=()=>{
      if(location.protocol==='file:'){
        alert('LƯU Ý BẢO MẬT CỦA TRÌNH DUYỆT:\n\nGoogle Chrome và Edge chặn quyền truy cập Micro khi mở tệp trực tiếp từ ổ đĩa (file:///...).\n\n👉 Để nói qua Micro mượt mà, bạn chỉ cần vào thư mục dự án và nhấp đúp vào tệp "Chay-SafeWater.bat" vừa được tạo để khởi chạy qua localhost nhé!');
        return;
      }

      const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
      if(!SR){
        alert('Trình duyệt chưa hỗ trợ Web Speech API. Bạn vui lòng sử dụng Google Chrome, Cốc Cốc hoặc Microsoft Edge để nói qua micro.');
        return;
      }
      if(isPageListening){
        if(pageRecognizer){
          try{pageRecognizer.stop();}catch(e){}
        }
        isPageListening=false;
        mainMic.classList.remove('is-listening');
        mainMic.textContent='🎤';
        return;
      }

      if(window.SW&&window.SW.stopSpeaking)window.SW.stopSpeaking();
      const originalPh=mainIn.placeholder;
      mainMic.classList.add('is-listening');
      mainMic.textContent='⏹️';
      mainMic.title='Đang kết nối micro... Bấm để dừng';
      mainIn.placeholder='🔴 Đang kết nối micro... Mời bạn nói';
      mainIn.focus();

      function startMainRecognizer(){
        try{
          const recognizer=new SR();
          pageRecognizer=recognizer;
          recognizer.lang='vi-VN';
          recognizer.interimResults=true;
          recognizer.continuous=false;

          let finalTrans='';

          recognizer.onstart=()=>{
            isPageListening=true;
            mainMic.classList.add('is-listening');
            mainMic.textContent='⏹️';
            mainIn.placeholder='🔴 Đang lắng nghe... Hãy nói câu hỏi';
          };

          recognizer.onresult=e=>{
            let interimTrans='';
            for(let i=e.resultIndex;i<e.results.length;++i){
              const t=e.results[i][0].transcript;
              if(e.results[i].isFinal){
                finalTrans+=t;
              }else{
                interimTrans+=t;
              }
            }
            mainIn.value=finalTrans||interimTrans;
          };

          recognizer.onerror=e=>{
            console.warn('Lỗi micro trang chính:',e.error);
            isPageListening=false;
            mainMic.classList.remove('is-listening');
            mainMic.textContent='🎤';
            mainIn.placeholder=originalPh;

            if(e.error==='not-allowed'||e.error==='permission-denied'){
              alert('Trình duyệt chưa được cấp quyền micro!\n\nBạn hãy nhìn lên thanh địa chỉ (bên trái ô nhập link), bấm vào biểu tượng Ổ khóa hoặc Micro, chọn "Cho phép" (Allow) rồi bấm lại nút mic nhé.');
            }else if(e.error==='network'){
              alert('Nhận diện giọng nói của Google cần kết nối internet ổn định.');
            }else if(e.error==='no-speech'){
              mainIn.placeholder='Chưa nhận diện được âm thanh, hãy bấm mic nói lại nhé...';
              setTimeout(()=>{mainIn.placeholder=originalPh;},2500);
            }
          };

          recognizer.onend=()=>{
            isPageListening=false;
            mainMic.classList.remove('is-listening');
            mainMic.textContent='🎤';
            mainMic.title='Nói qua micro';
            mainIn.placeholder=originalPh;

            const spoken=mainIn.value.trim();
            if(spoken){
              setTimeout(()=>{
                mainIn.value='';
                ask(spoken);
              },350);
            }
          };

          recognizer.start();
        }catch(err){
          console.warn('Lỗi bật micro:',err);
          isPageListening=false;
          mainMic.classList.remove('is-listening');
          mainMic.textContent='🎤';
          mainIn.placeholder=originalPh;
        }
      }

      if(navigator.mediaDevices&&navigator.mediaDevices.getUserMedia){
        navigator.mediaDevices.getUserMedia({audio:true})
          .then(stream=>{
            stream.getTracks().forEach(track=>track.stop());
            startMainRecognizer();
          })
          .catch(err=>{
            console.warn('Lỗi xin quyền getUserMedia trang chính:',err);
            mainMic.classList.remove('is-listening');
            mainMic.textContent='🎤';
            mainIn.placeholder=originalPh;
            alert('Quyền truy cập Micro chưa được cấp!\n\n👉 Bạn hãy nhìn lên thanh địa chỉ của trình duyệt (bên trái thanh nhập URL), bấm vào biểu tượng Ổ khóa hoặc biểu tượng Micro, chọn "Cho phép" (Allow) cho Micro rồi bấm lại nút mic nhé.');
          });
      }else{
        startMainRecognizer();
      }
        mainMic.classList.remove('is-listening');
        mainMic.textContent='🎤';
      }
    };
  }
})();
