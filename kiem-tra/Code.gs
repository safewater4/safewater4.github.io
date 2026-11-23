const EXAM_GROUPS = {
  nb: { count: 5, points: 5 },
  th: { count: 5, points: 7 },
  vd: { count: 4, points: 10 }
};
const EXAM_ID_PREFIX = 'v14_';
// Một mã đại diện cho mỗi nội dung câu hỏi trong ngân hàng công khai.
const UNIQUE_QUESTION_IDS = new Set([
  'nb_1', 'nb_2', 'nb_3', 'nb_4', 'nb_5', 'nb_6', 'nb_7', 'nb_8', 'nb_9', 'nb_10',
  'nb_11', 'nb_12', 'nb_13', 'nb_14', 'nb_15', 'nb_16', 'nb_17', 'nb_18', 'nb_19', 'nb_20',
  'nb_21', 'nb_22', 'nb_23', 'nb_24', 'nb_25', 'nb_26', 'nb_27', 'nb_28', 'nb_29', 'nb_30',
  'nb_31', 'nb_32', 'nb_33', 'nb_34', 'nb_35', 'nb_36', 'nb_37', 'nb_38', 'nb_39', 'nb_40',
  'nb_42', 'nb_43', 'nb_45', 'nb_46', 'nb_48', 'nb_49', 'nb_51', 'nb_54', 'nb_57', 'nb_60',
  'vd_1', 'vd_2', 'vd_3', 'vd_4', 'vd_5', 'vd_6', 'vd_7', 'vd_8', 'vd_9', 'vd_10',
  'vd_11', 'vd_12', 'vd_13', 'vd_14', 'vd_15', 'vd_16', 'vd_18', 'vd_19', 'vd_22', 'vd_25',
  'th_1', 'th_2', 'th_3', 'th_4', 'th_5', 'th_6', 'th_7', 'th_8', 'th_9', 'th_10',
  'th_11', 'th_12', 'th_13', 'th_14', 'th_15', 'th_16', 'th_17', 'th_18', 'th_19', 'th_20',
  'th_21', 'th_22', 'th_24', 'th_25', 'th_28'
]);
const EXAM_MS = 600000;
const DELIVERY_GRACE_MS = 15000;
const RESULT_SHEET = 'KetQuaKiemTra';
const ANSWER_SHEET = 'DapAn';

// Chạy một lần trong trình chỉnh sửa Apps Script của bảng tính riêng tư.
function setupSafeWaterExam() {
  const book = SpreadsheetApp.getActiveSpreadsheet();
  if (!book) throw new Error('Mở Apps Script từ bảng tính qua Tiện ích mở rộng.');
  loadAnswerKey_(book);
  const sheet = book.getSheetByName(RESULT_SHEET) || book.insertSheet(RESULT_SHEET);
  if (!sheet.getLastRow()) {
    sheet.appendRow(['Thời gian nộp', 'Họ và tên', 'Lớp', 'Trường', 'Xã/Phường',
      'Tỉnh/Thành', 'Tổng điểm', 'Số câu đúng', 'Thời gian (giây)', 'Lần rời màn hình',
      'Xếp loại', 'Nhận biết', 'Thông hiểu', 'Vận dụng', 'Chi tiết bài làm', 'ID lượt thi',
      'Thời gian (mili giây)']);
  }
  const properties = PropertiesService.getScriptProperties();
  properties.setProperty('EXAM_SPREADSHEET_ID', book.getId());
  if (!properties.getProperty('EXAM_SESSION_SECRET')) {
    properties.setProperty('EXAM_SESSION_SECRET', Utilities.getUuid() + Utilities.getUuid());
  }
}

function doPost(e) {
  const receivedAt = Date.now();
  return respond_(() => {
    const raw = e && e.postData && e.postData.contents;
    if (!raw || raw.length > 10000) invalid_('Yêu cầu không hợp lệ.');
    const input = JSON.parse(raw);
    const config = examConfig_();
    if (input.action === 'start') return startExam_(input, config);
    if (input.action === 'submit') return submitExam_(input, config, receivedAt);
    invalid_('Yêu cầu không hợp lệ.');
  });
}

