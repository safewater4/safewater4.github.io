/* assets/js/pages/kiem-tra.js - Logic kiểm tra 10 câu ngẫu nhiên + Bảng xếp hạng + Google Sheets */
(function(){
  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxihBfQUHiQj6M0TXon-6ufZxjt6a9Lre-jeO3fvsNiE2EwlzTN71Gi2n3V7A6Q8hl3/exec';
  const BANK = window.SW.data.quizBank;

  let currentQuestions = [];
  let userAnswers = [];
  let timerInterval = null;
  let remainingSeconds = 180;
  let startTime = 0;
  let candidate = {};
  let showAllLeaderboard = false;

  // Auto focus Họ và tên
  const nameInput = $('#inp-name');
  if (nameInput) setTimeout(() => nameInput.focus(), 200);

  // Khởi tạo bảng xếp hạng ban đầu
  renderLeaderboard();

  // Sự kiện nút Bắt đầu
  $('#btn-start').onclick = startQuiz;
  $('#btn-submit-exam').onclick = submitExam;
  $('#btn-retry').onclick = resetQuiz;
  $('#btn-expand-lb').onclick = toggleExpandLeaderboard;

  // Cho phép nhấn Enter ở ô Lớp để vào thi ngay
  $('#inp-class').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') startQuiz();
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
      q: qObj.q,
      options: indices.map(i => qObj.opts[i]),
      correct: indices.indexOf(qObj.c),
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

    // Rút chuẩn ma trận: 5 Nhận biết + 3 Thông hiểu + 2 Vận dụng
    if (!bankData || !bankData.nhanBiet) {
      alert('Không tìm thấy dữ liệu ngân hàng câu hỏi. Vui lòng tải lại trang!');
      return;
    }

    const qNB = pickRandom(bankData.nhanBiet, 5).map(q => ({ ...shuffleOptions(q), type: 'nb', typeText: 'Nhận biết' }));
    const qTH = pickRandom(bankData.thongHieu, 3).map(q => ({ ...shuffleOptions(q), type: 'th', typeText: 'Thông hiểu' }));
    const qVD = pickRandom(bankData.vanDung, 2).map(q => ({ ...shuffleOptions(q), type: 'vd', typeText: 'Vận dụng' }));

    currentQuestions = [...qNB, ...qTH, ...qVD].sort(() => 0.5 - Math.random());
    userAnswers = new Array(10).fill(-1);

    // Chuyển bước
    $('#step-start').style.display = 'none';
    $('#step-result').style.display = 'none';
    $('#step-exam').style.display = 'block';

    $('#lbl-student').textContent = candidate.name;
    $('#lbl-class').textContent = candidate.cls;

    renderExamPaper();

    // Bắt đầu đếm ngược 180s
    remainingSeconds = 180;
    startTime = Date.now();
    updateTimerDisplay();
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      remainingSeconds--;
      updateTimerDisplay();
      if (remainingSeconds <= 0) {
        clearInterval(timerInterval);
        alert('Hết thời gian làm bài! Hệ thống đang tự động nộp bài thi của bạn.');
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
    if (box) box.classList.toggle('urgent', remainingSeconds <= 30);
  }

  /* ---- Render đề thi trắc nghiệm ---- */
  function renderExamPaper() {
    const container = $('#quiz-container');
    container.innerHTML = currentQuestions.map((q, idx) => {
      return `
        <div class="q-card" id="card_q_${idx}">
          <div>
            <span class="q-badge ${q.type}">${q.typeText}</span>
          </div>
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

    clearInterval(timerInterval);

    // Tính thời gian hoàn thành thực tế (giây)
    const elapsedSeconds = Math.max(1, Math.round((Date.now() - startTime) / 1000));
    const bonusSeconds = Math.max(0, 180 - elapsedSeconds);

    // Tính điểm: Mỗi câu đúng 10đ + Thưởng tốc độ (0.5đ/giây còn lại)
    let correctCount = 0;
    currentQuestions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correct) correctCount++;
    });

    const knowledgeScore = correctCount * 10;
    const speedBonus = Math.round(bonusSeconds * 0.5);
    const totalScore = knowledgeScore + speedBonus;

    // Hiển thị kết quả
    $('#step-exam').style.display = 'none';
    $('#step-result').style.display = 'block';

    $('#res-score').textContent = totalScore;
    $('#res-detail').innerHTML = `
      Thí sinh: <b>${candidate.name}</b> (${candidate.cls})<br>
      Đúng: <b>${correctCount}/10 câu</b> (${knowledgeScore} điểm kiến thức) + Thưởng tốc độ: <b>+${speedBonus} điểm</b> (${bonusSeconds}s còn lại).<br>
      Thời gian làm bài: <b>${elapsedSeconds} giây</b>.
    `;

    // Pháo hoa chúc mừng hoàn thành bài thi
    if (window.confetti) {
      window.confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    }

    // Lưu vào Bảng xếp hạng
    const record = {
      name: candidate.name,
      cls: candidate.cls,
      school: candidate.school,
      ward: candidate.ward,
      prov: candidate.prov,
      score: totalScore,
      correct: `${correctCount}/10`,
      elapsed: `${elapsedSeconds}s`,
      timeSeconds: elapsedSeconds,
      timestamp: new Date().toLocaleDateString('vi-VN')
    };

    if (window.SW && window.SW.leaderboard) {
      window.SW.leaderboard.saveLeaderboard(record);
    }
    renderLeaderboard();

    // Honeypot check chống spam bot
    const honeypotVal = $('#inp-website') ? $('#inp-website').value : '';
    if (honeypotVal) {
      console.warn('Bot detected via honeypot.');
      return;
    }

    // Gửi kết quả về Google Sheets
    if (GOOGLE_SCRIPT_URL) {
      try {
        fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            surveyType: 'Bài kiểm tra kiến thức',
            name: candidate.name,
            class: candidate.cls,
            school: candidate.school,
            ward: candidate.ward,
            prov: candidate.prov,
            score: totalScore,
            correct: `${correctCount}/10`,
            elapsed: `${elapsedSeconds}s`,
            timestamp: new Date().toLocaleString('vi-VN')
          })
        });
      } catch(e) {
        console.warn('Lỗi gửi điểm Google Sheets:', e);
      }
    }
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
      const top1 = list[0] || { name: 'Chưa có', cls: '-', score: 0 };
      const top2 = list[1] || { name: 'Chưa có', cls: '-', score: 0 };
      const top3 = list[2] || { name: 'Chưa có', cls: '-', score: 0 };

      podiumEl.innerHTML = `
        <!-- HẠNG 2 (BẠC) -->
        <div class="podium-col rank-2" id="sidebar-podium-2" title="Chúc mừng Hạng Nhì: ${top2.name}">
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
        <div class="podium-col rank-1" id="sidebar-podium-1" title="Quán quân SafeWater: ${top1.name} (Chạm để bắn pháo hoa)">
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
        <div class="podium-col rank-3" id="sidebar-podium-3" title="Chúc mừng Hạng Ba: ${top3.name}">
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
              <div class="lb-time-meta">⏱️ ${item.elapsed || (item.timeSeconds ? item.timeSeconds + 's' : '90s')}</div>
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
