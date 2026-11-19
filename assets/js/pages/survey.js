/* pages/survey.js – Quản lý phiếu khảo sát duy nhất sau khi xem trang web, tự động gửi dữ liệu về Google Sheets */
(function(){
  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwdbF9UFCh00kAJRaqWODd6haj2C6pyElh7TdfqiKiIzOEM_fvdUSZKDGbCPjvzLwKA/exec';
  const SV = SW.data.survey;
  const storageKey = 'sw_survey_single_v1';

  function load() {
    try {
      return JSON.parse(localStorage.getItem(storageKey));
    } catch(e) {
      return null;
    }
  }

  function render() {
    const saved = load();
    const container = $('#survey-form');
    if (!container) return;

    container.innerHTML = SV.map((s, i) => {
      return `
        <div class="q-card" id="qc_${i}">
          <div class="q-card-head">
            <span class="q-num">Câu ${i + 1}</span>
            <b>${s.q}</b>
          </div>
          <div class="q-options">
            ${s.options.map((opt, k) => {
              const isChecked = saved && saved[i] === k;
              const ch = isChecked ? ' checked' : '';
              const dis = saved ? ' disabled' : '';
              const cls = 'q-opt-label' + (isChecked ? ' selected' : '') + (saved ? ' off' : '');
              return `
                <label class="${cls}" data-for="q_${i}">
                  <input type="radio" name="q_${i}" value="${k}"${ch}${dis}>
                  <span>${opt}</span>
                </label>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }).join('') +
    `
      <div class="survey-action-bar">
        ${saved
          ? `<button class="btn-redo" id="btn-reset">✏️ Khảo sát lại</button>`
          : `<button class="btn-submit" id="btn-submit">Gửi ý kiến khảo sát 📨</button>`}
      </div>
    `;

    container.querySelectorAll('.q-opt-label').forEach(label => {
      const input = label.querySelector('input');
      input.addEventListener('change', () => {
        const groupKey = label.getAttribute('data-for');
        container.querySelectorAll(`[data-for="${groupKey}"]`).forEach(l => l.classList.remove('selected'));
        if (input.checked) label.classList.add('selected');
      });
    });

    bindBtns();
  }

  function bindBtns() {
    const submitBtn = $('#btn-submit');
    const resetBtn = $('#btn-reset');
    if (submitBtn) submitBtn.onclick = submit;
    if (resetBtn) resetBtn.onclick = reset;
  }

  async function submit() {
    const answers = SV.map((s, i) => {
      const c = document.querySelector(`input[name="q_${i}"]:checked`);
      return c ? +c.value : -1;
    });

    const miss = answers.indexOf(-1);
    if (miss !== -1) {
      const k = $('#kres');
      k.hidden = false;
      k.className = 'card';
      k.style.borderColor = 'var(--rd)';
      k.style.color = 'var(--rd)';
      k.innerHTML = `⚠️ Vui lòng hoàn thành tất cả các mục khảo sát! (Còn <b>Câu ${miss + 1}</b> chưa chọn)`;
      
      const targetCard = document.getElementById(`qc_${miss}`);
      if (targetCard) {
        targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        targetCard.style.outline = '2px solid var(--rd)';
        setTimeout(() => { targetCard.style.outline = 'none'; }, 2000);
      }
      return;
    }

    const btn = $('#btn-submit');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = 'Đang gửi dữ liệu... ⏳';
    }

    const payload = {
      surveyType: 'Sau khi xem trang web',
      timestamp: new Date().toLocaleString('vi-VN'),
      answer1: SV[0].options[answers[0]],
      answer2: SV[1].options[answers[1]],
      answer3: SV[2].options[answers[2]]
    };

    // 1. Lưu LocalStorage
    try {
      localStorage.setItem(storageKey, JSON.stringify(answers));
    } catch(e) {}

    // 2. Gửi Google Sheets
    if (GOOGLE_SCRIPT_URL) {
      try {
        await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } catch(err) {
        console.warn('Lỗi gửi Google Sheets:', err);
      }
    }

    render();

    const k = $('#kres');
    k.hidden = false;
    k.style.borderColor = 'var(--bd)';
    k.style.color = 'var(--tx)';
    k.innerHTML = `
      <div style="font-size:16px;line-height:1.6">
        🎉 <b>Cảm ơn bạn đã hoàn thành khảo sát!</b><br>
        Ý kiến đóng góp của bạn đã được lưu lại và gửi thành công về Google Sheets.
      </div>
    `;
  }

  function reset() {
    try {
      localStorage.removeItem(storageKey);
    } catch(e) {}
    render();
    $('#kres').hidden = true;
  }

  render();
})();
