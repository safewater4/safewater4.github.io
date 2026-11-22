/* assets/js/data/leaderboard.js - Quản lý dữ liệu Bảng vàng vinh danh SafeWater */
window.SW = window.SW || {};

window.SW.leaderboard = (function() {
  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxihBfQUHiQj6M0TXon-6ufZxjt6a9Lre-jeO3fvsNiE2EwlzTN71Gi2n3V7A6Q8hl3/exec';
  const LB_KEY = 'sw_leaderboard_records_v3';

  async function getLeaderboard() {
    // 1. Luôn ưu tiên lấy dữ liệu trực tiếp mới nhất từ Google Sheets
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      const res = await fetch(GOOGLE_SCRIPT_URL, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          // Nếu bạn vừa xóa sạch trên Sheets (dữ liệu rỗng) -> Xóa sạch bộ nhớ tạm và trả về rỗng
          if (data.length === 0) {
            localStorage.removeItem(LB_KEY);
            return [];
          }

          // Chuẩn hóa dữ liệu từ Sheets
          const normalized = data.map(item => ({
            name: item.name || 'Thí sinh',
            cls: item.class || item.cls || '-',
            school: item.school || 'Trường TH&THCS Nguyễn Du',
            score: parseInt(item.score, 10) || 0,
            elapsed: item.elapsed || (item.timeSeconds ? `${item.timeSeconds}s` : '180s'),
            timeSeconds: parseInt(item.timeSeconds, 10) || parseInt(String(item.elapsed).replace('s',''), 10) || 180
          }));

          // Ưu tiên điểm cao xếp trên; bằng điểm thì ai ít giây hơn (nhanh hơn) xếp trên
          normalized.sort((a, b) => (b.score || 0) - (a.score || 0) || (a.timeSeconds || 0) - (b.timeSeconds || 0));
          localStorage.setItem(LB_KEY, JSON.stringify(normalized));
          return normalized;
        }
      }
    } catch(e) {
      console.warn('Lỗi kết nối Google Sheets, kiểm tra cache:', e);
    }

    // 2. Chỉ khi mất mạng hoặc không kết nối được mới lấy từ LocalStorage
    try {
      const cached = JSON.parse(localStorage.getItem(LB_KEY));
      if (Array.isArray(cached)) return cached;
    } catch(e) {}

    return [];
  }

  function saveLeaderboard(newRecord) {
    let list = [];
    try {
      list = JSON.parse(localStorage.getItem(LB_KEY)) || [];
    } catch(e) {}

    list.push(newRecord);
    list.sort((a, b) => (b.score || 0) - (a.score || 0) || (a.timeSeconds || 0) - (b.timeSeconds || 0));
    try {
      localStorage.setItem(LB_KEY, JSON.stringify(list));
    } catch(e) {}
    return list;
  }

  return {
    GOOGLE_SCRIPT_URL,
    LB_KEY,
    getLeaderboard,
    saveLeaderboard
  };
})();
