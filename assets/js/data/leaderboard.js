/* Kết nối trang Kiểm tra với Google Apps Script. */
window.SW = window.SW || {};

window.SW.leaderboard = (function() {
  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxihBfQUHiQj6M0TXon-6ufZxjt6a9Lre-jeO3fvsNiE2EwlzTN71Gi2n3V7A6Q8hl3/exec';
  let latestEntries = [];

  async function request(payload) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), payload ? 25000 : 8000);
    try {
      const options = { signal: controller.signal, credentials: 'omit' };
      if (payload) {
        options.method = 'POST';
        options.headers = { 'Content-Type': 'text/plain;charset=UTF-8' };
        options.body = JSON.stringify(payload);
      }
      const response = await fetch(GOOGLE_SCRIPT_URL, options);
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
      latestEntries = entries.slice(0, 10).map(entry => ({
        name: String(entry.name || ''),
        cls: String(entry.cls || ''),
        school: String(entry.school || ''),
        score: Number(entry.score) || 0,
        elapsed: Number(entry.elapsed).toLocaleString('vi-VN', { maximumFractionDigits: 3 }) + 's'
      }));
      return { entries: latestEntries, stale: false };
    } catch {
      return { entries: latestEntries, stale: true };
    }
  }

  return { request, getLeaderboard };
})();
