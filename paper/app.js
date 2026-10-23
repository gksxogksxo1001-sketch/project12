// Academic Paper & Raw Data Interaction Logic
// Real Project Case: 'Honbab-Biseo' (혼밥비서) by Han-Tae Ju
// Front-end: HTML, CSS, Vanilla JS, Public Open API (MFDS)

const honbabSessions = [
  { id: 1, date: "10/14 10:15", task: "[냉장고] 재료 등록 모달 팝업 레이아웃 및 폼 유효성 검사", latency: 12, action: "IDE 지속 주시", polling: "해당없음", modalChoice: "단일제안 채택", memo: "단순 CSS z-index 및 폼 배치 수정 관찰" },
  { id: 2, date: "10/14 11:30", task: "[냉장고] 식재료 유통기한 D-day 계산 로직 및 신선도 상태 분류", latency: 36, action: "혼밥비서 화면 검수", polling: "12초 후 힐끔 확인", modalChoice: "2번째 옵션 (Day.js 미도입)", memo: "혼밥비서 사이트 열어서 D-3 경고 뱃지 색상 바뀌나 확인" },
  { id: 3, date: "10/14 14:20", task: "[냉장고] 재료 카테고리별(채소/육류/양념) 필터링 탭 이벤트", latency: 15, action: "IDE 지속 주시", polling: "해당없음", modalChoice: "단일제안 채택", memo: "바닐라 JS 이벤트 위임 코드 생성 대기" },
  { id: 4, date: "10/14 16:00", task: "[식약처 API] 식품영양성분DB Open API 비동기 fetch 호출 파이프라인", latency: 54, action: "혼밥비서 화면 검수", polling: "14초 간격 2회 주시", modalChoice: "2번째 옵션 (프록시 우회)", memo: "F12 콘솔 열어서 CORS 에러 떴나 확인하다 모달 떠서 클릭" },
  { id: 5, date: "10/14 17:40", task: "[식약처 API] 영양소(칼로리, 탄수화물, 단백질) 데이터 파싱", latency: 28, action: "혼밥비서 화면 검수", polling: "11초 후 힐끔 확인", modalChoice: "2번째 옵션 (기본값 0 처리)", memo: "API 응답 JSON 키값이 달라 스크린샷 찍어 질문 전달" },
  { id: 6, date: "10/15 09:50", task: "[냉장고] 재료 수정 및 삭제 확인 비동기 커스텀 다이얼로그", latency: 42, action: "모바일 확인", polling: "10초 후 힐끔 확인", modalChoice: "2번째 옵션 (Promise 기반)", memo: "카톡 답장하며 대기하다가 에이전트 끝나서 IDE 복귀" },
  { id: 7, date: "10/15 11:15", task: "[반응형 UI] 모바일 뷰포트(375px) 냉장고 그리드 카드 깨짐 수정", latency: 24, action: "혼밥비서 화면 검수", polling: "13초 후 힐끔 확인", modalChoice: "2번째 옵션 (CSS Grid minmax)", memo: "F12 개발자도구 모바일 모드로 카드 줄바꿈 실시간 검수" },
  { id: 8, date: "10/15 14:05", task: "[냉장고 점수] 보유 재료 영양 밸런스 점수 산출 알고리즘", latency: 46, action: "혼밥비서 화면 검수", polling: "15초 간격 2회 주시", modalChoice: "2번째 옵션 (가중치 방식)", memo: "10분간 수식 고민하다 답답해서 에이전트 호출, 화면 검수" },
  { id: 9, date: "10/15 15:30", task: "[UI/UX] 유통기한 임박 식재료 상단 경고 토스트 팝업", latency: 14, action: "IDE 지속 주시", polling: "해당없음", modalChoice: "단일제안 채택", memo: "음악 들으며 코드 스트리밍 관찰" },
  { id: 10, date: "10/15 17:10", task: "[커뮤니티] 자취생 수다방 게시글 목록 무한 스크롤 연동", latency: 38, action: "혼밥비서 화면 검수", polling: "12초 후 힐끔 확인", modalChoice: "2번째 옵션 (IntersectionObs)", memo: "F12 콘솔 보며 스크롤 이벤트 디바운스 상태 체크" },
  { id: 11, date: "10/16 10:20", task: "[식약처 API] 검색어 자동완성 연관 식품 추천 드롭다운", latency: 22, action: "혼밥비서 화면 검수", polling: "14초 후 힐끔 확인", modalChoice: "2번째 옵션 (로컬 캐싱)", memo: "검색창에 '계란' 치고 드롭다운 UI 가시성 점검" },
  { id: 12, date: "10/16 11:45", task: "[냉장고] 재료 유통기한 D-day 정렬 (오름차순/내림차순) 기능", latency: 11, action: "IDE 지속 주시", polling: "해당없음", modalChoice: "단일제안 채택", memo: "화면 지켜보며 빠른 완료 확인" },
  { id: 13, date: "10/16 14:10", task: "[에러 디버깅] 식약처 API 영양성분 null 값 반환 시 계산 오류", latency: 50, action: "혼밥비서 화면 검수", polling: "13초 간격 2회 주시", modalChoice: "2번째 옵션 (옵셔널 체이닝)", memo: "10분간 에러 헤매다 스크린샷 캡처로 질문. 2번 옵션 채택" },
  { id: 14, date: "10/16 16:30", task: "[반응형 UI] 모바일 환경 모달 팝업 내부 스크롤 잠금 처리", latency: 29, action: "혼밥비서 화면 검수", polling: "11초 후 힐끔 확인", modalChoice: "2번째 옵션 (body overflow)", memo: "F12 모바일 모드 켜고 뒤쪽 화면 스크롤되나 손으로 스크롤" },
  { id: 15, date: "10/17 09:30", task: "[캐릭터] 냉장고 신선도 점수에 따른 캐릭터 표정 스프라이트", latency: 19, action: "IDE 지속 주시", polling: "해당없음", modalChoice: "단일제안 채택", memo: "SVG 표정 이미지 변경 로직 대기" },
  { id: 16, date: "10/17 11:00", task: "[냉장고] 식재료 대량 일괄 선택 및 삭제 모드 토글", latency: 45, action: "모바일 확인", polling: "10초 후 힐끔 확인", modalChoice: "2번째 옵션 (체크박스 일괄)", memo: "핸드폰 메시지 보며 대기, 옵션 3번은 너무 길어서 스킵" },
  { id: 17, date: "10/17 14:30", task: "[커뮤니티] 댓글 작성 시 즉시 DOM 추가 및 비동기 저장", latency: 16, action: "IDE 지속 주시", polling: "해당없음", modalChoice: "단일제안 채택", memo: "화면 주시" },
  { id: 18, date: "10/17 16:15", task: "[식약처 API] 일일 트래픽 초과 시 로컬 더미 데이터 폴백 처리", latency: 34, action: "혼밥비서 화면 검수", polling: "15초 후 힐끔 확인", modalChoice: "2번째 옵션 (Try-Catch 분기)", memo: "F12 콘솔에서 catch 블록 진입하나 새로고침 테스트" },
  { id: 19, date: "10/18 10:40", task: "[반응형 UI] 태블릿 및 모바일 가로 모드 시 레이아웃 정렬", latency: 25, action: "혼밥비서 화면 검수", polling: "12초 후 힐끔 확인", modalChoice: "2번째 옵션 (CSS flex-wrap)", memo: "크롬 창 너비 줄였다 늘렸다 하며 깨짐 검수" },
  { id: 20, date: "10/18 13:50", task: "[냉장고] 유통기한 지난 식재료 붉은색 깜빡임 CSS 애니메이션", latency: 13, action: "IDE 지속 주시", polling: "해당없음", modalChoice: "단일제안 채택", memo: "CSS 키프레임 적용 관찰" },
  { id: 21, date: "10/18 15:20", task: "[에러 디버깅] 재료 추가 모달 닫을 때 이전 입력값 초기화 안 됨", latency: 48, action: "혼밥비서 화면 검수", polling: "14초 간격 2회 주시", modalChoice: "1번째 옵션 (form.reset)", memo: "에이전트가 또 실패해서 멘탈 흔들렸으나 2회차에 1번 선택해 해결" },
  { id: 22, date: "10/18 17:00", task: "[냉장고] 소비기한 권장 섭취 기간 툴팁 마우스오버 연동", latency: 18, action: "IDE 지속 주시", polling: "해당없음", modalChoice: "단일제안 채택", memo: "마우스 호버 위치 확인 대기" },
  { id: 23, date: "10/19 11:20", task: "[커뮤니티] 혼밥 꿀팁 게시글 좋아요 토글 및 숫자 실시간 반영", latency: 15, action: "IDE 지속 주시", polling: "해당없음", modalChoice: "단일제안 채택", memo: "빠른 수정 주시" },
  { id: 24, date: "10/19 14:00", task: "[냉장고] 식재료 보관 장소(냉장실/냉동실/실온) 탭 분류", latency: 31, action: "혼밥비서 화면 검수", polling: "12초 후 힐끔 확인", modalChoice: "2번째 옵션 (data-attribute)", memo: "혼밥비서 사이트에서 탭 클릭 인터랙션 테스트" },
  { id: 25, date: "10/19 15:40", task: "[식약처 API] 영양소 섭취 비율 막대그래프 시각화 연동", latency: 58, action: "혼밥비서 화면 검수", polling: "14초 간격 3회 주시", modalChoice: "2번째 옵션 (순수 CSS bar)", memo: "3번 옵션은 라이브러리 추가라 너무 길어 패스, 2번 CSS 선택" },
  { id: 26, date: "10/19 17:15", task: "[반응형 UI] 모바일 하단 네비게이션 탭바 고정 및 아이콘 정렬", latency: 20, action: "혼밥비서 화면 검수", polling: "11초 후 힐끔 확인", modalChoice: "2번째 옵션 (fixed 하단 바)", memo: "F12 모바일 모드로 엄지손가락 터치 영역 점검" },
  { id: 27, date: "10/20 10:10", task: "[냉장고] 등록된 재료 검색어 실시간 필터링(한글 초성 검색)", latency: 43, action: "모바일 확인", polling: "13초 후 힐끔 확인", modalChoice: "2번째 옵션 (유니코드 분해)", memo: "연락 확인하다가 화면 힐끔거림" },
  { id: 28, date: "10/20 11:35", task: "[CSS] 다크모드 대응 식재료 신선도 뱃지 대비비(Contrast) 개선", latency: 12, action: "IDE 지속 주시", polling: "해당없음", modalChoice: "단일제안 채택", memo: "가시성 지적 반영 확인" },
  { id: 29, date: "10/20 14:15", task: "[에러 디버깅] 모바일 사파리에서 모달 팝업 100vh 스크롤 버그", latency: 52, action: "혼밥비서 화면 검수", polling: "15초 간격 2회 주시", modalChoice: "2번째 옵션 (dvh 적용)", memo: "스크린샷 첨부하며 '가시성 확보' 지시 전달 후 F12 콘솔 확인" },
  { id: 30, date: "10/20 16:30", task: "[냉장고] 보유 재료 기반 오늘 먹을 수 있는 요리 매칭", latency: 37, action: "혼밥비서 화면 검수", polling: "12초 후 힐끔 확인", modalChoice: "2번째 옵션 (배열 교집합)", memo: "레시피 탭 넘어가서 카드 클릭해봄" },
  { id: 31, date: "10/21 09:40", task: "[커뮤니티] 게시글 이미지 업로드 전 클라이언트 리사이징", latency: 46, action: "모바일 확인", polling: "11초 후 힐끔 확인", modalChoice: "2번째 옵션 (Canvas 리사이즈)", memo: "3번 옵션은 너무 길어서 안 읽고 2번 클릭" },
  { id: 32, date: "10/21 11:00", task: "[식약처 API] 영양소 섭취 권장량 대비 과다/부족 경고 문구", latency: 26, action: "혼밥비서 화면 검수", polling: "13초 후 힐끔 확인", modalChoice: "2번째 옵션 (조건부 태그)", memo: "화면 UI 가시성 점검" },
  { id: 33, date: "10/21 13:40", task: "[반응형 UI] 식재료 카드 호버 시 액션 버튼 슬라이드 애니메이션", latency: 14, action: "IDE 지속 주시", polling: "해당없음", modalChoice: "단일제안 채택", memo: "화면 지켜봄" },
  { id: 34, date: "10/21 15:10", task: "[에러 디버깅] 재료 삭제 시 냉장고 점수 실시간 재계산 누락 버그", latency: 49, action: "혼밥비서 화면 검수", polling: "12초 간격 2회 주시", modalChoice: "1번째 옵션 (이벤트 디스패치)", memo: "F12 콘솔 에러 확인 후 1번 선택해 즉시 해결" },
  { id: 35, date: "10/21 16:20", task: "[냉장고] 유통기한 D-day 캘린더 뷰와 리스트 뷰 전환 토글", latency: 18, action: "IDE 지속 주시", polling: "해당없음", modalChoice: "단일제안 채택", memo: "CSS 탭 전환 관찰" },
  { id: 36, date: "10/21 17:30", task: "[전체 검수] 혼밥비서 최종 빌드 번들 및 전역 콘솔 에러 클리어", latency: 55, action: "혼밥비서 화면 검수", polling: "14초 간격 3회 주시", modalChoice: "2번째 옵션 (린트 클린업)", memo: "F12 콘솔에 경고 1개도 안 남았나 전체 페이지 순회 점검" }
];

