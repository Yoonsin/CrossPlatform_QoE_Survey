// =====================================================================
// Google Apps Script - QoE 설문 데이터 수집기
// GitHub Actions + clasp가 이 파일을 Apps Script 프로젝트로 배포합니다.
// =====================================================================

const HEADERS = [
  "타임스탬프",
  "참가자 이름",
  "생년",
  "성별",
  "플랫폼",
  "알고리즘",
  "설문 번호",
  "시나리오",
  "단계",
  "Q1",
  "Q2",
  "Q3",
  "Q4",
  "Q2 추가 - 환경 격차",
  "Q2 추가 - 기타",
  "자유 의견",
];

function ensureHeaders(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    return;
  }

  const currentHeaders = sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0];
  const needsHeaderUpdate = HEADERS.some((header, index) => currentHeaders[index] !== header);
  if (needsHeaderUpdate) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  }
}

function recordToRow(r) {
  return [
    r.timestamp || new Date().toISOString(),
    r.participantName || r.participantId || r.userId || "",
    r.participantBirthYear || r.participantBirthDate || "",
    r.participantGender || "",
    r.platform || "",
    r.algorithm || "알고리즘 1",
    r.surveyNumber || "",
    r.scenario !== null && r.scenario !== undefined ? r.scenario : "",
    r.stage || "",
    r.q1 !== null && r.q1 !== undefined ? r.q1 : "",
    r.q2 !== null && r.q2 !== undefined ? r.q2 : "",
    r.q3 !== null && r.q3 !== undefined ? r.q3 : "",
    r.q4 !== null && r.q4 !== undefined ? r.q4 : "",
    r.q2_env || "",
    r.q2_env_other || "",
    r.comment || "",
  ];
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    ensureHeaders(sheet);

    // records 배열(다중 설문) 또는 단일 레코드 모두 처리
    const records = Array.isArray(data.records) ? data.records : [data];
    records.forEach(r => sheet.appendRow(recordToRow(r)));

    return ContentService
      .createTextOutput(JSON.stringify({ status: "ok", count: records.length }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// 테스트용: 스크립트 에디터에서 직접 실행해 시트 헤더를 확인할 수 있습니다.
function testSetup() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  Logger.log("시트 이름: " + sheet.getName());
  Logger.log("현재 행 수: " + sheet.getLastRow());
}
