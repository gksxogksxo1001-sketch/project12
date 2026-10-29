/**
 * app.js - 주한태 포트폴리오 웹 인터랙션 스크립트
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. 다크/라이트 테마 제어
  const themeToggleBtn = document.getElementById('theme-toggle');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const savedTheme = localStorage.getItem('theme') || (prefersDark ? 'dark' : 'light');

  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
  });

  function updateThemeIcon(theme) {
    themeToggleBtn.textContent = theme === 'dark' ? '☀️' : '🌓';
  }

  // 2. 3분 읽기 진행률 프로그레스 바
  const progressBar = document.getElementById('read-progress');

  window.addEventListener('scroll', () => {
    const winScroll = document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    progressBar.style.width = scrolled + '%';
  });

  // 3. 3대 역량 필터링 인터랙션
  const filterChips = document.querySelectorAll('.filter-chip');
  const narrativeBlocks = document.querySelectorAll('.narrative-block');

  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      filterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      const filterType = chip.getAttribute('data-filter');

      narrativeBlocks.forEach(block => {
        const theme = block.getAttribute('data-theme');
        if (filterType === 'all') {
          block.classList.remove('active-highlight');
          block.style.opacity = '1';
        } else if (theme === filterType) {
          block.classList.add('active-highlight');
          block.style.opacity = '1';
          block.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          block.classList.remove('active-highlight');
          block.style.opacity = '0.35';
        }
      });
    });
  });

  // 4. 이력서 모달 팝업 열기/닫기
  const btnOpenResume = document.getElementById('btn-open-resume');
  const btnHeroResume = document.getElementById('btn-hero-resume');
  const resumeModal = document.getElementById('resume-modal');
  const btnCloseModal = document.getElementById('btn-close-modal');
  const btnCloseModalFooter = document.getElementById('btn-close-modal-footer');
  const modalContent = document.getElementById('modal-content');

  function openResume(e) {
    if (e) e.preventDefault();
    resumeModal.classList.add('open');
    document.body.style.overflow = 'hidden';

    // 간략 이력서 렌더링
    modalContent.innerHTML = `
      <div class="resume-rendered">
        <h2>주한태 (Ju Han-tae) — 이력서 & 경력기술서</h2>
        <p><strong>지원 분야:</strong> IT 인프라 & 시스템/보안 엔지니어 | <strong>연락처:</strong> gksxogksxo1001@gmail.com</p>
        <p><strong>한 줄 소개:</strong> 2026년 10월 14일 이틀 연속 지각 앞에서 자책 대신 열 개의 알람을 맞춰 30분 먼저 강의실의 불을 켜는 사람</p>
        <hr style="margin: 16px 0; border: none; border-top: 1px solid var(--border-color);">
        
        <h3>1. 핵심 기술 역량</h3>
        <ul>
          <li><strong>Network:</strong> Cisco Packet Tracer 기반 OSPF 라우팅, VLAN, 서브넷팅, 패킷 흐름 분석</li>
          <li><strong>System:</strong> Linux(Ubuntu/CentOS), 가상화 서버 환경 구성, 쉘 스크립트 자동화</li>
          <li><strong>Web & Data:</strong> Node.js, Express, 식약처 공공 영양DB API 연동, Vision OCR 파이프라인 구축</li>
        </ul>

        <h3>2. 13주 기록의 3대 출처 통계</h3>
        <ul>
          <li><strong>「내 출석 기록」:</strong> 출석 48일 / 50일 (출석률 96.0%), 지각 2회(10/13, 10/14) ➔ 알람 10개 설정으로 영구 정상화</li>
          <li><strong>「리추얼 기록」:</strong> 40일 완주, 아침 40회(100%), 마무리 38회(95.0%), 호흡 143.0분</li>
          <li><strong>「내 제출 현황」:</strong> 11개 과제 전원 100% 제출 및 10번 논문 51개 기준 전 항목 통과</li>
        </ul>

        <h3>3. 대표 프로젝트</h3>
        <ul>
          <li><strong>과제 10 실증 연구 논문:</strong> AI 에이전트 대기시간 중 작업자 분할 주의 분석 (36개 세션 실측 CSV, 1초 검증기 구축)</li>
          <li><strong>팀 프로젝트 '혼밥비서':</strong> 영수증 Vision OCR 식재료 자동 등록 파이프라인 개발 및 식약처 Open API 연동</li>
          <li><strong>과제 13 (BR-B) FocusGuard AI 웹앱:</strong> 10번 논문 결과(16초 임계치, 12.7초 폴링 91.7%, 3지선다 편향 78.3%)를 반영한 분할 주의 방어 &amp; 3지선다 1줄 요약 애플리케이션 (<a href="app/index.html" target="_blank">바로 실행 ↗</a>)</li>
        </ul>

        <div style="margin-top: 24px; padding: 12px; background: var(--bg-secondary); border-radius: 8px; font-size: 0.85rem;">
          💡 상세 전문은 저장소의 <code>doc/resume-portfolio.md</code> 파일에서 확인하실 수 있습니다.
        </div>
      </div>
    `;
  }

  function closeResume() {
    resumeModal.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (btnOpenResume) btnOpenResume.addEventListener('click', openResume);
  if (btnHeroResume) btnHeroResume.addEventListener('click', openResume);
  btnCloseModal.addEventListener('click', closeResume);
  btnCloseModalFooter.addEventListener('click', closeResume);
  resumeModal.addEventListener('click', (e) => {
    if (e.target === resumeModal) closeResume();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && resumeModal.classList.contains('open')) {
      closeResume();
    }
  });
});
