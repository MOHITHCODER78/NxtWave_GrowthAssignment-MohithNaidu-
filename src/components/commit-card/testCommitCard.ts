import { generateShareUrl, generateQrCodeDataUrl } from '../../utils/shareUrl';
import { generateProjectEvolution } from '../../engine/domainMatrix';
import jsQR from 'jsqr';
import { PNG } from 'pngjs';

console.log('--- TEST SUITE: COMMIT CARD & QR CODE INTEGRITY ---');

async function runTests() {
  // TEST 1: Project 1 (Weather App - Upgrade Track)
  console.log('\n[TEST 1] Weather App - Upgrade Track Commit Card:');
  const weatherEvolution = generateProjectEvolution({
    mode: 'existing',
    projectTitle: 'Weather App',
    projectDescription: 'Live weather forecasts and rain radar.',
  });

  const weatherShareUrl = generateShareUrl({
    title: weatherEvolution.paths.upgrade.title,
    track: 'upgrade',
    authorName: 'Alex Chen',
    domain: weatherEvolution.domain,
  });

  console.log('Generated Share URL 1:', weatherShareUrl);
  if (!weatherShareUrl.includes('title=Actionable+Health+%26+Commute+Advisory+System') && !weatherShareUrl.includes('track=upgrade')) {
    throw new Error('Weather Share URL parameters are incorrect');
  }
  if (!weatherShareUrl.includes('by=Alex+Chen')) {
    throw new Error('Author name missing from URL');
  }

  // Generate QR code data URL
  const weatherQrDataUrl = await generateQrCodeDataUrl(weatherShareUrl);
  console.log('Generated QR Data URL length:', weatherQrDataUrl.length);
  if (!weatherQrDataUrl.startsWith('data:image/png;base64,')) {
    throw new Error('QR code is not a valid base64 PNG');
  }

  // Decode QR code and verify it matches the exact URL
  const weatherPngBase64 = weatherQrDataUrl.replace(/^data:image\/png;base64,/, '');
  const weatherPngBuffer = Buffer.from(weatherPngBase64, 'base64');
  const weatherPng = PNG.sync.read(weatherPngBuffer);
  const weatherDecoded = jsQR(new Uint8ClampedArray(weatherPng.data), weatherPng.width, weatherPng.height);

  if (!weatherDecoded) {
    throw new Error('Failed to decode QR code for Weather App');
  }
  console.log('Decoded QR Payload 1:', weatherDecoded.data);
  if (weatherDecoded.data !== weatherShareUrl) {
    throw new Error(`Decoded QR URL "${weatherDecoded.data}" does not match target URL "${weatherShareUrl}"`);
  }
  console.log('✓ QR code 1 decoded successfully and matches target share URL 100%!');

  // TEST 2: Project 2 (College Attendance Tracker - Differentiate Track)
  console.log('\n[TEST 2] Attendance Tracker - Differentiate Track Commit Card:');
  const attendanceEvolution = generateProjectEvolution({
    mode: 'existing',
    projectTitle: 'College Attendance Tracker',
    projectDescription: 'Student classroom attendance system.',
  });

  const attendanceShareUrl = generateShareUrl({
    title: attendanceEvolution.paths.differentiate.title,
    track: 'differentiate',
    authorName: 'Priya Sharma',
    domain: attendanceEvolution.domain,
  });

  console.log('Generated Share URL 2:', attendanceShareUrl);
  const attendanceQrDataUrl = await generateQrCodeDataUrl(attendanceShareUrl);
  const attendancePngBase64 = attendanceQrDataUrl.replace(/^data:image\/png;base64,/, '');
  const attendancePngBuffer = Buffer.from(attendancePngBase64, 'base64');
  const attendancePng = PNG.sync.read(attendancePngBuffer);
  const attendanceDecoded = jsQR(new Uint8ClampedArray(attendancePng.data), attendancePng.width, attendancePng.height);

  if (!attendanceDecoded) {
    throw new Error('Failed to decode QR code for Attendance Tracker');
  }
  console.log('Decoded QR Payload 2:', attendanceDecoded.data);
  if (attendanceDecoded.data !== attendanceShareUrl) {
    throw new Error(`Decoded QR URL does not match target URL`);
  }
  console.log('✓ QR code 2 decoded successfully and matches target share URL 100%!');

  // TEST 3: Privacy & Missing Optional Fields Verification
  console.log('\n[TEST 3] Privacy Audit & Fallback States:');
  const anonymousShareUrl = generateShareUrl({
    title: 'Minimal Test Project',
    track: 'transform',
    authorName: '   ', // whitespace only
  });
  console.log('Anonymous Share URL:', anonymousShareUrl);
  if (anonymousShareUrl.includes('by=')) {
    throw new Error('Empty author name should not create "by" param in URL');
  }
  if (anonymousShareUrl.includes('@') || anonymousShareUrl.includes('password') || anonymousShareUrl.includes('token')) {
    throw new Error('Private data detected in share URL');
  }
  console.log('✓ Zero private PII detected in URLs. Fallback author handling verified!');

  console.log('\nALL COMMIT CARD & QR TESTS PASSED WITH 100% INTEGRITY!');
}

runTests().catch((err) => {
  console.error('Test Suite Failed:', err);
  process.exit(1);
});
