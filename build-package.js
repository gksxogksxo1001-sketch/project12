/**
 * build-package.js
 * 제출물: 장치(실행 소스-README-마지막 결과)와 문서를 담은 ZIP 생성 (BRA-C21)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ZIP_NAME = 'project12_submission_device.zip';
const targetZip = path.resolve(__dirname, ZIP_NAME);

if (fs.existsSync(targetZip)) {
  fs.unlinkSync(targetZip);
}

console.log('📦 Creating submission zip package via PowerShell...');
const psCommand = `$ProgressPreference = 'SilentlyContinue'; Compress-Archive -Path 'generator', 'inputs', 'doc', 'site-data.json', 'site-data.js', 'README.md', 'package.json' -DestinationPath '${ZIP_NAME}' -Force`;

try {
  execSync(`powershell -Command "${psCommand}"`, { stdio: 'inherit' });
  console.log('✅ Successfully created:', ZIP_NAME);
  const stat = fs.statSync(targetZip);
  console.log('   Size:', (stat.size / 1024).toFixed(1), 'KB');
} catch (err) {
  console.error('ZIP 생성 실패:', err);
}