document.addEventListener('DOMContentLoaded', () => {
  setupViewToggle();
  renderChartBars();
  renderDataTable();
  setupExport();
});

// View Toggle between Paper and Data
function setupViewToggle() {
  const btnPaper = document.getElementById('btn-show-paper');
  const btnData = document.getElementById('btn-show-data');
  const paperSec = document.getElementById('paper-section');
  const dataSec = document.getElementById('data-section');

  btnPaper.addEventListener('click', () => {
    btnPaper.classList.add('active');
    btnData.classList.remove('active');
    paperSec.style.display = 'block';
    dataSec.style.display = 'none';
  });

  btnData.addEventListener('click', () => {
    btnData.classList.add('active');
    btnPaper.classList.remove('active');
    paperSec.style.display = 'none';
    dataSec.style.display = 'block';
  });
}

// Render Figure 1 Chart Bars
function renderChartBars() {
  const container = document.getElementById('paper-chart-bars');
  if (!container) return;

  const data = [
    { label: "0~15초 (10회)", ide: 80.0, project: 20.0, mobile: 0.0 },
    { label: "16~30초 (11회)", ide: 27.3, project: 54.5, mobile: 18.2 },
    { label: "31초+ (15회)", ide: 6.7, project: 66.7, mobile: 26.7 }
  ];

  container.innerHTML = data.map(d => `
    <div class="bar-row">
      <span class="bar-label">${d.label}</span>
      <div class="bar-track">
        <div class="bar-segment ide" style="width: ${d.ide}%;" title="IDE 지속 주시: ${d.ide}%"></div>
        <div class="bar-segment project" style="width: ${d.project}%;" title="혼밥비서 화면 검수: ${d.project}%"></div>
        <div class="bar-segment mobile" style="width: ${d.mobile}%;" title="모바일 알림 확인: ${d.mobile}%"></div>
      </div>
    </div>
  `).join('') + `
    <div class="bar-legend">
      <span><i class="legend-dot" style="background:#2563eb"></i> IDE 지속 주시</span>
      <span><i class="legend-dot" style="background:#0d9488"></i> 혼밥비서 웹 화면 검수 (F12/모바일뷰)</span>
      <span><i class="legend-dot" style="background:#e11d48"></i> 모바일 연락 확인</span>
    </div>
  `;
}

