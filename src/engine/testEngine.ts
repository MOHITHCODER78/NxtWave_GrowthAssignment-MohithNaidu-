import { generateProjectEvolution, detectDomain } from './domainMatrix';

console.log('--- TEST SUITE: PROJECT EVOLUTION ENGINE VERIFICATION ---');

// Test 1: Weather App
console.log('\n[TEST 1] Weather App Input:');
const weatherInput = {
  mode: 'existing' as const,
  projectTitle: 'Weather App',
  projectDescription: 'Shows local temperatures and rain predictions using API.',
  techStack: 'React, OpenWeather API',
};
const weatherDomain = detectDomain(weatherInput);
console.log('Detected domain:', weatherDomain);
const weatherResult = generateProjectEvolution(weatherInput);
console.log('Domain Name:', weatherResult.domain);
console.log('Upgrade Track:', weatherResult.paths.upgrade.title);
console.log('Transform Track:', weatherResult.paths.transform.title);
console.log('Differentiate Track:', weatherResult.paths.differentiate.title);

if (weatherDomain !== 'weather') throw new Error('Expected domain to be weather');
if (!weatherResult.paths.upgrade.title.toLowerCase().includes('health') && !weatherResult.paths.upgrade.title.toLowerCase().includes('weather')) {
  throw new Error('Weather Upgrade path is not weather related');
}

// Test 2: College Attendance Tracker
console.log('\n[TEST 2] College Attendance Tracker:');
const attendanceInput = {
  mode: 'existing' as const,
  projectTitle: 'College Attendance Tracker',
  projectDescription: 'Tracks student presence across lectures and checks 75% cutoff.',
  techStack: 'React + Node + PostgreSQL',
};
const attendanceDomain = detectDomain(attendanceInput);
console.log('Detected domain:', attendanceDomain);
const attendanceResult = generateProjectEvolution(attendanceInput);
console.log('Domain Name:', attendanceResult.domain);
console.log('Upgrade Track:', attendanceResult.paths.upgrade.title);
console.log('Transform Track:', attendanceResult.paths.transform.title);
console.log('Differentiate Track:', attendanceResult.paths.differentiate.title);

if (attendanceDomain !== 'attendance') throw new Error('Expected domain to be attendance');

// Test 3: Beginner Mode (Starting from scratch)
console.log('\n[TEST 3] Beginner Mode (No existing project):');
const beginnerInput = {
  mode: 'beginner' as const,
  beginnerInterest: 'Data Analytics & Prediction Pipelines',
  skillLevel: 'Beginner' as const,
};
const beginnerDomain = detectDomain(beginnerInput);
console.log('Detected domain:', beginnerDomain);
const beginnerResult = generateProjectEvolution(beginnerInput);
console.log('Domain Name:', beginnerResult.domain);
console.log('Upgrade Track:', beginnerResult.paths.upgrade.title);
console.log('Transform Track:', beginnerResult.paths.transform.title);
console.log('Differentiate Track:', beginnerResult.paths.differentiate.title);

if (beginnerDomain !== 'data') throw new Error('Expected domain to be data');

// Test 4: Verification of Distinctness (Upgrade != Transform != Differentiate)
console.log('\n[TEST 4] Verification of Distinctness across Tracks:');
const tracks = [attendanceResult.paths.upgrade, attendanceResult.paths.transform, attendanceResult.paths.differentiate];
const titles = new Set(tracks.map(t => t.title));
const capabilities = new Set(tracks.map(t => t.specificAiCapability));
if (titles.size !== 3) throw new Error('Track titles are not distinct');
if (capabilities.size !== 3) throw new Error('AI capabilities are not distinct');
console.log('Titles are 100% unique:', Array.from(titles));
console.log('Capabilities are 100% unique:', Array.from(capabilities));

// Test 5: Realistic 60-Minute Starter Sprints
console.log('\n[TEST 5] Four 15-Minute Sprints Verification:');
for (const track of tracks) {
  if (track.sixtyMinuteStarterPlan.length !== 4) {
    throw new Error(`Track ${track.track} does not have exactly 4 sprints`);
  }
  const ranges = track.sixtyMinuteStarterPlan.map(s => s.minuteRange);
  console.log(`Track ${track.track} sprint ranges:`, ranges);
  if (ranges[0] !== '0–15m' || ranges[1] !== '15–30m' || ranges[2] !== '30–45m' || ranges[3] !== '45–60m') {
    throw new Error('Sprint minute ranges are malformed');
  }
}

console.log('\nALL 5 TEST ASSERTIONS PASSED PERFECTLY!');
