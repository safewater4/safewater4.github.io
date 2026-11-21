/* ============================================================
   assets/js/safebuddy.js
   Trợ lý ảo Giọt nước SafeBuddy – SafeWater 4.0
   Giữ nguyên bản sắc Giọt nước xanh có phao cứu sinh,
   hướng dẫn học sinh theo lộ trình: Kiến thức -> Kiểm tra -> Khảo sát.
   ============================================================ */

(function () {
  'use strict';

  /* ============================================================
     1. KHU VỰC CẤU HÌNH LỜI THOẠI & KỊCH BẢN (Dễ dàng tùy chỉnh)
     ============================================================ */
  const SAFEBUDDY_SCRIPTS = {
    // 1.1 Kịch bản Trang chủ
    home: {
      introSequence: [
        {
          text: "Chào bạn! Mình là Giọt nước SafeBuddy! 💧",
          duration: 4000,
          highlight: true
        },
        {
          text: "Mình sẽ giúp bạn trang bị kiến thức phòng, chống đuối nước!",
          duration: 4500,
          highlight: true
        },
        {
          text: "Đầu tiên, mình vào học kiến thức nhé!",
          duration: 8000,
          highlight: true,
          actions: [
            { label: "📖 Xem kiến thức ngay", url: "kien-thuc/index.html", primary: true },
            { label: "✅ Mình học rồi", action: "home_learned", secondary: true }
          ]
        }
      ],
      learnedResponse: {
        text: "Bạn giỏi quá! Giờ thử sức nhé! 🌟",
        duration: 9000,
        actions: [
          { label: "📝 Làm bài kiểm tra", url: "kiem-tra/index.html", primary: true },
          { label: "📋 Làm khảo sát", url: "khao-sat/index.html", accent: true },
          { label: "🎮 Chơi trò chơi", url: "tro-choi/index.html", secondary: true }
        ]
      },
      welcomeBack: {
        text: "Chào bạn trở lại! Nhớ hoàn thành kiểm tra và khảo sát để nhận huy hiệu nhé! 🏆",
        duration: 5000,
        actions: [
          { label: "📝 Làm kiểm tra", url: "kiem-tra/index.html", primary: true },
          { label: "📋 Làm khảo sát", url: "khao-sat/index.html", accent: true }
        ]
      }
    },

    // 1.2 Kịch bản Trang Kiến thức
    kienthuc: {
      overview: {
        text: "Bạn bấm vào từng bài để học nhé! 📖",
        duration: 4500
      },
      lesson: {
        text: "Cố gắng ghi nhớ các kỹ năng an toàn nhé! 🛡️",
        duration: 4500
      },
      suggestNext: {
        text: "Học xong rồi, bạn hãy làm bài kiểm tra hoặc chơi trò chơi nhé!",
        duration: 8000,
        actions: [
          { label: "📝 Làm bài kiểm tra", url: "kiem-tra/index.html", primary: true },
          { label: "🎮 Chơi trò chơi", url: "tro-choi/index.html", secondary: true }
        ]
      }
    },

    // 1.3 Kịch bản Trang Trò chơi (Chỉ ở danh sách)
    trochoi: {
      hub: {
        text: "Chọn một màn để phiêu lưu nào! 🎮 Bạn muốn làm biệt đội cứu hộ hay tuần tra an toàn?",
        duration: 6000
      }
    },

    // 1.4 Kịch bản Trang Bản đồ
    bando: {
      text: "Bạn xem thử khu vực nguy hiểm gần nhà mình nhé! 🗺️",
      duration: 5000
    },

    // 1.5 Kịch bản Trang Giới thiệu
    gioithieu: {
      text: "Chào bạn! Nhớ vào làm bài kiểm tra và khảo sát để nhận chứng chỉ nhé! 🏅",
      duration: 7000,
      actions: [
        { label: "📝 Làm kiểm tra", url: "kiem-tra/index.html", primary: true },
        { label: "📋 Làm khảo sát", url: "khao-sat/index.html", accent: true }
      ]
    },

    // 1.5.1 Kịch bản Trang Kiểm tra (Chào trước khi bấm bắt đầu làm bài)
    kiemtra: {
      welcome: {
        text: "Bạn đã sẵn sàng chưa? Nhập thông tin và bấm 'Bắt đầu làm bài' nhé! Chúc bạn đạt điểm tối đa! 📝✨",
        duration: 7000
      }
    },

    // 1.6 Nhắc nhở định kỳ (Random)
    reminders: [
      "Nhớ vào làm bài kiểm tra và khảo sát nha! 🎯",
      "Đừng quên làm bài kiểm tra để lấy chứng nhận SafeWater nhé! 🏅",
      "Bớt chút thời gian làm khảo sát giúp chúng mình nha! 📋",
      "Bạn đã thử sức với bài kiểm tra an toàn chưa nào? ⭐"
    ],

    // 1.7 Lời nhắc khi định rời khỏi trang (Exit Intent)
    exitIntent: {
      text: "Khoan đã! Bạn làm bài kiểm tra và khảo sát rồi hãy đi nhé! ⏳",
      actions: [
        { label: "📝 Làm kiểm tra", url: "kiem-tra/index.html", primary: true },
        { label: "📋 Làm khảo sát", url: "khao-sat/index.html", accent: true }
      ]
    },

    // 1.8 Khen thưởng chúc mừng khi hoàn thành
    celebrate: {
      test: "Tuyệt vời! Chúc mừng bạn đã hoàn thành xuất sắc bài kiểm tra! 🎉",
      survey: "Cảm ơn bạn rất nhiều vì đã hoàn thành khảo sát an toàn! 💖"
    }
  };

  /* ============================================================
     2. TIỆN ÍCH ĐƯỜNG DẪN & KIỂM TRA TRANG
     ============================================================ */
  function getRootUrl() {
    if (window.SW && typeof window.SW.root === 'string') return window.SW.root;
    return document.documentElement.dataset.root || '';
  }

  function resolveUrl(path) {
    if (!path) return '#';
    if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('#')) return path;
    return getRootUrl() + path;
  }

  function getCurrentNav() {
    return document.documentElement.dataset.nav || 'home';
  }

  function isLessonPage() {
    return document.documentElement.dataset.page === 'lesson';
  }

  // Kiểm tra xem có đang ở trong màn chơi game cụ thể không (các trang trò chơi ngoài index.html)
  function isInsideGameLevel() {
    const nav = getCurrentNav();
    if (nav !== 'trochoi') return false;
    const path = window.location.pathname.toLowerCase();
    // Nếu kết thúc bằng 'tro-choi/' hoặc 'tro-choi/index.html' thì là trang danh sách, ngược lại là màn chơi
    return !(path.endsWith('/tro-choi/') || path.endsWith('/tro-choi/index.html') || path.endsWith('\\tro-choi\\index.html'));
  }

  // Tự động nhúng CSS nếu trang chưa nhúng
  function ensureStylesheet() {
    const existing = document.querySelector('link[href*="safebuddy.css"]');
    if (!existing) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = resolveUrl('assets/css/safebuddy.css');
      document.head.appendChild(link);
    }
  }

  /* ============================================================
     3. TẠO GIAO DIỆN (AVATAR GIỌT NƯỚC SVG + BONG BÓNG CHAT)
     ============================================================ */
  function createSafeBuddyDOM() {
    // Nếu đã tồn tại thì không tạo lại
    if (document.getElementById('safebuddy-wrapper')) return;

    ensureStylesheet();

    const container = document.createElement('div');
    container.id = 'safebuddy-wrapper';
    container.className = 'safebuddy-container';
    container.setAttribute('aria-label', 'Trợ lý Giọt nước SafeBuddy');

    // SVG Giọt nước SafeBuddy chuẩn từ trang chủ
    container.innerHTML = `
      <div class="safebuddy-avatar sb-anim-bob" id="safebuddy-avatar" title="Nhấp để trò chuyện với SafeBuddy">
        <svg viewBox="0 0 120 140" aria-hidden="true">
          <defs>
            <linearGradient id="sb-mg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stop-color="#8fe6ff"/>
              <stop offset="1" stop-color="#0a84d6"/>
            </linearGradient>
          </defs>
          <!-- Thân giọt nước -->
          <path d="M60 6C40 38 18 62 18 88a42 42 0 0084 0C102 62 80 38 60 6z" fill="url(#sb-mg)" stroke="#06609e" stroke-width="3"/>
          <!-- Vệt sáng phản quang -->
          <ellipse cx="40" cy="64" rx="6" ry="12" fill="#fff" opacity=".55" transform="rotate(20 40 64)"/>
          <!-- Đôi mắt -->
          <circle cx="46" cy="86" r="8" fill="#fff"/>
          <circle cx="74" cy="86" r="8" fill="#fff"/>
          <g class="sb-eye">
            <circle cx="47" cy="87" r="4" fill="#06304f"/>
            <circle cx="75" cy="87" r="4" fill="#06304f"/>
          </g>
          <!-- Miệng cười -->
          <path id="sb-mouth" d="M50 102q10 10 20 0" stroke="#06304f" stroke-width="3.5" fill="none" stroke-linecap="round"/>
          <!-- Má hồng -->
          <circle cx="35" cy="99" r="5" fill="#ff8fab" opacity=".7"/>
          <circle cx="85" cy="99" r="5" fill="#ff8fab" opacity=".7"/>
          <!-- Phao cứu sinh -->
          <g class="sb-lifebuoy" transform="translate(60 126)">
            <circle r="14" fill="#fff" stroke="#ff5a5f" stroke-width="7"/>
            <path d="M-10-10l5 5M10-10l-5 5M-10 10l5-5M10 10l-5-5" stroke="#ff5a5f" stroke-width="5"/>
          </g>
        </svg>
        <span class="sb-mini-badge" title="SafeBuddy đang chờ bạn"></span>
      </div>

      <div class="safebuddy-bubble" id="safebuddy-bubble" style="display: none;">
        <button type="button" class="safebuddy-bubble-close" id="safebuddy-close" title="Thu gọn trợ lý" aria-label="Đóng">×</button>
        <div class="safebuddy-text" id="safebuddy-text"></div>
        <div class="safebuddy-actions" id="safebuddy-actions"></div>
      </div>
    `;

    document.body.appendChild(container);

    // Gắn sự kiện click vào nhân vật
    const avatar = document.getElementById('safebuddy-avatar');
    avatar.addEventListener('click', onAvatarClick);

    // Gắn sự kiện nút đóng / thu nhỏ
    const closeBtn = document.getElementById('safebuddy-close');
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      minimizeSafeBuddy();
    });
  }

  /* ============================================================
     4. ĐIỀU KHIỂN BONG BÓNG & TRẠNG THÁI HIỂN THỊ
     ============================================================ */
  let currentTimer = null;

  function showBubble(options) {
    const container = document.getElementById('safebuddy-wrapper');
    const bubble = document.getElementById('safebuddy-bubble');
    const textEl = document.getElementById('safebuddy-text');
    const actionsEl = document.getElementById('safebuddy-actions');

    if (!container || !bubble || !textEl) return;

    // Đang bị ẩn hoặc đang ở trong màn chơi game thì không bật
    if (container.classList.contains('safebuddy-hidden')) return;

    if (currentTimer) {
      clearTimeout(currentTimer);
      currentTimer = null;
    }

    // Đưa container về trạng thái mở nếu đang thu nhỏ
    container.classList.remove('sb-minimized');

    // Cập nhật nội dung văn bản
    textEl.textContent = options.text || '';

    // Cập nhật hiệu ứng nổi bật (lấp lánh)
    if (options.highlight) {
      bubble.classList.add('sb-highlight');
    } else {
      bubble.classList.remove('sb-highlight');
    }

    // Cập nhật các nút hành động
    actionsEl.innerHTML = '';
    if (Array.isArray(options.actions) && options.actions.length > 0) {
      options.actions.forEach(act => {
        const btn = document.createElement('a');
        btn.textContent = act.label;
        btn.className = 'sb-btn ' + (act.primary ? 'sb-btn-primary' : act.accent ? 'sb-btn-accent' : 'sb-btn-secondary');

        if (act.url) {
          btn.href = resolveUrl(act.url);
        } else if (act.action) {
          btn.href = 'javascript:void(0)';
          btn.addEventListener('click', (e) => {
            e.preventDefault();
            handleCustomAction(act.action);
          });
        }
        actionsEl.appendChild(btn);
      });
      actionsEl.style.display = 'flex';
    } else {
      actionsEl.style.display = 'none';
    }

    bubble.style.display = 'block';

    // Tự động đóng bong bóng sau khoảng thời gian thích hợp nếu không có hành động bắt buộc
    const duration = options.duration || Math.min(Math.max(3500, (options.text || '').length * 85), 8000);
    if (!options.permanent) {
      currentTimer = setTimeout(() => {
        hideBubble();
      }, duration);
    }
  }

  function hideBubble() {
    const bubble = document.getElementById('safebuddy-bubble');
    if (bubble) bubble.style.display = 'none';
    if (currentTimer) {
      clearTimeout(currentTimer);
      currentTimer = null;
    }
  }

  function minimizeSafeBuddy() {
    const container = document.getElementById('safebuddy-wrapper');
    if (!container) return;
    hideBubble();
    container.classList.add('sb-minimized');
    try {
      sessionStorage.setItem('safebuddy_minimized', 'true');
    } catch (e) {}
  }

  function expandSafeBuddy() {
    const container = document.getElementById('safebuddy-wrapper');
    if (!container) return;
    container.classList.remove('sb-minimized');
    try {
      sessionStorage.removeItem('safebuddy_minimized');
    } catch (e) {}
  }

  function onAvatarClick() {
    const container = document.getElementById('safebuddy-wrapper');
    const bubble = document.getElementById('safebuddy-bubble');
    if (!container) return;

    if (container.classList.contains('sb-minimized') || bubble.style.display === 'none') {
      expandSafeBuddy();
      // Nói một câu ngẫu nhiên thân thiện
      const testDone = localStorage.getItem('safewater-test-done') === 'true';
      const surveyDone = localStorage.getItem('safewater-survey-done') === 'true';

      if (!testDone || !surveyDone) {
        showBubble({
          text: "Bạn cần mình hỗ trợ gì nè? Nhớ làm kiểm tra và khảo sát nhé!",
          duration: 6000,
          actions: [
            { label: "📖 Học kiến thức", url: "kien-thuc/index.html", primary: true },
            { label: "📝 Làm kiểm tra", url: "kiem-tra/index.html", accent: true }
          ]
        });
      } else {
        showBubble({
          text: "Chào bạn! Chúc bạn một ngày tràn đầy năng lượng và luôn an toàn nhé! 🌊",
          duration: 4500
        });
      }
    } else {
      minimizeSafeBuddy();
    }
  }

  function handleCustomAction(actionKey) {
    if (actionKey === 'home_learned') {
      showBubble(SAFEBUDDY_SCRIPTS.home.learnedResponse);
    } else if (actionKey === 'dismiss') {
      hideBubble();
    }
  }

  /* ============================================================
     5. HIỆU ỨNG BAY LƯỢN CHÀO SÂN & ĐIỀU PHỐI KỊCH BẢN TỪNG TRANG
     ============================================================ */
  function triggerFlyIn(flyText, onLanded) {
    const container = document.getElementById('safebuddy-wrapper');
    if (!container) return;

    // Kích hoạt class bay từ trên xuống
    container.classList.add('safebuddy-flying');
    showBubble({
      text: flyText,
      highlight: true,
      permanent: true
    });

    // Sau 1.8s hạ cánh êm dịu thẳng xuống vị trí cố định
    setTimeout(() => {
      container.classList.remove('safebuddy-flying');
      if (typeof onLanded === 'function') {
        onLanded();
      }
    }, 1800);
  }

  function runPageScript() {
    const nav = getCurrentNav();
    const container = document.getElementById('safebuddy-wrapper');
    if (!container) return;

    // 5.1 Xử lý trang Trò chơi
    if (nav === 'trochoi') {
      if (isInsideGameLevel()) {
        // Đang trong màn chơi thì ẩn hoàn toàn trợ lý
        container.classList.add('safebuddy-hidden');
        return;
      } else {
        // Trang danh sách trò chơi: bay vào rủ chơi
        container.classList.remove('safebuddy-hidden');
        setTimeout(() => {
          triggerFlyIn("Vèo... Cùng chơi trò chơi an toàn nhé! 🎮", () => {
            showBubble(SAFEBUDDY_SCRIPTS.trochoi.hub);
          });
        }, 400);
        return;
      }
    }

    // 5.2 Xử lý trang Kiểm tra
    if (nav === 'kiemtra') {
      setupQuizPageObserver(container);
      return;
    }

    // 5.3 Xử lý trang Khảo sát
    if (nav === 'khaosat') {
      setupSurveyPageObserver(container);
      return;
    }

    // Mặc định hiện ở các trang thông thường
    container.classList.remove('safebuddy-hidden');

    // 5.4 Trang chủ
    if (nav === 'home') {
      setTimeout(() => {
        runHomeIntroSequence();
      }, 400);
      return;
    }

    // 5.5 Trang Kiến thức
    if (nav === 'kienthuc') {
      setTimeout(() => {
        triggerFlyIn("Vèo... Cùng học kỹ năng an toàn nhé! 📖", () => {
          if (isLessonPage()) {
            showBubble(SAFEBUDDY_SCRIPTS.kienthuc.lesson);
          } else {
            showBubble(SAFEBUDDY_SCRIPTS.kienthuc.overview);
          }
          // Sau 20s gợi ý bước tiếp theo
          setTimeout(() => {
            showBubble(SAFEBUDDY_SCRIPTS.kienthuc.suggestNext);
          }, 20000);
        });
      }, 400);
      return;
    }

    // 5.6 Trang Bản đồ
    if (nav === 'bando') {
      setTimeout(() => {
        triggerFlyIn("Vèo... Khám phá các điểm nguy hiểm gần nhà nào! 🗺️", () => {
          showBubble(SAFEBUDDY_SCRIPTS.bando);
        });
      }, 400);
      return;
    }

    // 5.7 Trang Giới thiệu
    if (nav === 'gioithieu') {
      setTimeout(() => {
        triggerFlyIn("Chào bạn! Cùng tìm hiểu SafeWater nhé! 🏅", () => {
          showBubble(SAFEBUDDY_SCRIPTS.gioithieu);
        });
      }, 400);
      return;
    }
  }

  // Chuỗi hội thoại mở đầu trang chủ (vừa bay lượn vừa chào, sau đó tiếp đất và hướng dẫn)
  function runHomeIntroSequence() {
    const seq = SAFEBUDDY_SCRIPTS.home.introSequence;
    if (!seq || seq.length === 0) return;

    triggerFlyIn("Chào bạn, mình tới rồi đây! 💧✨", () => {
      // Bước 1: Tự giới thiệu
      showBubble(seq[0]);

      // Bước 2: Giúp trang bị kiến thức
      setTimeout(() => {
        showBubble(seq[1]);

        // Bước 3: Hướng dẫn vào học kiến thức đầu tiên kèm 2 nút
        setTimeout(() => {
          showBubble(seq[2]);
          try {
            sessionStorage.setItem('safebuddy_home_intro_done', 'true');
          } catch (e) {}
        }, seq[1].duration);

      }, seq[0].duration);
    });
  }

  /* ============================================================
     6. THEO DÕI HOÀN THÀNH KIỂM TRA & KHẢO SÁT
     ============================================================ */
  function setupQuizPageObserver(container) {
    const startStep = document.getElementById('step-start');
    const examStep = document.getElementById('step-exam');
    const resultStep = document.getElementById('step-result');

    // Nếu đang ở màn hình bắt đầu: cho trợ lý hiện và bay vào chào!
    const isExamVisible = examStep && (examStep.style.display === 'block' || (!examStep.hidden && window.getComputedStyle(examStep).display !== 'none'));
    const isResultVisible = resultStep && (resultStep.style.display === 'block' || (!resultStep.hidden && window.getComputedStyle(resultStep).display !== 'none'));

    if (!isExamVisible && !isResultVisible) {
      container.classList.remove('safebuddy-hidden');
      setTimeout(() => {
        triggerFlyIn("Vèo... Chuẩn bị làm bài kiểm tra nhé! 📝", () => {
          showBubble(SAFEBUDDY_SCRIPTS.kiemtra.welcome);
        });
      }, 400);
    } else if (isExamVisible) {
      container.classList.add('safebuddy-hidden');
      hideBubble();
    } else if (isResultVisible) {
      container.classList.remove('safebuddy-hidden');
      celebrateSuccess('test');
    }

    // Khi người dùng bấm nút "Bắt đầu làm bài" thì ẩn trợ lý ngay
    const startBtn = document.getElementById('btn-start');
    if (startBtn) {
      startBtn.addEventListener('click', () => {
        container.classList.add('safebuddy-hidden');
        hideBubble();
      });
    }

    // Theo dõi DOM thay đổi khi chuyển bước hoặc nộp bài
    let examHiddenDone = false;
    let resultShownDone = false;

    const observer = new MutationObserver(() => {
      const examNow = examStep && (examStep.style.display === 'block' || (!examStep.hidden && window.getComputedStyle(examStep).display !== 'none'));
      const resNow = resultStep && (resultStep.style.display === 'block' || (!resultStep.hidden && window.getComputedStyle(resultStep).display !== 'none'));

      if (examNow && !examHiddenDone) {
        examHiddenDone = true;
        container.classList.add('safebuddy-hidden');
        hideBubble();
      }

      if (resNow && !resultShownDone) {
        resultShownDone = true;
        container.classList.remove('safebuddy-hidden');
        celebrateSuccess('test');
        try {
          localStorage.setItem('safewater-test-done', 'true');
        } catch (e) {}
      }
    });

    observer.observe(document.body, { childList: true, subtree: true, attributes: true });
  }

  function setupSurveyPageObserver(container) {
    // Ban đầu ẩn trợ lý trong lúc làm khảo sát
    container.classList.add('safebuddy-hidden');

    const checkSurveyDone = () => {
      const resArea = document.getElementById('survey-result-area');
      const isVisible = resArea && !resArea.hidden && resArea.style.display !== 'none';
      const hasSaved = !!localStorage.getItem('safewater_survey_v2') || !!localStorage.getItem('safewater_survey_completed');

      if (isVisible || hasSaved) {
        // Đã hoàn thành khảo sát!
        container.classList.remove('safebuddy-hidden');
        celebrateSuccess('survey');
        try {
          localStorage.setItem('safewater-survey-done', 'true');
        } catch (e) {}
        return true;
      }
      return false;
    };

    if (checkSurveyDone()) return;

    const observer = new MutationObserver(() => {
      if (checkSurveyDone()) observer.disconnect();
    });
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });
  }

  function celebrateSuccess(type) {
    const avatar = document.getElementById('safebuddy-avatar');
    if (avatar) avatar.classList.add('sb-celebrating');

    triggerFlyIn(type === 'test' ? "Tuyệt vời! Hoàn thành bài thi rồi! 🎉" : "Cảm ơn bạn đã hoàn thành khảo sát! 💖", () => {
      showBubble({
        text: type === 'test' ? SAFEBUDDY_SCRIPTS.celebrate.test : SAFEBUDDY_SCRIPTS.celebrate.survey,
        duration: 8000,
        highlight: true,
        actions: [
          { label: "🏠 Về trang chủ", url: "index.html", primary: true },
          { label: "🎮 Chơi trò chơi", url: "tro-choi/index.html", secondary: true }
        ]
      });
    });
  }

  /* ============================================================
     7. NHẮC NHỞ ĐỊNH KỲ & NHẮC KHI RỜI TRANG (EXIT INTENT)
     ============================================================ */
  function startPeriodicReminders() {
    const nav = getCurrentNav();
    if (nav === 'kiemtra' || nav === 'khaosat' || isInsideGameLevel()) return;

    // Cứ mỗi 3.5 phút (210 giây) nhắc 1 lần nếu chưa làm kiểm tra hoặc khảo sát
    setInterval(() => {
      const testDone = localStorage.getItem('safewater-test-done') === 'true';
      const surveyDone = localStorage.getItem('safewater-survey-done') === 'true';

      if (testDone && surveyDone) return; // Đã làm cả hai thì không nhắc nữa

      const reminders = SAFEBUDDY_SCRIPTS.reminders;
      const text = reminders[Math.floor(Math.random() * reminders.length)];

      showBubble({
        text: text,
        duration: 7000,
        actions: [
          { label: "📝 Làm kiểm tra", url: "kiem-tra/index.html", primary: true },
          { label: "📋 Làm khảo sát", url: "khao-sat/index.html", accent: true }
        ]
      });
    }, 210000);
  }

  function setupExitIntent() {
    document.addEventListener('mouseleave', function (e) {
      if (e.clientY <= 5) {
        const testDone = localStorage.getItem('safewater-test-done') === 'true';
        const surveyDone = localStorage.getItem('safewater-survey-done') === 'true';

        if (testDone && surveyDone) return;

        let exitShown = false;
        try {
          exitShown = sessionStorage.getItem('safebuddy_exit_shown') === 'true';
        } catch (err) {}

        if (!exitShown) {
          try {
            sessionStorage.setItem('safebuddy_exit_shown', 'true');
          } catch (err) {}
          showBubble(SAFEBUDDY_SCRIPTS.exitIntent);
        }
      }
    });
  }

  /* ============================================================
     8. KHỞI TẠO TỰ ĐỘNG
     ============================================================ */
  function initSafeBuddy() {
    createSafeBuddyDOM();
    runPageScript();
    startPeriodicReminders();
    setupExitIntent();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSafeBuddy);
  } else {
    initSafeBuddy();
  }

  // Xuất ra window để có thể gọi thủ công nếu cần
  window.SafeBuddy = {
    show: showBubble,
    hide: hideBubble,
    minimize: minimizeSafeBuddy,
    expand: expandSafeBuddy
  };
})();
