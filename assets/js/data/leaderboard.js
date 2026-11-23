/* Kết nối trang Kiểm tra với Google Apps Script. */
window.SW = window.SW || {};

window.SW.leaderboard = (function() {
  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxihBfQUHiQj6M0TXon-6ufZxjt6a9Lre-jeO3fvsNiE2EwlzTN71Gi2n3V7A6Q8hl3/exec';
  let latestEntries = [];

  async function request(payload, endpoint = GOOGLE_SCRIPT_URL) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), payload ? 25000 : 8000);
    try {
      const options = { signal: controller.signal, credentials: 'omit' };
      if (payload) {
        options.method = 'POST';
        options.headers = { 'Content-Type': 'text/plain;charset=UTF-8' };
        options.body = JSON.stringify(payload);
      }
      const response = await fetch(endpoint, options);
      if (!response.ok) throw new Error('HTTP ' + response.status);
      const data = await response.json();
      if (!data || typeof data.ok !== 'boolean') throw new Error('Invalid response');
      if (!data.ok) {
        const error = new Error(data.error || 'Hệ thống đang bận. Vui lòng thử lại.');
        error.code = data.code || 'server';
        throw error;
      }
      return data;
    } catch (error) {
      if (error.code) throw error;
      throw new Error('Chưa nhận được phản hồi từ hệ thống thi. Vui lòng thử lại.');
    } finally {
      clearTimeout(timeout);
    }
  }

  async function getLeaderboard() {
    try {
      const { entries } = await request();
      if (!Array.isArray(entries)) throw new Error('Invalid leaderboard');
      latestEntries = entries.slice(0, 10).map(normalizeEntry);
      return { entries: latestEntries, stale: false };
    } catch {
      return { entries: latestEntries, stale: true };
    }
  }

  function normalizeEntry(entry) {
    return {
      name: String(entry.name || ''),
      cls: String(entry.cls || ''),
      school: String(entry.school || ''),
      score: Number(entry.score) || 0,
      elapsed: Number(entry.elapsed).toLocaleString('vi-VN', { maximumFractionDigits: 3 }) + 's',
      correct: Number.isInteger(entry.correctCount) ? entry.correctCount + '/14' : ''
    };
  }

  function mountList(root) {
    const list = root.querySelector('.lb-list');
    root.insertAdjacentHTML('beforeend', `
      <p class="lb-page-status" role="status"></p>
      <div class="lb-page-nav" hidden>
        <button class="b o" type="button" data-previous>Trang trước</button>
        <button class="b o" type="button" data-next>Trang sau</button>
      </div>
      <button class="b o lb-page-toggle" type="button" aria-expanded="false">Xem toàn bộ bảng xếp hạng</button>
    `);
    const status = root.querySelector('.lb-page-status');
    const nav = root.querySelector('.lb-page-nav');
    const previous = root.querySelector('[data-previous]');
    const next = root.querySelector('[data-next]');
    const toggle = root.querySelector('.lb-page-toggle');
    let topEntries = [];
    let page = 0;

    function render(entries, firstRank) {
      if (!entries.length) {
        list.textContent = 'Chưa có thêm thí sinh.';
        return;
      }
      list.replaceChildren(...entries.map((entry, index) => {
        const row = document.createElement('div');
        row.className = 'lb-item';
        row.innerHTML = `
          <div class="lb-item-left">
            <span class="lb-rank"></span>
            <div class="lb-info"><span class="lb-name"></span><span class="lb-meta"></span></div>
          </div>
          <div class="lb-score-tag"><div></div><div class="lb-time-meta"></div></div>
        `;
        row.querySelector('.lb-rank').textContent = '#' + (firstRank + index);
        row.querySelector('.lb-name').textContent = entry.name;
        row.querySelector('.lb-meta').textContent = entry.cls + ' · ' + entry.school;
        row.querySelector('.lb-score-tag div').textContent = entry.score + 'đ';
        row.querySelector('.lb-time-meta').textContent = '⏱️ ' + entry.elapsed;
        return row;
      }));
    }

    async function showPage(target) {
      const wasPreviousDisabled = previous.disabled;
      const wasNextDisabled = next.disabled;
      toggle.disabled = previous.disabled = next.disabled = true;
      status.textContent = 'Đang tải bảng xếp hạng…';
      try {
        const endpoint = new URL(GOOGLE_SCRIPT_URL);
        endpoint.searchParams.set('rankingPage', target);
        const { entries, firstRank, hasNext } = await request(undefined, endpoint);
        if (!Array.isArray(entries) || !Number.isInteger(firstRank) || typeof hasNext !== 'boolean') {
          throw new Error('Invalid ranking page');
        }
        render(entries.map(normalizeEntry), firstRank);
        page = target;
        toggle.textContent = 'Thu gọn về Top 10';
        toggle.setAttribute('aria-expanded', 'true');
        nav.hidden = target === 1 && !hasNext;
        previous.disabled = target === 1;
        next.disabled = !hasNext;
        status.textContent = entries.length ? 'Hạng ' + firstRank + '–' + (firstRank + entries.length - 1) : '';
      } catch {
        status.textContent = 'Chưa tải được trang xếp hạng. Vui lòng thử lại.';
        previous.disabled = wasPreviousDisabled;
        next.disabled = wasNextDisabled;
      } finally {
        toggle.disabled = false;
      }
    }

    toggle.onclick = () => {
      if (!page) return showPage(1);
      page = 0;
      nav.hidden = true;
      status.textContent = '';
      toggle.textContent = 'Xem toàn bộ bảng xếp hạng';
      toggle.setAttribute('aria-expanded', 'false');
      render(topEntries.slice(3), 4);
    };
    previous.onclick = () => showPage(page - 1);
    next.onclick = () => showPage(page + 1);

    return entries => {
      topEntries = entries;
      if (!page) render(topEntries.slice(3), 4);
    };
  }

  return { request, getLeaderboard, mountList };
})();
