# QoE 설문조사 사이트

GitHub Pages + Google Sheets 기반 리커트 5점 척도 설문조사

---

## 파일 구성

```
index.html              ← 설문 페이지 (GitHub Pages로 호스팅)
google_apps_script.js   ← Google Sheets 저장용 서버 스크립트
README.md               ← 이 파일
```

---

## 설정 단계

### 1단계 — Google Sheets + Apps Script 설정

1. [Google Sheets](https://sheets.google.com) 에서 새 스프레드시트를 만든다.
2. 상단 메뉴 **확장 프로그램 → Apps Script** 클릭
3. 기본 코드를 모두 지우고, `google_apps_script.js` 파일 내용을 전부 붙여넣는다.
4. 저장 (Ctrl+S)
5. 상단 **배포 → 새 배포** 클릭
   - 유형: **웹 앱**
   - 실행 계정: **나**
   - 액세스 권한: **모든 사용자** (익명 응답 수집을 위해 필요)
6. **배포** 클릭 → 나타나는 **웹 앱 URL** 복사

---

### 2단계 — index.html 에 URL 연결

`index.html` 를 열고 아래 줄을 찾아서:

```js
const APPS_SCRIPT_URL = "YOUR_APPS_SCRIPT_URL_HERE";
```

복사한 URL로 교체:

```js
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/XXXXXXXXXX/exec";
```

---

### 3단계 — GitHub Pages 배포

1. GitHub에서 새 Repository를 만든다 (예: `qoe-survey`)
2. `index.html` 을 Repository에 업로드
3. **Settings → Pages → Branch: main / (root)** 로 설정 후 저장
4. 잠시 후 `https://<your-username>.github.io/qoe-survey/` 에서 접속 가능

---

## 데이터 확인

- Google Sheets 스프레드시트를 열면 응답이 자동으로 쌓입니다.
- 컬럼 구성:

| 타임스탬프 | 참가자 ID | Q1 | Q2 | Q3 | Q4 |
|-----------|----------|-----|-----|-----|-----|
| 2026-04-15T... | P001 | 3 | 4 | 2 | 5 |

---

## Apps Script URL 미설정 시 동작

URL을 설정하지 않아도 사이트는 정상 작동합니다.  
이 경우 응답은 **브라우저 localStorage** 에만 저장됩니다.  
(수집 목적이라면 반드시 Apps Script URL을 설정하세요)
