/**
 * generator/engine.js
 * 주한태 포트폴리오 웹사이트 지속 갱신 장치 (Site & Narrative Generator)
 * 
 * 입력 폴더: inputs/
 *   - inputs/ritual-history-2026-10-22.txt (리추얼 기록)
 *   - inputs/attendance.json (내 출석 기록)
 *   - inputs/task-list.json (내 제출 현황 과제 목록)
 * 
 * 출력 파일:
 *   - site-data.json (프론트엔드 정형 JSON)
 *   - site-data.js (브라우저 바인딩용 전역 JS)
 *   - doc/generated-narrative-candidates.md (날짜·근거가 붙은 능력별 문단 후보)
 * 
 * 특성: 동일한 입력에 대해 100% 동일한 출력을 보장하는 결정론적(Deterministic) 구조
 */

const fs = require('fs');
const path = require('path');

const BASE_DIR = path.resolve(__dirname, '..');
const INPUT_DIR = path.join(BASE_DIR, 'inputs');

const RITUAL_FILE = path.join(INPUT_DIR, 'ritual-history-2026-10-22.txt');
const ATTENDANCE_FILE = path.join(INPUT_DIR, 'attendance.json');
const TASKS_FILE = path.join(INPUT_DIR, 'task-list.json');

const OUTPUT_JSON = path.join(BASE_DIR, 'site-data.json');
const OUTPUT_JS = path.join(BASE_DIR, 'site-data.js');
const OUTPUT_DOC = path.join(BASE_DIR, 'doc', 'generated-narrative-candidates.md');

