/**
 * generator/verify-reproducibility.js
 * 과제 완주 체크리스트 검증:
 * "장치를 두 번 돌려 같은 결과가 나오는 것을 새 폴더에서 확인했습니다."
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execSync } = require('child_process');

function getHash(filePath) {
  const content = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(content).digest('hex');
}

const BASE_DIR = path.resolve(__dirname, '..');
const TEST_DIR_1 = path.join(BASE_DIR, 'scratch_test_run1');
const TEST_DIR_2 = path.join(BASE_DIR, 'scratch_test_run2');
const ENGINE_SRC = path.join(BASE_DIR, 'generator', 'engine.js');
const RITUAL_SRC = path.join(BASE_DIR, 'ritual-history-2026-10-22.txt');

function prepareAndRun(targetDir) {
  if (fs.existsSync(targetDir)) {
    fs.rmSync(targetDir, { recursive: true, force: true });
  }
  fs.mkdirSync(path.join(targetDir, 'generator'), { recursive: true });
  fs.mkdirSync(path.join(targetDir, 'doc'), { recursive: true });

  fs.copyFileSync(ENGINE_SRC, path.join(targetDir, 'generator', 'engine.js'));
  fs.copyFileSync(RITUAL_SRC, path.join(targetDir, 'ritual-history-2026-10-22.txt'));

  execSync('node generator/engine.js', { cwd: targetDir, stdio: 'pipe' });
}

console.log('================================================================');
console.log('🔬 [검증기] 장치 결정론적 재현성 검증 (새 폴더 2회 독립 실행)');
console.log('================================================================');

console.log('▶ 1회차 실행: 새 임시 폴더 1 (' + path.basename(TEST_DIR_1) + ')');
prepareAndRun(TEST_DIR_1);

console.log('▶ 2회차 실행: 새 임시 폴더 2 (' + path.basename(TEST_DIR_2) + ')');
prepareAndRun(TEST_DIR_2);

const filesToCheck = [
  'site-data.json',
  'site-data.js',
  path.join('doc', 'generated-narrative-candidates.md')
];

let allMatched = true;

console.log('\n[산출물 SHA-256 체크섬 비교]');
filesToCheck.forEach(relPath => {
  const file1 = path.join(TEST_DIR_1, relPath);
  const file2 = path.join(TEST_DIR_2, relPath);

  const hash1 = getHash(file1);
  const hash2 = getHash(file2);

  const isSame = (hash1 === hash2);
  if (!isSame) allMatched = false;

  console.log('📄 ' + relPath + ':');
  console.log('   - Run 1 Hash: ' + hash1);
  console.log('   - Run 2 Hash: ' + hash2);
  console.log('   - 일치 여부: ' + (isSame ? '✅ 100% 동일 (MATCH)' : '❌ 불일치 (MISMATCH)'));
});

// 청소
fs.rmSync(TEST_DIR_1, { recursive: true, force: true });
fs.rmSync(TEST_DIR_2, { recursive: true, force: true });

console.log('\n----------------------------------------------------------------');
if (allMatched) {
  console.log('🎉 [검증 성공] 완주 체크리스트 조건 충족!');
  console.log('   새 폴더에서 장치를 두 번 돌려 정확히 동일한 결과가 산출됨을 확인했습니다.');
} else {
  console.error('❌ [검증 실패] 두 번의 실행 결과가 일치하지 않습니다.');
  process.exit(1);
}
console.log('================================================================');