// Render Data Table
function renderDataTable() {
  const tbody = document.getElementById('log-table-body');
  if (!tbody) return;

  tbody.innerHTML = honbabSessions.map(s => {
    let actionBadge = '';
    if (s.action === 'IDE 지속 주시') {
      actionBadge = `<span style="background:#dbeafe; color:#1e40af; padding:2px 7px; border-radius:4px; font-weight:700; font-size:0.75rem;">${s.action}</span>`;
    } else if (s.action === '혼밥비서 화면 검수') {
      actionBadge = `<span style="background:#ccfbf1; color:#0f766e; padding:2px 7px; border-radius:4px; font-weight:700; font-size:0.75rem;">${s.action}</span>`;
    } else {
      actionBadge = `<span style="background:#ffe4e6; color:#be123c; padding:2px 7px; border-radius:4px; font-weight:700; font-size:0.75rem;">${s.action}</span>`;
    }

    return `
      <tr>
        <td><strong>#${s.id}</strong></td>
        <td style="color:var(--text-muted); font-size:0.78rem; white-space:nowrap;">${s.date}</td>
        <td><strong>${escapeHtml(s.task)}</strong></td>
        <td><code>${s.latency}초</code></td>
        <td>${actionBadge}</td>
        <td style="font-size:0.80rem; color:${s.polling !== '해당없음' ? '#b45309; font-weight:600;' : 'var(--text-muted)'}">${s.polling}</td>
        <td style="color:var(--text-secondary); font-size:0.80rem;">
          <div style="font-weight:600; color:#0f172a; margin-bottom:2px;">[선택] ${escapeHtml(s.modalChoice)}</div>
          <div>${escapeHtml(s.memo)}</div>
        </td>
      </tr>
    `;
  }).join('');
}

// Export CSV
function setupExport() {
  const btn = document.getElementById('btn-export-csv');
  if (!btn) return;

  btn.addEventListener('click', () => {
    let csv = "ID,Date,Honbab_Task,Latency_Sec,Action_Type,Visual_Polling,Modal_Choice,Memo\n";
    honbabSessions.forEach(s => {
      csv += `${s.id},"${s.date}","${s.task.replace(/"/g, '""')}",${s.latency},"${s.action}","${s.polling}","${s.modalChoice}","${s.memo.replace(/"/g, '""')}"\n`;
    });

    const blob = new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `HonbabBiseo_Developer_N1_RawData_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  });
}

function escapeHtml(text) {
  if (!text) return '';
  return text.replace(/[&<>"']/g, function(m) {
    return {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    }[m];
  });
}
