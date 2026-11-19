/* Bộ icon nét mảnh (symbol id bắt đầu bằng i-): dùng cho menu, header, hình nền hero.
   Thêm icon: dán thêm <symbol id="i-ten" viewBox="0 0 24 24">…</symbol> vào chuỗi dưới.
   Dùng: <svg class="i"><use href="#i-ten"/></svg> */
window.SW=window.SW||{};
SW.sprites=SW.sprites||{};
SW.sprites.line=`
<symbol id="i-drop" viewBox="0 0 24 24"><path d="M12 3C8 8 6 11 6 14a6 6 0 0012 0c0-3-2-6-6-11z"/></symbol>
<symbol id="i-home" viewBox="0 0 24 24"><path d="M3 11l9-8 9 8v9a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1z"/></symbol>
<symbol id="i-book" viewBox="0 0 24 24"><path d="M5 4h13a1 1 0 011 1v14H6a2 2 0 00-2 2V5a1 1 0 011-1zM4 19a2 2 0 012-2h13"/></symbol>
<symbol id="i-game" viewBox="0 0 24 24"><path d="M7 8h10a4 4 0 014 4v2a3 3 0 01-5.2 2L14 14h-4l-1.8 2A3 3 0 013 14v-2a4 4 0 014-4zM8 10v4M6 12h4M16 11h.01M18 13h.01"/></symbol>
<symbol id="i-pin" viewBox="0 0 24 24"><path d="M12 21s-7-6-7-11a7 7 0 0114 0c0 5-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></symbol>
<symbol id="i-bot" viewBox="0 0 24 24"><rect x="4" y="8" width="16" height="11" rx="3"/><path d="M12 8V4M9 13h.01M15 13h.01M9 16.5h6"/><circle cx="12" cy="3.5" r="1"/></symbol>
<symbol id="i-clip" viewBox="0 0 24 24"><path d="M9 4h6v3H9zM7 5H6a1 1 0 00-1 1v14a1 1 0 001 1h12a1 1 0 001-1V6a1 1 0 00-1-1h-1M9 12h6M9 16h4"/></symbol>
<symbol id="i-info" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5h.01"/></symbol>
<symbol id="i-card" viewBox="0 0 24 24"><rect x="3" y="6" width="14" height="14" rx="2"/><path d="M7 6V4h14v14h-2"/></symbol>
<symbol id="i-search" viewBox="0 0 24 24"><circle cx="11" cy="11" r="6"/><path d="M20 20l-4.3-4.3"/></symbol>
<symbol id="i-video" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="M10 9l5 3-5 3z"/></symbol>
<symbol id="i-play" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M10 8l6 4-6 4z"/></symbol>
<symbol id="i-news" viewBox="0 0 24 24"><path d="M4 5h13v14H6a2 2 0 01-2-2zM17 9h3v8a2 2 0 01-2 2M7 9h7M7 13h7"/></symbol>
<symbol id="i-tool" viewBox="0 0 24 24"><path d="M14.7 6.3a4 4 0 00-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 005.4-5.4l-2.5 2.5-2.5-.5-.5-2.5z"/></symbol>
<symbol id="i-life" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><path d="M5.6 5.6l3.6 3.6M18.4 5.6l-3.6 3.6M5.6 18.4l3.6-3.6M18.4 18.4l-3.6-3.6"/></symbol>
<symbol id="i-siren" viewBox="0 0 24 24"><path d="M7 18v-6a5 5 0 0110 0v6M5 18h14v3H5zM12 3v2M4 8l1.5 1M20 8l-1.5 1"/></symbol>
<symbol id="i-phone" viewBox="0 0 24 24"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z"/></symbol>
<symbol id="i-megaphone" viewBox="0 0 24 24"><path d="M3 11v2a1 1 0 001 1h2l8 4V6L6 10H4a1 1 0 00-1 1zM18 9a4 4 0 010 6"/></symbol>
<symbol id="i-chart" viewBox="0 0 24 24"><path d="M4 20V10M10 20V4M16 20v-8M22 20H2"/></symbol>
<symbol id="i-mountain" viewBox="0 0 24 24"><path d="M2 20l7-12 4 6 3-4 6 10z"/></symbol>
<symbol id="i-wave" viewBox="0 0 24 24"><path d="M2 9c3-3 5 3 8 0s5 3 8 0 3-1 4 0M2 15c3-3 5 3 8 0s5 3 8 0 3-1 4 0"/></symbol>
<symbol id="i-pond" viewBox="0 0 24 24"><circle cx="12" cy="7" r="3"/><path d="M2 14c3-3 5 3 8 0s5 3 8 0 3-1 4 0M2 19c3-3 5 3 8 0s5 3 8 0 3-1 4 0"/></symbol>
<symbol id="i-bucket" viewBox="0 0 24 24"><path d="M5 8h14l-2 12H7zM5 8a7 3 0 0114 0"/></symbol>
<symbol id="i-swim" viewBox="0 0 24 24"><circle cx="16" cy="6" r="2"/><path d="M3 18c2-2 3 2 5 0s3 2 5 0 3 2 5 0M7 14l4-3 3 2 3-4"/></symbol>
<symbol id="i-alert" viewBox="0 0 24 24"><path d="M12 3l10 18H2zM12 10v5M12 18h.01"/></symbol>
<symbol id="i-star" viewBox="0 0 24 24"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/></symbol>
<symbol id="i-bulb" viewBox="0 0 24 24"><path d="M9 18h6M10 21h4M12 3a6 6 0 00-3 11c.6.5 1 1.2 1 2h4c0-.8.4-1.5 1-2a6 6 0 00-3-11z"/></symbol>
<symbol id="i-heart" viewBox="0 0 24 24"><path d="M12 20s-7-4.5-7-10a4 4 0 017-2.5A4 4 0 0119 10c0 5.5-7 10-7 10z"/></symbol>
<symbol id="i-shield" viewBox="0 0 24 24"><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/></symbol>
<symbol id="i-trophy" viewBox="0 0 24 24"><path d="M8 4h8v5a4 4 0 01-8 0zM8 6H4v1a4 4 0 004 4M16 6h4v1a4 4 0 01-4 4M12 13v4M8 20h8M10 17h4"/></symbol>
<symbol id="i-clock" viewBox="0 0 24 24"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2M9 2h6"/></symbol>
<symbol id="i-steps" viewBox="0 0 24 24"><path d="M4 6h4M4 12h8M4 18h12"/></symbol>
<symbol id="i-user" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0116 0"/></symbol>
<symbol id="i-target" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/></symbol>
<symbol id="i-leaf" viewBox="0 0 24 24"><path d="M5 19c0-9 5-14 14-14 0 9-5 14-14 14zM5 19l8-8"/></symbol>
<symbol id="i-flag" viewBox="0 0 24 24"><path d="M5 21V4M5 4h12l-2 4 2 4H5"/></symbol>
<symbol id="i-qr" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3h-3zM20 14v7M14 20h3"/></symbol>
<symbol id="i-sun" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5" fill="#ffd23f"/><path d="M12 1v3M12 20v3M1 12h3M20 12h3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/></symbol>
<symbol id="i-cloud" viewBox="0 0 24 24"><path d="M7 19a4.5 4.5 0 010-9 6 6 0 0111.5-1.5A5 5 0 0118 19z"/></symbol>
<symbol id="i-pine" viewBox="0 0 24 24"><path d="M12 2l5.5 8H14l5 7H5l5-7H6.5zM11 17h2v5h-2z"/></symbol>
<symbol id="i-mtf" viewBox="0 0 24 24"><path d="M1 21L9 6l4.5 8 3-4L23 21z"/></symbol>
<symbol id="i-fish" viewBox="0 0 24 24"><path d="M2 12c4-6 11-6 15 0-4 6-11 6-15 0zM17 12l5-5v10z"/></symbol>
`;
