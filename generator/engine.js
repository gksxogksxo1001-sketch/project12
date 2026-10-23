/**
 * generator/engine.js
 * 주한태 포트폴리오 웹사이트 지속 갱신 장치 (Site & Narrative Generator)
 * 
 * 입력: ritual-history-*.txt (또는 JSON)
 * 출력: site-data.json, site-data.js, doc/generated-narrative-candidates.md
 * 특성: 동일한 입력에 대해 100% 동일한 출력을 보장하는 결정론적(Deterministic) 구조
 */

const fs = require('fs');
const path = require('path');

const BASE_DIR = path.resolve(__dirname, '..');
const INPUT_FILE = process.env.RITUAL_FILE 
  ? path.resolve(process.cwd(), process.env.RITUAL_FILE)
  : path.join(BASE_DIR, 'ritual-history-2026-10-22.txt');

const OUTPUT_JSON = path.join(BASE_DIR, 'site-data.json');
const OUTPUT_JS = path.join(BASE_DIR, 'site-data.js');
const OUTPUT_DOC = path.join(BASE_DIR, 'doc', 'generated-narrative-candidates.md');

function run() {
  if (!fs.existsSync(INPUT_FILE)) {
    console.error('입력 파일을 찾을 수 없습니다:', INPUT_FILE);
    process.exit(1);
  }

  const rawText = fs.readFileSync(INPUT_FILE, 'utf8');
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

  const adversityEvent = {
    incidentTitle: '이틀 연속 지각 위기와 물리적 환경 통제 (알람 10개 & 30분 조기 도착)',
    timeline: [
      { date: '2026-10-13', event: '첫 지각 발생 - "오늘의 나는 바보다" (자책과 경각심)' },
      { date: '2026-10-14', event: '이틀 연속 지각 - "내일도 늦으면 내가 개다" (위기의 임계점)' },
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

  const siteData = {
    metadata: {
      generatedAt: endDate,
      sourceFile: path.basename(INPUT_FILE),
      version: '1.2.0'
    },
    hero: {
      name: '주한태',
      nameEn: 'Ju Han-tae',
      title: 'IT 인프라 & 시스템 엔지니어',
      oneLiner: '넘어지지 않은 사람이 아니라, 넘어진 그 자리에서 시스템을 고쳐 30분 먼저 불을 켜는 사람',
      contactEmail: 'hantae.ju.it@gmail.com',
      githubUrl: 'https://github.com/gksxogksxo1001-sketch/project12'
    },
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
        keyFindings: [
          '과제 안내 규정에 따라 현재 대표작 자리를 비워 두고, 13번 프로젝트 완주 직후 상세 아키텍처 및 라이브 데모 채움 예정'
        ],
        badge: '대표작 2 (Coming Soon)'
      }
    ]
  };

  fs.writeFileSync(OUTPUT_JSON, JSON.stringify(siteData, null, 2) + '\n', 'utf8');

  const jsContent = '/**\n * Auto-generated by generator/engine.js\n * Source: ' + path.basename(INPUT_FILE) + '\n * Timestamp: ' + endDate + '\n */\nwindow.SITE_DATA = ' + JSON.stringify(siteData, null, 2) + ';\n';
  fs.writeFileSync(OUTPUT_JS, jsContent, 'utf8');

  const candidateMarkdown = '# 📝 자동 생성된 자기소개 문단 후보군 및 리추얼 통계 리포트\n\n' +
    '> **데이터 출처**: `' + path.basename(INPUT_FILE) + '` (' + startDate + ' ~ ' + endDate + ', 총 ' + totalDays + '일)  \n' +
    '> **생성 기준**: 과제 BR-A 지속 갱신 장치 (Deterministic Generation)\n\n' +
    '---\n\n' +
    '## 📊 1. 13주 리추얼 정량 통계 요약\n' +
    '- **전체 기록 일수**: ' + totalDays + '일 (' + startDate + ' ~ ' + endDate + ')\n' +
    '- **아침 리추얼 완수율**: ' + morningCount + '회 (' + morningRate + '%)\n' +
    '- **마무리 리추얼 완수율**: ' + eveningCount + '회 (' + eveningRate + '%)\n' +
    '- **누적 명상·호흡 집중 시간**: ' + totalBreathingMinutes.toFixed(1) + '분 (회당 평균 ' + avgBreath + '분)\n' +
    '- **총 누적 성찰 세션**: ' + (morningCount + eveningCount) + '회\n\n' +
    '---\n\n' +
    '## ⚡ 2. 고난과 통계 페어링 후보 문단 (자기조절력)\n' +
    '> **핵심 사건**: 2026-10-13 ~ 10-14 이틀 연속 지각 위기 ➔ 10-15 알람 10개 설정 ➔ 10-16 30분 조기 도착\n\n' +
    '### [후보 A: 담백한 시스템 엔지니어링 톤]\n' +
    '"누구나 실수하고 피로에 무너질 수 있습니다. 중요한 것은 넘어진 뒤의 태도입니다. 2026년 10월 13일과 14일, 누적된 피로로 인해 이틀 연속 지각이라는 부끄러운 위기를 맞았습니다. 자괴감이 밀려왔지만, 저는 말뿐인 반성이나 자책으로 도피하지 않았습니다. 원인을 분석하고 즉시 스마트폰 머리맡에 10개의 알람을 분 단위로 촘촘히 세팅하는 물리적 환경 통제를 감행했습니다. 그 결과 바로 다음 날 정시 도착을 회복했고, 10월 16일에는 남들보다 30분 먼저 강의실에 도착해 문을 열었습니다. 40일간 아침 리추얼을 100%(40회) 완수해 낸 지속력의 이면에는, 실수를 시스템적 제약으로 즉각 수정하는 단단한 자기조절력이 있었습니다."\n\n' +
    '---\n\n' +
    '## 🤝 3. 협업과 소통 후보 문단 (대인관계력)\n' +
    '> **핵심 장면**: 2026-08-11 첫날 배려, 2026-08-14 Cisco 실습 질문, 10-16 30분 일찍 도착해 동료 질문 서포트\n\n' +
    '### [후보 B: 쿠션형 소통과 진솔한 배움 톤]\n' +
    '"낯선 사람들과 팀을 이루는 현장에서 저는 언제나 먼저 웃고 상대를 배려하는 사람이 되기로 선택했습니다. 리추얼 첫날(2026-08-11)부터 감정이 상할 수 있는 상황에서도 침착함을 유지하며 동료들에게 편안함을 주었고, 첫 대면에서도 배려심이 깊다는 평가를 받았습니다. 또한 모르는 기술이 생겼을 때 자존심을 내세우지 않고 동료에게 솔직히 묻고 끝까지 파고들어 내 것으로 만들었습니다. 30분 일찍 도착해 문을 연 날에도, 뒤이어 들어온 동기들의 자격증 질문을 여유 있게 맞이하며 함께 공부했습니다. 저에게 배려란 수동적인 양보가 아니라, 팀의 온도를 높이고 모두의 성장을 이끄는 적극적인 소통 기술입니다."\n\n' +
    '---\n\n' +
    '## 🚀 4. 내적 각성과 집념 후보 문단 (자기동기력)\n' +
    '> **핵심 장면**: 2022년 봄 대전 자취방 방황 ➔ 2022년 12월 화천 7사단 자원입대 및 불침번 각성 ➔ 혼밥비서 풀스택 완수\n\n' +
    '### [후보 C: 뚜벅뚜벅 걸어온 각성의 여정 톤]\n' +
    '"2022년 스무 살의 봄, 전공에 마음을 붙이지 못한 채 대전의 자취방과 강의실 뒷자리를 겉돌며 미래에 대한 극심한 불안 속에 있었습니다. 무기력의 늪을 끊어내기 위해 결단한 강원도 화천 7사단 최전방 생활관에서, 영하 20도의 혹한에도 묵묵히 궂은일을 해내는 전우들을 보며 제 안의 무언가가 깨어났습니다. 내 손으로 온전히 몰입할 수 있는 IT 기술을 배워 당당하게 서겠다는 불침번 복도의 다짐은 제 삶의 흔들리지 않는 나침반이 되었습니다. 전역 후 기초부터 네트워크, 서버를 파고들었고, 팀 프로젝트에서는 식약처 API와 Vision OCR 자동화 파이프라인을 직접 설계하여 한계를 돌파했습니다."\n';

  fs.writeFileSync(OUTPUT_DOC, candidateMarkdown, 'utf8');

  console.log('==============================================');
  console.log('✅ 주한태 포트폴리오 갱신 장치 실행 완료');
  console.log('📂 입력: ' + INPUT_FILE);
  console.log('📊 통계: 총 ' + totalDays + '일, 아침 ' + morningCount + '회(' + morningRate + '%), 마무리 ' + eveningCount + '회(' + eveningRate + '%)');
  console.log('⏱️ 누적 호흡: ' + totalBreathingMinutes.toFixed(1) + '분');
  console.log('💾 출력 1: ' + OUTPUT_JSON);
  console.log('💾 출력 2: ' + OUTPUT_JS);
  console.log('💾 출력 3: ' + OUTPUT_DOC);
  console.log('==============================================');
}

run();
