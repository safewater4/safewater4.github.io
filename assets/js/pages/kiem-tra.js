/* assets/js/pages/kiem-tra.js - Cuộc thi An toàn nước: Đo thời gian từng câu, Thang điểm 100, UTF-8 chuẩn & Chống gian lận */
(function(){
  const questionsById = new Map(Object.values(window.SW.data.quizBank).flat()
    .map(question => [question.id, question]));
  const api = window.SW.leaderboard;
  const updateRankingList = api.mountList($('#exam-ranking-list'));
  const groupCounts = { nb: 5, th: 5, vd: 4 };
  const questionCount = Object.values(groupCounts).reduce((total, count) => total + count, 0);
  let currentQuestions = [];
  let userAnswers = [];
  let questionTimes = [];
  let lastSelection = 0;
  let ticket = '';
  let pendingSubmission = null;
  let submitting = false;
  let timerInterval = null;
  let remainingSeconds = 600; // 10 phút = 600 giây
  let deadline = 0;
  let candidate = {};
  let tabSwitchCount = 0;
  let isExamActive = false;

  // Auto focus Họ và tên
  const nameInput = $('#inp-name');
  if (nameInput) setTimeout(() => nameInput.focus(), 200);

  // Khởi tạo bảng xếp hạng ban đầu
  renderLeaderboard();
  setInterval(() => {
    if (!document.hidden && !isExamActive && !submitting) renderLeaderboard();
  }, 60000);

  // Sự kiện nút
  $('#btn-start').onclick = startQuiz;
  $('#btn-submit-exam').onclick = () => submitExam(false);
  $('#btn-retry').onclick = resetQuiz;

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
        submitExam(true);
      }
    }
  });

  function escapeHtml(value) {
    const entities = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
    return String(value ?? '').replace(/[&<>"']/g, char => entities[char]);
  }

  function shuffleOptions(question) {
    const optionOrder = [0, 1, 2, 3];
    for (let i = optionOrder.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [optionOrder[i], optionOrder[j]] = [optionOrder[j], optionOrder[i]];
    }
    return { q: question.q, optionOrder, options: optionOrder.map(index => question.opts[index]) };
  }

  async function startQuiz() {
    const button = $('#btn-start');
    if (button.disabled || isExamActive || pendingSubmission) return;
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
    button.disabled = true;
    const originalLabel = button.textContent;
    button.textContent = 'Đang chuẩn bị đề…';
    let session;
    try {
      session = await api.request({ action: 'start', candidate, website: $('#inp-website').value });
      if (!Array.isArray(session.ids) || session.ids.length !== questionCount ||
          !session.ids.every(id => questionsById.has(id)) ||
          typeof session.ticket !== 'string' || !Number.isFinite(session.durationMs)) {
        throw new Error('Không nhận được đề hợp lệ. Vui lòng báo giáo viên.');
      }
      currentQuestions = session.ids.map(id => shuffleOptions(questionsById.get(id)));
    } catch (error) {
      alert(error.message);
      return;
    } finally {
      button.disabled = false;
      button.textContent = originalLabel;
    }

    ticket = session.ticket;
    userAnswers = new Array(questionCount).fill(-1);
    questionTimes = new Array(questionCount).fill(0);
    lastSelection = Date.now();
    pendingSubmission = null;
    tabSwitchCount = 0;
    isExamActive = true;
    $('#btn-submit-exam').textContent = 'Nộp bài ngay 🎯';

    const bar = $('#tab-warning-bar');
    if (bar) bar.style.display = 'none';

    $('#step-start').style.display = 'none';
    $('#step-result').style.display = 'none';
    $('#step-exam').style.display = 'block';

    $('#lbl-student').textContent = candidate.name;
    $('#lbl-class').textContent = candidate.cls;

    renderExamPaper();

    deadline = Date.now() + session.durationMs;
    remainingSeconds = Math.ceil(session.durationMs / 1000);
    updateTimerDisplay();
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      remainingSeconds = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      updateTimerDisplay();
      if (remainingSeconds === 0) submitExam(true);
    }, 250);

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
            <b>${escapeHtml(q.q)}</b>
          </div>
          <div class="q-options">
            ${q.options.map((opt, optIdx) => `
              <label class="q-opt-label" data-q="${idx}" data-opt="${optIdx}">
                <input type="radio" name="exam_q_${idx}" value="${optIdx}">
                <span>${escapeHtml(opt)}</span>
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
        const now = Date.now();
        questionTimes[qIdx] += Math.round((now - lastSelection) / 1000);
        lastSelection = now;

        container.querySelectorAll(`[data-q="${qIdx}"]`).forEach(l => l.classList.remove('selected'));
        label.classList.add('selected');
      });
    });
  }

  /* ---- Nộp bài ---- */
  async function submitExam(isAuto = false) {
    if (submitting || (!isExamActive && !pendingSubmission)) return;
    if (!pendingSubmission) {
      const unanswered = userAnswers.indexOf(-1);
      if (!isAuto && unanswered !== -1 &&
          !confirm('Bạn còn bỏ trống câu ' + (unanswered + 1) + '. Bạn có muốn nộp bài không?')) {
        document.getElementById('card_q_' + unanswered).scrollIntoView({ behavior: 'smooth' });
        return;
      }
      pendingSubmission = {
        action: 'submit',
        ticket,
        answers: userAnswers.map((answer, index) =>
          answer === -1 ? -1 : currentQuestions[index].optionOrder[answer]),
        questionTimes: [...questionTimes],
        tabSwitches: tabSwitchCount
      };
      document.querySelectorAll('#quiz-container input').forEach(input => { input.disabled = true; });
    }

    isExamActive = false;
    submitting = true;
    clearInterval(timerInterval);
    const loadingModal = $('#submit-loading-modal');
    const button = $('#btn-submit-exam');
    const status = $('#submit-status');
    status.textContent = '';
    loadingModal.style.display = 'flex';
    button.disabled = true;

    let result;
    try {
      ({ result } = await api.request(pendingSubmission));
      if (!result || !Number.isInteger(result.score)) {
        throw new Error('Chưa nhận được kết quả. Vui lòng thử nộp lại.');
      }
      pendingSubmission = null;
    } catch (error) {
      status.textContent = error.message;
      if (error.code === 'expired') {
        pendingSubmission = null;
        button.textContent = 'Bắt đầu lượt mới';
        button.onclick = () => {
          resetQuiz();
          button.onclick = () => submitExam(false);
        };
      } else {
        button.textContent = 'Thử nộp lại';
      }
      return;
    } finally {
      submitting = false;
      loadingModal.style.display = 'none';
      button.disabled = false;
    }

    const { score: totalScore, correctCount, elapsedSeconds, nbCorrect, thCorrect, vdCorrect } = result;
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

    $('#step-exam').style.display = 'none';
    $('#step-result').style.display = 'block';

    $('#res-score').textContent = totalScore;

    const badgeEl = $('#res-eval-badge');
    if (badgeEl) {
      badgeEl.className = `eval-badge ${ratingBadgeClass}`;
      badgeEl.textContent = ratingTitle;
    }

    $('#res-nb-score').textContent = `${nbCorrect}/${groupCounts.nb}`;
    $('#res-th-score').textContent = `${thCorrect}/${groupCounts.th}`;
    $('#res-vd-score').textContent = `${vdCorrect}/${groupCounts.vd}`;

    $('#res-detail').innerHTML = `
      Thí sinh: <b>${escapeHtml(candidate.name)}</b> (${escapeHtml(candidate.cls)} · ${escapeHtml(candidate.school)})<br>
      Số câu đúng: <b>${correctCount}/${questionCount} câu</b> · Thời gian: <b>${Number(elapsedSeconds).toLocaleString('vi-VN', { maximumFractionDigits: 3 })} giây</b> ${tabSwitchCount > 0 ? `· Rời màn hình: <b>${tabSwitchCount} lần</b>` : ''}<br>
      <i>${ratingComment}</i>
    `;

    renderQuestionReview(result.questionStatuses);

    if (totalScore >= 70 && window.confetti) {
      window.confetti({ particleCount: 90, spread: 75, origin: { y: 0.6 } });
    }

    renderLeaderboard();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function renderQuestionReview(statuses) {
    const review = $('#question-review');
    const list = $('#question-review-list');
    review.open = false;
    list.replaceChildren();
    const labels = ['Đúng', 'Sai', 'Bỏ trống'];
    review.hidden = !Array.isArray(statuses) || statuses.length !== questionCount ||
      !statuses.every(status => labels.includes(status));
    if (review.hidden) return;

    currentQuestions.forEach((question, index) => {
      const item = document.createElement('li');
      const prompt = document.createElement('p');
      prompt.textContent = question.q;
      const options = document.createElement('ol');
      options.type = 'A';
      options.className = 'question-review-options';
      question.options.forEach((option, optionIndex) => {
        const choice = document.createElement('li');
        choice.textContent = option;
        if (userAnswers[index] === optionIndex) {
          choice.className = statuses[index] === 'Đúng' ? 'review-choice-correct' : 'review-choice-incorrect';
        }
        options.append(choice);
      });
      const status = document.createElement('strong');
      status.textContent = statuses[index];
      item.append(prompt, options, status);
      list.append(item);
    });
  }

  function resetQuiz() {
    renderQuestionReview();
    $('#step-exam').style.display = 'none';
    $('#submit-status').textContent = '';
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
    const { entries: list, stale } = await api.getLeaderboard();
    $('#lb-status').textContent = stale ? 'Đang mất kết nối. Bảng có thể chưa cập nhật.' : 'Trực tiếp từ hệ thống thi';
    const podiumEl = $('#podium-area');
    updateRankingList(list);

    // 1. Render Bục Vinh Quang Top 3 Thể Thao
    if (podiumEl) {
      const top1 = list[0] || { name: 'Chưa có', cls: '-', score: 0, elapsed: '-' };
      const top2 = list[1] || { name: 'Chưa có', cls: '-', score: 0, elapsed: '-' };
      const top3 = list[2] || { name: 'Chưa có', cls: '-', score: 0, elapsed: '-' };

      podiumEl.innerHTML = `
        <!-- HẠNG 2 (BẠC) -->
        <div class="podium-col rank-2" id="sidebar-podium-2" title="Hạng Nhì: ${escapeHtml(top2.name)} (${top2.score}đ - ⏱️ ${escapeHtml(top2.elapsed || top2.timeSeconds + 's')})">
          <div class="podium-avatar-wrap">
            <div class="podium-crown">🥈</div>
          </div>
          <div class="podium-user-name">${escapeHtml(top2.name)}</div>
          <span class="podium-user-class">${escapeHtml(top2.cls || '-')}</span>
          <div class="podium-base">
            <span class="rank-num">2</span>
            <span class="score-val" id="sidebar-score-2">${top2.score}đ</span>
            <span class="podium-elapsed">⏱️ ${escapeHtml(top2.elapsed || '—')}</span>
          </div>
        </div>

        <!-- HẠNG 1 (VÀNG) -->
        <div class="podium-col rank-1" id="sidebar-podium-1" title="Quán quân: ${escapeHtml(top1.name)} (${top1.score}đ - ⏱️ ${escapeHtml(top1.elapsed || top1.timeSeconds + 's')})">
          <div class="podium-avatar-wrap">
            <div class="sparkle-container">
              <span class="sparkle sp-1">✨</span>
              <span class="sparkle sp-2">⭐</span>
              <span class="sparkle sp-3">🌟</span>
            </div>
            <div class="podium-crown">👑</div>
          </div>
          <div class="podium-user-name">${escapeHtml(top1.name)}</div>
          <span class="podium-user-class">${escapeHtml(top1.cls || '-')}</span>
          <div class="podium-base">
            <span class="rank-num">1</span>
            <span class="score-val" id="sidebar-score-1">${top1.score}đ</span>
            <span class="podium-elapsed">⏱️ ${escapeHtml(top1.elapsed || '—')}</span>
          </div>
        </div>

        <!-- HẠNG 3 (ĐỒNG) -->
        <div class="podium-col rank-3" id="sidebar-podium-3" title="Hạng Ba: ${escapeHtml(top3.name)} (${top3.score}đ - ⏱️ ${escapeHtml(top3.elapsed || top3.timeSeconds + 's')})">
          <div class="podium-avatar-wrap">
            <div class="podium-crown">🥉</div>
          </div>
          <div class="podium-user-name">${escapeHtml(top3.name)}</div>
          <span class="podium-user-class">${escapeHtml(top3.cls || '-')}</span>
          <div class="podium-base">
            <span class="rank-num">3</span>
            <span class="score-val" id="sidebar-score-3">${top3.score}đ</span>
            <span class="podium-elapsed">⏱️ ${escapeHtml(top3.elapsed || '—')}</span>
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

  }

})();