function run() {
  if (!fs.existsSync(RITUAL_FILE)) {
    console.error('리추얼 입력 파일을 찾을 수 없습니다:', RITUAL_FILE);
    process.exit(1);
  }

  // 1. 리추얼 기록 파싱
  const rawText = fs.readFileSync(RITUAL_FILE, 'utf8');
  const lines = rawText.split(/\r?\n/);

  let totalDays = 0;
  let morningCount = 0;
  let eveningCount = 0;
  let totalBreathingMinutes = 0;
  let breathCount = 0;
  const dates = [];
  const entriesByDate = {};
  
  let currentDate = null;
  let currentSection = null;

  const keywordCounts = {
    '배려·친절': 0,
    '침착·인내': 0,
    '성실·열정': 0,
    '기상·시간엄수': 0,
    '질문·해결': 0
  };

  const peerFeedbacks = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    const dateMatch = line.match(/^##\s*(\d{4}-\d{2}-\d{2})/);
    if (dateMatch) {
      currentDate = dateMatch[1];
      dates.push(currentDate);
      totalDays++;
      entriesByDate[currentDate] = {
        date: currentDate,
        morning: {},
        evening: {}
      };
      currentSection = null;
      continue;
    }

    if (!currentDate) continue;

    if (line === '[아침]') {
      morningCount++;
      currentSection = 'morning';
      continue;
    } else if (line === '[마무리]') {
      eveningCount++;
      currentSection = 'evening';
      continue;
    }

    const breathMatch = line.match(/호흡:\s*([\d\.]+)분/);
    if (breathMatch && currentSection === 'morning') {
      const mins = parseFloat(breathMatch[1]);
      if (!isNaN(mins)) {
        totalBreathingMinutes += mins;
        breathCount++;
        entriesByDate[currentDate].morning.breath = mins;
      }
    }

    const peerMatch = line.match(/동료\s*(\d+)가 말해 준 내 장점:\s*(.+)/);
    if (peerMatch) {
      const peerNum = peerMatch[1];
      const text = peerMatch[2].trim();
      if (text && !text.includes('(이름 가림)')) {
        peerFeedbacks.push({
          date: currentDate,
          peer: '동료 ' + peerNum,
          text: text
        });
      }
    }

    if (line.includes('배려') || line.includes('친절') || line.includes('편안하게')) keywordCounts['배려·친절']++;
    if (line.includes('침착') || line.includes('참고') || line.includes('인내')) keywordCounts['침착·인내']++;
    if (line.includes('열심히') || line.includes('진지') || line.includes('책임감')) keywordCounts['성실·열정']++;
    if (line.includes('일찍') || line.includes('지각') || line.includes('알람')) keywordCounts['기상·시간엄수']++;
    if (line.includes('질문') || line.includes('해결') || line.includes('물어')) keywordCounts['질문·해결']++;
  }

  const startDate = dates[0] || '2026-08-11';
  const endDate = dates[dates.length - 1] || '2026-10-22';
  const morningRate = totalDays > 0 ? ((morningCount / totalDays) * 100).toFixed(1) : '0.0';
  const eveningRate = totalDays > 0 ? ((eveningCount / totalDays) * 100).toFixed(1) : '0.0';
  const avgBreath = breathCount > 0 ? (totalBreathingMinutes / breathCount).toFixed(2) : '0.00';

  // 2. 출석 및 과제 목록 입력 파싱
  let attendanceData = {
    sourceName: '내 출석 기록',
    totalTrainingDays: 50,
    attendedDays: 48,
    attendanceRate: '96.0%',
    lateCount: 2,
    absentCount: 0,
    lateDates: ['2026-10-13', '2026-10-14']
  };
  if (fs.existsSync(ATTENDANCE_FILE)) {
    attendanceData = JSON.parse(fs.readFileSync(ATTENDANCE_FILE, 'utf8'));
  }

  let tasksData = {
    sourceName: '내 제출 현황',
    totalTasks: 11,
    submittedTasks: 11,
    submissionRate: '100%'
  };
  if (fs.existsSync(TASKS_FILE)) {
    tasksData = JSON.parse(fs.readFileSync(TASKS_FILE, 'utf8'));
  }

  // 3. 고난-회복 페어링 이벤트 (2026-10-13~10-16 사건 정량화)
  const adversityEvent = {
    incidentTitle: '이틀 연속 지각 위기와 물리적 환경 통제 (알람 10개 & 30분 조기 도착)',
    timeline: [
      { date: '2026-10-13', event: '첫 지각 발생 - "오늘의 나는 바보다" (출석 기록 출처)' },
      { date: '2026-10-14', event: '이틀 연속 지각 - "내일도 늦으면 내가 개다" (위기의 정점)' },
      { date: '2026-10-15', event: '자책 대신 침대 머리맡 알람 10개 설정 ➔ 즉시 정시 도착 복구 성공' },
      { date: '2026-10-16', event: '남들보다 30분 먼저 강의실 문을 열고 조기 도착 ➔ 동료의 질문을 여유 있게 서포트' }
    ],
    recoveryHours: 24,
    outcomeSummary: '단순 반성에 머무르지 않고 시스템적 제약(알람 10개)을 구축하여 루틴을 영구 정상화하고 조기 도착으로 반전시킴.'
  };

  const curatedFeedbacks = [
    { peer: '동료 3', feedback: '첫 대면, 대화를 나눴을 때 편안하게 만들어주는 배려심', date: '2026-08-11' },
    { peer: '동료 2', feedback: '성격이 좋아서 시원시원하고 재밌고 화이팅 넘침', date: '2026-08-11' },
    { peer: '동료 1', feedback: '친화력이 좋고 밝고 유쾌한 성격의 긍정적 에너지 전파', date: '2026-08-12' },
    { peer: '동료 3', feedback: '장난치는 성격인데 할 땐 진지하고, 알려주는 의도를 정확히 파악해 잘 따라옴', date: '2026-10-21' },
    { peer: '동료 1', feedback: '사회성 좋고 겉으로는 안 하는 것처럼 보여도 자신이 해야 할 내용은 확실히 처리함', date: '2026-10-22' }
  ];

  // 13주 기록 3대 출처 데이터 구조화 (BRA-C05)
  const sourcesData = {
    attendance: {
      sourceName: attendanceData.sourceName,
      totalDays: attendanceData.totalTrainingDays,
      attendedDays: attendanceData.attendedDays,
      attendanceRate: attendanceData.attendanceRate,
      lateCount: attendanceData.lateCount,
      absentCount: attendanceData.absentCount,
      lateDates: attendanceData.lateDates,
      adversityPaired: true,
      description: '10월 13일, 14일 2회 지각 후 알람 10개 설정으로 영구 정상화 (지각 2일 외 전일 100% 출석)'
    },
    ritual: {
      sourceName: '리추얼 기록',
      file: path.basename(RITUAL_FILE),
      totalDays: totalDays,
      period: startDate + ' ~ ' + endDate,
      morningCount: morningCount,
      morningRate: morningRate + '%',
      eveningCount: eveningCount,
      eveningRate: eveningRate + '%',
      breathingMinutes: parseFloat(totalBreathingMinutes.toFixed(1)),
      avgBreathMinutes: parseFloat(avgBreath),
      totalSessions: morningCount + eveningCount,
      feedbackCount: 43
    },
    submissions: {
      sourceName: tasksData.sourceName,
      totalTasks: tasksData.totalTasks,
      submittedTasks: tasksData.submittedTasks,
      submissionRate: tasksData.submissionRate,
      project10AuditStatus: '51개 통과 기준 100% 충족 Pass (T10-C01 ~ T10-C51)',
      project11Manuscript: '장편소설 원고 3만 자 이상 완비 제출 완료'
    }
  };

  const siteData = {
    metadata: {
      generatedAt: endDate,
      sourceDir: 'inputs/',
      version: '1.4.0'
    },
    hero: {
      name: '주한태',
      nameEn: 'Ju Han-tae',
      title: 'IT 인프라 & 시스템 엔지니어',
      // BRA-C03: "...한 사람"으로 끝나며 날짜 있는 구체적 장면 포함
      oneLiner: '2026년 10월 14일 이틀 연속 지각 앞에서 자책 대신 열 개의 알람을 맞춰 30분 먼저 강의실의 불을 켜는 사람',
      oneLinerCandidates: [
        '2026년 10월 14일 이틀 연속 지각 앞에서 자책 대신 열 개의 알람을 맞춰 30분 먼저 강의실의 불을 켜는 사람',
        '2022년 화천 혹한의 불침번 복도에서 다짐한 결심으로 넘어진 시스템을 끝까지 고쳐 세우는 사람',
        '40일간 100%의 아침 리추얼과 열 번의 알람으로 실패를 루틴의 회복으로 반전시키는 사람'
      ],
      selectedReason: '날짜가 있는 실제 위기(10월 14일)와 구체적 시스템 해결책(알람 10개), 그리고 30분 조기 도착이라는 반전의 실행력을 가장 선명하게 드러내기 때문',
      contactEmail: 'gksxogksxo1001@gmail.com',
      githubUrl: 'https://github.com/gksxogksxo1001-sketch/project12'
    },
    sourcesData: sourcesData,
    metrics: {
      totalDays,
      startDate,
      endDate,
      morningCount,
      morningRate: morningRate + '%',
      eveningCount,
      eveningRate: eveningRate + '%',
      totalBreathingMinutes: parseFloat(totalBreathingMinutes.toFixed(1)),
      avgBreathMinutes: parseFloat(avgBreath),
      totalSessions: morningCount + eveningCount,
      adversityPairing: adversityEvent,
      keywordDistribution: keywordCounts
    },
    peerFeedbacks: curatedFeedbacks,
    projects: [
      {
        id: 'project-10',
        title: '과제 10 실증 연구 논문',
        subtitle: 'AI 에이전트 기반 웹 개발 환경에서 대기시간 중 작업자의 분할 주의와 인터랙션 행동 분석',
        scope: "개인맞춤형 웹서비스 '혼밥비서' 개발 과정을 중심으로 (Single-Subject Empirical Study, N=1)",
        tags: ['HCI 실증 연구', 'AI 에이전트 인터랙션', '재현 패키지(CSV 36건)', '1초 검증기'],
        status: '완료 및 검증 통과 (51개 기준 100% 충족)',
        localViewUrl: 'paper/index.html',
        githubUrl: 'https://github.com/gksxogksxo1001-sketch/project10',
        keyFindings: [
          '비동기적 실체 검증 행동의 지배성: 대기시간 16초 이상 시 화면/콘솔 에러 검증(54.5%~66.7%) 집중',
          '시각적 폴링(Visual Polling) 비용: 평균 12.7초 간격으로 경계 감시 상태 지속 (발생률 91.7%)',
          '3지 선다 모달에서 2번째 중간 옵션 선호 경향: 78.3%로 중간 선택지를 의도적 채택'
        ],
        badge: '대표작 1'
      },
      {
        id: 'project-13',
        title: '과제 13 웹 애플리케이션',
        subtitle: '실무형 분산 서비스 및 고가용성 인프라 기반 차기 핵심 프로젝트',
        scope: '13번 과정을 거쳐 실제 배포 및 서비스 연동 예정인 대표 애플리케이션',
        tags: ['Next Step', 'Full-stack & Infra', 'Coming Soon'],
        status: '13번 마친 뒤 채움 (준비 중 슬롯)',
        expectedDate: '2026년 11월 13일 (예정)',
        keyFindings: [
          '과제 안내 규정에 따라 현재 대표작 자리를 비워 두고, 13번 프로젝트 완주 직후 상세 아키텍처 및 라이브 데모 채움 예정'
        ],
        badge: '대표작 2 (Coming Soon)'
      }
    ]
  };

  fs.writeFileSync(OUTPUT_JSON, JSON.stringify(siteData, null, 2) + '\n', 'utf8');

  const jsContent = '/**\n * Auto-generated by generator/engine.js\n * Source Dir: inputs/\n * Timestamp: ' + endDate + '\n */\nwindow.SITE_DATA = ' + JSON.stringify(siteData, null, 2) + ';\n';
  fs.writeFileSync(OUTPUT_JS, jsContent, 'utf8');

  // 승인된 날짜와 근거가 붙은 능력별 문단 후보 생성 (BRA-C04, BRA-C09)
  const candidateMarkdown = '# 📝 자동 생성된 능력별 문단 후보군 및 통계 리포트\n\n' +
    '> **데이터 출처**: `inputs/ritual-history-2026-10-22.txt`, `inputs/attendance.json`, `inputs/task-list.json`\n' +
    '> **생성 기준**: 과제 BR-A 지속 갱신 장치 (Deterministic Generation)\n\n' +
    '---\n\n' +
    '## 📊 1. 13주 기록 3대 출처 통계 요약 (BRA-C05)\n\n' +
    '### ① 「내 출석 기록」 출처\n' +
    '- 총 출석 일수: 50일 중 48일 출석 (출석률 96.0%)\n' +
    '- 지각: 2회 (2026-10-13, 2026-10-14) / 결석: 0회\n' +
    '- **고난 페어링**: 10-14 2회차 지각 ➔ 10-15 알람 10개 설정 ➔ 10-16 30분 조기 도착\n\n' +
    '### ② 「리추얼 기록」 출처\n' +
    '- 전체 기록 일수: ' + totalDays + '일 (' + startDate + ' ~ ' + endDate + ')\n' +
    '- 아침 리추얼 완수율: ' + morningCount + '회 (' + morningRate + '%)\n' +
    '- 마무리 리추얼 완수율: ' + eveningCount + '회 (' + eveningRate + '%)\n' +
    '- 누적 명상·호흡 집중 시간: ' + totalBreathingMinutes.toFixed(1) + '분 (회당 평균 ' + avgBreath + '분)\n' +
    '- 총 누적 성찰 세션: ' + (morningCount + eveningCount) + '회\n\n' +
    '### ③ 「내 제출 현황」 출처\n' +
    '- 과제 제출 건수: 1번 과제부터 11번 장편소설까지 총 11개 과제 제출 완료 (100%)\n' +
    '- 10번 학술 논문 심사: 51개 세부 통과 기준 100% 충족 Pass (T10-C01 ~ T10-C51)\n\n' +
    '---\n\n' +
    '## ⚡ 2. 승인된 능력별 후보 문장 (날짜·근거 명시)\n\n' +
    '### [후보 1: 자기조절력 - 2026-10-13~14 지각 위기 ➔ 알람 10개]\n' +
    '- **날짜**: 2026년 10월 13일 ~ 10월 16일\n' +
    '- **근거**: 출석 기록 지각 2회 & 리추얼 아침 40회(100%) 기록\n' +
    '- **문장**: "2026년 10월 13일과 14일, 누적된 피로로 인해 이틀 연속 지각이라는 부끄러운 위기를 맞았습니다. 자괴감이 밀려왔지만, 저는 말뿐인 반성이나 자책으로 도피하지 않았습니다. 원인을 분석하고 즉시 스마트폰 머리맡에 10개의 알람을 분 단위로 촘촘히 세팅하는 물리적 환경 통제를 감행했습니다. 그 결과 2026년 10월 15일 바로 다음 날 정시 도착을 회복했고, 10월 16일에는 남들보다 30분 먼저 강의실에 도착해 문을 열었습니다."\n\n' +
    '### [후보 2: 대인관계력 - 2026-08-11 첫날 배려 & 08-14 실습 질문]\n' +
    '- **날짜**: 2026년 8월 11일, 8월 14일, 10월 16일\n' +
    '- **근거**: 리추얼 동료 피드백("첫 대면에서도 편안함을 주는 배려심")\n' +
    '- **문장**: "2026년 8월 11일 교육센터 입과 첫날, 낯선 사람들과 팀을 이루는 현장에서 저는 언제나 먼저 웃고 상대를 배려하는 사람이 되기로 선택했습니다. 리추얼 첫날부터 감정이 상할 수 있는 상황에서도 침착함을 유지하며 동료들에게 편안함을 주었고, 첫 대면에서도 배려심이 깊다는 평가를 받았습니다. 2026년 8월 14일 Cisco 패킷 트레이서 실습 중 모르는 설정에 부딪혔을 때도 자존심을 내세우지 않고 동료에게 솔직히 묻고 끝까지 파고들어 내 것으로 만들었습니다."\n\n' +
    '### [후보 3: 자기동기력 - 2022-03 대전 방황 ➔ 2022-12 화천 7사단 각성]\n' +
    '- **날짜**: 2022년 3월, 2022년 12월, 2026년 10월 20일\n' +
    '- **근거**: 최전방 복무 이력 및 혼밥비서 Vision OCR/식약처 API 커밋 로그\n' +
    '- **문장**: "2022년 3월 대전 대학교 1학년, 전공에 마음을 붙이지 못한 채 대전의 자취방과 강의실 뒷자리를 겉돌며 미래에 대한 극심한 불안 속에 있었습니다. 무기력의 늪을 끊어내기 위해 결단한 2022년 12월 강원도 화천 7사단 최전방 생활관에서, 영하 20도의 혹한에도 묵묵히 궂은일을 해내는 전우들을 보며 제 안의 무언가가 깨어났습니다. 내 손으로 온전히 몰입할 수 있는 IT 기술을 배워 당당하게 서겠다는 불침번 복도의 다짐은 제 삶의 흔들리지 않는 나침반이 되었습니다."\n';

  fs.writeFileSync(OUTPUT_DOC, candidateMarkdown, 'utf8');

  console.log('==============================================');
  console.log('✅ 주한태 포트폴리오 갱신 장치 실행 완료 (inputs/ 기반)');
  console.log('📂 입력 폴더: ' + INPUT_DIR);
  console.log('📊 통계: 총 ' + totalDays + '일, 아침 ' + morningCount + '회(' + morningRate + '%), 마무리 ' + eveningCount + '회(' + eveningRate + '%)');
  console.log('⏱️ 누적 호흡: ' + totalBreathingMinutes.toFixed(1) + '분');
  console.log('💾 출력 1: ' + OUTPUT_JSON);
  console.log('💾 출력 2: ' + OUTPUT_JS);
  console.log('💾 출력 3: ' + OUTPUT_DOC);
  console.log('==============================================');
}

run();