function doGet() {
  return respond_(() => {
    const sheet = examConfig_().book.getSheetByName(RESULT_SHEET);
    const lastRow = sheet.getLastRow();
    const rows = lastRow > 1
      ? sheet.getRange(2, 1, lastRow - 1, 17).getValues()
      : [];
    const ranked = rows.filter(row => String(row[15]).startsWith(EXAM_ID_PREFIX)).sort((a, b) =>
      b[6] - a[6] || count_(b[13]) - count_(a[13]) ||
      count_(b[12]) - count_(a[12]) || a[16] - b[16] ||
      new Date(a[0]).getTime() - new Date(b[0]).getTime());
    const seen = new Set();
    const entries = [];
    for (const row of ranked) {
      const key = JSON.stringify(row.slice(1, 4).map(value =>
        String(value).normalize('NFC').trim().replace(/\s+/g, ' ').toLowerCase()));
      if (seen.has(key)) continue;
      seen.add(key);
      entries.push({ name: row[1], cls: row[2], school: row[3], score: row[6], elapsed: row[8] });
      if (entries.length === 10) break;
    }
    return { entries };
  });
}

function examConfig_() {
  const properties = PropertiesService.getScriptProperties();
  const id = properties.getProperty('EXAM_SPREADSHEET_ID');
  const secret = properties.getProperty('EXAM_SESSION_SECRET');
  if (!id || !secret) invalid_('Chưa cấu hình hệ thống kiểm tra.');
  return { book: SpreadsheetApp.openById(id), secret };
}

function loadAnswerKey_(book) {
  const sheet = book.getSheetByName(ANSWER_SHEET);
  if (!sheet) invalid_('Thiếu trang tính DapAn.');
  const rows = sheet.getDataRange().getValues();
  const key = new Map();
  const groups = { nb: [], th: [], vd: [] };
  for (const [id, group, answer] of rows.slice(1)) {
    if (!id && !group && answer === '') continue;
    if (typeof id !== 'string' || !/^(nb|th|vd)_\d+$/.test(id) ||
        !Object.prototype.hasOwnProperty.call(EXAM_GROUPS, group) || !id.startsWith(group + '_') ||
        !Number.isInteger(answer) || answer < 0 || answer > 3 || key.has(id)) {
      invalid_('Trang tính DapAn có dữ liệu không hợp lệ.');
    }
    key.set(id, { group, answer });
    if (UNIQUE_QUESTION_IDS.has(id)) groups[group].push(id);
  }
  if ([...UNIQUE_QUESTION_IDS].some(id => !key.has(id))) invalid_('Ngân hàng đáp án thiếu câu hỏi.');
  return { groups, key };
}

function startExam_(input, config) {
  if (input.website || !input.candidate) invalid_('Thông tin thí sinh không hợp lệ.');
  const candidate = ['name', 'cls', 'school', 'ward', 'prov'].map(field => {
    const value = input.candidate[field];
    if (typeof value !== 'string' || value.length > 150) invalid_('Thông tin thí sinh không hợp lệ.');
    return value.normalize('NFC').trim().replace(/\s+/g, ' ');
  });
  if (!candidate[0] || !candidate[1]) invalid_('Vui lòng nhập họ tên và lớp.');
  const { groups } = loadAnswerKey_(config.book);
  const ids = shuffle_(Object.keys(EXAM_GROUPS).flatMap(group =>
    shuffle_(groups[group]).slice(0, EXAM_GROUPS[group].count)));
  const session = { id: EXAM_ID_PREFIX + Utilities.getUuid(), startedAt: Date.now(), ids, candidate };
  const payload = Utilities.base64EncodeWebSafe(JSON.stringify(session), Utilities.Charset.UTF_8);
  return { ids, ticket: payload + '.' + sign_(payload, config.secret), durationMs: EXAM_MS };
}

