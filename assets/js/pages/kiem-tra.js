/* assets/js/pages/kiem-tra.js - Cuộc thi An toàn nước: Đo thời gian từng câu, Thang điểm 100, UTF-8 chuẩn & Chống gian lận */
(function(){
  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxihBfQUHiQj6M0TXon-6ufZxjt6a9Lre-jeO3fvsNiE2EwlzTN71Gi2n3V7A6Q8hl3/exec';
  const BANK = window.SW.data.quizBank;

  let currentQuestions = [];
  let userAnswers = [];
  let questionTimes = []; // Thời gian làm từng câu (giây)
  let lastActionTimestamp = 0;
  let timerInterval = null;
  let remainingSeconds = 600; // 10 phút = 600 giây
  let startTime = 0;
  let candidate = {};
  let showAllLeaderboard = false;
  let tabSwitchCount = 0;
  let isExamActive = false;

  // Auto focus Họ và tên
  const nameInput = $('#inp-name');
  if (nameInput) setTimeout(() => nameInput.focus(), 200);

  // Khởi tạo bảng xếp hạng ban đầu
  renderLeaderboard();

  // Sự kiện nút
  $('#btn-start').onclick = startQuiz;
  $('#btn-submit-exam').onclick = () => submitExam(false);
  $('#btn-retry').onclick = resetQuiz;
  $('#btn-expand-lb').onclick = toggleExpandLeaderboard;

  // Cho phép nhấn Enter ở ô Lớp để vào thi ngay
  $('#inp-class').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') startQuiz();
  });

  // Chống gian lận: Chặn chuột phải và phím tắt mở DevTools
  document.addEventListener('contextmenu', (e) => {
    if (isExamActive) {
      e.preventDefault();
      alert('Chuột phải đã bị vô hiệu hóa trong phòng thi!');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (!isExamActive) return;
    if (
      e.key === 'F12' ||
      (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
      (e.ctrlKey && (e.key === 'u' || e.key === 's'))
    ) {
      e.preventDefault();
      alert('Phím tắt nhà phát triển bị cấm trong lúc làm bài thi!');
    }
  });

  // Chống gian lận: Giám sát chuyển tab / rời màn hình
  document.addEventListener('visibilitychange', () => {
    if (!isExamActive) return;
    if (document.visibilityState === 'hidden') {
      tabSwitchCount++;
      const bar = $('#tab-warning-bar');
      const lbl = $('#lbl-tab-switches');
      if (bar) bar.style.display = 'flex';
      if (lbl) lbl.textContent = tabSwitchCount;

      if (tabSwitchCount >= 3) {
        alert('CẢNH BÁO: Bạn đã rời khỏi màn hình bài thi quá 3 lần! Hệ thống tự động thu bài để đảm bảo tính công bằng.');
        submitExam(true);
      }
    }
  });

  /* ---- Rút ngẫu nhiên mảng ---- */
  function pickRandom(arr, n) {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n);
  }

  /* ---- Xáo trộn 4 đáp án và bảo toàn đáp án đúng ---- */
  function shuffleOptions(qObj) {
    const indices = [0, 1, 2, 3];
    indices.sort(() => 0.5 - Math.random());
    return {
      id: qObj.id,
      q: qObj.q,
      options: indices.map(i => qObj.opts[i]),
      correct: indices.indexOf(qObj.c),
      h: qObj.h,
      explain: qObj.ex
    };
  }

  /* ---- Bắt đầu làm bài thi ---- */
  function startQuiz() {
    const bankData = window.SW.data.quizBank || BANK;
    const name = $('#inp-name').value.trim();
    const cls = $('#inp-class').value.trim();
    const school = $('#inp-school').value.trim();
    const ward = $('#inp-ward').value.trim();
    const prov = $('#inp-prov').value.trim();

    if (!name) {
      alert('Vui lòng nhập Họ và tên thí sinh!');
      $('#inp-name').focus();
      return;
    }
    if (!cls) {
      alert('Vui lòng nhập Lớp của thí sinh!');
      $('#inp-class').focus();
      return;
    }

    candidate = { name, cls, school, ward, prov };

    // Rút chuẩn tỷ lệ 50 - 30 - 20: 10 Nhận biết + 6 Thông hiểu + 4 Vận dụng (Tổng 20 câu)
    if (!bankData || !bankData.nhanBiet) {
      alert('Không tìm thấy dữ liệu ngân hàng câu hỏi. Vui lòng tải lại trang!');
      return;
    }

    const qNB = pickRandom(bankData.nhanBiet, 10).map(q => ({ ...shuffleOptions(q), type: 'nb' }));
    const qTH = pickRandom(bankData.thongHieu, 6).map(q => ({ ...shuffleOptions(q), type: 'th' }));
    const qVD = pickRandom(bankData.vanDung, 4).map(q => ({ ...shuffleOptions(q), type: 'vd' }));

    currentQuestions = [...qNB, ...qTH, ...qVD].sort(() => 0.5 - Math.random());
    userAnswers = new Array(20).fill(-1);
    questionTimes = new Array(20).fill(0);
    tabSwitchCount = 0;
    isExamActive = true;

    const bar = $('#tab-warning-bar');
    if (bar) bar.style.display = 'none';

    $('#step-start').style.display = 'none';
    $('#step-result').style.display = 'none';
    $('#step-exam').style.display = 'block';

    $('#lbl-student').textContent = candidate.name;
    $('#lbl-class').textContent = candidate.cls;

    renderExamPaper();

    // Bắt đầu đếm ngược 10 phút (600 giây)
    remainingSeconds = 600;
    startTime = Date.now();
    lastActionTimestamp = startTime;
    updateTimerDisplay();
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      remainingSeconds--;
      updateTimerDisplay();
      if (remainingSeconds <= 0) {
        clearInterval(timerInterval);
        alert('Đã hết thời gian làm bài (10 phút)! Hệ thống đang tự động nộp bài thi của bạn.');
        submitExam(true);
      }
    }, 1000);

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function updateTimerDisplay() {
    const m = Math.floor(remainingSeconds / 60);
    const s = remainingSeconds % 60;
    const str = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    const lbl = $('#lbl-time');
    const box = $('#box-timer');
    if (lbl) lbl.textContent = str;
    if (box) box.classList.toggle('urgent', remainingSeconds <= 60);
  }

  /* ---- Render đề thi trắc nghiệm (BỎ HOÀN TOÀN NHÃN PHÂN LOẠI) ---- */
  function renderExamPaper() {
    const container = $('#quiz-container');
    container.innerHTML = currentQuestions.map((q, idx) => {
      return `
        <div class="q-card" id="card_q_${idx}">
          <div class="q-card-head">
            <span class="q-num">Câu ${idx + 1}</span>
            <b>${q.q}</b>
          </div>
          <div class="q-options">
            ${q.options.map((opt, optIdx) => `
              <label class="q-opt-label" data-q="${idx}" data-opt="${optIdx}">
                <input type="radio" name="exam_q_${idx}" value="${optIdx}">
                <span>${opt}</span>
              </label>
            `).join('')}
          </div>
        </div>
      `;
    }).join('');

    container.querySelectorAll('.q-opt-label').forEach(label => {
      const radio = label.querySelector('input');
      radio.addEventListener('change', () => {
        const qIdx = parseInt(label.getAttribute('data-q'), 10);
        const optIdx = parseInt(label.getAttribute('data-opt'), 10);
        userAnswers[qIdx] = optIdx;

        // Tính thời gian dành cho câu hỏi này
        const now = Date.now();
        const durationSec = Math.max(1, Math.round((now - lastActionTimestamp) / 1000));
        questionTimes[qIdx] = (questionTimes[qIdx] || 0) + durationSec;
        lastActionTimestamp = now;

        container.querySelectorAll(`[data-q="${qIdx}"]`).forEach(l => l.classList.remove('selected'));
        label.classList.add('selected');
      });
    });
  }

  /* ---- Nộp bài ---- */
  async function submitExam(isAuto = false) {
    if (!isAuto) {
      const unAns = userAnswers.indexOf(-1);
      if (unAns !== -1) {
        const confirmSubmit = confirm(`Bạn còn Câu ${unAns + 1} chưa trả lời. Bạn có chắc chắn muốn nộp bài sớm không?`);
        if (!confirmSubmit) {
          const el = document.getElementById(`card_q_${unAns}`);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          return;
        }
      }
    }

    isExamActive = false;
    clearInterval(timerInterval);

    // Hiển thị modal "Đang nộp bài thi..."
    const loadingModal = $('#submit-loading-modal');
    if (loadingModal) loadingModal.style.display = 'flex';
    $('#btn-submit-exam').disabled = true;

    // Tính thời gian hoàn thành thực tế (giây)
    const elapsedSeconds = Math.max(1, Math.round((Date.now() - startTime) / 1000));

    // Chấm điểm chuẩn: 20 câu, mỗi câu 5 điểm -> Thang điểm 100
    let correctCount = 0;
    let nbCorrect = 0;
    let thCorrect = 0;
    let vdCorrect = 0;

    const detailsList = [];
    const timeList = [];

    currentQuestions.forEach((q, idx) => {
      const isCorrect = userAnswers[idx] === q.correct;
      if (isCorrect) {
        correctCount++;
        if (q.type === 'nb') nbCorrect++;
        else if (q.type === 'th') thCorrect++;
        else if (q.type === 'vd') vdCorrect++;
      }
      const qTime = questionTimes[idx] > 0 ? questionTimes[idx] : Math.max(2, Math.round(elapsedSeconds / 20));
      timeList.push(`C${idx + 1}:${qTime}s`);
      detailsList.push(`C${idx + 1}: ${isCorrect ? 'Đúng' : 'Sai'} (${qTime}s)`);
    });

    const totalScore = correctCount * 5; // Thang điểm 100

    // Xếp loại năng lực & lời nhận xét
    let ratingBadgeClass = 'xuat-sac';
    let ratingTitle = 'Đại sứ An toàn Nước 🏆';
    let ratingComment = 'Tuyệt vời! Em nắm rất vững toàn diện kiến thức phòng chống đuối nước và kỹ năng sinh tồn. Em xứng đáng là tấm gương tuyên truyền an toàn nước cho bạn bè!';

    if (totalScore >= 90) {
      ratingBadgeClass = 'xuat-sac';
      ratingTitle = 'Đại sứ An toàn Nước 🏆';
      ratingComment = 'Tuyệt vời! Em nắm rất vững toàn diện kiến thức phòng chống đuối nước và kỹ năng sinh tồn. Em xứng đáng là tấm gương tuyên truyền an toàn nước cho bạn bè!';
    } else if (totalScore >= 70) {
      ratingBadgeClass = 'tot';
      ratingTitle = 'Dũng sĩ An toàn Nước 🌟';
      ratingComment = 'Rất tốt! Em có hiểu biết vững vàng về an toàn sông nước. Hãy ôn luyện thêm một vài tình huống cứu nạn để đạt điểm tuyệt đối nhé!';
    } else if (totalScore >= 50) {
      ratingBadgeClass = 'dat';
      ratingTitle = 'Đã hoàn thành thử thách ⚡';
      ratingComment = 'Em đã nắm được các nguyên tắc cơ bản. Hãy dành thêm thời gian ôn tập kỹ hơn các bài học về nhận biết dòng chảy nguy hiểm và kỹ thuật Hô - Ném - Chìa nhé.';
    } else {
      ratingBadgeClass = 'can-co-gang';
      ratingTitle = 'Cần rèn luyện thêm 📖';
      ratingComment = 'Đừng nản lòng! Hãy quay lại góc Kiến thức của SafeWater để học lại các kỹ năng phòng chống đuối nước và thử sức lại lần nữa nhé!';
    }

    // Lưu vào Bảng xếp hạng cục bộ
    const record = {
      name: candidate.name,
      cls: candidate.cls,
      school: candidate.school,
      ward: candidate.ward,
      prov: candidate.prov,
      score: totalScore,
      correct: `${correctCount}/20`,
      elapsed: `${elapsedSeconds}s`,
      timeSeconds: elapsedSeconds,
      timestamp: new Date().toLocaleDateString('vi-VN')
    };

    if (window.SW && window.SW.leaderboard) {
      window.SW.leaderboard.saveLeaderboard(record);
    }

    // Chuẩn bị payload UTF-8 chuẩn gửi về Google Sheets (Đã tinh gọn, chi tiết bài làm đã chứa sẵn số giây từng câu)
    const payloadData = {
      surveyType: 'Bài kiểm tra kiến thức',
      name: candidate.name,
      class: candidate.cls,
      school: candidate.school,
      ward: candidate.ward,
      prov: candidate.prov,
      score: totalScore,
      correct: `${correctCount}/20`,
      elapsed: `${elapsedSeconds}s`,
      timeSeconds: elapsedSeconds,
      tabSwitches: tabSwitchCount,
      rating: ratingTitle,
      nbScore: `${nbCorrect}/10`,
      thScore: `${thCorrect}/6`,
      vdScore: `${vdCorrect}/4`,
      questionDetails: detailsList.join(' | '),
      timestamp: new Date().toLocaleString('vi-VN')
    };

    // Gửi kết quả về Google Sheets chạy ngầm (Không dùng await để giao diện không bao giờ bị đơ/treo khi mạng chậm)
    const honeypotVal = $('#inp-website') ? $('#inp-website').value : '';
    if (!honeypotVal && GOOGLE_SCRIPT_URL) {
      try {
        fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(payloadData)
        }).catch(e => console.warn('Lỗi gửi điểm Google Sheets:', e));
      } catch(e) {
        console.warn('Lỗi khởi tạo fetch:', e);
      }
    }

    // Luôn mở màn hình kết quả sau đúng 1.2 giây mượt mà, tuyệt đối không bị treo xoay vòng
    setTimeout(() => {
      if (loadingModal) loadingModal.style.display = 'none';
      $('#btn-submit-exam').disabled = false;

      // Hiển thị kết quả
      $('#step-exam').style.display = 'none';
      $('#step-result').style.display = 'block';

      $('#res-score').textContent = totalScore;
      
      const badgeEl = $('#res-eval-badge');
      if (badgeEl) {
        badgeEl.className = `eval-badge ${ratingBadgeClass}`;
        badgeEl.textContent = ratingTitle;
      }

      $('#res-nb-score').textContent = `${nbCorrect}/10`;
      $('#res-th-score').textContent = `${thCorrect}/6`;
      $('#res-vd-score').textContent = `${vdCorrect}/4`;

      $('#res-detail').innerHTML = `
        Thí sinh: <b>${candidate.name}</b> (${candidate.cls} · ${candidate.school})<br>
        Số câu đúng: <b>${correctCount}/20 câu</b> · Thời gian: <b>${elapsedSeconds} giây</b> ${tabSwitchCount > 0 ? `· Rời màn hình: <b>${tabSwitchCount} lần</b>` : ''}<br>
        <i>${ratingComment}</i>
      `;

      if (totalScore >= 70 && window.confetti) {
        window.confetti({ particleCount: 90, spread: 75, origin: { y: 0.6 } });
      }

      renderLeaderboard();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1200);
  }

  function resetQuiz() {
    $('#step-result').style.display = 'none';
    $('#step-start').style.display = 'block';
    setTimeout(() => {
      if (nameInput) nameInput.focus();
    }, 100);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function fireConfetti(colType = 'gold') {
    if (!window.confetti) return;
    let colors = ['#fbbf24', '#f59e0b', '#0a84d6', '#00b4d8', '#ffffff'];
    if (colType === 'silver') colors = ['#94a3b8', '#cbd5e1', '#0a84d6', '#ffffff'];
    if (colType === 'bronze') colors = ['#ea580c', '#fdba74', '#0a84d6', '#ffffff'];
    window.confetti({ particleCount: 50, spread: 60, origin: { y: 0.65 }, colors });
  }

  function animateCounter(el, target, suffix = '') {
    if (!el) return;
    const duration = 1200;
    const startTime = performance.now();
    function update(time) {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(target * eased);
      el.textContent = `${current}${suffix}`;
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = `${target}${suffix}`;
    }
    requestAnimationFrame(update);
  }

  async function renderLeaderboard() {
    let list = [];
    if (window.SW && window.SW.leaderboard) {
      list = await window.SW.leaderboard.getLeaderboard();
    }
    const podiumEl = $('#podium-area');
    const tableBody = $('#lb-table-body');

    // 1. Render Bục Vinh Quang Top 3 Thể Thao
    if (podiumEl) {
      const top1 = list[0] || { name: 'Chưa có', cls: '-', score: 0, elapsed: '-' };
      const top2 = list[1] || { name: 'Chưa có', cls: '-', score: 0, elapsed: '-' };
      const top3 = list[2] || { name: 'Chưa có', cls: '-', score: 0, elapsed: '-' };

      podiumEl.innerHTML = `
        <!-- HẠNG 2 (BẠC) -->
        <div class="podium-col rank-2" id="sidebar-podium-2" title="Hạng Nhì: ${top2.name} (${top2.score}đ - ⏱️ ${top2.elapsed || top2.timeSeconds + 's'})">
          <div class="podium-avatar-wrap">
            <div class="podium-crown">🥈</div>
          </div>
          <div class="podium-user-name">${top2.name}</div>
          <span class="podium-user-class">${top2.cls || '-'}</span>
          <div class="podium-base">
            <span class="rank-num">2</span>
            <span class="score-val" id="sidebar-score-2">${top2.score}đ</span>
          </div>
        </div>

        <!-- HẠNG 1 (VÀNG) -->
        <div class="podium-col rank-1" id="sidebar-podium-1" title="Quán quân: ${top1.name} (${top1.score}đ - ⏱️ ${top1.elapsed || top1.timeSeconds + 's'})">
          <div class="podium-avatar-wrap">
            <div class="sparkle-container">
              <span class="sparkle sp-1">✨</span>
              <span class="sparkle sp-2">⭐</span>
              <span class="sparkle sp-3">🌟</span>
            </div>
            <div class="podium-crown">👑</div>
          </div>
          <div class="podium-user-name">${top1.name}</div>
          <span class="podium-user-class">${top1.cls || '-'}</span>
          <div class="podium-base">
            <span class="rank-num">1</span>
            <span class="score-val" id="sidebar-score-1">${top1.score}đ</span>
          </div>
        </div>

        <!-- HẠNG 3 (ĐỒNG) -->
        <div class="podium-col rank-3" id="sidebar-podium-3" title="Hạng Ba: ${top3.name} (${top3.score}đ - ⏱️ ${top3.elapsed || top3.timeSeconds + 's'})">
          <div class="podium-avatar-wrap">
            <div class="podium-crown">🥉</div>
          </div>
          <div class="podium-user-name">${top3.name}</div>
          <span class="podium-user-class">${top3.cls || '-'}</span>
          <div class="podium-base">
            <span class="rank-num">3</span>
            <span class="score-val" id="sidebar-score-3">${top3.score}đ</span>
          </div>
        </div>
      `;

      animateCounter($('#sidebar-score-1'), top1.score, 'đ');
      animateCounter($('#sidebar-score-2'), top2.score, 'đ');
      animateCounter($('#sidebar-score-3'), top3.score, 'đ');

      $('#sidebar-podium-1').onclick = () => fireConfetti('gold');
      $('#sidebar-podium-2').onclick = () => fireConfetti('silver');
      $('#sidebar-podium-3').onclick = () => fireConfetti('bronze');
    }

    // 2. Render Danh sách bảng từ HẠNG 4 TRỞ ĐI
    if (tableBody) {
      const listFrom4 = list.slice(3);
      const displayList = showAllLeaderboard ? listFrom4 : listFrom4.slice(0, 7);

      if (displayList.length === 0) {
        tableBody.innerHTML = `<div style="text-align:center;padding:14px;color:var(--mu);font-size:13px">Chưa có thêm thí sinh nào khác.</div>`;
        return;
      }

      tableBody.innerHTML = displayList.map((item, index) => {
        const actualRank = index + 4;
        const delay = index * 40;

        return `
          <div class="lb-item" style="animation-delay:${delay}ms">
            <div class="lb-item-left">
              <span class="lb-rank">#${actualRank}</span>
              <div class="lb-info">
                <span class="lb-name" title="${item.name}">${item.name}</span>
                <span class="lb-meta">${item.cls} · ${item.school}</span>
              </div>
            </div>
            <div class="lb-score-tag">
              <div>${item.score}đ</div>
              <div class="lb-time-meta">⏱️ ${item.elapsed || (item.timeSeconds ? item.timeSeconds + 's' : '180s')}</div>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  function toggleExpandLeaderboard() {
    showAllLeaderboard = !showAllLeaderboard;
    const btn = $('#btn-expand-lb');
    if (btn) btn.textContent = showAllLeaderboard ? 'Thu gọn bảng xếp hạng (Top 10) 🔼' : 'Xem toàn bộ bảng xếp hạng 📋';
    renderLeaderboard();
  }
})();
