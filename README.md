# QoE 설문조사 사이트

GitHub Pages + Google Sheets + Google Apps Script 기반 QoE 설문조사입니다.

## 파일 구성

```text
index.html                              설문 페이지, GitHub Pages로 호스팅
apps-script/Code.js                     Google Sheets 저장용 Apps Script 코드
apps-script/appsscript.json             Apps Script manifest
.github/workflows/deploy-apps-script.yml GitHub Actions Apps Script 자동 배포
```

## 평소 배포 흐름

GitHub Desktop에서 변경 파일을 commit한 뒤 push하면 됩니다.

- `index.html` 변경: GitHub Pages가 `https://yoonsin.github.io/CrossPlatform_QoE_Survey/`에 반영합니다.
- `apps-script/**` 변경: GitHub Actions가 Apps Script 프로젝트에 자동 반영합니다.
- `APPS_SCRIPT_DEPLOYMENT_ID` secret이 설정되어 있으면 기존 웹앱 배포도 같은 URL로 업데이트됩니다.

## 최초 1회 설정

### 1. Google Sheets + Apps Script 준비

1. Google Sheets에서 응답을 받을 스프레드시트를 엽니다.
2. 상단 메뉴 **확장 프로그램 → Apps Script**를 엽니다.
3. Apps Script 왼쪽 **프로젝트 설정**에서 **스크립트 ID**를 복사합니다.
4. **배포 → 배포 관리**에서 현재 웹 앱 배포의 **배포 ID**를 확인합니다.
   - 현재 `index.html`의 URL에서 `/s/`와 `/exec` 사이 값도 배포 ID입니다.
5. Apps Script API를 켭니다: https://script.google.com/home/usersettings

### 2. 로컬에서 clasp 로그인

Windows PowerShell에서 한 번만 실행합니다.

```powershell
npm install -g @google/clasp
clasp login
Get-Content $HOME\.clasprc.json -Raw | Set-Clipboard
```

마지막 명령은 GitHub Secret에 넣을 인증 JSON을 클립보드에 복사합니다.

### 3. GitHub Secrets 등록

GitHub 웹사이트에서 이 저장소로 이동한 뒤:

**Settings → Secrets and variables → Actions → New repository secret**

아래 secret을 등록합니다.

| Secret 이름 | 값 |
|---|---|
| `CLASPRC_JSON` | `$HOME\.clasprc.json` 파일 전체 내용 |
| `CLASP_SCRIPT_ID` | Apps Script 프로젝트의 스크립트 ID |
| `APPS_SCRIPT_DEPLOYMENT_ID` | 웹 앱 배포 ID |

`APPS_SCRIPT_DEPLOYMENT_ID`를 넣어야 GitHub push 후 실제 `/exec` 웹앱 URL도 새 버전을 바라봅니다.

## 데이터 확인

Google Sheets 스프레드시트를 열면 응답이 자동으로 쌓입니다.

현재 설문은 시나리오별 고정 구성입니다.

- 시나리오 1: 알고리즘 1 적용 전, 알고리즘 1 적용 후
- 시나리오 2: 알고리즘 1,2 적용 전, 알고리즘 1 적용 후, 알고리즘 2 적용 후, 알고리즘 1,2 적용 후
- 시나리오 3: 알고리즘 2 적용 전, 알고리즘 2 적용 후

| 타임스탬프 | 참가자 이름 | 생년 | 성별 | 알고리즘 | 설문 번호 | 시나리오 | 단계 | Q1 | Q2 | Q3 | Q4 | Q2 추가 - 환경 격차 | Q2 추가 - 기타 | 자유 의견 |
|-----------|----------|------|------|----------|-----------|----------|------|----|----|----|----|-------------------|---------------|-----------|
| 2026-04-15T... | 김이름 | 2000 | 여성 | 알고리즘 1 | 1 | 1 | 적용 전 | 3 | 4 | 2 | 4 | 플랫폼 | | 의견 |

## Apps Script URL 미설정 시 동작

`index.html`의 `APPS_SCRIPT_URL`이 `YOUR_APPS_SCRIPT_URL_HERE`이면 응답은 브라우저 `localStorage`에만 저장됩니다.
수집용으로 배포할 때는 반드시 Apps Script 웹 앱 URL을 넣어야 합니다.