function submitExam_(input, config, receivedAt) {
  const [payload, signature, extra] = String(input.ticket || '').split('.');
  if (!signature || extra !== undefined || !equal_(signature, sign_(payload, config.secret))) {
    invalid_('Lượt thi không hợp lệ. Vui lòng bắt đầu lại.');
  }
  const session = JSON.parse(Utilities.newBlob(Utilities.base64DecodeWebSafe(payload)).getDataAsString('UTF-8'));
  if (!session.id.startsWith(EXAM_ID_PREFIX)) {
    invalid_('Đề thi đã được cập nhật. Vui lòng bắt đầu lượt thi mới.', 'expired');
  }
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) invalid_('Hệ thống đang bận. Vui lòng thử nộp lại.');
  try {
    const sheet = config.book.getSheetByName(RESULT_SHEET);
    const lastRow = sheet.getLastRow();
    const saved = lastRow > 1
      ? sheet.getRange(2, 16, lastRow - 1, 1).createTextFinder(session.id).matchEntireCell(true).findNext()
      : null;
    if (saved) return { result: result_(sheet.getRange(saved.getRow(), 1, 1, 17).getValues()[0]) };

    const elapsedMs = receivedAt - session.startedAt;
    if (elapsedMs < 0 || elapsedMs > EXAM_MS + DELIVERY_GRACE_MS) {
      invalid_('Máy chủ nhận bài quá hạn. Vui lòng bắt đầu lượt thi mới.', 'expired');
    }
    if (!Array.isArray(input.answers) || input.answers.length !== session.ids.length ||
        !input.answers.every(answer => Number.isInteger(answer) && answer >= -1 && answer <= 3)) {
      invalid_('Danh sách câu trả lời không hợp lệ.');
    }
    const { key } = loadAnswerKey_(config.book);
    const counts = { nb: 0, th: 0, vd: 0 };
    const details = session.ids.map((id, index) => {
      const question = key.get(id);
      if (!question) invalid_('Đáp án đã thay đổi. Vui lòng bắt đầu lượt thi mới.', 'expired');
      const correct = question.answer === input.answers[index];
      if (correct) counts[question.group]++;
      const seconds = Array.isArray(input.questionTimes) ? input.questionTimes[index] : null;
      const timing = Number.isInteger(seconds) && seconds >= 0 && seconds <= 600
        ? ' (' + seconds + ' giây theo trình duyệt)' : '';
      return 'C' + (index + 1) + ' (' + id + '): ' +
        (input.answers[index] === -1 ? 'Bỏ trống' : correct ? 'Đúng' : 'Sai') + timing;
    });
    const score = Object.keys(EXAM_GROUPS).reduce((total, group) =>
      total + counts[group] * EXAM_GROUPS[group].points, 0);
    const totalCorrect = counts.nb + counts.th + counts.vd;
    const rating = score >= 90 ? 'Đại sứ An toàn Nước' : score >= 70 ? 'Dũng sĩ An toàn Nước' :
      score >= 50 ? 'Đã hoàn thành thử thách' : 'Cần rèn luyện thêm';
    // Ghi chuỗi như văn bản để Sheets không diễn giải thông tin nhập thành công thức.
    const row = [new Date(receivedAt), ...session.candidate.map(value => value ? "'" + value : ''),
      score, totalCorrect, elapsedMs / 1000,
      Number.isInteger(input.tabSwitches) ? Math.min(3, Math.max(0, input.tabSwitches)) : 0,
      rating, counts.nb, counts.th, counts.vd,
      details.join(' | '), session.id, elapsedMs];
    sheet.appendRow(row);
    SpreadsheetApp.flush();
    return { result: result_(row) };
  } finally {
    lock.releaseLock();
  }
}

function result_(row) {
  // Đọc trạng thái từ chi tiết đã lưu để cả lần nộp lại cũng nhận cùng kết quả.
  const questionStatuses = String(row[14] || '').split(' | ').map((detail, index) => {
    if (!detail.startsWith('C' + (index + 1) + ' (')) return null;
    const match = detail.match(/\): (Đúng|Sai|Bỏ trống)(?= \(|$)/);
    return match ? match[1] : null;
  });
  return { score: row[6], correctCount: count_(row[7]), elapsedSeconds: row[8], rating: row[10],
    nbCorrect: count_(row[11]), thCorrect: count_(row[12]), vdCorrect: count_(row[13]),
    questionStatuses };
}

function count_(value) {
  return parseInt(value, 10);
}

function sign_(payload, secret) {
  return Utilities.base64EncodeWebSafe(Utilities.computeHmacSha256Signature(payload, secret));
}

function equal_(a, b) {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return mismatch === 0;
}

function shuffle_(values) {
  for (let i = values.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [values[i], values[j]] = [values[j], values[i]];
  }
  return values;
}

function invalid_(message, code) {
  const error = new Error(message);
  error.publicMessage = message;
  error.code = code;
  throw error;
}

function respond_(work) {
  let response;
  try {
    response = { ok: true, ...work() };
  } catch (error) {
    if (!error.publicMessage) console.error(error);
    response = { ok: false, error: error.publicMessage || 'Hệ thống đang bận. Vui lòng thử lại.',
      code: error.code };
  }
  return ContentService.createTextOutput(JSON.stringify(response)).setMimeType(ContentService.MimeType.JSON);
}
