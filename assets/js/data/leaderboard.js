/* assets/js/data/leaderboard.js - Quản lý dữ liệu Bảng vàng vinh danh SafeWater */
window.SW = window.SW || {};

window.SW.leaderboard = (function() {
  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxihBfQUHiQj6M0TXon-6ufZxjt6a9Lre-jeO3fvsNiE2EwlzTN71Gi2n3V7A6Q8hl3/exec';
  const LB_KEY = 'sw_leaderboard_records_v1';

  // 10 thí sinh tiêu biểu chuẩn từ hệ thống dữ liệu Lâm Đồng
  const DEFAULT_LIST = [
    { name: "Hoàng Gia Bảo", cls: "5A", school: "Trường TH&THCS Nguyễn Du", ward: "Thuận Hạnh", prov: "Lâm Đồng", score: 146, correct: "10/10", timeSeconds: 88, elapsed: "88s" },
    { name: "Vũ Mai Phương", cls: "5B", school: "Trường TH&THCS Nguyễn Du", ward: "Thuận Hạnh", prov: "Lâm Đồng", score: 141, correct: "10/10", timeSeconds: 98, elapsed: "98s" },
    { name: "Nguyễn Đăng Khôi", cls: "6A", school: "Trường TH&THCS Nguyễn Du", ward: "Thuận Hạnh", prov: "Lâm Đồng", score: 136, correct: "9/10", timeSeconds: 88, elapsed: "88s" },
    { name: "Trần Thùy Linh", cls: "5C", school: "Trường TH&THCS Nguyễn Du", ward: "Thuận Hạnh", prov: "Lâm Đồng", score: 132, correct: "9/10", timeSeconds: 96, elapsed: "96s" },
    { name: "Phạm Quốc Anh", cls: "4B", school: "Trường TH&THCS Nguyễn Du", ward: "Thuận Hạnh", prov: "Lâm Đồng", score: 128, correct: "9/10", timeSeconds: 104, elapsed: "104s" },
    { name: "Lê Minh Triết", cls: "6B", school: "Trường TH&THCS Nguyễn Du", ward: "Thuận Hạnh", prov: "Lâm Đồng", score: 125, correct: "8/10", timeSeconds: 90, elapsed: "90s" },
    { name: "Đặng Thảo Vy", cls: "5A", school: "Trường TH&THCS Nguyễn Du", ward: "Thuận Hạnh", prov: "Lâm Đồng", score: 120, correct: "8/10", timeSeconds: 100, elapsed: "100s" },
    { name: "Bùi Thanh Hằng", cls: "4A", school: "Trường TH&THCS Nguyễn Du", ward: "Thuận Hạnh", prov: "Lâm Đồng", score: 115, correct: "8/10", timeSeconds: 110, elapsed: "110s" },
    { name: "Đỗ Nhật Minh", cls: "5C", school: "Trường TH&THCS Nguyễn Du", ward: "Thuận Hạnh", prov: "Lâm Đồng", score: 112, correct: "7/10", timeSeconds: 96, elapsed: "96s" },
    { name: "Hồ Khánh An", cls: "6A", school: "Trường TH&THCS Nguyễn Du", ward: "Thuận Hạnh", prov: "Lâm Đồng", score: 105, correct: "7/10", timeSeconds: 110, elapsed: "110s" }
  ];

  async function getLeaderboard() {
    // 1. Kiểm tra cache trong LocalStorage
    let localData = null;
    try {
      const cached = JSON.parse(localStorage.getItem(LB_KEY));
      if (Array.isArray(cached) && cached.length > 0) {
        localData = cached;
      }
    } catch(e) {}

    // 2. Thử fetch từ Google Sheets (không chặn UI nếu mạng chậm)
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);
      const res = await fetch(GOOGLE_SCRIPT_URL, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          // Chuẩn hóa dữ liệu Sheets
          const normalized = data.map(item => ({
            name: item.name || 'Thí sinh',
            cls: item.class || item.cls || '-',
            school: item.school || 'Trường TH&THCS Nguyễn Du',
            score: parseInt(item.score, 10) || 0,
            elapsed: item.elapsed || (item.timeSeconds ? `${item.timeSeconds}s` : '90s'),
            timeSeconds: parseInt(item.timeSeconds, 10) || parseInt(item.elapsed, 10) || 90
          }));
          normalized.sort((a, b) => b.score - a.score || a.timeSeconds - b.timeSeconds);
          localStorage.setItem(LB_KEY, JSON.stringify(normalized));
          return normalized;
        }
      }
    } catch(e) {
      // Dùng fallback nhẹ nhàng
    }

    if (localData) return localData;

    // Lưu mặc định để các trang đều đồng bộ
    try { localStorage.setItem(LB_KEY, JSON.stringify(DEFAULT_LIST)); } catch(e) {}
    return DEFAULT_LIST;
  }

  function saveLeaderboard(newRecord) {
    let list = [];
    try {
      list = JSON.parse(localStorage.getItem(LB_KEY)) || [];
    } catch(e) {}
    if (list.length === 0) list = [...DEFAULT_LIST];

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
    DEFAULT_LIST,
    getLeaderboard,
    saveLeaderboard
  };
})();
