// =====================================================================
// Google Apps Script - QoE 설문 데이터 수집기
// 이 파일을 Google Apps Script 에디터에 붙여넣고 배포하세요.
// 설정 방법은 README.md 를 참고하세요.
// =====================================================================

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // 헤더가 없으면 첫 행에 추가
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "타임스탬프",
        "참가자 ID",
        "Q1 - 게임이 느리거나 부자연스럽게 느껴졌다",
        "Q2 - 상대가 나보다 유리한 환경이라고 느꼈다",
        "Q3 - 결과가 내 실력에 비해 잘 안 나온 것 같다고 느꼈다",
        "Q4 - 목표 달성에 본인이 충분히 기여했다고 느꼈다",
      ]);
    }

    // 데이터 행 추가
    sheet.appendRow([
      data.timestamp || new Date().toISOString(),
      data.userId,
      data.q1,
      data.q2,
      data.q3,
      data.q4,
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: "ok" }))
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
