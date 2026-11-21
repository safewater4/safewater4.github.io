/* pages/survey.js – Quản lý Phiếu khảo sát SafeWater 4.0 và tự động đồng bộ Google Sheets */

// ==========================================================================
// [CẤU HÌNH DÀNH CHO LẬP TRÌNH VIÊN]
// Dán link Web App triển khai từ Google Apps Script của bạn vào biến dưới đây:
// ==========================================================================
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwqlnyhjvrAqOHHvQqfdkwZ86pHNMV0XMbxHuDd61PfArYbn813X99LHBb_mtfcVKZK/exec';
// ==========================================================================

(function(){
  const STORAGE_KEY = 'sw_survey_safewater4_v2';
  const SV = SW.data.survey;

  function loadSaved() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY));
    } catch(e) {
      return null;
    }
  }

  function render() {
    const saved = loadSaved();
    const form = document.getElementById('survey-form');
    const resArea = document.getElementById('survey-result-area');
    if (!form || !resArea) return;

    if (saved) {
      form.closest('.survey-viewport').hidden = true;
      resArea.hidden = false;
      renderResult(saved);
      return;
    }

    form.closest('.survey-viewport').hidden = false;
    resArea.hidden = true;

    let html = '';

    // ================= PHẦN A. THÔNG TIN CHUNG =================
    html += `
      <div class="section-heading">
        <span>📋 PHẦN A. THÔNG TIN CHUNG</span>
      </div>

      <div class="q-card" id="card_grade">
        <div class="q-card-head">
          <span class="q-num">Câu 1</span>
          <b>${SV.partA.grade.label} <span style="color:var(--rd)">*</span></b>
        </div>
        <div class="q-options grid-opts">
          ${SV.partA.grade.options.map((opt, i) => `
            <label class="q-opt-label" data-group="grade">
              <input type="radio" name="opt_grade" value="${opt}">
              <span>${opt}</span>
            </label>
          `).join('')}
        </div>
        <div id="grade_other_wrap" class="inline-other-wrap" style="display:none;">
          <input type="text" id="inp_grade_other" class="survey-input-text" placeholder="Nhập khối lớp hoặc thông tin khác...">
        </div>
      </div>

      <div class="q-card" id="card_swim">
        <div class="q-card-head">
          <span class="q-num">Câu 2</span>
          <b>${SV.partA.swim.label} <span style="color:var(--rd)">*</span></b>
        </div>
        <div class="q-options grid-opts">
          ${SV.partA.swim.options.map((opt, i) => `
            <label class="q-opt-label" data-group="swim">
              <input type="radio" name="opt_swim" value="${opt}">
              <span>${opt}</span>
            </label>
          `).join('')}
        </div>
      </div>
    `;

    // ================= PHẦN B. CÂU HỎI TRẮC NGHIỆM =================
    html += `
      <div class="section-heading">
        <span>📝 PHẦN B. CÂU HỎI (Chọn một đáp án đúng nhất)</span>
      </div>
    `;

    SV.partB.forEach(tc => {
      html += `
        <div class="tc-banner">
          <span>🎯 ${tc.tcName}</span>
        </div>
      `;

      tc.questions.forEach(q => {
        html += `
          <div class="q-card" id="card_q_${q.num}">
            <div class="q-card-head">
              <span class="q-num">Câu ${q.num}</span>
              <b>${q.q} <span style="color:var(--rd)">*</span></b>
            </div>
            <div class="q-options">
              ${q.options.map((opt, optIndex) => `
                <label class="q-opt-label" data-group="q_${q.num}">
                  <input type="radio" name="opt_q_${q.num}" value="${optIndex}">
                  <span>${opt}</span>
                </label>
              `).join('')}
            </div>
          </div>
        `;
      });
    });

    // ================= PHẦN C. NHU CẦU HỌC TẬP =================
    html += `
      <div class="section-heading">
        <span>💡 PHẦN C. NHU CẦU HỌC TẬP & ĐÓNG GÓP Ý KIẾN</span>
      </div>

      <div class="q-card" id="card_q_13">
        <div class="q-card-head">
          <span class="q-num">Câu 13</span>
          <b>${SV.partC.q13.q} <span style="color:var(--rd)">*</span></b>
        </div>
        <div class="q-options grid-opts">
          ${SV.partC.q13.options.map((opt, i) => `
            <label class="q-opt-label" data-group="q13_opts">
              <input type="checkbox" name="opt_q_13" value="${opt}">
              <span>${opt}</span>
            </label>
          `).join('')}
        </div>
        <div id="q13_other_wrap" class="inline-other-wrap" style="display:none;">
          <input type="text" id="inp_q13_other" class="survey-input-text" placeholder="Nhập hình thức học tập khác mà em mong muốn...">
        </div>
      </div>

      <div class="q-card" id="card_q_14">
        <div class="q-card-head">
          <span class="q-num">Câu 14</span>
          <b>${SV.partC.q14.q}</b>
        </div>
        <div>
          <textarea id="inp_feedback" class="survey-input-text survey-textarea" placeholder="${SV.partC.q14.placeholder}"></textarea>
        </div>
      </div>

      <!-- Action Bar -->
      <div class="survey-action-bar">
        <div></div>
        <button type="button" class="btn-submit" id="btn-submit">
          Gửi phiếu khảo sát 📨
        </button>
      </div>
    `;

    form.innerHTML = html;
    bindEvents(form);
  }

  function bindEvents(form) {
    form.querySelectorAll('.q-opt-label').forEach(label => {
      const input = label.querySelector('input');
      input.addEventListener('change', () => {
        const group = label.getAttribute('data-group');
        if (input.type === 'radio') {
          form.querySelectorAll(`[data-group="${group}"]`).forEach(l => l.classList.remove('selected'));
          if (input.checked) label.classList.add('selected');
        } else if (input.type === 'checkbox') {
          if (input.name === 'opt_q_13') {
            const checkedBoxes = form.querySelectorAll('input[name="opt_q_13"]:checked');
            if (checkedBoxes.length > SV.partC.q13.maxSelect) {
              input.checked = false;
              alert(`Em chỉ được chọn tối đa ${SV.partC.q13.maxSelect} hình thức học tập!`);
              return;
            }
          }
          label.classList.toggle('selected', input.checked);
        }

        if (input.name === 'opt_grade') {
          const isOther = input.value === 'Khác';
          const wrap = document.getElementById('grade_other_wrap');
          if (wrap) wrap.style.display = isOther ? 'block' : 'none';
        }

        if (input.name === 'opt_q_13') {
          const isOther = Array.from(form.querySelectorAll('input[name="opt_q_13"]:checked')).some(c => c.value === 'Khác');
          const wrap = document.getElementById('q13_other_wrap');
          if (wrap) wrap.style.display = isOther ? 'block' : 'none';
        }
      });
    });

    const submitBtn = document.getElementById('btn-submit');
    if (submitBtn) {
      submitBtn.onclick = handleSubmit;
    }
  }

  function highlightError(elementId, message) {
    const el = document.getElementById(elementId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.style.borderColor = 'var(--rd)';
      el.style.boxShadow = '0 0 12px rgba(231, 76, 60, 0.4)';
      setTimeout(() => {
        el.style.borderColor = '';
        el.style.boxShadow = '';
      }, 3500);
    }
    alert(message);
  }

  async function handleSubmit() {
    const form = document.getElementById('survey-form');
    if (!form) return;

    // Tự sinh mã định danh ngầm cho dòng khảo sát (để thống kê ghép đợt)
    const autoCode = 'HS-' + Math.floor(1000 + Math.random() * 9000);

    // 1. Khối lớp
    const gradeChecked = form.querySelector('input[name="opt_grade"]:checked');
    if (!gradeChecked) {
      highlightError('card_grade', 'Em hãy chọn Khối lớp ở Phần A nhé!');
      return;
    }
    let gradeVal = gradeChecked.value;
    if (gradeVal === 'Khác') {
      const otherVal = (document.getElementById('inp_grade_other')?.value || '').trim();
      if (!otherVal) {
        highlightError('card_grade', 'Em hãy nhập tên khối lớp ở ô "Khác" nhé!');
        return;
      }
      gradeVal = 'Khác: ' + otherVal;
    }

    // 2. Tình trạng biết bơi
    const swimChecked = form.querySelector('input[name="opt_swim"]:checked');
    if (!swimChecked) {
      highlightError('card_swim', 'Em hãy chọn tình trạng biết bơi ở Câu 2 nhé!');
      return;
    }
    const swimVal = swimChecked.value;

    // 3. Kiểm tra 12 câu trắc nghiệm phần B
    const bAnswers = [];
    for (let tc of SV.partB) {
      for (let q of tc.questions) {
        const checked = form.querySelector(`input[name="opt_q_${q.num}"]:checked`);
        if (!checked) {
          highlightError(`card_q_${q.num}`, `Em chưa chọn đáp án cho Câu ${q.num}! Hãy chọn 1 đáp án đúng nhất nhé.`);
          return;
        }
        bAnswers.push({
          num: q.num,
          tcId: tc.tcId,
          selectedIndex: parseInt(checked.value, 10),
          correctIndex: q.correct,
          isCorrect: parseInt(checked.value, 10) === q.correct,
          selectedText: q.options[parseInt(checked.value, 10)]
        });
      }
    }

    // 4. Câu 13 Phần C
    const q13CheckedBoxes = Array.from(form.querySelectorAll('input[name="opt_q_13"]:checked'));
    if (q13CheckedBoxes.length === 0) {
      highlightError('card_q_13', 'Em hãy chọn ít nhất 1 hình thức học tập yêu thích ở Câu 13 nhé!');
      return;
    }
    const q13Selections = q13CheckedBoxes.map(c => {
      if (c.value === 'Khác') {
        const otherVal = (document.getElementById('inp_q13_other')?.value || '').trim();
        return otherVal ? `Khác (${otherVal})` : 'Khác';
      }
      return c.value;
    });

    // 5. Câu 14 Góp ý
    const feedbackVal = (document.getElementById('inp_feedback')?.value || '').trim();

    // ================= TÍNH ĐIỂM TIÊU CHÍ (TC1 -> TC6) =================
    // Quy tắc: học sinh đạt một tiêu chí khi trả lời ĐÚNG CẢ 2 câu thuộc tiêu chí đó
    const criteriaResults = [];
    for (let i = 1; i <= 6; i++) {
      const tcQuestions = bAnswers.filter(a => a.tcId === i);
      const isPass = tcQuestions.length === 2 && tcQuestions[0].isCorrect && tcQuestions[1].isCorrect;
      criteriaResults.push({
        tcId: i,
        tcName: SV.partB[i - 1].tcName,
        isPass: isPass,
        q1: tcQuestions[0],
        q2: tcQuestions[1]
      });
    }

    const totalAchieved = criteriaResults.filter(tc => tc.isPass).length;

    // Payload đồng bộ Google Sheets
    const payload = {
      timestamp: new Date().toLocaleString('vi-VN'),
      surveyCode: autoCode,
      stage: SV.header.stage,
      grade: gradeVal,
      swim: swimVal,
      tc1: criteriaResults[0].isPass ? 1 : 0,
      tc2: criteriaResults[1].isPass ? 1 : 0,
      tc3: criteriaResults[2].isPass ? 1 : 0,
      tc4: criteriaResults[3].isPass ? 1 : 0,
      tc5: criteriaResults[4].isPass ? 1 : 0,
      tc6: criteriaResults[5].isPass ? 1 : 0,
      totalAchieved: totalAchieved,
      q1: bAnswers[0].selectedText,
      q2: bAnswers[1].selectedText,
      q3: bAnswers[2].selectedText,
      q4: bAnswers[3].selectedText,
      q5: bAnswers[4].selectedText,
      q6: bAnswers[5].selectedText,
      q7: bAnswers[6].selectedText,
      q8: bAnswers[7].selectedText,
      q9: bAnswers[8].selectedText,
      q10: bAnswers[9].selectedText,
      q11: bAnswers[10].selectedText,
      q12: bAnswers[11].selectedText,
      q13_format: q13Selections.join(', '),
      q14_feedback: feedbackVal
    };

    const submitBtn = document.getElementById('btn-submit');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Đang đồng bộ dữ liệu... ⏳';
    }

    // 1. Lưu LocalStorage
    const fullSavedData = {
      payload: payload,
      criteriaResults: criteriaResults,
      bAnswers: bAnswers,
      q13Selections: q13Selections,
      feedbackVal: feedbackVal
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fullSavedData));
    } catch(e) {
      console.warn('Lỗi lưu LocalStorage:', e);
    }

    // 2. Gửi Google Sheets
    if (GOOGLE_SCRIPT_URL) {
      try {
        await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(payload)
        });
      } catch(err) {
        console.warn('Lỗi gửi dữ liệu Google Sheets:', err);
      }
    }

    if (window.confetti) {
      try {
        window.confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      } catch(e) {}
    }

    render();
  }

  function renderResult(saved) {
    const resArea = document.getElementById('survey-result-area');
    if (!resArea) return;

    resArea.innerHTML = `
      <div class="result-card" style="text-align:center;padding:36px 24px;">
        <div style="font-size:52px;margin-bottom:12px;">🎉</div>
        <h3 style="font-size:24px;color:var(--tx);margin:0 0 10px;">CẢM ƠN EM ĐÃ THAM GIA KHẢO SÁT!</h3>
        <p style="color:var(--mu);font-size:16px;line-height:1.6;max-width:580px;margin:0 auto 24px;">
          Những chia sẻ và cảm nhận của em đã được hệ sinh thái SafeWater 4.0 ghi nhận thành công. Đây là nguồn dữ liệu quý giá giúp nhóm nghiên cứu tiếp tục cải thiện nội dung an toàn phòng chống đuối nước ngày một tốt hơn!
        </p>

        <div style="display:flex;justify-content:center;gap:14px;margin-top:20px;flex-wrap:wrap;">
          <a href="../index.html" class="btn-submit" style="text-decoration:none;padding:12px 28px;">
            🏠 Về trang chủ SafeWater
          </a>
          <button type="button" class="btn-redo" id="btn-redo-survey">
            ✏️ Khảo sát lại
          </button>
        </div>
      </div>
    `;

    const btnRedo = document.getElementById('btn-redo-survey');
    if (btnRedo) {
      btnRedo.onclick = () => {
        if (confirm('Em có muốn làm lại phiếu khảo sát này không?')) {
          localStorage.removeItem(STORAGE_KEY);
          render();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      };
    }
  }

  // Khởi động
  render();
})();
